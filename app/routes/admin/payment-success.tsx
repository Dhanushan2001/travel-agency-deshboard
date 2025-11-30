import {Header} from "../../../components";
import {useLocation, useNavigate} from "react-router";
import React, {useState, useEffect} from "react";
const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state?.tripData) {
            setTrip(location.state.tripData);
            setPaymentAmount(location.state.paymentAmount || '');
        }
        setLoading(false);
    }, [location.state]);

    if (loading) {
        return (
            <main className="flex flex-col gap-10 pb-20 wrapper">
                <Header title="Payment Success" description="Processing..." />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </main>
        );
    }

    if (!trip) {
        return (
            <main className="flex flex-col gap-10 pb-20 wrapper">
                <Header title="Payment Success" description="Payment completed" />
                <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Payment Successful!</h3>
                    <p className="text-gray-500">Your payment has been processed successfully.</p>
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
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header 
                title="Payment Successful!" 
                description="Your trip has been booked successfully" 
            />

            <section className="mt-8 wrapper-md">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        {/* Success Icon */}
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <img src="/assets/icons/check.svg" alt="success" className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                            <p className="text-gray-600">Your trip has been booked and confirmed.</p>
                        </div>

                        {/* Trip Details */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <img 
                                    src={trip.imageUrls?.[0] || "/assets/images/sample1.jpg"} 
                                    alt={trip.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900">{trip.name}</h3>
                                    <p className="text-gray-600">{trip.country}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-left">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium ml-2">{trip.duration} days</span>
                                </div>
                                <div className="text-left">
                                    <span className="text-gray-600">Travel Style:</span>
                                    <span className="font-medium ml-2">{trip.travelStyle}</span>
                                </div>
                                <div className="text-left">
                                    <span className="text-gray-600">Budget:</span>
                                    <span className="font-medium ml-2">{trip.budget}</span>
                                </div>
                                <div className="text-left">
                                    <span className="text-gray-600">Group Type:</span>
                                    <span className="font-medium ml-2">{trip.groupType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-blue-50 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount Paid:</span>
                                    <span className="font-semibold text-green-600">{paymentAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <span className="font-mono text-gray-800">TXN-{Date.now().toString().slice(-8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                            <ul className="text-left space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">✓</span>
                                    <span>You'll receive a confirmation email within 24 hours</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">✓</span>
                                    <span>Our travel coordinator will contact you within 48 hours</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">✓</span>
                                    <span>Detailed itinerary will be sent to your email</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">✓</span>
                                    <span>Pre-trip information will be provided 1 week before departure</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/trips')}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                View All Trips
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PaymentSuccess;

