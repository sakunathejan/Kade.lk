import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/http';
import { useAppContext } from '../context/AppContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useAppContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="py-6">Loading...</div>;
  if (isError || !data) return <div className="py-6">Product not found</div>;

  const p = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded" />
      <div>
        <h1 className="text-2xl font-semibold mb-2">{p.title}</h1>
        <div className="text-gray-600 dark:text-gray-300 mb-4">{p.description}</div>
        <div className="text-xl font-bold mb-4">Rs. {p.price?.toLocaleString()}</div>
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => addToCart(p)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;


