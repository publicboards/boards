import { ChevronUp, ChevronDown } from "lucide-react";

interface PostEntryProps {
  title: string;
  description: string;
  votes: number;
  author: string;
  date: string;
  imageUrl?: string;
  isHighlighted?: boolean;
  isDownvoted?: boolean;
}

export function PostEntry({
  title,
  description,
  votes,
  author,
  date,
  imageUrl,
  isHighlighted = false,
  isDownvoted = false,
}: PostEntryProps) {
  return (
    <li
      className={`p-4 bg-white dark:bg-gray-700 rounded shadow-md flex space-x-4 ${
        isHighlighted ? "border-l-4 border-green-500" : ""
      } ${isDownvoted ? "border-l-4 border-red-500" : ""}`}
    >
      <div className="flex flex-col items-center space-y-2">
        <button className={`text-gray-500 hover:text-blue-500 ${isHighlighted ? "text-blue-500" : ""}`}>
          <ChevronUp className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{votes}</span>
        <button className={`text-gray-500 hover:text-red-500 ${isDownvoted ? "text-red-500" : ""}`}>
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 flex items-start">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`Post ${title}`}
            className="w-16 h-16 rounded mr-4 self-start"
          />
        )}
        <div className="flex flex-col justify-start">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Posted by {author} | {date}
          </div>
        </div>
      </div>
    </li>
  );
}
