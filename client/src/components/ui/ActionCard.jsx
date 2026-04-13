const ActionCard = ({ title, desc }) => {
  return (
    <div className="bg-[#1F2937] p-4 rounded-xl hover:bg-[#374151] transition">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
};

export default ActionCard;