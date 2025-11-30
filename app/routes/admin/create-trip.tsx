import {Header} from "../../../components";
import {ComboBoxComponent} from "@syncfusion/ej2-react-dropdowns";
import type {Route} from "./+types/create-trip"
import {comboBoxItems, selectItems} from "~/constants";
import {formatKey} from "~/lib/utils";
import React, {useState, useEffect} from "react";
import {createTrip} from "~/appwrite/trips";
import {useNavigate, useLocation} from "react-router";

export const loader = async () => {
    try {
    const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    const data = await response.json();
        
        // Ensure data is an array before mapping
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [];
        }
        
        return data.map((country: any) => ({
            name: country.flag + ' ' + country.name.common,
            coordinates: country.latlng || [0, 0],
        value: country.name.common,
            openStreetMap: country.maps?.openStreetMap || '',
        }));
    } catch (error) {
        console.error('Error fetching countries:', error);
        // Return fallback data instead of empty array
        return [
            {
                name: '🇺🇸 United States',
                coordinates: [38, -97],
                value: 'United States',
                openStreetMap: 'https://www.openstreetmap.org/relation/148838'
            },
            {
                name: '🇯🇵 Japan',
                coordinates: [36, 138],
                value: 'Japan',
                openStreetMap: 'https://www.openstreetmap.org/relation/382313'
            },
            {
                name: '🇫🇷 France',
                coordinates: [46, 2],
                value: 'France',
                openStreetMap: 'https://www.openstreetmap.org/relation/1403916'
            },
            {
                name: '🇮🇹 Italy',
                coordinates: [42, 12],
                value: 'Italy',
                openStreetMap: 'https://www.openstreetmap.org/relation/365331'
            },
            {
                name: '🇪🇸 Spain',
                coordinates: [40, -4],
                value: 'Spain',
                openStreetMap: 'https://www.openstreetmap.org/relation/1311341'
            }
        ];
    }
}

const CreateTrip = ({loaderData}: Route.ComponentProps) => {
    const countries = Array.isArray(loaderData) ? loaderData : [];
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if we're editing a trip from summary page
    useEffect(() => {
        if (location.state?.tripData && location.state?.isEditing) {
            const tripData = location.state.tripData;
            setFormData({
                country: tripData.country || '',
                travelStyle: tripData.travelStyle || '',
                interest: tripData.interests || '',
                budget: tripData.budget || '',
                duration: tripData.duration || 0,
                groupType: tripData.groupType || ''
            });
        }
    }, [location.state]);

    // Function to get a random sample image
    const getRandomSampleImage = () => {
        const sampleImages = [
            "/assets/images/sample1.jpg",
            "/assets/images/sample2.jpg", 
            "/assets/images/sample3.jpg",
            "/assets/images/sample4.jpg"
        ];
        const randomIndex = Math.floor(Math.random() * sampleImages.length);
        return sampleImages[randomIndex];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields are filled
        if (!formData.country || !formData.travelStyle || !formData.interest || !formData.budget || !formData.duration || !formData.groupType) {
            alert('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Generate a trip name based on the selected country and travel style
            const tripName = `${formData.country} ${formData.travelStyle} Adventure`;
            
            // Generate estimated price based on duration and budget
            const basePrice = formData.duration * 50; // $50 per day base
            const budgetMultiplier = {
                'Budget': 0.7,
                'Mid-range': 1.0,
                'Luxury': 2.0,
                'Premium': 3.0
            }[formData.budget] || 1.0;
            
            const estimatedPrice = `$${Math.round(basePrice * budgetMultiplier)}`;

            // Generate tags based on form data
            const tags = [formData.travelStyle, formData.budget, formData.groupType].filter(Boolean);

            // Create the trip data
            const tripData: Omit<Trip, 'id'> = {
                name: tripName,
                description: `Experience ${formData.travelStyle} travel in ${formData.country} with ${formData.interest} activities. Perfect for ${formData.groupType} travelers on a ${formData.budget} budget.`,
                estimatedPrice,
                duration: formData.duration,
                budget: formData.budget,
                travelStyle: formData.travelStyle,
                interests: formData.interest,
                groupType: formData.groupType,
                country: formData.country,
                imageUrls: [getRandomSampleImage()], // Random sample image
                itinerary: [
                    {
                        day: 1,
                        location: formData.country,
                        activities: [
                            {
                                time: "09:00",
                                description: "Arrival and check-in"
                            },
                            {
                                time: "14:00", 
                                description: `${formData.interest} activity`
                            }
                        ]
                    }
                ],
                bestTimeToVisit: ["Spring", "Fall"],
                weatherInfo: ["Mild temperatures", "Low rainfall"],
                location: {
                    city: formData.country,
                    coordinates: countries.find(c => c.name === formData.country)?.coordinates || [0, 0] as [number, number],
                    openStreetMap: countries.find(c => c.name === formData.country)?.openStreetMap || ""
                } as Location,
                payment_link: ""
            };

            // Navigate to summary page with trip data
            navigate('/trips/create/summary', { 
                state: { 
                    tripData,
                    isNewTrip: true 
                } 
            });
            
        } catch (error) {
            console.error('Error creating trip:', error);
            alert('Failed to create trip. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header 
                title={location.state?.isEditing ? "Edit Trip" : "Add a New Trip"} 
                description={location.state?.isEditing ? "Edit your trip details" : "View and edit AI Generated Travel plans"} 
            />

            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="country">
                            Country
                    </label>
                    <ComboBoxComponent
                         id="country"
                            dataSource={countries.map((country) => ({
                                text: country.name,
                                value: country.value
                            }))}
                            fields={{text: 'text', value: 'value'}}
                        placeholder="Select a Country"
                         className="combo-box"
                            change={(e: {value: string | undefined}) => {
                                if (e.value) {
                                    handleChange('country', e.value);
                             }
                         }}
                         allowFiltering
                         filtering={(e) => {
                             const query = e.text.toLowerCase();
                             e.updateData(
                                    countries.filter((country) => 
                                        country.name.toLowerCase().includes(query)
                                    ).map((country) => ({
                                     text: country.name,
                                     value: country.value
                                    }))
                                );
                         }}
                    />
                </div>

                    <div>
                    <label htmlFor="duration">Duration</label>
                    <input
                        id="duration"
                        name="duration"
                        type="number"
                        placeholder="Enter a number of days"
                        className="form-input placeholder:text-gray-100"
                            value={formData.duration || ''}
                        onChange={(e) => handleChange('duration', Number(e.target.value))}
                    />
                </div>

                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>
                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{ text: 'text', value: 'value'}}
                                placeholder={`Select ${formatKey(key)}`}
                                value={formData[key] || ''}
                                change={(e: { value: string | undefined }) => {
                                    if(e.value) {
                                        handleChange(key, e.value)
                                    }
                                }}
                                allowFiltering
                                filtering={(e) => {
                                    const query = e.text.toLowerCase();
                                    e.updateData(
                                        comboBoxItems[key]
                                            .filter((item) => item.toLowerCase().includes(query))
                                            .map(((item) => ({
                                                text: item,
                                                value: item,
                                            })))
                                    );
                                }}
                                className="combo-box"
                            />
                        </div>
                        ))}

                    <div>
                        <label htmlFor="location">
                            Location on the world map
                        </label>
                        {/* Location Preview */}
                        {formData.country && (
                            <div className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Map Preview */}
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
                                        <img 
                                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(formData.country)}&zoom=8&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(formData.country)}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`}
                                            alt={`Map of ${formData.country}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback to a placeholder if the map fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://via.placeholder.com/600x300/4A90E2/FFFFFF?text=Map+of+${encodeURIComponent(formData.country)}&font-size=18`;
                                            }}
                                        />
                                        {/* Location Info Overlay */}
                                        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <img src="/assets/icons/location-mark.svg" alt="location" className="w-4 h-4 text-red-500" />
                                                <span className="font-semibold text-gray-800 text-sm">{formData.country}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Destination Image Preview */}
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
                                        <img 
                                            src={getRandomSampleImage()}
                                            alt={`${formData.country} destination`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Destination Info Overlay */}
                                        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <img src="/assets/icons/destination.svg" alt="destination" className="w-4 h-4 text-blue-500" />
                                                <span className="font-semibold text-gray-800 text-sm">{formData.country} Destination</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Location preview of selected destination
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            {isSubmitting ? 'Generating Trip...' : (location.state?.isEditing ? 'Update Trip' : 'Generate Trip')}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default CreateTrip
