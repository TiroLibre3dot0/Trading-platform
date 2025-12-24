import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  MdShoppingCart,
  MdTrendingUp,
  MdHistory,
  MdLightbulb,
  MdAccountBalanceWallet,
  MdChat,
  MdLogout,
  MdMenu,
  MdPerson,
  MdSettings,
  MdVerified,
} from "react-icons/md";

const links = [
  { to: "/qlik-lab", label: "NEGOZIA", icon: MdShoppingCart },
  { to: "/profile/positions", label: "POSIZIONI APERTE", icon: MdTrendingUp },
  { to: "/profile/history", label: "POSIZIONI CHIUSE", icon: MdHistory },
  { to: "/profile/insights", label: "INSIGHTS", icon: MdLightbulb },
  { to: "/profile/funds", label: "FONDI", icon: MdAccountBalanceWallet },
];

const bottomLinks = [
  { to: "/support", label: "Chat Supporto", icon: MdChat },
];

interface ProfileSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user?: { email: string; name: string; tier?: string } | null;
}

const ProfileSidebar = ({ collapsed, onToggle, user }: ProfileSidebarProps) => {
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountSidebarOpen, setAccountSidebarOpen] = useState(false);

  const baseItem = "flex items-center gap-3 px-3 py-2 rounded-xl transition";
  const active = "bg-white/10 text-white border border-white/15";
  const inactive = "text-white/70 hover:text-white hover:bg-white/5 border border-transparent";

  const content = (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between px-2 pt-2">
        <button
          onClick={() => setAccountSidebarOpen(!accountSidebarOpen)}
          className="text-sm font-semibold text-white/70 hover:text-white transition"
        >
          MENU
        </button>
        <button
          onClick={() => {
            onToggle();
            setMobileOpen(false);
          }}
          className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white"
          aria-label="Collapse sidebar"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${baseItem} ${isActive ? active : inactive} ${collapsed ? "justify-center" : ""}`
            }
            onClick={() => setMobileOpen(false)}
          >
            <item.icon className="w-4 h-4" />
            {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1">
        {bottomLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${baseItem} ${isActive ? active : inactive} ${collapsed ? "justify-center" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <item.icon className="w-4 h-4" />
            {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
          </NavLink>
        ))}
        <button
          onClick={() => {
            signOut();
            setMobileOpen(false);
          }}
          className={`${baseItem} ${inactive} ${collapsed ? "justify-center" : ""} w-full text-left`}
        >
          <MdLogout className="w-4 h-4" />
          {!collapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden mb-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
        onClick={() => setMobileOpen(true)}
      >
        ☰ Menu
      </button>

      <aside
        className={`hidden lg:flex flex-col rounded-2xl border border-white/10 bg-[#080f21]/70 backdrop-blur-xl shadow-[0_24px_90px_rgba(0,0,0,0.55)] transition-all duration-200 ${
          collapsed ? "w-16 px-2" : "w-64 px-3"
        } py-4 h-full ${accountSidebarOpen ? "mr-80" : ""}`}
      >
        {content}
      </aside>

      {accountSidebarOpen && (
        <aside className="hidden lg:flex flex-col absolute right-0 top-0 w-80 h-full bg-[#080f21]/90 backdrop-blur-xl border-l border-white/10 shadow-2xl z-40 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Account Info</h2>
            <button
              onClick={() => setAccountSidebarOpen(false)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white"
              aria-label="Close account sidebar"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div className="text-white font-semibold">{user?.name ?? "User"}</div>
                <div className="text-white/60 text-sm">{user?.email ?? ""}</div>
                <div className="text-white/50 text-xs">{user?.tier ?? "Base"} Account</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-sm">Account Type</label>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-semibold">Live</button>
                <button className="flex-1 px-3 py-2 rounded-lg border border-white/20 text-white/70 text-sm hover:border-white/40">Demo</button>
              </div>
            </div>

            <nav className="space-y-2">
              <button className={`${baseItem} ${inactive} w-full text-left`}>
                <MdPerson className="w-4 h-4" />
                <span className="text-sm font-semibold">Profile</span>
              </button>
              <button className={`${baseItem} ${inactive} w-full text-left`}>
                <MdSettings className="w-4 h-4" />
                <span className="text-sm font-semibold">Settings</span>
              </button>
              <button className={`${baseItem} ${inactive} w-full text-left`}>
                <MdVerified className="w-4 h-4" />
                <span className="text-sm font-semibold">Verification</span>
              </button>
            </nav>

            <button
              onClick={() => {
                signOut();
                setAccountSidebarOpen(false);
              }}
              className={`${baseItem} ${inactive} w-full text-left`}
            >
              <MdLogout className="w-4 h-4" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </aside>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-72 bg-[#080f21] border-r border-white/10 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 text-white">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSidebar;
