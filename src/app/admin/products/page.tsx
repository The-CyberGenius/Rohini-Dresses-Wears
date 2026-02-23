"use client";
import { useState, useEffect } from "react";
import { Product, Category } from "@/types";

const emptyProduct = {
  name: "", nameHi: "", description: "", categoryId: "", categoryName: "",
  images: [""], price: 0, fabric: "", colors: [""], sizes: [""],
  minOrderQty: 10, stock: 0, unit: "pieces", isFeatured: false,
  bulkPricing: [{ minQty: 0, maxQty: 0, pricePerUnit: 0 }],
  tags: [""],
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = () => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([prodData, catData]) => {
      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const selectedCat = categories.find((c) => c.id === form.categoryId);
    const payload = {
      ...form,
      categoryName: selectedCat?.name || "",
      images: form.images.filter((i) => i.trim()),
      colors: form.colors.filter((c) => c.trim()),
      sizes: form.sizes.filter((s) => s.trim()),
      tags: form.tags.filter((t) => t.trim()),
      bulkPricing: form.bulkPricing.filter((bp) => bp.minQty > 0),
    };

    if (editing) {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...payload }),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyProduct);
    fetchData();
  };

  const handleEdit = (prod: Product) => {
    setForm({
      name: prod.name, nameHi: prod.nameHi, description: prod.description,
      categoryId: prod.categoryId, categoryName: prod.categoryName,
      images: prod.images.length ? prod.images : [""],
      price: prod.price, fabric: prod.fabric,
      colors: prod.colors.length ? prod.colors : [""],
      sizes: prod.sizes.length ? prod.sizes : [""],
      minOrderQty: prod.minOrderQty, stock: prod.stock, unit: prod.unit,
      isFeatured: prod.isFeatured,
      bulkPricing: prod.bulkPricing.length ? prod.bulkPricing : [{ minQty: 0, maxQty: 0, pricePerUnit: 0 }],
      tags: prod.tags.length ? prod.tags : [""],
    });
    setEditing(prod.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">Products & Inventory</h1>
          <p className="text-navy-500 mt-1">{products.length} products total</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyProduct); }} className="btn-primary text-sm">
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text" placeholder="Search products..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-navy-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-heading font-bold text-navy-900">
                {editing ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-navy-400 hover:text-navy-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Product Name *</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Hindi Name</label>
                  <input type="text" value={form.nameHi} onChange={(e) => setForm({ ...form, nameHi: e.target.value })} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Category *</label>
                <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field">
                  <option value="">Select Category</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.icon} {c.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Price (₹) *</label>
                  <input required type="number" min={0} value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Min Order Qty</label>
                  <input type="number" min={1} value={form.minOrderQty} onChange={(e) => setForm({ ...form, minOrderQty: Number(e.target.value) })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Stock</label>
                  <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field">
                    <option value="pieces">Pieces</option>
                    <option value="sets">Sets</option>
                    <option value="meters">Meters</option>
                    <option value="pairs">Pairs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Fabric</label>
                <input type="text" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} className="input-field" placeholder="e.g. Cotton, Silk" />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Images</label>
                <div className="space-y-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <div className="flex-1 flex gap-2 items-center w-full">
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={img}
                          onChange={(e) => {
                            const newImgs = [...form.images];
                            newImgs[i] = e.target.value;
                            setForm({ ...form, images: newImgs });
                          }}
                          className="input-field flex-1"
                        />
                        <span className="text-navy-400 text-sm font-medium whitespace-nowrap">OR</span>
                        <label className="cursor-pointer bg-navy-100 hover:bg-navy-200 text-navy-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              const formData = new FormData();
                              formData.append("file", file);

                              setSaving(true);
                              try {
                                const res = await fetch("/api/upload", {
                                  method: "POST",
                                  body: formData,
                                });
                                const data = await res.json();
                                if (data.success) {
                                  const newImgs = [...form.images];
                                  newImgs[i] = data.url;
                                  setForm({ ...form, images: newImgs });
                                } else {
                                  alert("Upload failed: " + data.error);
                                }
                              } catch (error) {
                                alert("Failed to upload image.");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Image Preview & Delete */}
                      <div className="flex items-center gap-2">
                        {img && <img src={img} alt="" className="h-10 w-10 object-cover rounded border border-navy-100" />}
                        {form.images.length > 1 && (
                          <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} className="text-red-500 hover:text-red-700 px-2 font-bold p-2 bg-red-50 rounded-lg">✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setForm({ ...form, images: [...form.images, ""] })} className="text-sm border border-primary-200 bg-primary-50 text-primary-700 px-4 py-2 mt-3 rounded-lg font-medium hover:bg-primary-100 transition-colors inline-block">+ Add Another Image</button>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Colors (comma separated)</label>
                <input type="text" value={form.colors.join(", ")} onChange={(e) => setForm({ ...form, colors: e.target.value.split(",").map((s) => s.trim()) })} className="input-field" placeholder="Red, Blue, Green" />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Sizes (comma separated)</label>
                <input type="text" value={form.sizes.join(", ")} onChange={(e) => setForm({ ...form, sizes: e.target.value.split(",").map((s) => s.trim()) })} className="input-field" placeholder="S, M, L, XL" />
              </div>

              {/* Bulk Pricing */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Bulk Pricing Tiers</label>
                {form.bulkPricing.map((bp, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input type="number" placeholder="Min Qty" value={bp.minQty || ""} onChange={(e) => {
                      const newBp = [...form.bulkPricing]; newBp[i] = { ...newBp[i], minQty: Number(e.target.value) }; setForm({ ...form, bulkPricing: newBp });
                    }} className="input-field text-sm" />
                    <input type="number" placeholder="Max Qty" value={bp.maxQty || ""} onChange={(e) => {
                      const newBp = [...form.bulkPricing]; newBp[i] = { ...newBp[i], maxQty: Number(e.target.value) }; setForm({ ...form, bulkPricing: newBp });
                    }} className="input-field text-sm" />
                    <input type="number" placeholder="Price/unit" value={bp.pricePerUnit || ""} onChange={(e) => {
                      const newBp = [...form.bulkPricing]; newBp[i] = { ...newBp[i], pricePerUnit: Number(e.target.value) }; setForm({ ...form, bulkPricing: newBp });
                    }} className="input-field text-sm" />
                    {form.bulkPricing.length > 1 && (
                      <button type="button" onClick={() => setForm({ ...form, bulkPricing: form.bulkPricing.filter((_, j) => j !== i) })} className="text-red-500 px-2 shrink-0">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setForm({ ...form, bulkPricing: [...form.bulkPricing, { minQty: 0, maxQty: 0, pricePerUnit: 0 }] })} className="text-sm text-primary-600 font-medium">+ Add Tier</button>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Tags (comma separated)</label>
                <input type="text" value={form.tags.join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((s) => s.trim()) })} className="input-field" />
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-5 h-5 rounded border-navy-300 text-primary-500 focus:ring-primary-400" />
                <span className="text-sm font-medium text-navy-700">Featured Product</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (<div key={i} className="h-16 shimmer rounded-xl" />))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-navy-900">No products found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-50 border-b border-navy-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden sm:table-cell">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Featured</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-navy-900 text-sm">{p.name}</p>
                        <p className="text-xs text-navy-400">{p.fabric} | Min: {p.minOrderQty} {p.unit}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-navy-500 hidden md:table-cell">{p.categoryName}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy-900">₹{p.price}</td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className={`text-sm font-medium ${p.stock > 100 ? "text-green-600" : p.stock > 0 ? "text-orange-500" : "text-red-500"}`}>
                        {p.stock.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {p.isFeatured ? <span className="text-gold-500">⭐</span> : <span className="text-navy-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
