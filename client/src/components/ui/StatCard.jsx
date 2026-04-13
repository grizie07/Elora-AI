const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-[#1E293B] p-5 rounded-2xl shadow-md">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
};

export default StatCard;