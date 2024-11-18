// const axios = require('axios');

// exports.reverseGeocode = async (req, res) => {
//   const { lat, lng } = req.body;
//   const apiKey = process.env.OPENCAGE_API_KEY;
//   const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

//   try {
//     const response = await axios.get(apiUrl);
//     const data = response.data;
//     const location = data.results[0]?.formatted || 'Location not found';
//     res.status(200).json({ location });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching location', error });
//   }
// };









const axios = require('axios');

exports.reverseGeocode = async (req, res) => {
  const { lat, lng } = req.body;
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  const apiUrl = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    if (data.address) {
      res.status(200).json({ location: data.address });
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location', error });
  }
};
