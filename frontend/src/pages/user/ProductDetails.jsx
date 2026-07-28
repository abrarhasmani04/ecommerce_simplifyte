import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";

const ProductDetails = () => {
  const { id } = useParams();

  // Placeholder — replace with real API fetch
  if (!id) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Product Details</h1>
      <p className="mt-4 text-gray-500">Product ID: {id}</p>
      <p className="mt-2 text-gray-400 text-sm">
        Full product details will be loaded here from the API.
      </p>
    </div>
  );
};

export default ProductDetails;
