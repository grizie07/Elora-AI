import Sidebar from "../components/ui/Sidebar";
import Topbar from "../components/ui/Topbar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#0B1120] text-white">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="p-6 overflow-y-auto bg-[#0F172A]">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;