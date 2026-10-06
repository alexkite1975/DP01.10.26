with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# Fix the duplicate closing bracket on line 11
code = code.replace("} , VolumeX, RotateCcw } from 'lucide-react';", ", VolumeX, RotateCcw } from 'lucide-react';")

with open("src/app/driver/page.tsx", "w") as f:
    f.write(code)

print("✓ Fixed lucide-react import syntax cleanly!")
