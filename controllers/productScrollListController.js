const ProductScrollList = require('../models/ProductScrollList');

// ✅ Get All Product Scroll Lists
exports.getAllScrollLists = async (req, res) => {
  try {
    const lists = await ProductScrollList.find().populate('productIds');
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Single List by ID
exports.getScrollListById = async (req, res) => {
  try {
    const list = await ProductScrollList.findById(req.params.id).populate('productIds');
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add New Scroll List
exports.addScrollList = async (req, res) => {
  try {
    const { name, description, listNumber, productIds } = req.body;

    if (productIds.length > 20) {
      return res.status(400).json({ message: 'Max 20 product IDs allowed' });
    }

    const newList = new ProductScrollList({ name, description, listNumber, productIds });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Edit Scroll List
exports.editScrollList = async (req, res) => {
  try {
    const { name, description, listNumber, productIds } = req.body;

    if (productIds && productIds.length > 20) {
      return res.status(400).json({ message: 'Max 20 product IDs allowed' });
    }

    const updatedList = await ProductScrollList.findByIdAndUpdate(
      req.params.id,
      { name, description, listNumber, productIds },
      { new: true }
    );

    if (!updatedList) return res.status(404).json({ message: 'List not found' });

    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Scroll List
exports.deleteScrollList = async (req, res) => {
  try {
    const deletedList = await ProductScrollList.findByIdAndDelete(req.params.id);
    if (!deletedList) return res.status(404).json({ message: 'List not found' });

    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
