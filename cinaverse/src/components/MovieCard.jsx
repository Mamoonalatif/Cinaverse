import React from 'react';

export default function MovieCard({ image, title }) {
  return (
    <div className="w-48 flex-shrink-0 mr-4">
      <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg" />
      <h3 className="mt-2 text-white font-medium">{title}</h3>
    </div>
  );
}
