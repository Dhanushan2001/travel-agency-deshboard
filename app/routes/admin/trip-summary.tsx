import {Header} from "../../../components";
import {TripCard} from "../../../components";
import {useLocation, useNavigate} from "react-router";
import {createTrip} from "~/appwrite/trips";
import {allTrips} from "~/constants";
import React, {useState} from "react";

// Helper function to safely add trip to dashboard
const addTripToDashboard = (tripData: any) => {
    try {
        const dashboardTrip = {
            id: allTrips.length + 1,
            name: tripData.name,
            imageUrls: tripData.imageUrls,
            itinerary: [{ location: tripData.country }],
            tags: [tripData.travelStyle, tripData.budget, tripData.groupType].filter(Boolean),
            travelStyle: tripData.travelStyle,
            estimatedPrice: tripData.estimatedPrice,
        };
        
        // Add to the allTrips array
        allTrips.push(dashboardTrip);
        return true;
    } catch (error) {
        console.error('Error adding trip to dashboard:', error);
        return false;
    }
};

const TripSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    
    // Get trip data from navigation state
    const tripData = location.state?.tripData;
    const isNewTrip = location.state?.isNewTrip;

    if (!tripData) {
        return (
            <main className="flex flex-col gap-10 pb-20 wrapper">
                <Header title="Trip Summary" description="Trip details not found" />
                <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No trip data found</h3>
                    <p className="text-gray-500">Please go back and create a new trip.</p>
                    <button 
                        onClick={() => navigate('/trips/create')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Create New Trip
                    </button>
                </div>
            </main>
        );
    }

    const handleSaveTrip = async () => {
        setIsSaving(true);
        try {
            // Try to save the trip to the database (optional)
            let dbSuccess = false;
            try {
                const newTrip = await createTrip(tripData);
                console.log('Trip saved to database successfully:', newTrip);
                dbSuccess = true;
            } catch (dbError) {
                console.warn('Database save failed, but continuing with dashboard save:', dbError);
                // Continue with dashboard save even if database fails
            }
            
            // Add the trip to the dashboard's trip list
            const dashboardSuccess = addTripToDashboard(tripData);
            
            if (dashboardSuccess) {
                // Show success message
                const message = dbSuccess 
                    ? 'Trip saved successfully to database and dashboard!' 
                    : 'Trip saved to dashboard! (Database save skipped)';
                alert(message);
                
                // Navigate to dashboard to see the new trip
                navigate('/dashboard');
            } else {
                throw new Error('Failed to add trip to dashboard');
            }
        } catch (error) {
            console.error('Error saving trip:', error);
            alert('Failed to save trip. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditTrip = () => {
        // Navigate back to create page with the data
        navigate('/trips/create', { 
            state: { 
                tripData,
                isEditing: true 
            } 
        });
    };

    const handleViewTripDetails = () => {
        // Navigate to trip details page with the trip data
        navigate(`/trips/preview`, { 
            state: { 
                tripData 
            } 
        });
    };

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header 
                title="Trip Summary" 
                description="Review your generated trip before saving" 
            />

            <section className="mt-8 wrapper-md">
                <div className="max-w-4xl mx-auto">
                    {/* Trip Summary Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {tripData.name}
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    {tripData.description}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600">
                                    {tripData.estimatedPrice}
                                </div>
                                <div className="text-gray-500">
                                    {tripData.duration} days
                                </div>
                            </div>
                        </div>

                        {/* Trip Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                                <p className="text-gray-600">{tripData.country}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Travel Style</h3>
                                <p className="text-gray-600">{tripData.travelStyle}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Budget</h3>
                                <p className="text-gray-600">{tripData.budget}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Group Type</h3>
                                <p className="text-gray-600">{tripData.groupType}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Interest</h3>
                                <p className="text-gray-600">{tripData.interests}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                                <p className="text-gray-600">{tripData.duration} days</p>
                            </div>
                        </div>

                        {/* Trip Card Preview */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Preview</h2>
                            <div className="max-w-sm">
                                <TripCard
                                    id="preview"
                                    name={tripData.name}
                                    location={tripData.location?.city || tripData.country}
                                    imageUrl={tripData.imageUrls?.[0] || "/assets/images/sample1.jpg"}
                                    tags={[tripData.travelStyle, tripData.budget, tripData.groupType].filter(Boolean)}
                                    price={tripData.estimatedPrice}
                                />
                            </div>
                        </div>

                        {/* Location Preview */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Preview</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Map Preview */}
                                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                                    <img 
                                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(tripData.country)}&zoom=8&size=600x400&maptype=roadmap&markers=color:red%7C${encodeURIComponent(tripData.country)}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`}
                                        alt={`Map of ${tripData.country}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to a placeholder if the map fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://via.placeholder.com/600x400/4A90E2/FFFFFF?text=Map+of+${encodeURIComponent(tripData.country)}&font-size=24`;
                                        }}
                                    />
                                    {/* Location Info Overlay */}
                                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <img src="/assets/icons/location-mark.svg" alt="location" className="w-4 h-4 text-red-500" />
                                            <span className="font-semibold text-gray-800">{tripData.country}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Destination Image Preview */}
                                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                                    <img 
                                        src={tripData.imageUrls?.[0] || "/assets/images/sample1.jpg"}
                                        alt={`${tripData.country} destination`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Destination Info Overlay */}
                                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <img src="/assets/icons/destination.svg" alt="destination" className="w-4 h-4 text-blue-500" />
                                            <span className="font-semibold text-gray-800">{tripData.country} Destination</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Location preview of trip destination
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleViewTripDetails}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Trip Details
                            </button>
                            <button
                                onClick={handleSaveTrip}
                                disabled={isSaving}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {isSaving ? 'Saving Trip...' : 'Save to Dashboard'}
                            </button>
                            <button
                                onClick={handleEditTrip}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Edit Trip
                            </button>
                            <button
                                onClick={() => navigate('/trips/create')}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Create New Trip
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TripSummary;
