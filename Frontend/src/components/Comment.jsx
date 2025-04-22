// Comment Component
import StarRating from "./Rating";
const Comment = ({ comment }) => (
    <div className="border-b border-gray-200 py-4">
        <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {comment.name[0]}
            </div>
            <div>
                <p className="font-semibold">{comment.name}</p>
                <StarRating rating={comment.rating} />
            </div>
        </div>
        <p className="text-gray-700 ml-10">{comment.text}</p>
    </div>
);
export default Comment;