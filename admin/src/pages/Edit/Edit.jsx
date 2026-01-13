// src/admin/pages/Edit/Edit.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./Edit.css";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { getFoodItems, updateFoodItem } from "../../api/api"; // centralized APIs
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Cakes",
  });

  const fetchProduct = useCallback(async () => {
    try {
      const response = await getFoodItems();
      const product = response.data.data.find((item) => item._id === id);

      if (!product) {
        MySwal.fire({
          icon: "error",
          title: "Not Found",
          text: "Product not found",
        });
        return;
      }

      setData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "Cakes",
      });

      setExistingImage(product.image || "");
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error fetching product",
      });
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    formData.append("price", Number(data.price));
    formData.append("stock", Number(data.stock));
    formData.append("category", data.category);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await updateFoodItem(id, formData);
      if (response.data.success) {
        MySwal.fire({
          icon: "success",
          title: "Product Updated!",
          text: "Product has been updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin/list");
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.data.message || "Failed to update product",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating product",
      });
    }
  };

  return (
    <div className="edit">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image Upload */}
        <div className="edit-img-upload flex-col">
          <p>Product Image</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : existingImage
                  ? `${import.meta.env.VITE_BACKEND_URL}/images/${existingImage}`
                  : assets.upload_area
              }
              alt="Product"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Product Name */}
        <div className="edit-product-name flex-col">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Product Description */}
        <div className="edit-product-description flex-col">
          <p>Description</p>
          <textarea
            name="description"
            rows="6"
            value={data.description}
            onChange={onChangeHandler}
            placeholder="Enter product description"
            required
          ></textarea>
        </div>

        {/* Category, Price, Stock */}
        <div className="edit-category-price">
          <div className="edit-category flex-col">
            <p>Category</p>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
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

          <div className="edit-price flex-col">
            <p>Price</p>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onChangeHandler}
              min="1"
              placeholder="Enter price"
              required
            />
          </div>

          <div className="edit-stock flex-col">
            <p>Stock</p>
            <input
              type="number"
              name="stock"
              value={data.stock}
              onChange={onChangeHandler}
              min="0"
              placeholder="Enter stock"
              required
            />
          </div>
        </div>

        <button type="submit" className="edit-btn">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default Edit;
