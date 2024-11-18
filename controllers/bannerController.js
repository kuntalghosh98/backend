// controllers/bannerController.js
const Banner = require('../models/Banner');

// Add or update a banner with cards
exports.addOrUpdateBanner = async (req, res) => {
  const { bannerNumber, cards } = req.body;

  try {
    let banner = await Banner.findOne({ bannerNumber });

    if (banner) {
      // Update existing banner
      banner.cards = cards;
    } else {
      // Create a new banner
      banner = new Banner({ bannerNumber, cards });
    }

    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error saving banner', error });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error });
  }
};

// Get a specific banner by bannerNumber
exports.getBannerByNumber = async (req, res) => {
  const { bannerNumber } = req.params;

  try {
    const banner = await Banner.findOne({ bannerNumber });
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banner', error });
  }
};
