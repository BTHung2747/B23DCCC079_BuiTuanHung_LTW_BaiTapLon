import React from 'react';
import { FaFileAlt, FaUsers, FaCloudUploadAlt, FaUpload } from 'react-icons/fa';
import './HomeView.css'; // Import file CSS

const HomeView = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Welcome to <span className="text-blue-600">DocShare</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Share, discover, and collaborate on documents with our global community of professionals and learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="text-blue-600 mb-4">
              <FaFileAlt className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
            <p className="text-gray-600">Share your documents securely with anyone, anywhere in the world.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="text-blue-600 mb-4">
              <FaUsers className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Driven</h3>
            <p className="text-gray-600">Join our growing community of knowledge seekers and contributors.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="text-blue-600 mb-4">
              <FaCloudUploadAlt className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
            <p className="text-gray-600">Access your documents from anywhere with secure cloud storage.</p>
          </div>
        </div>

        {/* Các nút */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.location.href = "/documents"} 
            className="browse-button"
          >
            Browse Documents
          </button>
          <button
            onClick={() => window.location.href = "/upload"} 
            className="upload-button"
          >
            <FaUpload className="w-6 h-6" /> Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
