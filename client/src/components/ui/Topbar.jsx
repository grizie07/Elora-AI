const Topbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0B1120] border-b border-gray-800">

      {/* Search */}
      <input
        type="text"
        placeholder="Search courses, notes, or ask a question..."
        className="w-1/2 bg-[#1F2937] px-4 py-2 rounded-xl outline-none"
      />

      {/* Icons */}
      <div className="flex items-center gap-4">
        <button>🌙</button>
        <button>🔔</button>
      </div>
    </div>
  );
};

export default Topbar;