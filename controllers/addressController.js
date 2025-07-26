// controllers/addressController.js
const Address = require('../models/Address');

exports.addAddress = async (req, res) => {
  const {
    userId, name, mobileNumber, pincode, locality,
    flatNumber, landmark, district, state, addressType, isDefault
  } = req.body;

  if (!userId || !name || !mobileNumber || !pincode || !locality || !flatNumber || !district || !state || !addressType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    if (isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const newAddress = new Address({
      userId, name, mobileNumber, pincode, locality,
      flatNumber, landmark, district, state, addressType, isDefault
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message || error });
  }
};

exports.getAddresses = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const addresses = await Address.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error: error.message || error });
  }
};

exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const {
    userId, name, mobileNumber, pincode, locality,
    flatNumber, landmark, district, state, addressType, isDefault
  } = req.body;

  if (!id || !userId) return res.status(400).json({ message: 'Missing id or userId' });

  try {
    if (isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const updated = await Address.findByIdAndUpdate(id, {
      name, mobileNumber, pincode, locality, flatNumber,
      landmark, district, state, addressType, isDefault
    }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address updated successfully', address: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message || error });
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'Missing address id' });

  try {
    const deleted = await Address.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message || error });
  }
};

exports.setDefaultAddress = async (req, res) => {
  const { id, userId } = req.body;
  if (!id || !userId) return res.status(400).json({ message: 'Missing id or userId' });

  try {
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
    const updated = await Address.findByIdAndUpdate(id, { $set: { isDefault: true } }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Default address set', address: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error setting default address', error: error.message || error });
  }
};


