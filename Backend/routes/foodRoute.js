import express from "express";
import { addFoodItems, listFoodItems, removeFoodItems, updateFoodItem } from "../controllers/foodcontrollers.js";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({storage:storage})

foodRouter.post("/add", upload.single("image"), addFoodItems)
foodRouter.get("/list", listFoodItems)
foodRouter.post("/remove", removeFoodItems);
foodRouter.put("/update/:id", upload.single("image"), updateFoodItem);

export default foodRouter;

