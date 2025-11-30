import {Header} from "../../../components";
import {useLocation, useNavigate} from "react-router";
import React, {useState, useEffect} from "react";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        email: '',
        country: 'United States',
        zip: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (location.state?.tripData) {
            setTrip(location.state.tripData);
        }
        setLoading(false);
    }, [location.state]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            // Navigate to payment success page
            navigate('/payment/success', { 
                state: { 
                    tripData: trip,
                    paymentAmount: trip?.estimatedPrice 
                } 
            });
        }, 2000);
    };

    if (loading) {
        return (
            <main className="flex flex-col gap-10 pb-20 wrapper">
                <Header title="Payment" description="Loading payment details..." />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </main>
        );
    }

    if (!trip) {
        return (
            <main className="flex flex-col gap-10 pb-20 wrapper">
                <Header title="Payment" description="Trip not found" />
                <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Trip not found</h3>
                    <p className="text-gray-500">Please go back and select a trip.</p>
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

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/assets/icons/logo.svg" alt="Tourvisto" className="w-8 h-8" />
                        <span className="text-xl font-semibold text-gray-900">Tourvisto</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Trip Details */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Pay {trip.name}
                            </h1>
                            <div className="text-3xl font-bold text-gray-900 mb-6">
                                {trip.estimatedPrice}
                            </div>
                        </div>

                        {/* Trip Image */}
                        <div className="mb-6">
                            <img 
                                src={trip.imageUrls?.[0] || "/assets/images/sample1.jpg"} 
                                alt={trip.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>

                        {/* Trip Info */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{trip.name}</h2>
                            <p className="text-gray-600 mb-4">{trip.description}</p>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="font-medium">{trip.duration} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Travel Style:</span>
                                    <span className="font-medium">{trip.travelStyle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Budget:</span>
                                    <span className="font-medium">{trip.budget}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Group Type:</span>
                                    <span className="font-medium">{trip.groupType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Powered by Stripe</span>
                                <div className="flex gap-4">
                                    <a href="#" className="hover:text-gray-700">Terms</a>
                                    <a href="#" className="hover:text-gray-700">Privacy</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Payment Form */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
                        
                        <form onSubmit={handlePayment} className="space-y-6">
                            {/* Apple Pay Button */}
                            <button
                                type="button"
                                className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                                Pay
                            </button>

                            {/* Separator */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or pay with card</span>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={cardDetails.email}
                                    onChange={(e) => setCardDetails({...cardDetails, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card information
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="1234 1234 1234 1234"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                                        <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                        <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
                                        <div className="w-6 h-4 bg-yellow-600 rounded-sm"></div>
                                        <div className="w-6 h-4 bg-gray-600 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Expiry and CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={cardDetails.expiryDate}
                                        onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                        required
                                    />
                                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            {/* Name on Card */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name on card"
                                    value={cardDetails.cardholderName}
                                    onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <select
                                    value={cardDetails.country}
                                    onChange={(e) => setCardDetails({...cardDetails, country: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Australia">Australia</option>
                                </select>
                            </div>

                            {/* ZIP */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="ZIP"
                                    value={cardDetails.zip}
                                    onChange={(e) => setCardDetails({...cardDetails, zip: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Pay Button */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {isProcessing ? 'Processing...' : `Pay ${trip.estimatedPrice}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Payment;
