// controllers/productScrollListController.js
const ProductScrollList = require('../models/ProductScrollList');

exports.getAllScrollLists = async (req, res) => {
  try {
    const lists = await ProductScrollList.find().populate('productIds');
    res.status(200).json({ success: true, data: lists });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.getScrollListById = async (req, res) => {
  try {
    const list = await ProductScrollList.findById(req.params.id).populate('productIds');
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.addScrollList = async (req, res) => {
  try {
    const { name, description, listNumber, productIds } = req.body;

    if (productIds?.length > 20) {
      return res.status(400).json({ success: false, message: 'Max 20 product IDs allowed' });
    }

    const newList = await ProductScrollList.create({ name, description, listNumber, productIds });
    res.status(201).json({ success: true, data: newList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating scroll list', error });
  }
};

exports.editScrollList = async (req, res) => {
  try {
    const { name, description, listNumber, productIds } = req.body;

    if (productIds?.length > 20) {
      return res.status(400).json({ success: false, message: 'Max 20 product IDs allowed' });
    }

    const updatedList = await ProductScrollList.findByIdAndUpdate(
      req.params.id,
      { name, description, listNumber, productIds },
      { new: true }
    );

    if (!updatedList) return res.status(404).json({ success: false, message: 'List not found' });

    res.status(200).json({ success: true, data: updatedList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating scroll list', error });
  }
};

exports.deleteScrollList = async (req, res) => {
  try {
    const deletedList = await ProductScrollList.findByIdAndDelete(req.params.id);
    if (!deletedList) return res.status(404).json({ success: false, message: 'List not found' });

    res.status(200).json({ success: true, message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting scroll list', error });
  }
};
