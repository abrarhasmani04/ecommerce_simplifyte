import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/axios";
import SellerProductForm from "./SellerProductForm";

const SellerEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/product/${id}`);
        const p = data?.product ?? data;
        setProduct(p);
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Product not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-slate-500 text-center">Loading product...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/seller/products")}
          className="text-blue-600 underline text-sm"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <SellerProductForm productId={id} initialData={product} />
    </div>
  );
};

export default SellerEditProduct;
