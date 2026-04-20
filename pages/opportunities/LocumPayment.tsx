import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Loader2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { LocumPlanType, LocumProfile, LocumLocation } from '../../types';
import { registerLocum } from '../../services/locumService';

interface LocumPaymentState {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        specialties: string[];
        gender: 'Male' | 'Female';
        minCharge: number;
        minHours: number;
    };
    locations: LocumLocation[];
}

const LocumPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<LocumPlanType>('1 Month');
    
    // REPLACE THIS WITH YOUR ACTUAL PAYSTACK PUBLIC KEY (Same as registration if applicable)
    const LOCUM_PAYSTACK_KEY = 'pk_live_a35b5eef4a79e10f6f06b9f1a7a56a7424ccfbc6';

    const stateData = location.state as LocumPaymentState;

    // Check if state is present, otherwise redirect
    useEffect(() => {
        if (!stateData || !stateData.personalInfo) {
            navigate('/locum/register');
        }
    }, [stateData, navigate]);

    if (!stateData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const { personalInfo, locations } = stateData;

    const getPlanPrice = (plan: LocumPlanType) => {
        switch(plan) {
            case '1 Month': return 550;
            case '3 Months': return 1500;
            case '6 Months': return 2900;
            case '1 Year': return 6000;
            default: return 0;
        }
    };

    const processRegistration = async () => {
        // Calculate dates
        const now = new Date();
        const expiry = new Date();
        if (selectedPlan === '1 Month') expiry.setMonth(now.getMonth() + 1);
        else if (selectedPlan === '3 Months') expiry.setMonth(now.getMonth() + 3);
        else if (selectedPlan === '6 Months') expiry.setMonth(now.getMonth() + 6);
        else if (selectedPlan === '1 Year') expiry.setFullYear(now.getFullYear() + 1);

        const profileData: Partial<LocumProfile> = {
            ...personalInfo,
            locations,
            isAvailable: true,
            subscription: {
                plan: selectedPlan,
                amountPaid: getPlanPrice(selectedPlan),
                startDate: now.toISOString(),
                expiryDate: expiry.toISOString(),
                isActive: true
            }
        };

        const success = await registerLocum(profileData);
        if (success) {
            // Save simple auth to local storage for the dashboard
            localStorage.setItem('studiRad_locum_email', personalInfo.email);
            navigate('/locum/dashboard');
        } else {
            alert("Registration failed. Please contact support.");
        }
    };

    const handlePaymentAndSubmit = () => {
        setLoading(true);
        try {
            const amount = getPlanPrice(selectedPlan);

            const PaystackPop = (window as any).PaystackPop;
            
            if (!PaystackPop) {
                setLoading(false);
                alert("Payment system not loaded. Please refresh and try again.");
                return;
            }

            const handler = PaystackPop.setup({
                key: LOCUM_PAYSTACK_KEY,
                email: personalInfo.email,
                amount: amount * 100, // Convert NGN to Kobo
                currency: 'NGN',
                ref: 'LOCUM_' + Math.floor((Math.random() * 1000000000) + 1),
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Subscription Plan",
                            variable_name: "plan",
                            value: selectedPlan
                        }
                    ]
                },
                // Removed 'async' to avoid potential validation errors in Paystack library
                callback: (response: any) => {
                    processRegistration()
                        .catch((e) => {
                            console.error(e);
                            alert("Payment successful but registration failed. Please contact support.");
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                },
                onClose: () => {
                    setLoading(false);
                    alert("Payment cancelled.");
                }
            });

            handler.openIframe();
        } catch (error) {
            console.error("Payment Error:", error);
            setLoading(false);
            alert("An error occurred while initializing payment.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                
                <div className="p-8 md:p-12">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Select Subscription</h2>
                        <span className="text-sm font-bold text-slate-400">Final Step</span>
                    </div>

                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-4">
                            {(['1 Month', '3 Months', '6 Months', '1 Year'] as LocumPlanType[]).map((plan) => (
                                <div 
                                    key={plan}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedPlan === plan ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-100 hover:border-amber-200'}`}
                                >
                                    <span className="block text-xs font-bold text-slate-500 uppercase">{plan}</span>
                                    <span className="block text-xl font-black text-slate-900 mt-1">₦{getPlanPrice(plan).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col items-center text-center shadow-lg">
                            <p className="text-slate-400 mb-2 uppercase text-xs font-bold tracking-widest">Total to Pay</p>
                            <h3 className="text-4xl font-black text-white mb-6">₦{getPlanPrice(selectedPlan).toLocaleString()}</h3>
                            
                            <button 
                                onClick={handlePaymentAndSubmit}
                                disabled={loading}
                                className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors flex justify-center items-center shadow-lg shadow-amber-500/20"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        <CreditCard className="w-5 h-5 mr-2" /> Pay & Complete
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-slate-500 mt-4 flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> Secure Payment by Paystack
                            </p>
                        </div>

                        <div className="pt-2 flex justify-start">
                            <button onClick={() => navigate('/locum/register')} className="text-slate-500 font-bold px-4 hover:text-slate-800 flex items-center">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocumPayment;