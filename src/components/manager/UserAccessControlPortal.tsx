'use client';
import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Building2,
  Lock,
  Unlock,
  Sliders,
  Mail,
  Trash2,
  Eye,
  Key,
  ChevronRight,
  Sparkles,
  Search,
  Check,
  UserCheck
} from 'lucide-react';

export interface UserPermissions {
  inCabCockpit: boolean;
  vehicleChecks: boolean;
  freightMarketplace: boolean;
  timesheetsPayroll: boolean;
  tachoScanner: boolean;
  dvsaErsCompliance: boolean;
  esgCarbon: boolean;
  tmsIntegrations: boolean;
  userAdmin: boolean;
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: 'FLEET_ADMIN' | 'TRANSPORT_MANAGER' | 'DISPATCHER' | 'HGV_DRIVER' | 'AUDITOR';
  depot: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  lastActive: string;
  avatarColor: string;
  permissions: UserPermissions;
}

const DEFAULT_ROLE_PERMISSIONS: Record<PortalUser['role'], UserPermissions> = {
  FLEET_ADMIN: {
    inCabCockpit: true,
    vehicleChecks: true,
    freightMarketplace: true,
    timesheetsPayroll: true,
    tachoScanner: true,
    dvsaErsCompliance: true,
    esgCarbon: true,
    tmsIntegrations: true,
    userAdmin: true
  },
  TRANSPORT_MANAGER: {
    inCabCockpit: true,
    vehicleChecks: true,
    freightMarketplace: true,
    timesheetsPayroll: true,
    tachoScanner: true,
    dvsaErsCompliance: true,
    esgCarbon: true,
    tmsIntegrations: true,
    userAdmin: false
  },
  DISPATCHER: {
    inCabCockpit: true,
    vehicleChecks: true,
    freightMarketplace: true,
    timesheetsPayroll: false,
    tachoScanner: false,
    dvsaErsCompliance: false,
    esgCarbon: false,
    tmsIntegrations: false,
    userAdmin: false
  },
  HGV_DRIVER: {
    inCabCockpit: true,
    vehicleChecks: true,
    freightMarketplace: true,
    timesheetsPayroll: true,
    tachoScanner: true,
    dvsaErsCompliance: false,
    esgCarbon: false,
    tmsIntegrations: false,
    userAdmin: false
  },
  AUDITOR: {
    inCabCockpit: false,
    vehicleChecks: false,
    freightMarketplace: false,
    timesheetsPayroll: true,
    tachoScanner: true,
    dvsaErsCompliance: true,
    esgCarbon: true,
    tmsIntegrations: false,
    userAdmin: false
  }
};

const INITIAL_USERS: PortalUser[] = [
  {
    id: 'usr-1',
    name: 'Alex Kite',
    email: 'admin@drivepartners.app',
    role: 'FLEET_ADMIN',
    depot: 'National Fleet HQ (All Depots)',
    status: 'ACTIVE',
    lastActive: 'Just now',
    avatarColor: 'bg-cyan-500 text-slate-950',
    permissions: DEFAULT_ROLE_PERMISSIONS.FLEET_ADMIN
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@drivepartners.app',
    role: 'TRANSPORT_MANAGER',
    depot: 'Bristol Gateway DC',
    status: 'ACTIVE',
    lastActive: '12m ago',
    avatarColor: 'bg-emerald-500 text-slate-950',
    permissions: DEFAULT_ROLE_PERMISSIONS.TRANSPORT_MANAGER
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'm.vance@reliefhgv.co.uk',
    role: 'HGV_DRIVER',
    depot: 'Carlisle North Hub',
    status: 'ACTIVE',
    lastActive: '2h ago',
    avatarColor: 'bg-amber-500 text-slate-950',
    permissions: DEFAULT_ROLE_PERMISSIONS.HGV_DRIVER
  },
  {
    id: 'usr-4',
    name: 'Liam Evans',
    email: 'l.evans@depot-dispatch.co.uk',
    role: 'DISPATCHER',
    depot: 'Crick Logistics Park',
    status: 'ACTIVE',
    lastActive: 'Yesterday',
    avatarColor: 'bg-purple-500 text-slate-950',
    permissions: DEFAULT_ROLE_PERMISSIONS.DISPATCHER
  },
  {
    id: 'usr-5',
    name: 'David Sterling',
    email: 'd.sterling@dvsa-audit.gov.uk',
    role: 'AUDITOR',
    depot: 'External DVSA ER Oversight',
    status: 'ACTIVE',
    lastActive: '3d ago',
    avatarColor: 'bg-blue-500 text-slate-950',
    permissions: DEFAULT_ROLE_PERMISSIONS.AUDITOR
  }
];

const PERMISSION_DEFINITIONS = [
  {
    key: 'inCabCockpit' as keyof UserPermissions,
    title: 'In-Cab Telematics Cockpit',
    desc: '3-tier low bridge radar, 1-tap route clearing, What3Words navigation'
  },
  {
    key: 'vehicleChecks' as keyof UserPermissions,
    title: 'DVSA 27-Point Vehicle Checks',
    desc: 'Walkaround checklists, defect photo failure locks, wheel torque alerts'
  },
  {
    key: 'freightMarketplace' as keyof UserPermissions,
    title: 'Cascading Freight & Shifts',
    desc: 'Load board access, 3-tier cascading tendering, ReliefHGV driver matching'
  },
  {
    key: 'timesheetsPayroll' as keyof UserPermissions,
    title: 'Timesheets & Demurrage Claims',
    desc: 'Geofenced GPS dwell logging, £45/hr detention claim calculation, cashouts'
  },
  {
    key: 'tachoScanner' as keyof UserPermissions,
    title: 'Tachograph Roll Scanner & OCR',
    desc: 'Gemini AI thermal printout scans, 4.5h continuous drive & WTD compliance'
  },
  {
    key: 'dvsaErsCompliance' as keyof UserPermissions,
    title: 'DVSA Earned Recognition & VOR',
    desc: 'Fleet safety matrix, vehicle grounding lockouts, official XML exports'
  },
  {
    key: 'esgCarbon' as keyof UserPermissions,
    title: 'Scope 3 ESG Carbon Accounting',
    desc: 'UK DEFRA conversion factors, deadhead reduction audits, ISO 14064'
  },
  {
    key: 'tmsIntegrations' as keyof UserPermissions,
    title: 'ERP & TMS Webhook Sync',
    desc: 'SAP S/4HANA, Oracle OTM, Mandata bi-directional order dispatch'
  },
  {
    key: 'userAdmin' as keyof UserPermissions,
    title: 'Admin Portal & User Management',
    desc: 'Add/remove team members, assign granular feature permissions'
  }
];

interface UserAccessControlPortalProps {
  onImpersonateUser?: (user: PortalUser) => void;
}

export const UserAccessControlPortal: React.FC<UserAccessControlPortalProps> = ({
  onImpersonateUser
}) => {
  const [users, setUsers] = useState<PortalUser[]>(() => {
    try {
      const saved = localStorage.getItem('dp2_admin_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<PortalUser | null>(null);
  const [activeImpersonation, setActiveImpersonation] = useState<PortalUser | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<PortalUser['role']>('HGV_DRIVER');
  const [newUserDepot, setNewUserDepot] = useState('Bristol Gateway DC');
  const [newUserPermissions, setNewUserPermissions] = useState<UserPermissions>(
    DEFAULT_ROLE_PERMISSIONS.HGV_DRIVER
  );

  useEffect(() => {
    localStorage.setItem('dp2_admin_users', JSON.stringify(users));
  }, [users]);

  // Update permissions when role changes in add form
  const handleRoleSelect = (role: PortalUser['role']) => {
    setNewUserRole(role);
    setNewUserPermissions(DEFAULT_ROLE_PERMISSIONS[role]);
  };

  const handleToggleNewUserPermission = (permKey: keyof UserPermissions) => {
    setNewUserPermissions((prev) => ({
      ...prev,
      [permKey]: !prev[permKey]
    }));
  };

  const handleToggleExistingPermission = (userId: string, permKey: keyof UserPermissions) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updatedPerms = { ...u.permissions, [permKey]: !u.permissions[permKey] };
          if (selectedUserForEdit?.id === userId) {
            setSelectedUserForEdit({ ...u, permissions: updatedPerms });
          }
          return { ...u, permissions: updatedPerms };
        }
        return u;
      })
    );
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const colors = [
      'bg-cyan-500 text-slate-950',
      'bg-purple-500 text-slate-950',
      'bg-emerald-500 text-slate-950',
      'bg-amber-500 text-slate-950',
      'bg-blue-500 text-slate-950'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: PortalUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      depot: newUserDepot,
      status: 'ACTIVE',
      lastActive: 'Just registered',
      avatarColor: randomColor,
      permissions: newUserPermissions
    };

    setUsers((prev) => [newUser, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (selectedUserForEdit?.id === userId) setSelectedUserForEdit(null);
  };

  const handleStartTesting = (user: PortalUser) => {
    setActiveImpersonation(user);
    if (onImpersonateUser) {
      onImpersonateUser(user);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.depot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Active Impersonation Testing Banner */}
      {activeImpersonation && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 p-4 shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                Active Test Mode: Impersonating {activeImpersonation.name}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-500/40">
                  {activeImpersonation.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Enabled modules: {Object.values(activeImpersonation.permissions).filter(Boolean).length} of 9 permissions granted.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveImpersonation(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            Exit Test Mode (Return to Fleet Admin)
          </button>
        </div>
      )}

      {/* Admin Portal Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              User Access &amp; Feature Permissions Portal
            </h2>
            <span className="rounded px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              RBAC v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Add team members, drivers, dispatchers, and auditors. Configure granular feature-level access and test live as any user with one click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-4 py-2.5 text-xs font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, depot, or role..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredUsers.length} of {users.length} Users
        </div>
      </div>

      {/* Users Matrix Layout: List (Left) + Detailed Permissions Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Roster List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredUsers.map((user) => {
            const isSelected = selectedUserForEdit?.id === user.id;
            const grantedCount = Object.values(user.permissions).filter(Boolean).length;

            return (
              <div
                key={user.id}
                onClick={() => setSelectedUserForEdit(user)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${user.avatarColor}`}>
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{user.name}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.depot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {grantedCount}/9 Modules
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTesting(user);
                      }}
                      className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      title="Test the app as this user"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Test as User</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Permissions Configuration Inspector (Right Panel) */}
        <div className="lg:col-span-5">
          {selectedUserForEdit ? (
            <div className="sticky top-20 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${selectedUserForEdit.avatarColor}`}>
                    {selectedUserForEdit.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedUserForEdit.name}</h3>
                    <p className="text-xs text-slate-400">{selectedUserForEdit.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteUser(selectedUserForEdit.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                  Granular Feature Permissions
                </span>

                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {PERMISSION_DEFINITIONS.map((perm) => {
                    const isGranted = selectedUserForEdit.permissions[perm.key];

                    return (
                      <div
                        key={perm.key}
                        onClick={() => handleToggleExistingPermission(selectedUserForEdit.id, perm.key)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isGranted
                            ? 'bg-slate-950 border-cyan-500/40 text-slate-100'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                              isGranted
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isGranted ? <Check className="w-3.5 h-3.5" /> : null}
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${isGranted ? 'text-white' : 'text-slate-400'}`}>
                              {perm.title}
                            </div>
                            <div className="text-[10px] text-slate-500">{perm.desc}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          isGranted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isGranted ? 'Enabled' : 'Locked'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-mono">
                  {Object.values(selectedUserForEdit.permissions).filter(Boolean).length} granted
                </span>
                <button
                  onClick={() => handleStartTesting(selectedUserForEdit)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Test as {selectedUserForEdit.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
              <Shield className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-xs">Select any user on the left to inspect or modify their feature permissions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                Add &amp; Configure New User
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="r.adams@haulage.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Role Preset</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => handleRoleSelect(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HGV_DRIVER">HGV Driver (Class 1 / Class 2)</option>
                    <option value="TRANSPORT_MANAGER">Transport Manager (Full Ops)</option>
                    <option value="DISPATCHER">Depot Dispatcher / Marshall</option>
                    <option value="FLEET_ADMIN">Fleet Administrator (Full Access)</option>
                    <option value="AUDITOR">DVSA / Compliance Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Assigned Depot / Hub</label>
                  <input
                    type="text"
                    value={newUserDepot}
                    onChange={(e) => setNewUserDepot(e.target.value)}
                    placeholder="e.g. Bristol Gateway DC"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Granular Permission Checklist for New User */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-300 mb-2">
                  Granular Functionality Permissions:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {PERMISSION_DEFINITIONS.map((perm) => {
                    const isChecked = newUserPermissions[perm.key];
                    return (
                      <div
                        key={perm.key}
                        onClick={() => handleToggleNewUserPermission(perm.key)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-slate-950 border-cyan-500/40 text-slate-100'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                              isChecked
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isChecked ? <Check className="w-3 h-3" /> : null}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{perm.title}</div>
                            <div className="text-[10px] text-slate-500">{perm.desc}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isChecked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isChecked ? 'Allowed' : 'Denied'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20"
                >
                  Create &amp; Authorize User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
