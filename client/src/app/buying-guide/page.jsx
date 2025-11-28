'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const buyingSteps = [
  {
    number: 1,
    title: "Browse & Search",
    icon: "🔍",
    duration: "1-3 days",
    description: "Find your perfect car from our curated inventory",
    details: [
      "Use our advanced filters to narrow down options by budget, type, fuel, and features",
      "Save your favorite cars to wishlist for easy comparison",
      "Take our Car Match Quiz for personalized recommendations based on your lifestyle",
      "Compare multiple vehicles side-by-side to make an informed decision"
    ],
    documents: [],
    tips: [
      "Set your budget before browsing to stay focused",
      "Consider total cost including insurance and registration",
      "Read owner reviews for real-world insights"
    ],
    faqs: [
      {
        q: "How often is your inventory updated?",
        a: "Our inventory is updated daily with new arrivals. Check back frequently or set up price alerts to never miss a great deal!"
      },
      {
        q: "Can I view cars online before visiting?",
        a: "Absolutely! Every listing has detailed photos, 360° views (select cars), and comprehensive specifications."
      }
    ],
    cta: { text: "Browse Inventory", link: "/buy", external: false }
  },
  {
    number: 2,
    title: "Schedule Inspection",
    icon: "🔧",
    duration: "30-45 minutes",
    description: "Book a thorough 150-point professional inspection",
    details: [
      "Our certified mechanics inspect every aspect - engine, transmission, suspension, electronics",
      "Receive detailed inspection report with photos of all components",
      "Identify any existing issues, repairs needed, or maintenance due",
      "Use the report for price negotiation and informed decision-making"
    ],
    documents: ["Valid Photo ID (Aadhar/Driving License)"],
    tips: [
      "Schedule inspection for cars you're seriously considering",
      "Ask to be present during the inspection",
      "Request clarification on any issues in the report"
    ],
    faqs: [
      {
        q: "Is inspection mandatory?",
        a: "While not mandatory, we highly recommend it for peace of mind and transparency. All inspections are free for our inventory."
      },
      {
        q: "What if issues are found?",
        a: "Minor issues are normal in used cars. We'll discuss repair costs and may adjust the price accordingly."
      }
    ],
    cta: { text: "Schedule Inspection", link: "/contact", external: false }
  },
  {
    number: 3,
    title: "Book Test Drive",
    icon: "🚗",
    duration: "20-30 minutes",
    description: "Experience the car firsthand with a test drive",
    details: [
      "Choose between home delivery test drive or showroom visit",
      "Test the car on different road conditions - highways, city traffic, speed breakers",
      "Check all features, controls, comfort, visibility, and noise levels",
      "Ask our experts any questions during the drive"
    ],
    documents: ["Valid Driving License", "Photo ID"],
    tips: [
      "Test the AC, power windows, and all electronics",
      "Listen for unusual sounds from engine or suspension",
      "Check brake responsiveness and steering feel",
      "Drive for at least 15-20 minutes"
    ],
    faqs: [
      {
        q: "Can I test drive multiple cars?",
        a: "Yes! You can schedule test drives for as many cars as you like. We want you to be 100% confident in your choice."
      },
      {
        q: "Do you offer home test drives?",
        a: "Yes, we offer doorstep test drives for your convenience. Just mention this when booking."
      }
    ],
    cta: { text: "Book Test Drive", link: "/buy", external: false }
  },
  {
    number: 4,
    title: "Documentation Review",
    icon: "📄",
    duration: "15-20 minutes",
    description: "Verify all legal documents and ownership papers",
    details: [
      "RC (Registration Certificate) book verification - check for owner details, hypothecation",
      "Valid insurance policy with adequate coverage remaining",
      "Complete service history and maintenance records",
      "NOC from previous state if applicable, Form 28 & 29 for transfer"
    ],
    documents: [],
    tips: [
      "Ensure RC is in the name of the seller",
      "Check for any traffic challans or pending fines",
      "Verify chassis and engine numbers match RC",
      "Confirm insurance validity and transferability"
    ],
    faqs: [
      {
        q: "What if the car has a loan?",
        a: "We ensure all loans are cleared before sale. You'll receive a No Dues Certificate from the bank."
      },
      {
        q: "How long does RC transfer take?",
        a: "Typically 7-15 days. We handle the entire process for you and keep you updated."
      }
    ],
    cta: { text: "Contact Us", link: "/contact", external: false }
  },
  {
    number: 5,
    title: "Financing Options",
    icon: "💰",
    duration: "1-2 days",
    description: "Choose the best financing solution for you",
    details: [
      "Compare loan offers from multiple banks and NBFCs with best interest rates",
      "Down payment options from 10% to 30% based on your preference",
      "Use our EMI calculator to plan your budget accurately",
      "Quick pre-approval process - know your eligibility instantly"
    ],
    documents: [
      "PAN Card",
      "Aadhar Card",
      "Last 3 months salary slips (salaried) or ITR (self-employed)",
      "Last 6 months bank statements",
      "Address proof"
    ],
    tips: [
      "Compare interest rates across different lenders",
      "Consider total interest payable, not just EMI",
      "Read all terms and conditions carefully",
      "Negotiate for lower processing fees"
    ],
    faqs: [
      {
        q: "What's the minimum down payment?",
        a: "Typically 10-20% of the car value. Higher down payment means lower EMI and less interest."
      },
      {
        q: "Can I get pre-approved?",
        a: "Yes! Get pre-approved in minutes. This helps you negotiate better and close the deal faster."
      }
    ],
    cta: { text: "Calculate EMI", link: "/finance", external: false }
  },
  {
    number: 6,
    title: "Negotiation & Final Offer",
    icon: "🤝",
    duration: "30 minutes - 1 day",
    description: "Finalize the price and terms of purchase",
    details: [
      "Review inspection report findings and discuss any required repairs",
      "Get trade-in valuation for your current car if applicable",
      "Negotiate based on market value, condition, and your budget",
      "Finalize on-road price including registration, insurance, and taxes"
    ],
    documents: [],
    tips: [
      "Be reasonable - our prices are already competitive",
      "Consider total value including warranty and services",
      "Factor in any included accessories or services",
      "Get the final price in writing"
    ],
    faqs: [
      {
        q: "Is the price negotiable?",
        a: "We price our cars competitively based on market rates. However, we're open to reasonable offers."
      },
      {
        q: "Can I trade in my old car?",
        a: "Absolutely! We offer fair trade-in valuations. The value will be adjusted in your final price."
      }
    ],
    cta: { text: "Make an Offer", link: "/buy", external: false }
  },
  {
    number: 7,
    title: "Payment & Agreement",
    icon: "✍️",
    duration: "1-2 hours",
    description: "Complete payment and sign purchase agreement",
    details: [
      "Multiple payment options: Bank transfer, cheque, financing EMI",
      "Review and sign the purchase agreement with all terms clearly stated",
      "Receive official purchase receipt and invoice",
      "Initiate RC transfer process - we handle all RTO formalities"
    ],
    documents: [
      "PAN Card (for payment above ₹2 lakhs)",
      "Cancelled cheque for EMI",
      "Address proof for RC transfer",
      "Passport size photos (2 copies)"
    ],
    tips: [
      "Read the agreement thoroughly before signing",
      "Keep copies of all payment receipts",
      "Confirm what's included in the price",
      "Understand the warranty terms if applicable"
    ],
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept NEFT/RTGS, cheques, and financing through approved banks. Cash transactions above ₹2 lakhs require PAN."
      },
      {
        q: "When does ownership transfer?",
        a: "Ownership transfers upon full payment, but RC transfer takes 7-15 days through RTO."
      }
    ],
    cta: { text: "Contact Sales", link: "/contact", external: false }
  },
  {
    number: 8,
    title: "Delivery & Handover",
    icon: "🎉",
    duration: "1-2 hours",
    description: "Final inspection and drive away your dream car",
    details: [
      "Final walk-around inspection - ensure everything is as expected",
      "Handover of all keys, documents, service records, and accessories",
      "RC transfer initiation with tracking number for status updates",
      "After-sales support for any queries or warranty claims"
    ],
    documents: [],
    tips: [
      "Do a final check of all features and accessories",
      "Get contact details for after-sales support",
      "Ask about servicing and maintenance schedules",
      "Drive carefully as you get used to your new car"
    ],
    faqs: [
      {
        q: "What if I find an issue after purchase?",
        a: "Contact us immediately. We offer warranty on select cars and will assist with any genuine concerns."
      },
      {
        q: "Do you provide after-sales service?",
        a: "Yes! We provide ongoing support, workshop services, and maintenance packages for your convenience."
      }
    ],
    cta: { text: "Workshop Services", link: "/workshop", external: false }
  }
]

export default function BuyingGuidePage() {
  const [expandedStep, setExpandedStep] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState({})

  const toggleStep = (stepNumber) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber)
  }

  const toggleFaq = (stepNumber, faqIndex) => {
    const key = `${stepNumber}-${faqIndex}`
    setExpandedFaq(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen bg-custom-black">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-custom-jet to-custom-black border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-6">
              Your Complete <span className="text-custom-accent">Car Buying Guide</span>
            </h1>
            <p className="text-xl text-custom-platinum mb-8 max-w-2xl mx-auto">
              Navigate your car purchase journey with confidence. We've simplified the entire process into 8 easy steps.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/buy"
                className="px-8 py-4 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-custom-accent/30"
              >
                Start Browsing Cars
              </Link>
              <button
                onClick={() => window.print()}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-custom-black transition-all duration-300"
              >
                📄 Download Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Steps */}
            <div className="relative">
              {/* Vertical Line - Desktop */}
              <div className="hidden md:block absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-custom-accent via-custom-accent/50 to-transparent"></div>

              {buyingSteps.map((step, index) => (
                <div key={step.number} className="relative mb-8 md:mb-12">
                  {/* Step Card */}
                  <div className="md:ml-28">
                    <div
                      className={`glass-dark border rounded-2xl overflow-hidden transition-all duration-300 ${
                        expandedStep === step.number
                          ? 'border-custom-accent shadow-2xl shadow-custom-accent/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {/* Header - Always Visible */}
                      <button
                        onClick={() => toggleStep(step.number)}
                        className="w-full p-6 text-left"
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon Circle - Desktop */}
                          <div className="hidden md:flex absolute left-0 w-24 h-24 items-center justify-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${
                              expandedStep === step.number
                                ? 'bg-custom-accent shadow-lg shadow-custom-accent/50 scale-110'
                                : 'bg-custom-jet border-2 border-white/20'
                            }`}>
                              {step.icon}
                            </div>
                          </div>

                          {/* Mobile Icon */}
                          <div className="md:hidden flex-shrink-0">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                              expandedStep === step.number
                                ? 'bg-custom-accent'
                                : 'bg-custom-jet border-2 border-white/20'
                            }`}>
                              {step.icon}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-custom-accent font-bold text-sm">STEP {step.number}</span>
                              <span className="text-custom-platinum text-sm">⏱️ {step.duration}</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
                              {step.title}
                            </h3>
                            <p className="text-custom-platinum text-lg">
                              {step.description}
                            </p>
                          </div>

                          {/* Expand Icon */}
                          <div className="flex-shrink-0">
                            <svg
                              className={`w-6 h-6 text-custom-accent transition-transform duration-300 ${
                                expandedStep === step.number ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {expandedStep === step.number && (
                        <div className="px-6 pb-6 animate-slide-up">
                          <div className="border-t border-white/10 pt-6 space-y-6">
                            {/* Details */}
                            <div>
                              <h4 className="text-white font-bold text-lg mb-3">What Happens:</h4>
                              <ul className="space-y-2">
                                {step.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-custom-platinum">
                                    <span className="text-custom-accent mt-1">✓</span>
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Documents */}
                            {step.documents.length > 0 && (
                              <div>
                                <h4 className="text-white font-bold text-lg mb-3">📋 Documents Required:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {step.documents.map((doc, idx) => (
                                    <span key={idx} className="bg-custom-accent/10 border border-custom-accent/30 text-custom-accent px-4 py-2 rounded-full text-sm">
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Tips */}
                            {step.tips && step.tips.length > 0 && (
                              <div>
                                <h4 className="text-white font-bold text-lg mb-3">💡 Pro Tips:</h4>
                                <ul className="space-y-2">
                                  {step.tips.map((tip, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-custom-platinum">
                                      <span className="text-yellow-400 mt-1">💡</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* FAQs */}
                            {step.faqs.length > 0 && (
                              <div>
                                <h4 className="text-white font-bold text-lg mb-3">❓ Common Questions:</h4>
                                <div className="space-y-3">
                                  {step.faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-custom-black/50 rounded-lg overflow-hidden">
                                      <button
                                        onClick={() => toggleFaq(step.number, idx)}
                                        className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                                      >
                                        <span className="text-white font-medium">{faq.q}</span>
                                        <svg
                                          className={`w-5 h-5 text-custom-accent transition-transform ${
                                            expandedFaq[`${step.number}-${idx}`] ? 'rotate-180' : ''
                                          }`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>
                                      {expandedFaq[`${step.number}-${idx}`] && (
                                        <div className="px-4 pb-4 text-custom-platinum">
                                          {faq.a}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* CTA */}
                            <div className="pt-4">
                              <Link
                                href={step.cta.link}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-custom-accent/20"
                              >
                                {step.cta.text}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-b from-custom-black to-custom-jet border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Ready to Buy Your <span className="text-custom-accent">Dream Car</span>?
            </h2>
            <p className="text-xl text-custom-platinum mb-8">
              Our team is here to guide you through every step of the journey.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/buy"
                className="px-8 py-4 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-custom-accent/30"
              >
                Browse Our Inventory
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-custom-black transition-all duration-300"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .glass-dark {
            background: white !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  )
}
