import { Eye } from "lucide-react";
import { useState } from "react";

const Input = ({ icon: Icon, type, ...props }) => {
  const [visible, setVisible] = useState(type === "password" ? false : true);
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-white" />
      </div>
      <input
        type={type !== "password" ? type : visible ? "text" : "password"}
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-black focus:ring-2 focus:ring-black text-white placeholder-gray-400 transition duration-200"
      />
      {type === "password" && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            setVisible(!visible);
          }}
        >
          <Eye className="size-5 text-white" />
        </button>
      )}
    </div>
  );
};
export default Input;
