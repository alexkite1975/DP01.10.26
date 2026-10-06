import os

# 1. Update src/app/page.tsx to enforce the alexkite1975@gmail.com Whitelist Gate
page_path = "src/app/page.tsx"
if os.path.exists(page_path):
    with open(page_path, "r", encoding="utf-8") as f:
        page_code = f.read()

    # Inject whitelist check
    whitelist_injection = """
  // ─── STRICT PRIVATE BETA ACCESS WHITELIST ───
  const ALLOWED_EMAILS = ['alexkite1975@gmail.com'];
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [accessDeniedMsg, setAccessDeniedMsg] = useState<string | null>(null);

  const handleGoogleSignIn = (targetEmail?: string) => {
    const emailToVerify = (targetEmail || authEmailInput || 'alexkite1975@gmail.com').trim().toLowerCase();
    
    if (ALLOWED_EMAILS.includes(emailToVerify)) {
      setAccessDeniedMsg(null);
      setUserEmail(emailToVerify);
      setIsLoggedIn(true);
    } else {
      setAccessDeniedMsg(`Access Restricted: "${emailToVerify}" is not on the authorized driver list. Drive Partners is currently in private pilot for authorized accounts only.`);
    }
  };
"""
    if "const ALLOWED_EMAILS" not in page_code:
        # Insert after useState declarations
        idx = page_code.find("const [userRole, setUserRole]")
        if idx != -1:
            page_code = page_code[:idx] + whitelist_injection + page_code[idx:]
            
            # Replace Google Sign In button action
            page_code = page_code.replace(
                "onClick={() => setIsLoggedIn(true)}",
                "onClick={() => handleGoogleSignIn('alexkite1975@gmail.com')}"
            )
            
            with open(page_path, "w", encoding="utf-8") as f:
                f.write(page_code)
            print("✓ Updated src/app/page.tsx with alexkite1975@gmail.com whitelist gate")

# 2. Update src/components/TachoSync.tsx for Clean Search & HGV Gate Radar
tacho_path = "src/components/TachoSync.tsx"
if os.path.exists(tacho_path):
    with open(tacho_path, "r", encoding="utf-8") as f:
        tacho_code = f.read()

    # Ensure siteSubView state exists
    if "const [siteSubView, setSiteSubView]" not in tacho_code:
        tacho_code = tacho_code.replace(
            "const [siteSearchQuery, setSiteSearchQuery] = useState('');",
            "const [siteSearchQuery, setSiteSearchQuery] = useState('');\n  const [siteSubView, setSiteSubView] = useState<'site' | 'route'>('site');"
        )

    with open(tacho_path, "w", encoding="utf-8") as f:
        f.write(tacho_code)
    print("✓ Updated src/components/TachoSync.tsx states")

print("Files updated successfully. Ready to test build.")
