const OpenAI = require('openai');
const Listing = require('../models/listing');

// Initialize OpenAI only if API key is provided
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tool Definition
const tools = [
  {
    type: "function",
    function: {
      name: "search_inventory",
      description: "Search for cars in the inventory based on criteria like brand, model, price, etc.",
      parameters: {
        type: "object",
        properties: {
          brand: { type: "string", description: "Car brand (e.g., Maruti, Hyundai, Honda)" },
          model: { type: "string", description: "Car model (e.g., Swift, Creta, City)" },
          minPrice: { type: "number", description: "Minimum price in INR" },
          maxPrice: { type: "number", description: "Maximum price in INR" },
          year: { type: "number", description: "Minimum manufacturing year" },
          fuelType: { type: "string", enum: ["Petrol", "Diesel", "CNG", "Electric"] },
          transmission: { type: "string", enum: ["Manual", "Automatic"] },
          type: { type: "string", enum: ["Hatchback", "Sedan", "SUV", "MUV", "Luxury"] }
        },
        required: []
      }
    }
  }
];

// Helper to execute the search
async function executeInventorySearch(args) {
  try {
    console.log("🔍 AI Search Args:", JSON.stringify(args, null, 2));
    
    const query = {};

    if (args.brand) query.brand = { $regex: args.brand, $options: 'i' };
    if (args.model) query.model = { $regex: args.model, $options: 'i' };
    if (args.fuelType) query.fuelType = { $regex: args.fuelType, $options: 'i' };
    
    // SMART MAPPING: Map user terms to DB values
    if (args.transmission) {
      const trans = args.transmission.toLowerCase();
      if (trans.includes('auto')) {
        query.transmissionType = { $regex: 'AMT|CVT|Auto|AT', $options: 'i' };
      } else if (trans.includes('manual')) {
        query.transmissionType = { $regex: 'MT|Manual|IMT', $options: 'i' };
      } else {
        query.transmissionType = { $regex: args.transmission, $options: 'i' };
      }
    }
    
    if (args.type) query.type = { $regex: args.type, $options: 'i' };
    if (args.year) query.year = { $gte: args.year };
    
    if (args.minPrice || args.maxPrice) {
      query.price = {};
      if (args.minPrice) query.price.$gte = args.minPrice;
      if (args.maxPrice) query.price.$lte = args.maxPrice;
    }

    console.log("🔍 MongoDB Query:", JSON.stringify(query, null, 2));

    const listings = await Listing.find(query)
      // COST OPTIMIZATION: Return MINIMAL fields only
      .select('brand model variant year price transmissionType')
      .limit(3); // Reduced from 5 to 3

    console.log(`✅ Found ${listings.length} cars`);

    if (listings.length === 0) {
      return "No cars found matching these criteria.";
    }

    // COST OPTIMIZATION: Return compact format
    const compactResults = listings.map(car => ({
      brand: car.brand,
      model: car.model,
      variant: car.variant,
      year: car.year,
      price: car.price,
      transmission: car.transmissionType
    }));

    return JSON.stringify(compactResults);
  } catch (error) {
    console.error("❌ Search Error:", error);
    return "Error searching inventory.";
  }
}

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    // COST OPTIMIZATION: Limit context to last 4 messages (down from 10)
    const limitedMessages = messages.slice(-4);

    // COST OPTIMIZATION: Simplified system prompt
    const systemPrompt = `You are Poddar AI for Poddar Motors in Ranchi. Help customers find used cars.

TOOLS: Use 'search_inventory' to check real inventory.

RULES:
- Be brief and friendly
- When user asks about cars, search the database
- Show: Brand, Model, Year, Price (in Lakhs)
- If interested, ask for contact details
- We offer 90% finance and have a workshop`;

    // 1. First Call: Check if AI wants to use a tool
    // COST OPTIMIZATION: Using gpt-4o-mini (10x cheaper than gpt-3.5-turbo)
    const runner = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Switched from gpt-3.5-turbo
      messages: [
        { role: "system", content: systemPrompt },
        ...limitedMessages
      ],
      tools: tools,
      tool_choice: "auto",
      max_tokens: 200, // Limit response length
    });

    const responseMessage = runner.choices[0].message;

    // 2. If tool call requested
    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (functionName === "search_inventory") {
        // Execute the search
        const searchResults = await executeInventorySearch(functionArgs);

        // 3. Second Call: Send results back to AI for final answer
        const finalResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...limitedMessages,
            responseMessage, // The tool call request
            {
              role: "tool",
              tool_call_id: toolCall.id,
              name: functionName,
              content: searchResults,
            },
          ],
          max_tokens: 200,
        });

        return res.json({
          message: finalResponse.choices[0].message.content,
          role: 'assistant'
        });
      }
    }

    // If no tool call, just return the text response
    res.json({ 
      message: responseMessage.content,
      role: 'assistant' 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: "I'm having a little trouble connecting right now." });
  }
};
