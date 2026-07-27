const Divider = ({ text = "OR" }) => {
  return (
    <div className="flex items-center gap-4 my-6">
      <hr className="flex-1" />

      <span className="text-sm text-gray-400">{text}</span>

      <hr className="flex-1" />
    </div>
  );
};

export default Divider;
