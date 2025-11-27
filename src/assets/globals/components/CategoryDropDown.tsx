import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchCategories } from "../../../store/categorySlice";

interface Props {
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
}

const CategoryDropdown = ({ selected, onSelect, className }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative z-[99999] ${className || ""}`}
    >
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between 
                   bg-white dark:bg-gray-700 
                   border border-gray-300 dark:border-gray-600 
                   px-3 py-2 rounded-l-md 
                   text-gray-800 dark:text-white 
                   focus:ring-2 focus:ring-purple-500 
                   shadow-sm text-sm"
      >
        <span className="truncate">{selected}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown List */}
      {open && (
        <div
          className="absolute left-0 top-full mt-1 
                     bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-600 
                     rounded-md shadow-lg 
                     max-h-60 overflow-y-auto 
                     min-w-full w-max 
                     z-[999999]"
        >
          <div
            onClick={() => {
              onSelect("All");
              setOpen(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 
                       dark:hover:bg-gray-700 
                       cursor-pointer text-sm dark:text-white"
          >
            All
          </div>

          {category.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelect(cat.categoryName);
                setOpen(false);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 
                         hover:bg-gray-100 dark:hover:bg-gray-700 
                         cursor-pointer text-sm"
            >
              {cat.categoryName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
