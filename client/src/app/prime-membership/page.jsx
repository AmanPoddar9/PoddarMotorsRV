'use client';
import { useState } from 'react';
import { FaPhoneAlt, FaChevronDown, FaChevronUp, FaMoneyBillWave, FaQuestionCircle, FaCrown } from 'react-icons/fa';
import PrimePlanCard from './components/PrimePlanCard';
import PrimeEnquiryModal from './components/PrimeEnquiryModal';

const plans = [
  {
    name: 'Prime Silver',
    price: '1,499',
    description: 'Perfect for basic car care and retention.',
    features: [
      '1 Full Car Wash – FREE',
      '1 Top Wash – FREE',
      'Wheel Alignment + Balancing – 50% Off',
      'Free 18-Point General Check-up',
      'Priority Service – No Appointment Needed',
      'Free Pickup & Drop (up to 10 km)',
      'VIP welcome & invitations to meets'
    ],
    popular: false
  },
  {
    name: 'Prime Gold',
    price: '2,999',
    description: 'Most popular for families & regular users.',
    features: [
      'ALL Silver Benefits, plus:',
      '2 Complete Car Washes – FREE',
      'Wheel Alignment + Balancing – FREE (1 Time)',
      '50% Off Labor Charges (one visit)',
      '20% Off Brake Overhaul Labor',
      '15% Off Body & Paint Labor',
      'Free Standard Check-Up & Battery Test'
    ],
    popular: true
  },
  {
    name: 'Prime Platinum',
    price: '5,999',
    description: 'The ultimate VIP experience for your car.',
    features: [
      'ALL Gold Benefits, plus:',
      'Unlimited Pickup & Drop',
      'Unlimited Exterior Washing',
      'Interior Cleaning – FREE (6x/year)',
      'Wheel Alignment + Balancing – FREE (2x/year)',
      'Blower Cleaning – FREE',
      'Engine Oil + Filter Change – FREE',
      'Engine Waxing Treatment – FREE',
      'Priority breakdown support'
    ],
    popular: false
  }
];

const faqs = [
  {
    question: 'How do I activate my membership?',
    answer: 'Once you submit your request, our team will call you to verify your car details and process the payment. Your membership is activated immediately after.'
  },
  {
    question: 'Is the plan valid for only one car?',
    answer: 'Yes, the Prime Membership is linked to a specific car registration number. However, you can buy multiple memberships for different cars.'
  },
  {
    question: 'Can I upgrade from Silver to Gold or Platinum later?',
    answer: 'Absolutely! You can upgrade your plan at any time by paying the difference. Contact our team for assistance.'
  },
  {
    question: 'Are there any hidden charges?',
    answer: 'No hidden charges. The price covers the membership for one full year. Service parts and consumables are charged as per actuals, but labor discounts apply.'
  },
  {
    question: 'Is this valid at all Poddar Motors locations?',
    answer: 'Presently, this membership is valid at our main workshop in Ranchi. We are expanding to other centers soon.'
  }
];

export default function PrimeMembershipPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative bg-custom-black text-white pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 z-0"></div>
        {/* Abstract Gold Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-[150px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10"></div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 font-display">
            Poddar Motors <span className="text-yellow-500">Prime</span> Membership
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto font-light">
            Save more on every service. Enjoy VIP treatment every visit.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm md:text-base font-medium text-slate-400">
            <span className="flex items-center gap-2"><FaMoneyBillWave className="text-yellow-500" /> Up to ₹15,000 Yearly Savings</span>
            <span className="w-1.5 h-1.5 bg-slate-600 rounded-full hidden md:block"></span>
            <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Priority Workshop Service</span>
            <span className="w-1.5 h-1.5 bg-slate-600 rounded-full hidden md:block"></span>
            <span className="flex items-center gap-2"><FaCheck className="text-yellow-500" /> Free Washes & Wheel Care</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('plans').scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              View Plans
            </button>
            <a 
              href="tel:+918709119090"
              className="border border-slate-600 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-full transition-all flex items-center justify-center gap-2"
            >
              <FaPhoneAlt size={14} /> Talk to our team
            </a>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 -mt-10 mb-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, index) => (
              <PrimePlanCard 
                key={index} 
                plan={plan} 
                onSelect={handleSelectPlan} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Savings Highlight */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 font-display">
            How much do you save?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="text-slate-400 mb-3 text-4xl"><FaMoneyBillWave className="mx-auto" /></div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Prime Silver</h3>
              <p className="text-slate-600">Save <span className="text-green-600 font-bold">₹250 – ₹500</span> per year on basic care & washes.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 text-center hover:shadow-md transition-shadow relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-yellow-200 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">BEST VALUE</div>
              <div className="text-yellow-500 mb-3 text-4xl"><FaMoneyBillWave className="mx-auto" /></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Prime Gold</h3>
              <p className="text-slate-600">Save <span className="text-green-600 font-bold">₹1,500 – ₹3,000</span> per year on labor, wheel care & maintenance.</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-slate-400 mb-3 text-4xl"><FaMoneyBillWave className="mx-auto" /></div>
              <h3 className="text-lg font-bold text-white mb-2">Prime Platinum</h3>
              <p className="text-slate-400">Save <span className="text-green-400 font-bold">₹10,000 – ₹15,000</span> per year on comprehensive full maintenance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-10 font-display flex items-center justify-center gap-3">
            <FaQuestionCircle className="text-slate-400" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800">{faq.question}</span>
                  {openFaq === index ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400" />}
                </button>
                <div 
                  className={`px-5 text-slate-600 bg-slate-50 transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-40 py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <PrimeEnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        selectedPlan={selectedPlan} 
      />
    </div>
  );
}

// Icon helper
function FaCheck({ className }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
