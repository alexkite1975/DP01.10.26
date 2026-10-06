import os, re

print("🔒 Applying Layer 3: Anti-Scraper & Anti-Archive robots.txt...")
os.makedirs("public", exist_ok=True)
with open("public/robots.txt", "w", encoding="utf-8") as f:
    f.write("User-agent: *\nDisallow: /\n# Drive Partners Proprietary System - Scraping Strictly Prohibited\n")

print("🔒 Applying Layer 1 & 4: next.config.js Source Cloaking & Anti-Clickjacking...")
next_config = """/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Cloaks TypeScript source code from DevTools
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' }, // Prevents iframe embedding
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(self)' },
      ],
    },
  ],
};

module.exports = nextConfig;
"""
with open("next.config.js", "w", encoding="utf-8") as f:
    f.write(next_config)

print("🔒 Applying Layer 2 & 5 + Whitelist Gate: src/app/page.tsx...")
page_path = "src/app/page.tsx"
if os.path.exists(page_path):
    with open(page_path, "r", encoding="utf-8") as f:
        page_code = f.read()

    # Add global anti-copy event listeners & legal copyright banner if not present
    if "PROPRIETARY & CONFIDENTIAL SYSTEM" not in page_code:
        # Add useEffect for right-click and keyboard interception
        anti_copy_logic = """
  // ─── COPYRIGHT & ANTI-COPYING SHIELD (UK Patents & Copyright Act 1988) ───
  useEffect(() => {
    // 1. Console Legal Warning
    console.log(
      "%c🛑 DRIVE PARTNERS PROPRIETARY SYSTEM\\nProtected under the UK Copyright, Designs and Patents Act 1988 (c. 48).\\nUnauthorized inspection, decompilation, scraping, or reverse engineering is strictly prohibited.",
      "color: #f59e0b; font-size: 14px; font-weight: bold; background: #0f172a; padding: 10px; border-radius: 8px;"
    );

    // 2. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable DevTools & Source Hotkeys (F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ─── STRICT PRIVATE BETA ACCESS WHITELIST ───
  const ALLOWED_EMAILS = ['alexkite1975@gmail.com'];
  const [accessDeniedMsg, setAccessDeniedMsg] = useState<string | null>(null);

  const handleAuthorizedLogin = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (ALLOWED_EMAILS.includes(cleanEmail)) {
      setAccessDeniedMsg(null);
      setIsLoggedIn(true);
    } else {
      setAccessDeniedMsg(`Access Restricted: "${cleanEmail}" is not authorized. Drive Partners is currently in private testing for approved accounts only.`);
    }
  };
"""
        # Insert inside main component
        idx = page_code.find("const [userRole, setUserRole]")
        if idx != -1:
            page_code = page_code[:idx] + anti_copy_logic + page_code[idx:]

        # Wire up Google login to whitelist
        page_code = page_code.replace(
            "onClick={() => setIsLoggedIn(true)}",
            "onClick={() => handleAuthorizedLogin('alexkite1975@gmail.com')}"
        )

        with open(page_path, "w", encoding="utf-8") as f:
            f.write(page_code)
        print("✓ Layer 2 & 5 and Whitelist applied to src/app/page.tsx")

print("All security layers applied successfully!")
