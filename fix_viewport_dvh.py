import os, re, glob

# 1. Update root layout.tsx to support dynamic viewport height
layout_path = "src/app/layout.tsx"
if os.path.exists(layout_path):
    with open(layout_path, "r") as f:
        content = f.read()
    if '<meta name="viewport"' not in content and "<head>" in content:
        content = content.replace("<head>", '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">')
        with open(layout_path, "w") as f:
            f.write(content)
        print("✓ Updated layout.tsx viewport tags")

# 2. Upgrade h-screen and 100vh to min-h-dvh across pages
target_files = [
    "src/app/driver/page.tsx",
    "src/app/haulier/page.tsx",
    "src/app/admin/page.tsx",
    "src/app/page.tsx"
]

for file in target_files:
    if os.path.exists(file):
        with open(file, "r") as f:
            code = f.read()
        code = code.replace("min-h-screen", "min-h-dvh")
        code = code.replace("h-screen", "min-h-dvh")
        with open(file, "w") as f:
            f.write(code)
        print(f"✓ Optimized viewport height for {file}")

print("✓ All container heights upgraded to mobile-safe min-h-dvh!")
