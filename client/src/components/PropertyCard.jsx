import { useState } from "react";
import { Heart } from "lucide-react";


const PropertyCard = ({ title, location, price, rating, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img
          src={images[currentImageIndex]}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full"
        >
          <Heart
            className={`h-5 w-5 ${
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="flex items-center gap-1">
            <svg
              viewBox="0 0 32 32"
              className="h-3 w-3 fill-current"
              aria-hidden="true"
            >
              <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" />
            </svg>
            <span className="text-sm">{rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-sm mt-2">
          <span className="font-semibold">${price}</span> night
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;