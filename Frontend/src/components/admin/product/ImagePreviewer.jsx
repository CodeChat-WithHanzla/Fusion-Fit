import React from 'react';
import { X } from 'lucide-react';

const ImagePreview = ({ images, imageIds, onDeleteImage, onAddImages, newImages }) => {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-600">Event Images</label>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((url, index) => (
                    <div key={imageIds[index]} className="relative group">
                        <img
                            src={url}
                            alt={`Dress ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                            onClick={() => onDeleteImage(imageIds[index])}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {/* New Image Previews */}
                {newImages?.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`New Upload ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    </div>
                ))}

                {/* Add Image Button */}
                {/* Upload Button */}
                {(images.length + (newImages?.length || 0)) < 5 && (
                    <label className="flex items-center justify-center w-full h-48 border-2 
                           border-dashed border-gray-300 rounded-lg cursor-pointer
                           hover:border-blue-500 transition-colors">
                        <div className="text-center">
                            <div className="mt-2 text-sm text-gray-600">Click to upload</div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={onAddImages}
                                className="hidden"
                            />
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
};

export default ImagePreview;