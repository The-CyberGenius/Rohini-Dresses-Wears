"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => {
      setCategories(d.categories || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Our <span className="text-primary-500">Categories</span></h1>
          <p className="section-subtitle">हमारी सभी कैटेगरी | Browse our wide range of wholesale products</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (<div key={i} className="h-64 shimmer rounded-2xl" />))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="card card-hover group overflow-hidden">
                <div className="relative h-48">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <h3 className="text-xl font-heading font-bold text-white">{cat.name}</h3>
                        <p className="text-primary-300 text-sm">{cat.nameHi}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-navy-600 text-sm">{cat.description}</p>
                  <div className="mt-3 flex items-center text-primary-500 text-sm font-medium group-hover:text-primary-600">
                    View Products →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
