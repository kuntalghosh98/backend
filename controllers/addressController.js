// controllers/addressController.js
const Address = require('../models/Address');

// Add new address
exports.addAddress = async (req, res) => {
  const {
    userId, name, mobileNumber, pincode, locality, flatNumber, landmark, district, state, addressType, isDefault
  } = req.body;

  try {
    if (isDefault) {
      // If this is marked as the default, set all other addresses to not be default
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const newAddress = new Address({
      userId, name, mobileNumber, pincode, locality, flatNumber, landmark, district, state, addressType, isDefault
    });
    await newAddress.save();

    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error });
  }
};

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  const { userId } = req.params;

  try {
    const addresses = await Address.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const {
    name, mobileNumber, pincode, locality, flatNumber, landmark, district, state, addressType, isDefault
  } = req.body;

  try {
    if (isDefault) {
      // If this is marked as the default, set all other addresses to not be default
      await Address.updateMany({ userId: req.body.userId }, { $set: { isDefault: false } });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { name, mobileNumber, pincode, locality, flatNumber, landmark, district, state, addressType, isDefault },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  const { id, userId } = req.body;

  try {
    // Set all other addresses to not be default
    await Address.updateMany({ userId }, { $set: { isDefault: false } });

    // Set the selected address as default
    const defaultAddress = await Address.findByIdAndUpdate(id, { $set: { isDefault: true } }, { new: true });

    if (!defaultAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Default address set', address: defaultAddress });
  } catch (error) {
    res.status(500).json({ message: 'Error setting default address', error });
  }
};
