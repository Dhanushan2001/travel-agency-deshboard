import {Header, StatsCard, TripCard} from "../../../components";
import {dashboardStats,user,allTrips} from "~/constants";
import {getAllUsers, getUser} from "~/appwrite/auth";
import type { Route } from './+types/dashboard';
import React, {useState, useEffect} from "react";

// Helper function to extract name from email
const getNameFromEmail = (email: string): string => {
    if (!email) return 'Guest';
    
    // Extract the part before @ symbol
    const namePart = email.split('@')[0];
    
    // Capitalize the first letter and handle common email patterns
    if (namePart.includes('.')) {
        // Handle cases like "john.doe@gmail.com" -> "John Doe"
        return namePart.split('.').map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
    } else {
        // Handle cases like "john@gmail.com" -> "John"
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
};

const {totalUsers,usersJoined,totalTrips,tripsCreated,userRole}=dashboardStats;

const Dashboard = ({loaderData}:Route.ComponentProps) => {
   //const user = loaderData as User | null;
   const [trips, setTrips] = useState(allTrips);
   const [currentUser, setCurrentUser] = useState<any>(null);
   const [userName, setUserName] = useState('Guest');

   // Fetch current user on component mount
   useEffect(() => {
       const fetchCurrentUser = async () => {
           try {
               const user = await getUser();
               if (user && typeof user === 'object' && 'email' in user) {
                   setCurrentUser(user);
                   // Extract name from email
                   const name = getNameFromEmail(user.email as string);
                   setUserName(name);
               }
           } catch (error) {
               console.error('Error fetching current user:', error);
               setUserName('Guest');
           }
       };

       fetchCurrentUser();
   }, []);

   const handleDeleteTrip = (tripId: string) => {
       const updatedTrips = trips.filter(trip => trip.id.toString() !== tripId);
       setTrips(updatedTrips);
       // Update the allTrips array as well
       allTrips.length = 0;
       updatedTrips.forEach(trip => allTrips.push(trip));
   };

                 return (
        <main className="dashboard wrapper relative min-h-screen">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
                <img 
                    src="/assets/images/hero-img.png" 
                    alt="Travel Background" 
                    className="w-full h-full object-cover opacity-30"
                />
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-10">
                <Header
                    title={`Welcome ${userName}👋`}
                    description="Track activity, and popular destination in real time"
                />
            
            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full backdrop-blur-sm">
                    <StatsCard
                        headerTitle="Total Users"
                        total={totalUsers}
                        currentMonthCount={usersJoined.currentMonth}
                        lastMonthCount={usersJoined.lastMonth}
                    />

                    <StatsCard
                        headerTitle="Total Trips"
                        total={totalTrips}
                        currentMonthCount={tripsCreated.currentMonth}
                        lastMonthCount={tripsCreated.lastMonth}
                    />
                    
                    <StatsCard
                        headerTitle="Active Users"
                        total={userRole.total}
                        currentMonthCount={userRole.currentMonth}
                        lastMonthCount={userRole.lastMonth}
                    />
                </div>
            </section>
            
            <section className="container">
                <h1 className="text-xl font-semibold text-dark-100 bg-white/80 backdrop-blur-sm rounded-lg p-4 inline-block">
                    Created Trips
                </h1>
                <div className="trip-grid">
                    {trips.map(({id,name,imageUrls,itinerary,tags,estimatedPrice}) => (
                        <TripCard
                            key={id}
                            id={id.toString()}
                            name={name}
                            imageUrl={imageUrls[0]}
                            location={itinerary?.[0]?.location ?? ''}
                            tags={tags}
                            price={estimatedPrice}
                            showDeleteButton={true}
                            onDelete={handleDeleteTrip}
                        />
                    ))}
                </div>
            </section>
            </div>
        </main>
    );
 }
 
 export default Dashboard;

