const InspectionBooking = require('../models/InspectionBooking');
const Auction = require('../models/Auction');
const InspectionReport = require('../models/InspectionReport');

// Calculate instant car valuation based on historical data
exports.getInstantValuation = async (req, res) => {
  try {
    const { brand, model, year, kilometers, condition } = req.body;

    // Validate required fields
    if (!brand || !model || !year) {
      return res.status(400).json({ error: 'Brand, model, and year are required' });
    }

    // Get historical auction data for similar cars
    const similarCars = await Auction.aggregate([
      {
        $match: {
          winnerId: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: 'inspectionreports',
          localField: 'inspectionReportId',
          foreignField: '_id',
          as: 'report'
        }
      },
      { $unwind: '$report' },
      {
        $lookup: {
          from: 'inspectionbookings',
          localField: 'report.bookingId',
          foreignField: '_id',
          as: 'booking'
        }
      },
      { $unwind: '$booking' },
      {
        $match: {
          'booking.brand': brand,
          'booking.model': model
        }
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$currentBid' },
          minPrice: { $min: '$currentBid' },
          maxPrice: { $max: '$currentBid' },
          count: { $sum: 1 }
        }
      }
    ]);

    let basePrice = 0;
    let priceRange = { min: 0, max: 0 };
    let confidence = 'low';

    if (similarCars.length > 0 && similarCars[0].count >= 3) {
      // We have enough data
      basePrice = Math.round(similarCars[0].avgPrice);
      priceRange.min = Math.round(similarCars[0].minPrice * 0.9);
      priceRange.max = Math.round(similarCars[0].maxPrice * 1.1);
      confidence = similarCars[0].count >= 10 ? 'high' : 'medium';
    } else {
      // Not enough data, use industry estimates
      // This is a simplified fallback - in production, you'd use a more sophisticated model
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(year);
      
      // Base price estimation (simplified)
      const brandPrices = {
        'Maruti Suzuki': 300000,
        'Hyundai': 350000,
        'Tata': 320000,
        'Honda': 400000,
        'Mahindra': 450000,
        'Toyota': 500000,
        'Ford': 350000,
        'Volkswagen': 380000,
        'Renault': 320000,
        'Nissan': 340000
      };

      basePrice = brandPrices[brand] || 350000;
      
      // Depreciation: 10% per year
      basePrice = basePrice * Math.pow(0.9, age);
      
      // Adjust for kilometers (if provided)
      if (kilometers) {
        const km = parseInt(kilometers);
        if (km > 100000) basePrice *= 0.85;
        else if (km > 50000) basePrice *= 0.95;
      }
      
      // Adjust for condition (if provided)
      if (condition) {
        const conditionMultipliers = {
          'Excellent': 1.1,
          'Good': 1.0,
          'Fair': 0.9,
          'Poor': 0.75
        };
        basePrice *= conditionMultipliers[condition] || 1.0;
      }

      basePrice = Math.round(basePrice);
      priceRange.min = Math.round(basePrice * 0.8);
      priceRange.max = Math.round(basePrice * 1.2);
      confidence = 'low';
    }

    // Store lead for follow-up
    const lead = {
      brand,
      model,
      year,
      kilometers: kilometers || 'Not specified',
      condition: condition || 'Not specified',
      estimatedValue: basePrice,
      createdAt: new Date(),
      source: 'sell-your-car-landing'
    };

    // You could save this to a "Leads" collection
    // For now, we'll just return the valuation

    res.json({
      success: true,
      valuation: {
        estimatedValue: basePrice,
        priceRange,
        confidence,
        currency: 'INR',
        message: confidence === 'high' 
          ? `Based on ${similarCars[0].count} similar cars sold on our platform`
          : confidence === 'medium'
          ? `Based on ${similarCars[0]?.count || 0} similar cars sold on our platform`
          : 'Based on market trends and industry data'
      },
      lead
    });
  } catch (error) {
    console.error('Error calculating valuation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get popular car brands
exports.getPopularBrands = async (req, res) => {
  try {
    const brands = await InspectionBooking.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: error.message });
  }
};
