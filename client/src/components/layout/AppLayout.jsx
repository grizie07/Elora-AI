import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";
import { useTheme } from "../../context/ThemeContext";

const AppLayout = ({ children }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const bg = isLight ? "#F1F5F9" : "#0D1117";

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, overflow: "hidden", transition: "background 0.25s" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: "auto", background: bg, transition: "background 0.25s" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;