import re

tacho_path = "src/components/TachoSync.tsx"
with open(tacho_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Check all currentView values used in buttons
matches = re.findall(r"setCurrentView\(['\"]([^'\"]+)['\"]\)", code)
print("Cockpit buttons trigger these views:", set(matches))

# 2. Find all currentView === blocks
views_rendered = re.findall(r"currentView === ['\"]([^'\"]+)['\"]", code)
print("Views rendered in JSX:", set(views_rendered))

# 3. Replace any old depot-radar or site-reviews view block with the clean <SiteReviews />
# Look for currentView === 'depot-radar' or currentView === 'site-reviews'
pattern = re.compile(
    r"\{currentView === '(depot-radar|site-reviews|depot-admin|reviews)'\s*&&[\s\S]*?(?=\{\/\* ─── VIEW:|\{currentView === '|\}\n\s*</main>)",
    re.MULTILINE
)

clean_view_block = """{currentView === 'site-reviews' && (
        <SiteReviews onBack={() => setCurrentView('cockpit')} />
      )}

      """

if pattern.search(code):
    code = pattern.sub(clean_view_block, code)
    print("✓ Successfully replaced old depot view with <SiteReviews onBack={() => setCurrentView('cockpit')} />")
else:
    # If not found via regex, inject before </main>
    code = code.replace("</main>", "  {currentView === 'site-reviews' && <SiteReviews onBack={() => setCurrentView('cockpit')} />}\n      </main>")
    print("✓ Mounted <SiteReviews onBack={() => setCurrentView('cockpit')} /> before </main>")

# 4. Make sure Cockpit button triggers 'site-reviews'
code = re.sub(
    r"onClick=\{\(\) => setCurrentView\('(depot-radar|depot-admin|reviews)'\)\}",
    "onClick={() => setCurrentView('site-reviews')}",
    code
)

# Also ensure ModuleView type includes 'site-reviews'
if "'site-reviews'" not in code.split("type ModuleView")[1].split(";")[0] if "type ModuleView" in code else False:
    code = code.replace("type ModuleView = ", "type ModuleView = 'site-reviews' | ")
    print("✓ Added 'site-reviews' to ModuleView type")

with open(tacho_path, "w", encoding="utf-8") as f:
    f.write(code)

print("✓ Updated src/components/TachoSync.tsx cleanly!")
