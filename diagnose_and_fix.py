import re, os, subprocess

tacho_path = "src/components/TachoSync.tsx"
if not os.path.exists(tacho_path):
    print("❌ Error: TachoSync.tsx not found")
    exit(1)

with open(tacho_path, "r", encoding="utf-8") as f:
    content = f.read()

print("=== 1. CHECKING COCKPIT BUTTON WIRING ===")
# Find all setView calls on buttons
set_views = re.findall(r"setView\(['\"]([^'\"]+)['\"]\)", content)
print("Cockpit views triggered by buttons:", set(set_views))

print("\n=== 2. CHECKING ACTIVE VIEW BLOCKS IN TACHOSYNC ===")
view_blocks = re.findall(r"view === ['\"]([^'\"]+)['\"]", content)
print("Views rendered in file:", set(view_blocks))

# Check for duplicate site-reviews
count_site_reviews = content.count("view === 'site-reviews'")
print(f"Occurrences of 'view === site-reviews': {count_site_reviews}")

# Check if SiteReviews is imported
has_import = "import { SiteReviews }" in content
print(f"Has SiteReviews import: {has_import}")

print("\n=== 3. CHECKING SITE_REVIEWS.TSX SIZE ===")
if os.path.exists("src/components/SiteReviews.tsx"):
    with open("src/components/SiteReviews.tsx", "r", encoding="utf-8") as f:
        sr_content = f.read()
    print(f"src/components/SiteReviews.tsx lines: {len(sr_content.splitlines())}")
    print("Contains Whistleblower code:", "Anonymous Yard Safety Whistleblower" in sr_content)
else:
    print("❌ src/components/SiteReviews.tsx DOES NOT EXIST!")

print("\n=== 4. CHECKING LIVE DOMAIN MAPPING & ACTIVE REVISION ===")
try:
    rev = subprocess.check_output(
        "gcloud run services describe smarthaul-ui --region europe-west1 --project drive-partners2 --format='value(status.latestReadyRevisionName)'",
        shell=True, text=True
    ).strip()
    print(f"Latest Ready Cloud Run Revision in europe-west1: {rev}")
except Exception as e:
    print(f"Could not fetch revision: {e}")

try:
    domains = subprocess.check_output(
        "gcloud run domain-mappings list --project drive-partners2 --format='table(domain,region,service)'",
        shell=True, text=True
    ).strip()
    print(f"Custom Domain Mappings:\n{domains}")
except Exception as e:
    print(f"Could not fetch domains: {e}")

