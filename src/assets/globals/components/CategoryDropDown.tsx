import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchCategories } from "../../../store/categorySlice";

interface Props {
  selected: string;
  onSelect: (value: string) => void;
}

const CategoryDropdown = ({ selected, onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch()
  const { category } = useAppSelector((state) => state.category);

  useEffect(()=>{
     category && dispatch(fetchCategories())
  },[dispatch])

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
    <div ref={ref} className="relative w-full z-[200]">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white dark:bg-gray-700 
                   border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md 
                   text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 shadow-sm"
      >
        <span>{selected}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-600 rounded-md shadow-lg 
                     py-2 max-h-60 overflow-y-auto z-[9999] animate-fadeIn scrollbar-hide"
        >
          {/* All Category */}
          <div
            onClick={() => {
              onSelect("All");
              setOpen(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
          >
            All
          </div>

          {/* Main category list */}
          {category.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelect(cat.categoryName);
                setOpen(false);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 
                         hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
