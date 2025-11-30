import {Header} from "../../../components";
import {useLocation, useNavigate} from "react-router";
import React, {useState, useEffect} from "react";
import {getTripById} from "~/appwrite/trips";

export const loader = async ({params}: {params: {id: string}}) => {
    try {
        const trip = await getTripById(params.id);
        return trip;
    } catch (error) {
        console.error('Error loading trip:', error);
        return null;
    }
};

const TripDetails = ({loaderData}: {loaderData: any}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loaderData) {
            setTrip(loaderData);
        } else if (location.state?.tripData) {
            setTrip(location.state.tripData);
        }
        setLoading(false);
    }, [loaderData, location.state]);

    // Function to generate Google Maps URL
    const getGoogleMapsUrl = (locationName: string) => {
        const encodedLocation = encodeURIComponent(locationName);
        return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=10&size=600x400&maptype=roadmap&markers=color:red%7C${encodedLocation}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    };

    // Function to get a map image URL based on location
    const getMapImageUrl = (locationName: string) => {
        const encodedLocation = encodeURIComponent(locationName);
        // Using a more reliable map service
        return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=8&size=600x400&maptype=roadmap&markers=color:red%7C${encodedLocation}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`;
    };

    // Function to get a fallback map image with better styling
    const getFallbackMapUrl = (locationName: string) => {
        const encodedLocation = encodeURIComponent(locationName);
        return `https://via.placeholder.com/600x400/4A90E2/FFFFFF?text=Map+of+${encodedLocation}&font-size=24`;
    };

    // Function to get a location-specific image
    const getLocationImage = (locationName: string) => {
        const locationImages: { [key: string]: string } = {
            'Japan': '/assets/images/sample1.jpg',
            'Thailand': '/assets/images/sample2.jpg',
            'France': '/assets/images/sample3.jpg',
            'Italy': '/assets/images/sample4.jpg',
            'Spain': '/assets/images/sample1.jpg',
            'Germany': '/assets/images/sample2.jpg',
            'United Kingdom': '/assets/images/sample3.jpg',
            'Netherlands': '/assets/images/sample4.jpg',
            'Switzerland': '/assets/images/sample1.jpg',
            'Austria': '/assets/images/sample2.jpg'
        };
        return locationImages[locationName] || '/assets/images/sample1.jpg';
    };

    if (loading) {
        return (
            <main className="flex flex-col gap-10 pb-20 wrapper">
                <Header title="Trip Details" description="Loading trip details..." />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </main>
        );
    }

    if (!trip) {
        return (
            <main className="flex flex-col gap-10 pb-20 wrapper">
                <Header title="Trip Details" description="Trip not found" />
                <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Trip not found</h3>
                    <p className="text-gray-500">The trip you're looking for doesn't exist.</p>
                    <button 
                        onClick={() => navigate('/trips')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Back to Trips
                    </button>
                </div>
            </main>
        );
    }

    // Generate detailed itinerary based on trip data
    const generateDetailedItinerary = () => {
        const baseItinerary = [
            {
                day: 1,
                title: `Day 1: Arrival in ${trip.country}`,
                activities: [
                    "Arrive at airport & check-in at hotel",
                    `Explore ${trip.country} city center`,
                    `Enjoy ${trip.interests} activities`,
                    "Dinner at local restaurant"
                ]
            },
            {
                day: 2,
                title: `Day 2: ${trip.travelStyle} Adventure`,
                activities: [
                    `Morning: ${trip.interests} exploration`,
                    `Afternoon: ${trip.travelStyle} activities`,
                    "Evening: Local culture experience"
                ]
            },
            {
                day: 3,
                title: `Day 3: ${trip.country} Highlights`,
                activities: [
                    "Visit main attractions",
                    "Local food tasting",
                    "Cultural activities"
                ]
            },
            {
                day: 4,
                title: `Day 4: ${trip.country} Exploration`,
                activities: [
                    "Explore hidden gems",
                    "Adventure activities",
                    "Evening entertainment"
                ]
            },
            {
                day: 5,
                title: "Day 5: Shopping & Departure",
                activities: [
                    "Last-minute shopping",
                    "Farewell activities",
                    "Head to airport for departure"
                ]
            }
        ];

        return baseItinerary.slice(0, trip.duration);
    };

    const detailedItinerary = generateDetailedItinerary();

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header 
                title="Trip Details" 
                description="Detailed trip information and itinerary" 
            />

            <section className="mt-8 wrapper-md">
                <div className="max-w-6xl mx-auto">
                    {/* Trip Header */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Side - Images */}
                            <div className="lg:w-1/2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <img 
                                            src={trip.imageUrls?.[0] || "/assets/images/sample1.jpg"} 
                                            alt={trip.name}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <img 
                                            src="/assets/images/sample2.jpg" 
                                            alt="Hotel"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <img 
                                            src="/assets/images/sample3.jpg" 
                                            alt="Beach"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Trip Info */}
                            <div className="lg:w-1/2">
                                <div className="flex items-center gap-2 mb-4">
                                    <img src="/assets/icons/calendar.svg" alt="calendar" className="w-5 h-5" />
                                    <span className="text-gray-600">{trip.duration} day plan</span>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <img src="/assets/icons/location-mark.svg" alt="location" className="w-5 h-5" />
                                    <span className="text-gray-600">{trip.country}</span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {[trip.travelStyle, trip.budget, trip.groupType].filter(Boolean).map((tag, index) => (
                                        <span 
                                            key={index}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                index === 0 ? 'bg-pink-100 text-pink-600' :
                                                index === 1 ? 'bg-blue-100 text-blue-600' :
                                                index === 2 ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                            }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <img key={i} src="/assets/icons/star.svg" alt="star" className="w-5 h-5" />
                                        ))}
                                    </div>
                                    <span className="text-gray-600">4.9/5.0</span>
                                </div>

                                {/* Trip Name and Price */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {trip.name}
                                        </h1>
                                        <p className="text-gray-600 text-lg">
                                            {trip.travelStyle}, {trip.budget}, and {trip.groupType}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {trip.estimatedPrice}
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Description */}
                                <div className="mb-6">
                                    <p className="text-gray-700 mb-3">
                                        {trip.description}
                                    </p>
                                    <p className="text-gray-700">
                                        Experience the best of {trip.country} with {trip.interests} activities, 
                                        perfect for {trip.groupType} travelers on a {trip.budget} budget. 
                                        🚂 ✨
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Day-by-Day Itinerary */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
                        <div className="space-y-6">
                            {detailedItinerary.map((day) => (
                                <div key={day.day} className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {day.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {day.activities.map((activity, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700">{activity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best Time to Visit & Weather Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Best Time to Visit */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Time to Visit:</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">🌸</span>
                                    <div>
                                        <strong>Spring (March-May):</strong>
                                        <p className="text-gray-600">Cherry blossoms in full bloom, mild temperatures.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">🍁</span>
                                    <div>
                                        <strong>Autumn (September-November):</strong>
                                        <p className="text-gray-600">Beautiful fall foliage, comfortable weather.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">❄️</span>
                                    <div>
                                        <strong>Winter (December-February):</strong>
                                        <p className="text-gray-600">Quieter, with snow-covered temples creating a magical scene.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">☀️</span>
                                    <div>
                                        <strong>Summer (June-August):</strong>
                                        <p className="text-gray-600">Hot & humid but lively with festivals and events.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Weather Info */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Weather Info:</h2>
                            <ul className="space-y-4">
                                <li className="flex justify-between items-center">
                                    <strong>Spring:</strong>
                                    <span className="text-gray-600">10°C - 20°C (50°F - 68°F)</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <strong>Summer:</strong>
                                    <span className="text-gray-600">22°C - 33°C (72°F - 91°F)</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <strong>Autumn:</strong>
                                    <span className="text-gray-600">12°C - 25°C (54°F - 77°F)</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <strong>Winter:</strong>
                                    <span className="text-gray-600">0°C - 10°C (32°F - 50°F)</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Location Preview Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Preview</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Map Section */}
                            <div className="relative">
                                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                                    <img 
                                        src={getMapImageUrl(trip.country)}
                                        alt={`Map of ${trip.country}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to a placeholder if the map fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.src = getFallbackMapUrl(trip.country);
                                        }}
                                    />
                                </div>
                                
                                {/* Location Info Overlay */}
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <img src="/assets/icons/location-mark.svg" alt="location" className="w-4 h-4 text-red-500" />
                                        <span className="font-semibold text-gray-800">{trip.country}</span>
                                    </div>
                                </div>
                                
                                {/* Map Attribution */}
                                <div className="mt-2 text-xs text-gray-500 text-center">
                                    <p>Map data © Google Maps</p>
                                </div>
                            </div>

                            {/* Location Image */}
                            <div className="relative">
                                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                                    <img 
                                        src={getLocationImage(trip.country)}
                                        alt={`${trip.country} destination`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to sample image if the location image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/assets/images/sample1.jpg';
                                        }}
                                    />
                                </div>
                                
                                {/* Location Info Overlay */}
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <img src="/assets/icons/destination.svg" alt="destination" className="w-4 h-4 text-blue-500" />
                                        <span className="font-semibold text-gray-800">{trip.country} Destination</span>
                                    </div>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-500 text-center">
                                    <p>Destination preview</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/trips')}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Back to Trips
                        </button>
                        <button
                            onClick={() => navigate('/payment', { state: { tripData: trip } })}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Pay and join trip
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TripDetails;
