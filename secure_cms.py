import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add admin auth states and replace unprotected showAdminPortal
admin_auth_code = """
  // Master Admin Authentication State
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const MASTER_ADMIN_KEY = 'DP-ADMIN-2026'; // Master Admin Passcode

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === MASTER_ADMIN_KEY) {
      setIsAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('Invalid Admin Passcode. Access Denied.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminPortal(false);
    setAdminPasscode('');
    setAdminError('');
  };
"""

# Replace in page.tsx
if 'isAdminAuthenticated' not in code:
    code = code.replace(
        "const [showAdminPortal, setShowAdminPortal] = useState(false);",
        admin_auth_code
    )

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("✓ Admin security gate logic injected.")
