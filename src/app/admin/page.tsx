"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalInquiries: number;
  newInquiries: number;
  totalStock: number;
  featuredProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/inquiries").then((r) => r.json()),
    ]).then(([prodData, catData, inqData]) => {
      const products = prodData.products || [];
      const categories = catData.categories || [];
      const inquiries = inqData.inquiries || [];
      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalInquiries: inquiries.length,
        newInquiries: inquiries.filter((i: { status: string }) => i.status === "new").length,
        totalStock: products.reduce((sum: number, p: { stock: number }) => sum + p.stock, 0),
        featuredProducts: products.filter((p: { isFeatured: boolean }) => p.isFeatured).length,
      });
    });
  }, []);

  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="h-8 shimmer rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (<div key={i} className="h-32 shimmer rounded-2xl" />))}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "bg-blue-50 text-blue-700", link: "/admin/products" },
    { label: "Categories", value: stats.totalCategories, icon: "📁", color: "bg-purple-50 text-purple-700", link: "/admin/categories" },
    { label: "Total Inquiries", value: stats.totalInquiries, icon: "📩", color: "bg-green-50 text-green-700", link: "/admin/inquiries" },
    { label: "New Inquiries", value: stats.newInquiries, icon: "🔔", color: "bg-red-50 text-red-700", link: "/admin/inquiries" },
    { label: "Total Stock", value: stats.totalStock.toLocaleString(), icon: "📊", color: "bg-orange-50 text-orange-700", link: "/admin/products" },
    { label: "Featured Products", value: stats.featuredProducts, icon: "⭐", color: "bg-yellow-50 text-yellow-700", link: "/admin/products" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">Dashboard</h1>
        <p className="text-navy-500 mt-1">Welcome back, Siddharth! Here&apos;s your business overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <Link key={i} href={card.link} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-navy-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-500">{card.label}</p>
                <p className="text-3xl font-heading font-bold text-navy-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-heading font-bold text-navy-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="btn-primary text-sm">+ Add Product</Link>
          <Link href="/admin/categories" className="btn-secondary text-sm">+ Add Category</Link>
          <Link href="/admin/inquiries" className="btn-outline text-sm">View Inquiries</Link>
          <Link href="/" target="_blank" rel="noopener noreferrer" className="bg-navy-100 text-navy-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-200 transition-colors">
            🌐 View Website
          </Link>
        </div>
      </div>
    </div>
  );
}
