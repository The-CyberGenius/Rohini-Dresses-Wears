"use client";
import { useState, useEffect } from "react";
import { Category } from "@/types";

const emptyCategory = { name: "", nameHi: "", description: "", image: "", icon: "📁" };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    fetch("/api/categories").then((r) => r.json()).then((d) => {
      setCategories(d.categories || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyCategory);
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, nameHi: cat.nameHi, description: cat.description, image: cat.image, icon: cat.icon });
    setEditing(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">Categories</h1>
          <p className="text-navy-500 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyCategory); }}
          className="btn-primary text-sm"
        >
          + Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-navy-100 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-navy-900">
                {editing ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-navy-400 hover:text-navy-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Category Name *</label>
                <input required type="text" placeholder="e.g. School Uniforms" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Hindi Name</label>
                <input type="text" placeholder="e.g. स्कूल यूनिफॉर्म" value={form.nameHi} onChange={(e) => setForm({ ...form, nameHi: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Icon (Emoji)</label>
                <input type="text" placeholder="e.g. 🎓" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Image URL or Upload</label>
                <div className="flex gap-2 items-center">
                  <input type="url" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field flex-1" />
                  <span className="text-navy-400 text-sm font-medium">OR</span>
                  <label className="cursor-pointer bg-navy-100 hover:bg-navy-200 text-navy-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                    Upload File
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
                            setForm({ ...form, image: data.url });
                          } else {
                            alert("Upload failed: " + data.error);
                          }
                        } catch (error) {
                          alert("Failed to upload image. Please try again.");
                        } finally {
                          setSaving(false);
                        }
                      }}
                    />
                  </label>
                </div>
                {form.image && <img src={form.image} alt="Preview" className="h-16 mt-2 rounded-lg object-cover border border-navy-100" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Category description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Saving..." : editing ? "Update Category" : "Add Category"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-20 shimmer rounded-xl" />))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-navy-900">No categories yet</h3>
          <p className="text-navy-500 mt-2">Add your first category to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-50 border-b border-navy-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Slug</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Description</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-navy-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-navy-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="font-semibold text-navy-900">{cat.name}</p>
                          <p className="text-xs text-primary-500">{cat.nameHi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-500 hidden md:table-cell">{cat.slug}</td>
                    <td className="px-6 py-4 text-sm text-navy-500 hidden lg:table-cell">
                      <p className="line-clamp-2">{cat.description}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(cat)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">Edit</button>
                        <button onClick={() => handleDelete(cat.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium">Delete</button>
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
