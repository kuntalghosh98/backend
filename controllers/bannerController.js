// controllers/bannerController.js
const Banner = require('../models/Banner');

exports.addOrUpdateBanner = async (req, res) => {
  const { bannerNumber, cards } = req.body;

  try {
    if (!bannerNumber || !Array.isArray(cards)) {
      return res.status(400).json({ success: false, message: 'Invalid input format' });
    }

    let banner = await Banner.findOne({ bannerNumber });

    if (banner) {
      banner.cards = cards;
    } else {
      banner = new Banner({ bannerNumber, cards });
    }

    const savedBanner = await banner.save();
    res.status(200).json({ success: true, data: savedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving banner', error });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching banners', error });
  }
};

exports.getBannerByNumber = async (req, res) => {
  const { bannerNumber } = req.params;

  try {
    const banner = await Banner.findOne({ bannerNumber });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching banner', error });
  }
};



