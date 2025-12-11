import foodmodels from "../models/foodmodels.js";
import fs from "fs";






// Add food items to the database
const addFoodItems = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const food = new foodmodels({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });
    try {
        await food.save();
        res.json({ success:true, message: "Food item added successfully"});
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding food item" });
    }   
};

// All list of food items from the database

const listFoodItems = async (req, res) => {
    try {
        const foodItems =  await foodmodels.find({});
        res.json({ success: true, data: foodItems });
    }   
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching food items" });
    }
};  

// Remove food items from the database

const removeFoodItems = async (req, res) => {
    try {
        const foodItem = await foodmodels.findById(req.body.id);
        fs.unlink(`uploads/${foodItem.image}`, () => {});
        await foodmodels.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food item removed successfully" });    
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food item" });
    }   
};

export { addFoodItems, listFoodItems, removeFoodItems };
