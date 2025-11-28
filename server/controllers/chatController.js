const OpenAI = require('openai');
const Listing = require('../models/listing');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    // 1. Fetch available inventory (limit to key fields to save tokens)
    const listings = await Listing.find({ status: 'Active' })
      .select('brand model year price fuelType transmission kmDriven')
      .limit(20); // Limit to 20 for now to manage context window

    // 2. Format inventory for the AI
    const inventoryText = listings.map(car => 
      `- ${car.year} ${car.brand} ${car.model} (${car.fuelType}, ${car.transmission}): ₹${car.price.toLocaleString('en-IN')}, ${car.kmDriven}km`
    ).join('\n');

    // 3. System Prompt
    const systemPrompt = `
      You are "Poddar AI", the smart sales assistant for Poddar Motors Real Value in Ranchi, Jharkhand.
      
      YOUR GOAL: Help customers find the perfect used car, answer questions about finance/workshop, and encourage them to book a test drive or visit.
      
      KEY INFORMATION:
      - Location: Ranchi, Jharkhand.
      - Services: Used Car Sales, Buying Cars, Finance (Loans), Insurance, Workshop/Service Center.
      - Finance: We offer loans up to 90% value, minimal documentation.
      - Workshop: Full service center available for all brands.
      
      CURRENT INVENTORY (Use this to answer "what cars do you have?"):
      ${inventoryText}
      
      GUIDELINES:
      - Be polite, professional, and concise.
      - If a user asks for a car NOT in the list, say we don't have it right now but can arrange it.
      - Always mention prices in Lakhs/Crores or Indian Rupees.
      - If the user seems interested, ask for their name/number to schedule a visit.
      - Do not invent cars that are not in the list.
    `;

    // 4. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Cost-effective and fast
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
    });

    res.json({ 
      message: completion.choices[0].message.content,
      role: 'assistant' 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: 'Sorry, I am having trouble thinking right now.' });
  }
};
