const Video = require('../models/video');

// Helper to extract video ID and platform
const extractVideoDetails = (url) => {
  let platform = 'other';
  let videoId = '';

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    platform = 'youtube';
    // Handle various YouTube formats (shorts, watch, youtu.be)
    if (url.includes('shorts/')) {
      videoId = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
  } else if (url.includes('instagram.com')) {
    platform = 'instagram';
    // Handle Instagram reels/posts
    if (url.includes('/reel/') || url.includes('/p/')) {
      const parts = url.split('/');
      const index = parts.findIndex(p => p === 'reel' || p === 'p');
      if (index !== -1 && parts[index + 1]) {
        videoId = parts[index + 1];
      }
    }
  }

  return { platform, videoId };
};

exports.createVideo = async (req, res) => {
  try {
    const { title, videoUrl, linkedListing } = req.body;
    
    const { platform, videoId } = extractVideoDetails(videoUrl);

    if (!videoId) {
      return res.status(400).json({ message: 'Invalid video URL. Could not extract video ID.' });
    }

    const video = new Video({
      title,
      videoUrl,
      platform,
      videoId,
      linkedListing: linkedListing || null
    });

    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('linkedListing', 'brand model year price slug images');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
