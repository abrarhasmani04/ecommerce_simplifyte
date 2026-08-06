import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/services/axios";

const SellerProductForm = ({ productId = null, initialData = null }) => {
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    brand: "",
    stock: "",
    category: "",
    isFeatured: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        price: initialData.price ?? "",
        discountPrice: initialData.discountPrice ?? "",
        brand: initialData.brand ?? "",
        stock: initialData.stock ?? "",
        category: initialData.category?._id ?? initialData.category ?? "",
        isFeatured: initialData.isFeatured ?? false,
      });
      setExistingImages(initialData.images ?? []);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/category/");
        const list = Array.isArray(data) ? data : (data.categories ?? []);
        setCategories(list);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => {
      const combined = [...prev, ...files];
      const totalSlots = existingImages.length + combined.length;
      if (totalSlots > 5) {
        toast.warning("Maximum 5 images allowed");
        return prev;
      }
      return combined;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const totalImages = existingImages.length + newImages.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.warning("Please select a category");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      existingImages.forEach((url) => {
        data.append("existingImages", url);
      });

      newImages.forEach((file) => {
        data.append("images", file);
      });

      if (isEditMode) {
        await api.put(`/product/${productId}`, data);
        toast.success("Product Updated Successfully");
        navigate("/seller/products");
      } else {
        await api.post("/product/add", data);
        toast.success("Product Added Successfully");

        setFormData({
          name: "",
          description: "",
          price: "",
          discountPrice: "",
          brand: "",
          stock: "",
          category: "",
          isFeatured: false,
        });
        setNewImages([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log("Product Error:", error.response?.data || error.message);
      const errData = error.response?.data;
      const message =
        errData?.errors?.[0]?.msg ||
        errData?.message ||
        (isEditMode ? "Product Update Failed" : "Product Add Failed");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border shadow-sm space-y-6"
    >
      {/* Name */}
      <div>
        <label className="font-medium">Product Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          className="w-full mt-2 border rounded-lg px-3 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Enter description"
          className="w-full mt-2 border rounded-lg px-3 py-2"
        />
      </div>

      {/* Price / Discount */}
      <div className="grid md:grid-cols-2 gap-5">
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleChange}
          placeholder="Discount Price"
          className="border rounded-lg px-3 py-2"
        />
      </div>

      {/* Brand / Stock / Category */}
      <div className="grid md:grid-cols-3 gap-5">
        <input
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border rounded-lg px-3 py-2"
        />

        {/* Category dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={catLoading}
          className="border rounded-lg px-3 py-2 bg-white disabled:opacity-50"
        >
          <option value="">
            {catLoading ? "Loading categories..." : "Select Category"}
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
        />
        <span>Featured Product</span>
      </div>

      {/* Images */}
      <div>
        <label className="font-medium">Product Images ({totalImages}/5)</label>

        {existingImages.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {existingImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`existing-${index}`}
                  className="h-24 w-24 rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {newImages.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {newImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  className="h-24 w-24 rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {totalImages < 5 && (
          <div className="border-2 border-dashed rounded-xl p-5 mt-3 text-center">
            <Upload className="mx-auto text-slate-400" />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImages}
              className="mt-3"
            />
            <p className="text-xs text-slate-400 mt-1">
              {5 - totalImages} slot{5 - totalImages !== 1 ? "s" : ""} remaining
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? isEditMode
              ? "Saving..."
              : "Adding..."
            : isEditMode
              ? "Save Changes"
              : "Add Product"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/seller/products")}
          className="px-6 py-3 rounded-lg border hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SellerProductForm;
