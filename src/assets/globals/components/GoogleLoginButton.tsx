import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="hover:text-gray-200">
    <button
      onClick={onClick}
      type="button"
      className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600
      py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-300 transition duration-200"
    >
      <FcGoogle size={22} />
      <span className="text-sm font-medium text-gray-700 dark:text-black  hover:text-gray-800 transition-colors">
        Continue with Google
      </span>
    </button>
  </div>
  
  );
}
