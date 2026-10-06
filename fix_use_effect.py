import re

with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# Ensure useEffect is imported alongside useState from 'react'
if "useEffect" not in code.split("export default")[0]:
    # Replace standard react import
    code = re.sub(
        r"import\s*\{\s*useState\s*\}\s*from\s*['\"]react['\"];?",
        "import { useState, useEffect } from 'react';",
        code
    )

with open("src/app/driver/page.tsx", "w") as f:
    f.write(code)

print("✓ Successfully imported useEffect into src/app/driver/page.tsx!")
