const OpenAI = require('openai');
const Listing = require('../models/listing');

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
    
    // Note: 'status' field is not in the schema, so removing it for now to avoid filtering out all cars
    // If you add a status field later, uncomment the next line
    // const query = { status: 'Active' };
    const query = {};

    if (args.brand) query.brand = { $regex: args.brand, $options: 'i' };
    if (args.model) query.model = { $regex: args.model, $options: 'i' };
    if (args.fuelType) query.fuelType = { $regex: args.fuelType, $options: 'i' };
    
    // FIX: Schema uses 'transmissionType', not 'transmission'
    if (args.transmission) query.transmissionType = { $regex: args.transmission, $options: 'i' };
    
    if (args.type) query.type = { $regex: args.type, $options: 'i' };
    if (args.year) query.year = { $gte: args.year };
    
    if (args.minPrice || args.maxPrice) {
      query.price = {};
      if (args.minPrice) query.price.$gte = args.minPrice;
      if (args.maxPrice) query.price.$lte = args.maxPrice;
    }

    console.log("🔍 MongoDB Query:", JSON.stringify(query, null, 2));

    const listings = await Listing.find(query)
      .select('brand model variant year price fuelType transmissionType kmDriven color images')
      .limit(5);

    console.log(`✅ Found ${listings.length} cars`);

    if (listings.length === 0) {
      // Fallback: If specific search fails, try a broader search
      if (args.model) {
         console.log("⚠️ No exact match, trying broader search for model:", args.model);
         const broadQuery = { 
           $or: [
             { model: { $regex: args.model, $options: 'i' } },
             { brand: { $regex: args.model, $options: 'i' } },
             { variant: { $regex: args.model, $options: 'i' } }
           ]
         };
         const broadListings = await Listing.find(broadQuery).select('brand model variant year price').limit(3);
         if (broadListings.length > 0) return JSON.stringify(broadListings);
      }
      return "No cars found matching these criteria. Suggest checking other similar options.";
    }

    return JSON.stringify(listings);
  } catch (error) {
    console.error("❌ Search Error:", error);
    return "Error searching inventory.";
  }
}

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    const systemPrompt = `
      You are "Poddar AI", the smart sales assistant for Poddar Motors Real Value in Ranchi.
      
      YOUR GOAL: Help customers find the perfect used car from our REAL inventory.
      
      CAPABILITIES:
      - You have a tool 'search_inventory' to check our live database.
      - ALWAYS use this tool when a user asks about available cars, prices, or specific models.
      - Do NOT guess. If the tool returns no results, say so politely.
      
      RESPONSE GUIDELINES:
      - When showing cars, mention: Year, Brand, Model, Variant, and Price (in Lakhs/Crores).
      - Be concise and professional.
      - If a user shows interest, ask for their name/number to schedule a test drive.
      - We offer up to 90% finance and have a full service workshop.
    `;

    // 1. First Call: Check if AI wants to use a tool
    const runner = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      tools: tools,
      tool_choice: "auto",
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
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            responseMessage, // The tool call request
            {
              role: "tool",
              tool_call_id: toolCall.id,
              name: functionName,
              content: searchResults,
            },
          ],
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
