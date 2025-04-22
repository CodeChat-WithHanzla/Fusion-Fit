import React, { useState } from "react";

const ImageGallery = ({ images, altText }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]); // Default to the first image

  if (!images || images.length === 0) {
    return <p>No images available.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Big Frame */}
      <div className="relative w-full max-w-3xl">
        <img
          src={selectedImage}
          alt={altText}
          className="w-full h-96 object-cover rounded-md shadow-lg transform transition-transform hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div
        className={`grid grid-cols-5 gap-4 max-w-3xl ${
          images.length < 5 ? `grid-cols-${images.length}` : "grid-cols-5"
        }`}
      >
        {images.slice(0, 5).map((url, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(url)}
            className={`relative w-full h-24 rounded-md overflow-hidden border-2 ${
              selectedImage === url
                ? "border-blue-500"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={url}
              alt={`${altText} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover transform transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
