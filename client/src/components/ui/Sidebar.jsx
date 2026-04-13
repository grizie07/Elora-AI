import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all";
  const activeClass = "bg-gradient-to-r from-indigo-500 to-purple-500 text-white";

  return (
    <div className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col justify-between">

      {/* Logo */}
      <div>
        <div className="p-6 text-xl font-bold flex items-center gap-2">
          ✨ ELORA
        </div>

        {/* Menu */}
        <nav className="space-y-2 px-4">
          <NavLink to="/student" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
            Dashboard
          </NavLink>

          <NavLink to="/materials" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
            Library
          </NavLink>

          <NavLink to="/chats" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
            AI Chat
          </NavLink>

          <NavLink to="/analytics" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
            Analytics
          </NavLink>

          <NavLink to="/settings" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Profile */}
      <div className="p-4 border-t border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
          A
        </div>
        <div>
          <p className="text-sm font-medium">Alex Chen</p>
          <p className="text-xs text-gray-400">Premium Plan</p>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;