"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product, Category } from "@/types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [fabric, setFabric] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    if (fabric !== "all") params.set("fabric", fabric);
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 10000) params.set("maxPrice", String(priceRange[1]));
    params.set("sortBy", sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      });
  }, [category, search, fabric, sortBy, priceRange]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const fabrics = ["all", "Cotton", "Silk", "Polyester Blend", "Cotton Satin", "Georgette", "Rayon", "Net & Satin", "Polyester Blackout", "Sheer Polyester", "Cotton Blend", "Pure Cotton"];

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Our <span className="text-primary-500">Products</span></h1>
          <p className="section-subtitle">सभी प्रोडक्ट्स देखें | Wholesale rates on bulk orders</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products, fabrics, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10"
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field !w-auto min-w-[180px]">
            <option value="name">Sort: Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-outline flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="card p-5 sticky top-24 space-y-6">
              <h3 className="font-heading font-bold text-navy-900 text-lg">Filters</h3>

              {/* Category */}
              <div>
                <h4 className="font-semibold text-navy-800 text-sm mb-2">Category</h4>
                <div className="space-y-1">
                  <button onClick={() => setCategory("all")} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === "all" ? "bg-primary-50 text-primary-700 font-medium" : "text-navy-600 hover:bg-navy-50"}`}>
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setCategory(cat.id)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.id ? "bg-primary-50 text-primary-700 font-medium" : "text-navy-600 hover:bg-navy-50"}`}>
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div>
                <h4 className="font-semibold text-navy-800 text-sm mb-2">Fabric</h4>
                <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="input-field text-sm">
                  {fabrics.map((f) => (
                    <option key={f} value={f}>{f === "all" ? "All Fabrics" : f}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-navy-800 text-sm mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={priceRange[0] || ""} onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])} className="input-field text-sm" />
                  <input type="number" placeholder="Max" value={priceRange[1] === 10000 ? "" : priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])} className="input-field text-sm" />
                </div>
              </div>

              {/* Reset */}
              <button onClick={() => { setCategory("all"); setFabric("all"); setPriceRange([0, 10000]); setSearch(""); }} className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="text-sm text-navy-400 mb-4">{products.length} products found</p>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (<div key={i} className="h-80 rounded-2xl shimmer" />))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-navy-900">No products found</h3>
                <p className="text-navy-500 mt-2">Try changing your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="card card-hover group">
                    <div className="relative h-48 overflow-hidden">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="badge bg-primary-500 text-white text-xs">Wholesale</span>
                        {product.isFeatured && <span className="badge bg-gold-500 text-white text-xs">Featured</span>}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary-500 font-medium mb-1">{product.categoryName}</p>
                      <h3 className="font-semibold text-navy-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                      <p className="text-xs text-navy-400 mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-lg font-bold text-navy-900">₹{product.price}</span>
                          <span className="text-xs text-navy-400 ml-1">/{product.unit}</span>
                        </div>
                        <span className="text-xs text-navy-400">Min: {product.minOrderQty}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-navy-400">{product.fabric}</span>
                        <span className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      {product.bulkPricing.length > 0 && (
                        <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md text-center">
                          Bulk price from ₹{product.bulkPricing[product.bulkPricing.length - 1].pricePerUnit}/{product.unit}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center py-20">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
