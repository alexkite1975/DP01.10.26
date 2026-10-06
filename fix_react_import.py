import re

with open("src/app/driver/page.tsx", "r") as f:
    content = f.read()

# 1. Strip any existing React imports and 'use client'
content = re.sub(r'import\s+.*?from\s+[\'"]react[\'"];?\n?', '', content)
content = re.sub(r"['\"]use client['\"];?\n?", '', content)

# 2. Prepend clean 'use client' and full React hooks import
header = "'use client';\n\nimport React, { useState, useEffect } from 'react';\n"
content = header + content.lstrip()

with open("src/app/driver/page.tsx", "w") as f:
    f.write(content)

print("✓ Successfully injected 'import React, { useState, useEffect } from react'!")
