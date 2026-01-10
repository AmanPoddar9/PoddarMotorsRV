const OpenAI = require('openai');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = process.env.AWS_S3_BUCKET || 'realvaluestorage';

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

exports.generateTopics = async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: "AI service is currently unavailable.",
        error: "OpenAI not configured"
      });
    }

    const { category = "General Used Cars" } = req.body;

    const systemPrompt = `You are a professional blog editor for a used car dealership in India called 'Poddar Motors'. 
    Generate 5 engaging, SEO-friendly, and viral blog topic titles based on the category provided.
    The audience is Indian car buyers.
    Return ONLY a JSON array of strings.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Category: ${category}` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const content = JSON.parse(response.choices[0].message.content);
    const topics = content.topics || content.titles || []; 
    
    res.json({ topics });

  } catch (error) {
    console.error('AI Topic Gen Error:', error);
    res.status(500).json({ message: "Failed to generate topics." });
  }
};

// Step 1: Generate Metadata only (Fast)
exports.generateBlogMetadata = async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ message: "AI not configured" });

    const { topic } = req.body;

    const systemPrompt = `You are an expert automotive content writer.
    For the topic: "${topic}", generate ONLY the following metadata in JSON format:
    - title: (Refined SEO title)
    - excerpt: (Short summary, max 200 chars)
    - metaTitle: (SEO optimized title)
    - metaDescription: (SEO optimized description)
    - metaKeywords: (Comma separated string)
    - category: (Best fit enum: 'Company', 'New Launches', 'Service Tips', 'Industry News')
    - readTime: (Estimate, e.g. '5 min read')
    
    Keep it concise. Tailor for Indian market.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      max_tokens: 500, // Reduced tokens for speed
    });

    const data = JSON.parse(response.choices[0].message.content);
    res.json(data);

  } catch (error) {
    console.error('AI Metadata Gen Error:', error);
    res.status(500).json({ message: "Failed to generate metadata." });
  }
};

// Step 2: Generate Body only (Fast-ish)
exports.generateBlogBody = async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ message: "AI not configured" });

    const { topic, title } = req.body;

    const systemPrompt = `You are an expert automotive content writer.
    Write the HTML BODY content for a blog post titled: "${title}" (Topic: ${topic}).
    
    Rules:
    - valid HTML only (use <h2>, <p>, <ul>, <li>).
    - NO <html>, <head>, or <body> tags. Just the inner content.
    - NO markdown (No \`\`\`).
    - Keep it CONCISE (approx 400-600 words) to ensure fast generation.
    - Tailor to Indian audience (Rs., kms, road conditions).
    - Return JSON: { "content": "..." }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      max_tokens: 1000, // Strictly limited
    });

    const data = JSON.parse(response.choices[0].message.content);
    res.json(data);

  } catch (error) {
    console.error('AI Body Gen Error:', error);
    res.status(500).json({ message: "Failed to generate blog body." });
  }
};

exports.generateBlogImage = async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ message: "AI not configured" });

    const { title } = req.body;

    // DALL-E 3 takes ~15s. This MIGHT timeout on Vercel Hobby (10s limit).
    // If it does, we just return empty image or handle error in frontend.
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A realistic, high-quality, professional photo for a blog post about: ${title}. The image should be suitable for a car dealership in India. No text in the image.`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageResponse.data[0].url;

    // Download image
    const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageBuffer.data, 'binary');

    // Upload to S3
    const timestamp = Date.now();
    const filename = `blog-images/${timestamp}-${Math.random().toString(36).substring(7)}.png`;
    
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const s3Url = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${filename}`;
    
    res.json({ featuredImage: s3Url });

  } catch (error) {
    console.error('AI Image Gen Error:', error);
    // Return 200 with empty image to avoid frontend breaking entirely
    res.json({ featuredImage: '', message: 'Image generation took too long or failed.' });
  }
};
