interface ProductDescriptionProps {
    description: string;
  }
  
  const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    // Split description into main text and highlights if "Highlights:" exists
    const [mainText, highlightsText] = description.split(/Highlights:/i);
    const highlights = highlightsText
      ? highlightsText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : [];
  
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mt-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
           Description :
        </h3>
        <div className="overflow-y-auto max-h-[300px] scrollbar-hide">
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {mainText?.trim()}
        </p>
  
        {highlights.length > 0 && (
          <>
            <h4 className="text-gray-800 dark:text-white font-bold mb-2">Highlights:</h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
              {highlights.map((item, idx) => (
                <li key={idx}>
                  {/* Make the first part before ":" bold if exists */}
                  {item.includes(":") ? (
                    <>
                      <span className="font-semibold">{item.split(":")[0]}:</span>{" "}
                      {item.split(":")[1].trim()}
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        </div>
      </div>
    );
  };
  
  export default ProductDescription;
  