import {Link, useLocation, useNavigate} from "react-router";
import {ChipDirective, ChipListComponent, ChipsDirective} from "@syncfusion/ej2-react-buttons";
import {cn, getFirstWord} from "~/lib/utils";
import React from "react";

interface TripCardProps {
    id: string;
    name: string;
    location: string;
    imageUrl: string;
    tags: string[];
    price: string;
    onDelete?: (id: string) => void;
    showDeleteButton?: boolean;
}

const TripCard = ({id, name, location, imageUrl, tags, price, onDelete, showDeleteButton = false}: TripCardProps) => {
    const path = useLocation();
    const navigate = useNavigate();
    const isPreview = id === 'preview';

    const cardContent = (
        <>
            {/* Image with price pill overlay */}
            <div className="relative">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full h-[160px] rounded-t-xl object-cover aspect-video"
                />
                {/* Price pill positioned absolutely */}
                <div className="absolute top-2.5 right-4 bg-white py-1 px-2.5 rounded-[20px] text-dark-100 text-sm font-semibold shadow-sm">
                    {price}
                </div>
                
                {/* Delete button - only show if showDeleteButton is true */}
                {showDeleteButton && onDelete && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this trip?')) {
                                onDelete(id);
                            }
                        }}
                        className="absolute top-2.5 left-4 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm transition-colors duration-200"
                        title="Delete trip"
                    >
                        ×
                    </button>
                )}
            </div>
            
            {/* Content section */}
            <div className="flex flex-col gap-3 mt-4 pl-[18px] pr-3.5 pb-5">
                {/* Title */}
                <h2 className="text-sm md:text-lg font-semibold text-dark-100 line-clamp-2">
                    {name}
                </h2>
                
                {/* Location */}
                <figure className="flex items-center gap-2">
                    <img
                        src="/assets/icons/location-mark.svg"
                        alt="location" 
                        className="size-4"
                    />
                    <figcaption className="text-xs md:text-sm font-normal text-gray-100">
                        {location}
                    </figcaption>
                </figure>
                
                {/* Tags */}
                <div className="mt-2">
                    <ChipListComponent id={`travel-chip-${id}`}>
                        <ChipsDirective>
                            {tags?.slice(0, 2).map((tag, index) => (
                                <ChipDirective
                                    key={index}
                                    text={getFirstWord(tag)}
                                    cssClass={cn(
                                        index === 0 
                                            ? '!bg-pink-50 !text-pink-500 !rounded-full !px-3 !py-1 !text-xs !font-medium' 
                                            : '!bg-success-50 !text-success-700 !rounded-full !px-3 !py-1 !text-xs !font-medium'
                                    )}
                                />
                            ))}
                        </ChipsDirective>
                    </ChipListComponent>
                </div>
            </div>
        </>
    );

    if (isPreview) {
        return (
            <div className="trip-card shadow-300 bg-white rounded-[20px] flex-col w-full relative">
                {cardContent}
            </div>
        );
    }

    // Determine the correct link based on the current path
    const getTripLink = () => {
        if (path.pathname.startsWith('/trips')) {
            return `/trips/${id}`;
        }
        return `/travel/${id}`;
    };

    // Handle card click for dashboard trips
    const handleCardClick = (e: React.MouseEvent) => {
        if (showDeleteButton) {
            // For dashboard trips, navigate to trip summary
            e.preventDefault();
            navigate('/trips/create/summary', { 
                state: { 
                    tripData: {
                        name,
                        country: location,
                        imageUrls: [imageUrl],
                        estimatedPrice: price,
                        travelStyle: tags[0] || '',
                        budget: tags[1] || '',
                        groupType: tags[2] || '',
                        duration: 5, // Default duration
                        description: `${name} - ${location} adventure`,
                        interests: tags.join(', '),
                        location: { city: location, coordinates: [0, 0], openStreetMap: '' }
                    }
                } 
            });
        }
    };

    return (
        <Link 
            to={getTripLink()}
            onClick={handleCardClick}
            className="trip-card shadow-300 bg-white rounded-[20px] flex-col w-full relative hover:shadow-400 transition-shadow duration-200"
        >
            {cardContent}
        </Link>
    );
};

export default TripCard;