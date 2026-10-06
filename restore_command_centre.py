import re

# 1. Read build-and-deploy.sh to extract the original TomTomTruckMap and page.tsx
with open("build-and-deploy.sh", "r", encoding="utf-8") as f:
    sh_content = f.read()

# Extract TomTomTruckMap.tsx
map_marker = "cat << 'EOF' > src/components/TomTomTruckMap.tsx\n"
if map_marker in sh_content:
    map_code = sh_content.split(map_marker)[1].split("\nEOF")[0]
    with open("src/components/TomTomTruckMap.tsx", "w", encoding="utf-8") as f:
        f.write(map_code)
    print("✓ Restored src/components/TomTomTruckMap.tsx")

# Extract page.tsx
page_marker = "cat << 'EOF' > src/app/page.tsx\n"
if page_marker in sh_content:
    page_code = sh_content.split(page_marker)[1].split("\nEOF")[0]
    with open("src/app/page.tsx", "w", encoding="utf-8") as f:
        f.write(page_code)
    print("✓ Restored src/app/page.tsx with the sleek Driver Command Centre!")

