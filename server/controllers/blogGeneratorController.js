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

exports.generateBlogText = async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: "AI service is currently unavailable.",
        error: "OpenAI not configured"
      });
    }

    const { topic } = req.body;

    const systemPrompt = `You are an expert automotive content writer for 'Poddar Motors', a trusted used car dealership.
    Write a complete, high-quality blog post on the given topic.
    
    Response format must be a valid JSON object with these fields:
    - title: (Refined string)
    - content: (HTML string, use <h2>, <p>, <ul>, <li>. NO markdown, just HTML tags. Keep it professional yet engaging.)
    - excerpt: (Short summary, max 250 chars)
    - metaTitle: (SEO optimized title)
    - metaDescription: (SEO optimized description)
    - metaKeywords: (Comma separated string)
    - category: (One of: 'Company', 'New Launches', 'Service Tips', 'Industry News')
    - readTime: (e.g. '5 min read')
    
    Ensure the content is tailored to the Indian market (mention Rs, Indian road conditions, etc).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${topic}` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const blogData = JSON.parse(response.choices[0].message.content);
    res.json(blogData);

  } catch (error) {
    console.error('AI Blog Text Gen Error:', error);
    res.status(500).json({ message: "Failed to generate blog text." });
  }
};

exports.generateBlogImage = async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: "AI service is currently unavailable.",
        error: "OpenAI not configured"
      });
    }

    const { title } = req.body;

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
    res.status(500).json({ message: "Failed to generate image." });
  }
};
