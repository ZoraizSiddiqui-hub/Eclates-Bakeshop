// src/admin/pages/Add/Add.jsx
import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { addFoodItem } from "../../../../Frontend/src/api/api"; // centralized API function

const Add = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Cakes",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload an image before submitting");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    formData.append("price", Number(data.price));
    formData.append("stock", Number(data.stock));
    formData.append("category", data.category);

    try {
      const response = await addFoodItem(formData);
      if (response.data.success) {
        // Reset form
        setData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "Cakes",
        });
        setImage(null);
        toast.success(response.data.message || "Product added successfully");
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding product");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image Upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Product Description */}
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Enter product description"
            required
          ></textarea>
        </div>

        {/* Category, Price, Stock */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
            >
              <option value="Cakes">Cakes</option>
              <option value="Cookies">Cookies</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Desserts">Desserts</option>
              <option value="Mini Donuts">Mini Donuts</option>
              <option value="Sundae">Sundae</option>
              <option value="Brownies">Brownies</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="Enter price"
              min="1"
              required
            />
          </div>

          <div className="add-stock flex-col">
            <p>Product stock</p>
            <input
              onChange={onChangeHandler}
              value={data.stock}
              type="number"
              name="stock"
              placeholder="Enter stock"
              min="0"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
