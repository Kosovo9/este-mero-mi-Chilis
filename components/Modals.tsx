import React, { useState } from 'react';
import { Translation, PricingPackage } from '../types';
import { PACKAGES } from '../constants';
import { CheckIcon, CreditCardIcon, MercadoPagoIcon, PayPalIcon, LockIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    cta: string;
    icon: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, cta, icon }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-christmas-dark border-2 border-christmas-gold rounded-2xl p-8 max-w-md w-full animate-fadeIn shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                <button onClick={onClose} className="absolute top-4 right-4 text-christmas-cream/50 hover:text-white">✕</button>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 p-4 bg-christmas-gold/10 rounded-full text-christmas-gold">
                        {icon}
                    </div>
                    <h3 className="text-2xl font-serif text-christmas-gold mb-4">{title}</h3>
                    <p className="text-christmas-cream/80 mb-8 leading-relaxed">{description}</p>
                    <button onClick={onClose} className="w-full py-3 bg-christmas-gold text-christmas-dark font-bold rounded-full hover:bg-yellow-400 transition-colors">
                        {cta}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AffiliateModal: React.FC<{ isOpen: boolean; onClose: () => void; t: Translation }> = ({ isOpen, onClose, t }) => (
    <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={t.modals.affiliateTitle}
        description={t.modals.affiliateDesc}
        cta={t.modals.affiliateCta}
        icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        }
    />
);

export const DonationModal: React.FC<{ isOpen: boolean; onClose: () => void; t: Translation }> = ({ isOpen, onClose, t }) => (
    <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={t.modals.donationTitle}
        description={t.modals.donationDesc}
        cta={t.modals.donationCta}
        icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        }
    />
);

export const PricingModal: React.FC<{ isOpen: boolean; onClose: () => void; onPurchase: (credits: number) => void; t: Translation }> = ({ isOpen, onClose, onPurchase, t }) => {
    const [selectedPkg, setSelectedPkg] = useState<PricingPackage>(PACKAGES[1]);
    const [selectedMethod, setSelectedMethod] = useState<'mp' | 'paypal' | 'stripe' | null>(null);
    const [step, setStep] = useState<'packages' | 'payment' | 'processing' | 'success'>('packages');

    if (!isOpen) return null;

    const handleStripePay = async () => {
        setStep('processing');
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: selectedPkg.id,
                    successUrl: window.location.origin + '?status=success',
                    cancelUrl: window.location.origin + '?status=cancel'
                }),
            });
            const { id } = await response.json();
            // En una implementación real con el SDK de Stripe:
            // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
            // await stripe.redirectToCheckout({ sessionId: id });
            console.log("Redirecting to Stripe Session:", id);
            // Simulación para el demo
            setTimeout(() => setStep('success'), 1500);
        } catch (err) {
            console.error(err);
            setStep('payment');
        }
    };

    const handlePay = () => {
        if (!selectedMethod) return;
        if (selectedMethod === 'stripe') {
            handleStripePay();
            return;
        }

        setStep('processing');
        // Simulación para PayPal y Mercado Pago (como en el original pero manteniendo el estado)
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPurchase(selectedPkg.credits);
                onClose();
                setStep('packages');
                setSelectedMethod(null);
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-christmas-dark border border-christmas-gold/30 rounded-3xl p-0 max-w-2xl w-full animate-fadeIn shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                <button onClick={onClose} className="absolute top-4 right-4 text-christmas-cream/50 hover:text-white z-10">✕</button>

                {/* Left Side: Summary or Image */}
                <div className="hidden md:flex w-1/3 bg-christmas-gold/5 border-r border-christmas-gold/10 flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-christmas-gold/5 blur-3xl transform rotate-12"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-christmas-gold flex items-center justify-center text-christmas-dark mb-6 mx-auto">
                            <CreditCardIcon />
                        </div>
                        <h4 className="font-serif text-xl text-christmas-gold mb-2">{t.modals.paymentTitle}</h4>
                        <p className="text-sm text-christmas-cream/60">SSL Secure Payment</p>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-8 flex flex-col justify-center">

                    {step === 'packages' && (
                        <>
                            <h3 className="text-2xl font-serif text-christmas-cream mb-2 text-center">{t.modals.pricingTitle}</h3>
                            <p className="text-christmas-cream/50 text-center mb-8 text-sm">{t.modals.pricingDesc}</p>

                            <div className="space-y-4 mb-8">
                                {PACKAGES.map(pkg => (
                                    <div
                                        key={pkg.id}
                                        onClick={() => setSelectedPkg(pkg)}
                                        className={`relative border rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all ${selectedPkg.id === pkg.id ? 'border-christmas-gold bg-christmas-gold/10' : 'border-white/10 hover:border-christmas-gold/50'}`}
                                    >
                                        {pkg.popular && (
                                            <span className="absolute -top-3 left-4 bg-christmas-gold text-christmas-dark text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">{pkg.label}</span>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-serif text-lg text-white">{pkg.credits} Photos</span>
                                            <span className="text-xs text-christmas-cream/50">{pkg.label}</span>
                                        </div>
                                        <div className="text-xl font-bold text-christmas-gold">${pkg.price}</div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => setStep('payment')} className="w-full py-4 bg-christmas-gold text-christmas-dark font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20">
                                {t.modals.payBtn}
                            </button>
                        </>
                    )}

                    {step === 'payment' && (
                        <>
                            <h3 className="text-2xl font-serif text-christmas-cream mb-6 text-center">{t.modals.paymentTitle}</h3>

                            <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-christmas-cream/80">Total</span>
                                <span className="text-2xl font-bold text-christmas-gold">${selectedPkg.price}</span>
                            </div>

                            <label className="block text-sm uppercase tracking-wider text-christmas-cream/50 mb-4 text-center">{t.modals.selectMethod}</label>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                <button
                                    onClick={() => setSelectedMethod('stripe')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${selectedMethod === 'stripe' ? 'border-christmas-gold bg-christmas-gold/10' : 'border-white/10 hover:border-christmas-gold/50 bg-white/5'}`}
                                >
                                    <div className="w-6 h-6 text-christmas-gold"><CreditCardIcon /></div>
                                    <span className="text-[10px] font-bold text-white uppercase">Stripe</span>
                                </button>
                                <button
                                    onClick={() => setSelectedMethod('mp')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${selectedMethod === 'mp' ? 'border-[#009EE3] bg-[#009EE3]/10' : 'border-white/10 hover:border-[#009EE3]/50 bg-white/5'}`}
                                >
                                    <MercadoPagoIcon />
                                    <span className="text-[10px] font-bold text-white uppercase">MP</span>
                                </button>
                                <button
                                    onClick={() => setSelectedMethod('paypal')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${selectedMethod === 'paypal' ? 'border-[#003087] bg-[#003087]/10' : 'border-white/10 hover:border-[#003087]/50 bg-white/5'}`}
                                >
                                    <PayPalIcon />
                                    <span className="text-[10px] font-bold text-white uppercase">PayPal</span>
                                </button>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={!selectedMethod}
                                className={`w-full py-4 font-bold rounded-xl transition-all ${selectedMethod === 'stripe'
                                        ? 'bg-christmas-gold hover:bg-yellow-400 text-christmas-dark shadow-lg shadow-yellow-900/20'
                                        : selectedMethod === 'mp'
                                            ? 'bg-[#009EE3] hover:bg-[#008CC9] text-white shadow-lg shadow-blue-500/20'
                                            : selectedMethod === 'paypal'
                                                ? 'bg-[#003087] hover:bg-[#002569] text-white shadow-lg shadow-blue-900/20'
                                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {selectedMethod ? `${t.modals.payWith} ${selectedMethod.toUpperCase()}` : t.modals.selectMethod}
                            </button>

                            <button onClick={() => setStep('packages')} className="w-full mt-4 text-sm text-christmas-cream/50 hover:text-white underline">Back</button>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center py-10">
                            <div className="w-16 h-16 border-4 border-christmas-gold border-t-transparent rounded-full animate-spin mb-6"></div>
                            <p className="text-christmas-gold animate-pulse">{t.modals.processing}</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center py-10 animate-fadeIn">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 text-christmas-dark shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                <CheckIcon />
                            </div>
                            <p className="text-2xl font-serif text-white text-center">{t.modals.success}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};