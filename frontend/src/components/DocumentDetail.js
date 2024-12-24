import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEye, FaStar, FaHeart, FaShare, FaDownload } from "react-icons/fa"; // Thêm FaDownload
import './DocumentDetail.css';

const DocumentDetail = ({ selectedDocument, setSelectedDocument, user }) => {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchDocumentDetails = useCallback(async (documentId) => {
    console.log(`Fetching details for documentId: ${documentId}`);
    try {
      const response = await axios.get(`http://localhost:3000/api/documents/${documentId}`);
      setSelectedDocument(prevDocument => ({
        ...prevDocument,
        ...response.data.document || response.data,
        fetched: true
      }));

      const commentResponse = await axios.get(`http://localhost:3000/api/comments?documentId=${documentId}`);
      const fetchedComments = commentResponse.data.comments;

      const ratingResponse = await axios.get(`http://localhost:3000/api/ratings/${documentId}`);
      const ratings = ratingResponse.data.ratings;

      const updatedComments = fetchedComments.map(comment => {
        const rating = ratings.find(r => r.user_id === comment.user_id);
        return rating ? { ...comment, rating: rating.rating } : comment;
      });

      setComments(updatedComments);

      // Cập nhật giá trị rating trung bình
      const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0;
      setRating(averageRating);

    } catch (error) {
      console.error("Error fetching document details:", error);
    }
  }, [setSelectedDocument]);

  useEffect(() => {
    if (selectedDocument && selectedDocument.id && !selectedDocument.fetched) {
      fetchDocumentDetails(selectedDocument.id);
    }
  }, [selectedDocument, fetchDocumentDetails, setSelectedDocument]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedDocument || !selectedDocument.id) {
      console.log("Bình luận mới trống hoặc không có tài liệu được chọn");
      return;
    }

    const commentData = {
      documentId: selectedDocument.id,
      userId: user.id,
      comment: newComment,
      rating: rating,
    };

    try {
      await axios.post(`http://localhost:3000/api/comments`, commentData);
      const updatedComments = await axios.get(`http://localhost:3000/api/comments?documentId=${selectedDocument.id}`);
      setComments(updatedComments.data.comments);
      setNewComment("");

      if (rating > 0) {
        const ratingData = {
          documentId: selectedDocument.id,
          userId: user.id,
          rating: rating,
        };
        await axios.post(`http://localhost:3000/api/ratings`, ratingData);
      }

      const updatedDocument = await axios.get(`http://localhost:3000/api/documents/${selectedDocument.id}`);
      setSelectedDocument(updatedDocument.data);

      setRating(0);

      const updatedRatings = await axios.get(`http://localhost:3000/api/ratings/${selectedDocument.id}`);
      setComments(prevComments =>
        prevComments.map(comment => {
          const rating = updatedRatings.data.ratings.find(r => r.user_id === comment.user_id);
          return rating ? { ...comment, rating: rating.rating } : comment;
        })
      );

    } catch (error) {
      console.error("Lỗi khi gửi bình luận hoặc đánh giá:", error.response || error.message);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  useEffect(() => {
    console.log("Giá trị rating đã được cập nhật:", rating);
  }, [rating]);

  if (!selectedDocument) {
    return <p>Không có tài liệu nào được chọn.</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={`http://localhost:3000${selectedDocument.image_path}`}
            alt={selectedDocument.title}
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1586281380349-632531db7ed4";
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{selectedDocument.title}</h2>
            <p className="text-gray-200">{selectedDocument.description}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <FaEye className="text-blue-500" />
                <span className="font-semibold">{selectedDocument.views}</span> lượt xem
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold">
                  {rating > 0 ? rating.toFixed(1) : "Chưa có đánh giá"}
                </span>
                {rating > 0 && <FaStar className="text-yellow-500" />}
              </span>
              <span className="flex items-center gap-2">
                <FaHeart className={`${isLiked ? "text-red-500" : "text-gray-400"} cursor-pointer`} onClick={() => setIsLiked(!isLiked)} />
                <span className="font-semibold">{selectedDocument.likes}</span>
              </span>
              <span className="flex items-center gap-2">
                <FaShare className="text-green-500" />
                <span className="font-semibold">{selectedDocument.shares}</span>
              </span>
            </div>
            <a 
              href={`http://localhost:3000${selectedDocument.file_path}`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDownload className="mr-2" /> Tải về
            </a>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">Bình luận</h3>
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{comment.user_name ? comment.user_name : "Ẩn danh"}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(comment.rating || 0)].map((_, index) => (
                        <FaStar
                          key={index}
                          className="text-yellow-500 w-4 h-4"
                        />
                      ))}
                      {[...Array(5 - (comment.rating || 0))].map((_, index) => (
                        <FaStar
                          key={index}
                          className="text-gray-300 w-4 h-4"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{comment.comment}</p>
                </div>
              ))}
            </div>

            {user ? (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Thêm bình luận của bạn</h4>
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="Viết bình luận của bạn ở đây..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)} 
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                          onClick={() => handleRatingClick(index + 1)}
                        />                      
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Gửi bình luận
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <p>Vui lòng đăng nhập để thêm bình luận.</p>
            )}
          </div>
        </div>
      </div>
      </div>
  );
};
export default DocumentDetail;