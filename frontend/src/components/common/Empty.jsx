import { PackageOpen } from "lucide-react";

const Empty = ({ message = "Nothing here yet." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
      <PackageOpen size={48} strokeWidth={1.5} />
      <p className="text-base">{message}</p>
    </div>
  );
};

export default Empty;
