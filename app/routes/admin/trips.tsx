
import {Header} from "../../../components";
import {TripCard} from "../../../components";
import {getAllTrips} from "~/appwrite/trips";
import React, {useEffect, useState} from "react";

export const loader = async () => {
    try {
        const tripsData = await getAllTrips(50, 0);
        return tripsData;
    } catch (error) {
        console.error('Error loading trips:', error);
        return { allTrips: [], total: 0 };
    }
};

const Trips = ({loaderData}: {loaderData: {allTrips: any[], total: number}}) => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loaderData?.allTrips) {
            setTrips(loaderData.allTrips);
        }
        setLoading(false);
    }, [loaderData]);

    return (
        <main className="all-users wrapper">
            <Header
                title="Trips"
                description="View and edit AI-Generated travel plans"
                ctaText="Create a trip"
                ctaUrl="/trips/create"
            />
            
            <section className="mt-8 wrapper-md">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips found</h3>
                        <p className="text-gray-500">Create your first trip to get started!</p>
                        <button 
                            onClick={() => window.location.href = '/trips/create'}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Create Your First Trip
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {trips.map((trip) => (
                            <TripCard
                                key={trip.$id}
                                id={trip.$id}
                                name={trip.name || `${trip.country} ${trip.travelStyle} Adventure`}
                                location={trip.location?.city || trip.country || 'Unknown Location'}
                                imageUrl={trip.imageUrls?.[0] || "/assets/images/sample1.jpg"}
                                tags={[trip.travelStyle, trip.budget, trip.groupType].filter(Boolean)}
                                price={trip.estimatedPrice || '$500'}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default Trips
