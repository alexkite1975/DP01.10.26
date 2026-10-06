import os, shutil

src_root = os.path.expanduser("~/fleetops-api-source/src")
dest_root = os.path.expanduser("~/smarthaul-ui/src")

folders_to_sync = ["components", "services", "data", "types", "utils"]

for folder in folders_to_sync:
    src_folder = os.path.join(src_root, folder)
    dest_folder = os.path.join(dest_root, folder)
    if os.path.exists(src_folder):
        print(f"Syncing {folder}...")
        shutil.copytree(src_folder, dest_folder, dirs_exist_ok=True)

print("✓ All components, services, and types successfully copied into smarthaul-ui!")
