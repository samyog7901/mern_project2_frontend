import { FcGoogle } from "react-icons/fc";


export default function GoogleLoginButton({ onClick,label }: { onClick: () => void,label: "Sign in" | "Sign up"; }) {
  
  return (
    <div className="hover:text-gray-200">
    <button
      onClick={onClick}
      type="button"
      className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600
      py-2 rounded-lg  dark:hover:bg-gray-600 transition duration-20 dark:bg-gray-800 dark:text-white hover:cursor-pointer"
    >
      <FcGoogle size={22} />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200  transition-colors">
        {label} with Google
      </span>
    </button>
  </div>
  
  );
}
