"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({ name: "", phone: "", email: "", message: "", quantity: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.products || []).find((p: Product) => p.id === params.id);
        setProduct(found || null);
        setLoading(false);
      });
  }, [params.id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...inquiryForm,
        quantity: Number(inquiryForm.quantity) || undefined,
        productId: product?.id,
        productName: product?.name,
      }),
    });
    setSubmitting(false);
    setSubmitted(true);
    setInquiryForm({ name: "", phone: "", email: "", message: "", quantity: "" });
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-96 shimmer rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 shimmer rounded w-3/4" />
            <div className="h-4 shimmer rounded w-1/2" />
            <div className="h-32 shimmer rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-navy-900">Product Not Found</h1>
        <Link href="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
          <Link href="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-500">Products</Link>
          <span>/</span>
          <span className="text-navy-700">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden bg-navy-50">
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge bg-primary-500 text-white">Wholesale</span>
                {product.isFeatured && <span className="badge bg-gold-500 text-white">Featured</span>}
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-primary-500 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-primary-500 font-medium mb-1">{product.categoryName}</p>
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-navy-900">{product.name}</h1>
            <p className="text-primary-600 mt-1">{product.nameHi}</p>
            <p className="text-navy-600 mt-4 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-gold-50 rounded-xl">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-navy-900">₹{product.price}</span>
                <span className="text-navy-500">per {product.unit}</span>
              </div>
              <p className="text-sm text-navy-400 mt-1">Minimum order: {product.minOrderQty} {product.unit}</p>
            </div>

            {/* Bulk Pricing */}
            {product.bulkPricing.length > 0 && (
              <div className="mt-6">
                <h3 className="font-heading font-bold text-navy-900 mb-3">📊 Bulk Pricing (बल्क दाम)</h3>
                <div className="space-y-2">
                  {product.bulkPricing.map((bp, i) => (
                    <div key={i} className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-navy-700">{bp.minQty} - {bp.maxQty === 9999 ? "∞" : bp.maxQty} {product.unit}</span>
                      <span className="font-bold text-green-700">₹{bp.pricePerUnit}/{product.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-navy-50 p-3 rounded-lg">
                <p className="text-xs text-navy-400">Fabric</p>
                <p className="font-semibold text-navy-900 text-sm">{product.fabric}</p>
              </div>
              <div className="bg-navy-50 p-3 rounded-lg">
                <p className="text-xs text-navy-400">Stock</p>
                <p className={`font-semibold text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.stock > 0 ? `${product.stock.toLocaleString()} ${product.unit}` : "Out of Stock"}
                </p>
              </div>
              <div className="bg-navy-50 p-3 rounded-lg">
                <p className="text-xs text-navy-400">Colors</p>
                <p className="font-semibold text-navy-900 text-sm">{product.colors.join(", ")}</p>
              </div>
              <div className="bg-navy-50 p-3 rounded-lg">
                <p className="text-xs text-navy-400">Sizes</p>
                <p className="font-semibold text-navy-900 text-sm">{product.sizes.join(", ")}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/919602911100?text=Hi%20Siddharth%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.name)}.%20Please%20share%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Order on WhatsApp
              </a>
              <a href="tel:+919602911100" className="btn-primary">📞 Call Now</a>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="card p-6 md:p-8">
            <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">Send Inquiry</h2>
            <p className="text-navy-500 text-sm mb-6">इस प्रोडक्ट के बारे में पूछताछ करें</p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-600">Inquiry Sent Successfully!</h3>
                <p className="text-navy-500 mt-2">Siddharth will contact you soon.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline mt-4">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" placeholder="Your Name *" value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="input-field" />
                  <input required type="tel" placeholder="Phone Number *" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} className="input-field" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="email" placeholder="Email (optional)" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="input-field" />
                  <input type="number" placeholder={`Quantity (${product.unit})`} value={inquiryForm.quantity} onChange={(e) => setInquiryForm({ ...inquiryForm, quantity: e.target.value })} className="input-field" />
                </div>
                <textarea required placeholder="Your message / requirements *" rows={4} value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} className="input-field" />
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
