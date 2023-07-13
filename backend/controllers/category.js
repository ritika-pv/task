const Category=require("../models/Category")

exports.addCategory = async (req, res) => {
    const { name } = req.body;

  try {
    // Create a new category
    const category = new Category({ name });
    
    // Save the category to the database
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}