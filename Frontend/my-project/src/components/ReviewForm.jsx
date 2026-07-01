import React, { useState } from "react";

const ReviewForm = ({ onSubmit, onClose }) => {
  const [review, setReview] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (review.trim() && name.trim()) {
      onSubmit({ name, review });
      setReview("");
      setName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg relative animate-fade-in">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center">
          Share Your Experience
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your review..."
            rows={5}
            className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
