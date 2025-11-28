'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import API_URL from '../config/api'

const quizQuestions = [
  {
    id: 1,
    question: "What's your budget range?",
    type: "cards",
    options: [
      { 
        label: "Under ₹4 Lakhs", 
        value: "0-400000", 
        icon: "💰",
        weights: { budget: { min: 0, max: 400000 } }
      },
      { 
        label: "₹4L - ₹8L", 
        value: "400000-800000", 
        icon: "💵",
        weights: { budget: { min: 400000, max: 800000 } }
      },
      { 
        label: "₹8L - ₹15L", 
        value: "800000-1500000", 
        icon: "💸",
        weights: { budget: { min: 800000, max: 1500000 } }
      },
      { 
        label: "Above ₹15L", 
        value: "1500000+", 
        icon: "👑",
        weights: { budget: { min: 1500000, max: 10000000 } }
      }
    ]
  },
  {
    id: 2,
    question: "How many people usually travel with you?",
    type: "cards",
    options: [
      { 
        label: "Just me (1-2)", 
        value: "1-2", 
        icon: "🚗",
        weights: { seats: 5, types: ["Hatchback", "Compact Sedan"] }
      },
      { 
        label: "Small family (3-4)", 
        value: "3-4", 
        icon: "👨‍👩‍👧",
        weights: { seats: 5, types: ["Hatchback", "Mid Size Sedan", "Compact SUV"] }
      },
      { 
        label: "Big family (5-6)", 
        value: "5-6", 
        icon: "👨‍👩‍👧‍👦",
        weights: { seats: 7, types: ["Compact SUV", "Mid Size SUV", "MUV/MPV"] }
      },
      { 
        label: "Large group (7+)", 
        value: "7+", 
        icon: "👨‍👩‍👧‍👦👶",
        weights: { seats: 7, types: ["Mid Size SUV", "MUV/MPV", "Full Size SUV"] }
      }
    ]
  },
  {
    id: 3,
    question: "What's your primary use?",
    type: "cards",
    options: [
      { 
        label: "Daily Commute", 
        value: "commute", 
        icon: "🏢",
        weights: { fuelTypes: ["Petrol", "CNG", "EV"], preference: "mileage" }
      },
      { 
        label: "Weekend Getaways", 
        value: "weekend", 
        icon: "🏖️",
        weights: { types: ["Compact SUV", "Mid Size SUV"], preference: "comfort" }
      },
      { 
        label: "Family Trips", 
        value: "family", 
        icon: "🚙",
        weights: { seats: 7, types: ["MUV/MPV", "Mid Size SUV"], preference: "space" }
      },
      { 
        label: "Business Travel", 
        value: "business", 
        icon: "💼",
        weights: { types: ["Mid Size Sedan", "Full Size Sedan", "Luxury"], preference: "comfort" }
      }
    ]
  },
  {
    id: 4,
    question: "Fuel preference?",
    type: "cards",
    options: [
      { 
        label: "Petrol", 
        value: "Petrol", 
        icon: "⛽",
        weights: { fuelTypes: ["Petrol"] }
      },
      { 
        label: "Diesel", 
        value: "Diesel", 
        icon: "🛢️",
        weights: { fuelTypes: ["Diesel"] }
      },
      { 
        label: "CNG", 
        value: "CNG", 
        icon: "🌱",
        weights: { fuelTypes: ["CNG"] }
      },
      { 
        label: "Any / No Preference", 
        value: "any", 
        icon: "✨",
        weights: { fuelTypes: ["Petrol", "Diesel", "CNG", "EV", "Hybrid"] }
      }
    ]
  },
  {
    id: 5,
    question: "What type of car do you prefer?",
    type: "image-cards",
    options: [
      { 
        label: "Hatchback", 
        value: "Hatchback", 
        icon: "🚗",
        description: "Compact & fuel-efficient",
        weights: { types: ["Hatchback", "Micro Car"] }
      },
      { 
        label: "Sedan", 
        value: "Sedan", 
        icon: "🚘",
        description: "Comfort & style",
        weights: { types: ["Compact Sedan", "Mid Size Sedan", "Full Size Sedan"] }
      },
      { 
        label: "SUV", 
        value: "SUV", 
        icon: "🚙",
        description: "Power & space",
        weights: { types: ["Compact SUV", "Mid Size SUV", "Full Size SUV"] }
      },
      { 
        label: "MUV/MPV", 
        value: "MUV", 
        icon: "🚐",
        description: "Maximum seating",
        weights: { types: ["MUV/MPV"] }
      },
      { 
        label: "No Preference", 
        value: "any", 
        icon: "✨",
        description: "Show me all",
        weights: { types: [] }
      }
    ]
  },
  {
    id: 6,
    question: "Must-have features?",
    type: "multi-select",
    options: [
      { label: "Power Windows", value: "Power Windows", icon: "🪟" },
      { label: "Air Conditioning", value: "Air Conditioning", icon: "❄️" },
      { label: "Music System", value: "Music System", icon: "🎵" },
      { label: "Airbags", value: "Airbags", icon: "🎈" },
      { label: "ABS", value: "ABS", icon: "🛑" },
      { label: "Alloy Wheels", value: "Alloy Wheels", icon: "⚙️" },
      { label: "Leather Seats", value: "Leather Seats", icon: "🪑" },
      { label: "Sunroof", value: "Sunroof", icon: "☀️" }
    ]
  }
]

export default function FindMyCarPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const handleAnswer = (questionId, value, isMultiSelect = false) => {
    if (isMultiSelect) {
      const currentAnswers = answers[questionId] || []
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value]
      
      setAnswers({ ...answers, [questionId]: newAnswers })
    } else {
      setAnswers({ ...answers, [questionId]: value })
      
      // Auto-advance for single-select questions
      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
        }
      }, 300)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateMatches()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateMatches = async () => {
    setLoading(true)
    
    try {
      // Fetch all listings
      const response = await axios.get(`${API_URL}/api/listings`)
      const allCars = response.data
      
      // Calculate match scores
      const scoredCars = allCars.map(car => {
        let score = 0
        let maxScore = 0
        const reasons = []
        
        // Budget matching (35% weight)
        maxScore += 35
        if (answers[1]) {
          const selectedBudget = quizQuestions[0].options.find(opt => opt.value === answers[1])
          if (selectedBudget) {
            const { min, max } = selectedBudget.weights.budget
            if (car.price >= min && car.price <= max) {
              score += 35
              reasons.push(`Within your budget of ${selectedBudget.label}`)
            } else if (car.price < max * 1.1 && car.price > min * 0.9) {
              score += 20
              reasons.push(`Close to your budget range`)
            }
          }
        }
        
        // Seats matching (15% weight)
        maxScore += 15
        if (answers[2]) {
          const selectedPassengers = quizQuestions[1].options.find(opt => opt.value === answers[2])
          if (selectedPassengers && car.seats >= selectedPassengers.weights.seats) {
            score += 15
            reasons.push(`Has ${car.seats} seats for your needs`)
          }
        }
        
        // Type matching (20% weight)
        maxScore += 20
        if (answers[5]) {
          const selectedType = quizQuestions[4].options.find(opt => opt.value === answers[5])
          if (selectedType && selectedType.weights.types.length > 0) {
            if (selectedType.weights.types.includes(car.type)) {
              score += 20
              reasons.push(`${car.type} matches your preference`)
            }
          } else {
            score += 10 // Partial score for "any"
          }
        }
        
        // Fuel matching (15% weight)
        maxScore += 15
        if (answers[4]) {
          const selectedFuel = quizQuestions[3].options.find(opt => opt.value === answers[4])
          if (selectedFuel) {
            if (selectedFuel.weights.fuelTypes.includes(car.fuelType)) {
              score += 15
              reasons.push(`${car.fuelType} fuel as preferred`)
            }
          }
        }
        
        // Features matching (15% weight)
        maxScore += 15
        if (answers[6] && answers[6].length > 0) {
          const matchedFeatures = answers[6].filter(feature => 
            car.features?.includes(feature)
          )
          const featureScore = (matchedFeatures.length / answers[6].length) * 15
          score += featureScore
          if (matchedFeatures.length > 0) {
            reasons.push(`Has ${matchedFeatures.length} of your must-have features`)
          }
        } else {
          score += 7.5 // Give partial if no features selected
        }
        
        const matchPercentage = Math.round((score / maxScore) * 100)
        
        return {
          car,
          matchPercentage,
          reasons: reasons.slice(0, 3) // Top 3 reasons
        }
      })
      
      // Sort and get top 5 matches
      const topMatches = scoredCars
        .filter(s => s.matchPercentage >= 40) // Minimum 40% match
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 5)
      
      setResults(topMatches)
    } catch (error) {
      console.error('Error calculating matches:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const retakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResults(null)
  }

  const AmountWithCommas = (amount) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-custom-accent mb-4"></div>
          <p className="text-white text-xl">Finding your perfect match...</p>
        </div>
      </div>
    )
  }

  if (results) {
    return (
      <div className="min-h-screen bg-custom-black py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-4">
              Your Perfect <span className="text-custom-accent">Matches</span>! 🎉
            </h1>
            <p className="text-xl text-custom-platinum mb-6">
              Based on your preferences, we found {results.length} great {results.length === 1 ? 'match' : 'matches'} for you
            </p>
            <button
              onClick={retakeQuiz}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
            >
              🔄 Retake Quiz
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-custom-platinum mb-6">
                No exact matches found. Try adjusting your preferences!
              </p>
              <button
                onClick={retakeQuiz}
                className="px-8 py-4 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400"
              >
                Retake Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.car._id}
                  className="glass-dark border border-white/10 rounded-2xl overflow-hidden hover:border-custom-accent/50 transition-all group"
                >
                  <div className="p-6 md:flex md:items-center md:gap-6">
                    {/* Car Image */}
                    <div className="md:w-1/3 mb-4 md:mb-0">
                      {result.car.images && result.car.images[0] && (
                        <img
                          src={result.car.images[0]}
                          alt={`${result.car.brand} ${result.car.model}`}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      )}
                    </div>

                    {/* Car Details */}
                    <div className="md:w-2/3">
                      {/* Match Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
                          result.matchPercentage >= 80 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : result.matchPercentage >= 60
                            ? 'bg-custom-accent/20 text-custom-accent border border-custom-accent/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {result.matchPercentage}% Match {index === 0 && '🏆'}
                        </span>
                        {index === 0 && (
                          <span className="text-sm text-custom-accent font-bold">BEST MATCH</span>
                        )}
                      </div>

                      {/* Car Name */}
                      <h3 className="font-display font-bold text-2xl text-white mb-2">
                        {result.car.year} {result.car.brand} {result.car.model}
                      </h3>
                      
                      {/* Variant */}
                      <p className="text-custom-platinum mb-3">{result.car.variant}</p>

                      {/* Quick Specs */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-custom-jet px-3 py-1 rounded-full text-sm text-custom-platinum">
                          {result.car.fuelType}
                        </span>
                        <span className="bg-custom-jet px-3 py-1 rounded-full text-sm text-custom-platinum">
                          {result.car.type}
                        </span>
                        <span className="bg-custom-jet px-3 py-1 rounded-full text-sm text-custom-platinum">
                          {result.car.kmDriven} km
                        </span>
                      </div>

                      {/* Why It Matches */}
                      <div className="mb-4">
                        <p className="text-sm text-custom-accent font-semibold mb-2">Why this car is perfect for you:</p>
                        <ul className="space-y-1">
                          {result.reasons.map((reason, idx) => (
                            <li key={idx} className="text-sm text-custom-platinum flex items-start gap-2">
                              <span className="text-custom-accent mt-0.5">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-3xl font-bold text-white">
                            ₹{AmountWithCommas(result.car.price)}
                          </span>
                        </div>
                        <Link
                          href={`/buy/${result.car.slug || result.car._id}`}
                          className="px-6 py-3 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all shadow-lg shadow-custom-accent/20"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTAs */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-custom-platinum">
              Can't find what you're looking for?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/buy"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all"
              >
                Browse All Cars
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]
  const currentAnswer = answers[currentQ.id]

  return (
    <div className="min-h-screen bg-custom-black py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-custom-platinum text-sm">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-custom-accent text-sm font-bold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-custom-jet rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-custom-accent to-yellow-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
            {currentQ.question}
          </h2>
        </div>

        {/* Options */}
        <div className={`grid gap-4 mb-8 ${
          currentQ.type === 'multi-select' 
            ? 'grid-cols-2 md:grid-cols-4' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {currentQ.options.map((option) => {
            const isSelected = currentQ.type === 'multi-select'
              ? currentAnswer?.includes(option.value)
              : currentAnswer === option.value

            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option.value, currentQ.type === 'multi-select')}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isSelected
                    ? 'border-custom-accent bg-custom-accent/10 shadow-lg shadow-custom-accent/20'
                    : 'border-white/10 bg-custom-jet hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{option.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-lg mb-1">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-custom-platinum text-sm">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div className="text-custom-accent text-2xl">✓</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              currentQuestion === 0
                ? 'bg-custom-jet text-gray-600 cursor-not-allowed'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
          >
            ← Back
          </button>

          {currentQ.type === 'multi-select' && (
            <button
              onClick={handleNext}
              disabled={!currentAnswer || currentAnswer.length === 0}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                !currentAnswer || currentAnswer.length === 0
                  ? 'bg-custom-jet text-gray-600 cursor-not-allowed'
                  : currentQuestion === quizQuestions.length - 1
                  ? 'bg-custom-accent text-custom-black hover:bg-yellow-400'
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'See Results 🎯' : 'Next →'}
            </button>
          )}
        </div>

        {/* Skip Button */}
        {currentQ.type !== 'multi-select' && (
          <div className="text-center mt-6">
            <button
              onClick={handleNext}
              className="text-custom-platinum hover:text-white text-sm underline"
            >
              Skip this question
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
