import React, { useEffect, useState } from "react";
import { FaHeart, FaBookmark, FaComment, FaPaperPlane } from "react-icons/fa";
import { baseImgUrl } from "../../constance";
import { formatTimestamp } from "../../utils/formateTimeStamp";
import api from "../../utils/axios";
import CommentCard from "../Comment/CommentCard";

const Post = ({post}) => {
  const {userId, firstName,lastName, createdAt, location, picturePath } = post;
  const [user, setUser] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] =useState([])
  const [commentInput, setCommentInput] = useState("");
  const [ flag, setFlag]=useState(false)

  useEffect(() => {
    console.log(post);
    // Simulating fetching comments
    if (userId) {
      api.get(`/users/${userId}`).then((user) => setUser(user.data));
    }

    //setting comments to variable
    setComments(post.comments)

    // setting like count and comment count
    setLikeCount(Object.keys(post.likes).length)
    setCommentCount(Object.keys(post.comments).length)

    //setting user liked or not
    if (post.likes.hasOwnProperty(userId)) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
   
  }, []);

  const handleLike = () => {
    api.patch(`/posts/${post._id}/like`,{userId}).then(res=>console.log(res))
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };
  
  const handleAddComment = async () => {
    
    if (commentInput.trim() === '') return;

    try {
      const response = await api.post( `posts/${post._id}/comment`,{
        content : commentInput,
        userId:localStorage.getItem('user_id')
      } );

      const {newComment}=response.data
      console.log(newComment);
      // setComments(newComment)
      console.log(response);
      setCommentInput('')
      setComments(prevComments => [...prevComments, response.data.newComment]);
      setCommentCount(commentCount+1);
    } catch (err) {
      console.error('Error adding comment:', err);
    }

  };


  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 mb-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <img
          src={
            baseImgUrl + user.picturePath ||
            "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png"
          }
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="ml-4">
          <div className="font-semibold text-lg text-gray-800">{firstName+lastName}</div>
          <div className="text-gray-600 text-sm">
            {formatTimestamp(createdAt)} • {location}
          </div>
        </div>
      </div>
      <div className="mb-4 rounded-lg overflow-hidden">
        <img
          src={baseImgUrl + picturePath}
          alt="Post"
          className="w-full h-auto max-h-96 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              isLiked ? "text-red-500" : "text-gray-500"
            } hover:text-red-500 transition-colors duration-200`}
          >
            <FaHeart className="text-xl" />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={handleCommentToggle}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
          >
            <FaComment className="text-xl" />
            <span>{commentCount}</span>
          </button>
        </div>
        <button className="text-gray-500 hover:text-yellow-500 transition-colors duration-200">
          <FaBookmark className="text-xl" />
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showComments ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="mb-4 max-h-40 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id}>

           <CommentCard comment={comment}/>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;