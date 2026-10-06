with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Ensure handleAdminLogin exists
if 'handleAdminLogin' not in code:
    handler = """
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === MASTER_ADMIN_KEY) {
      setIsAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('Invalid Master Passcode. Access Denied.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminPortal(false);
    setAdminPasscode('');
    setAdminError('');
  };
"""
    code = code.replace("const MASTER_ADMIN_KEY = 'DP-ADMIN-2026'; // Master Admin Passcode", "const MASTER_ADMIN_KEY = 'DP-ADMIN-2026'; // Master Admin Passcode\n" + handler)

# 2. Inject the Login Screen if not authenticated
login_screen = """
  // ==========================================
  // VIEW: ADMIN AUTHENTICATION GATE (LOCKED)
  // ==========================================
  if (showAdminPortal && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5 shadow-2xl">
          <div className="text-center space-y-1">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto mb-2 text-xl font-black">
              🔒
            </div>
            <h1 className="text-xl font-black text-white">ADMIN SECURITY GATE</h1>
            <p className="text-xs text-slate-400 font-mono">Restricted Access • Master Administrator Only</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Master Passcode</label>
              <input
                type="password"
                placeholder="Enter passcode"
                value={adminPasscode}
                onChange={e => setAdminPasscode(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3.5 text-center text-lg font-mono tracking-widest text-white outline-none"
              />
              {adminError && (
                <p className="text-xs text-red-400 font-mono mt-1.5 text-center">{adminError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all"
            >
              Unlock Admin Portal
            </button>

            <button
              type="button"
              onClick={() => setShowAdminPortal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-mono text-xs"
            >
              Cancel & Return to App
            </button>
          </form>
        </div>
      </div>
    );
  }
"""

if 'ADMIN AUTHENTICATION GATE (LOCKED)' not in code:
    code = code.replace(
        "if (showAdminPortal) {",
        login_screen + "\n  if (showAdminPortal && isAdminAuthenticated) {"
    )

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("✓ Password login gate successfully patched into page.tsx!")
