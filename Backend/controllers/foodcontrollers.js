import foodmodels from "../models/foodmodels.js";
import fs from "fs";

// Add food items to the database
const addFoodItems = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodmodels({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        category: req.body.category,
        image: image_filename,
        stock: Number(req.body.stock) // ✅ NEW: allow admin to set stock
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food item added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding food item" });
    }
};

// All list of food items from the database
const listFoodItems = async (req, res) => {
    try {
        const foodItems = await foodmodels.find({});
        res.json({ success: true, data: foodItems }); // stock is included automatically
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching food items" });
    }
};

// Remove food items from the database
const removeFoodItems = async (req, res) => {
    try {
        const foodItem = await foodmodels.findById(req.body.id);

        if (!foodItem) {
            return res.json({ success: false, message: "Food item not found" });
        }

        fs.unlink(`uploads/${foodItem.image}`, () => {});
        await foodmodels.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food item" });
    }
};

// ------------------------------------------------------
// Update Food Item (Admin)
// ------------------------------------------------------
const updateFoodItem = async (req, res) => {
  try {
    const foodId = req.params.id;

    const existingFood = await foodmodels.findById(foodId);
    if (!existingFood) {
      return res.json({ success: false, message: "Food item not found" });
    }

    // Build update object
    const updatedData = {
      name: req.body.name || existingFood.name,
      description: req.body.description || existingFood.description,
      price: req.body.price ? Number(req.body.price) : existingFood.price,
      stock: req.body.stock ? Number(req.body.stock) : existingFood.stock,
      category: req.body.category || existingFood.category,
    };

    // If new image uploaded → replace old one
    if (req.file) {
      // delete old image
      try {
        fs.unlinkSync(`uploads/${existingFood.image}`);
      } catch (err) {
        console.log("Old image not found, skipping delete");
      }

      updatedData.image = req.file.filename;
    }

    const updatedFood = await foodmodels.findByIdAndUpdate(foodId, updatedData, { new: true });

    res.json({ success: true, message: "Food item updated successfully", data: updatedFood });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food item" });
  }
};


export { addFoodItems, listFoodItems, removeFoodItems, updateFoodItem };
