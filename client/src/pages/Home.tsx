import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import CategoryPills from '../components/CategoryPills';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '../services/http';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductListItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

const Home: React.FC = () => {
  const { addToCart } = useAppContext();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'relevance' | 'price_low' | 'price_high'>('relevance');

  const categories = ['all', 'electronics', 'food', 'clothing', 'beauty', 'accessories', 'sports'];

  // Partner stores & recommendations
  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => (await api.get('/stores/highlights')).data,
  });
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => (await api.get('/recommendations/home')).data,
  });

  const fetchPage = async ({ pageParam = 1 }) => {
    const res = await api.get('/products', {
      params: {
        page: pageParam,
        limit: 12,
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        sort,
      },
    });
    return res.data;
  };

  const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch, status } = useInfiniteQuery({
    queryKey: ['products', category, search, sort],
    queryFn: fetchPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
  });

  useEffect(() => {
    if (!data) return;
    const merged = (data.pages ?? [])
      .flatMap((p: any) => (p?.products ?? []))
      .filter((it: any) => it && typeof it === 'object');
    setProducts(merged as any);
  }, [data]);

  const visibleProducts = useMemo(() => {
    let result = [...products];
    if (category !== 'all') result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sort === 'price_low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price_high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, search, category, sort]);

  const loadMore = () => { if (hasNextPage) fetchNextPage(); };
  const resetAndSearch = (value: string) => {
    setProducts([]);
    setSearch(value);
    refetch();
  };

  const onSelectCategory = (value: string) => {
    setProducts([]);
    setCategory(value);
    refetch();
  };

  return (
    <div className="container-3d space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="card card--hero p-12 text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary)] via-[color:var(--color-accent)] to-[color:var(--color-secondary)] opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
              TaproBuy
      </h1>
            <p className="text-xl md:text-2xl text-muted mb-8 max-w-3xl mx-auto">
              Discover Sri Lanka's finest products in one seamless marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="#deals" 
                className="btn btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fa-solid fa-rocket mr-2" /> Start Shopping
              </motion.a>
              <motion.a 
                href="#categories" 
                className="btn btn-outline text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fa-solid fa-compass mr-2" /> Explore Categories
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-2 relative">
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted"></i>
              <input
                type="text"
                className="input input--sm w-full pl-12"
                placeholder="Search for products..."
                aria-label="Search products"
                onChange={(e) => resetAndSearch(e.target.value)}
              />
            </div>
            <select
              className="input input--sm"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              aria-label="Sort products"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
            <div className="md:col-span-2">
              <CategoryPills categories={categories} selected={category} onSelect={onSelectCategory} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.filter(c => c !== 'all').map((c, index) => (
              <motion.a 
                key={c} 
                className="card p-6 text-center group cursor-pointer"
                href={`/?category=${c}`}
                whileHover={{ y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] flex items-center justify-center text-white text-2xl">
                  <i className="fa-solid fa-tag" />
                </div>
                <div className="font-semibold capitalize text-lg">{c}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Store Highlights */}
      {stores?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Stores</h2>
            <div className="flex gap-6 overflow-x-auto py-4">
              {stores.map((s: any, index: number) => (
                <motion.a 
                  key={s._id} 
                  href={`/stores/${s.slug}`} 
                  className="card p-6 flex items-center justify-center min-w-[140px] cursor-pointer"
                  whileHover={{ y: -8, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  aria-label={s.name}
                >
                  <img src={s.logoUrl} alt={s.name} className="h-12 object-contain" />
                </motion.a>
        ))}
      </div>
          </motion.div>
        </section>
      )}

      {/* Top Deals */}
      <section id="deals" className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">🔥 Hot Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((p, idx) => {
              const safe: any = p || {};
              const key = safe._id || `${idx}`;
              return (
                <motion.div 
                  key={key} 
                  className="card cursor-pointer"
                  whileHover={{ y: -12, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Link to={`/products/${safe._id ?? ''}`} className="block p-6">
                    <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-4 flex items-center justify-center">
                      <i className="fa-solid fa-image text-3xl text-muted" />
                    </div>
                    <div className="font-semibold text-lg mb-2 truncate">{safe.title ?? 'Untitled'}</div>
                    <div className="text-muted mb-3 line-clamp-2">{safe.description ?? ''}</div>
                    <div className="text-2xl font-bold text-[color:var(--color-primary)] mb-4">
                      Rs. {Number(safe.price ?? 0).toLocaleString()}
                    </div>
                  </Link>
                  <div className="px-6 pb-6">
                    <motion.button 
                      className="w-full btn btn-primary"
                      onClick={() => addToCart(safe)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <i className="fa-solid fa-cart-plus mr-2" /> Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]"></div>
            </div>
          )}
          {hasNextPage && (
            <div className="text-center py-8">
              <motion.button 
                className="btn btn-accent text-lg px-8 py-4"
                onClick={loadMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fa-solid fa-arrow-down mr-2" /> Load More
              </motion.button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">✨ Recommended for You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {recommendations.map((p: any, index: number) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/products/${p._id}`} className="card p-4 block cursor-pointer">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-3 flex items-center justify-center">
                      <i className="fa-solid fa-image text-2xl text-muted" />
                    </div>
                    <div className="font-medium truncate mb-1">{p.title}</div>
                    <div className="text-sm text-muted truncate mb-2">{p.description}</div>
                    <div className="font-bold text-[color:var(--color-primary)]">
                      Rs. {Number(p.price ?? 0).toLocaleString()}
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
          </motion.div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="card card--elevated p-8 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted mb-6 text-lg">
              Get the latest deals and product updates delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); }} aria-label="Newsletter signup">
              <input className="flex-1 input" placeholder="your@email.com" type="email" required />
              <motion.button 
                className="btn btn-accent whitespace-nowrap"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;


