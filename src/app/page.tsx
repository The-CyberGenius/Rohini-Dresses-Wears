"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category, Product } from "@/types";

function AnimatedCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-5xl font-heading font-bold text-primary-500">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-navy-400 mt-1 text-sm md:text-base">{label}</div>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/products?featured=true").then((r) => r.json()),
    ]).then(([catData, prodData]) => {
      setCategories(catData.categories || []);
      setFeaturedProducts(prodData.products || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-gold-400 to-primary-500" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                Wholesale Supplier Since 2010
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
                Rohini{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400">
                  Dresses
                </span>
                <br />& Wears
              </h1>
              <p className="mt-6 text-lg md:text-xl text-navy-200 leading-relaxed max-w-lg">
                Premium wholesale clothing, school uniforms, hotel bedsheets, curtains, sarees & fabrics.
                <span className="text-primary-300 font-medium"> Best prices guaranteed</span> for bulk orders.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/products" className="btn-primary text-lg">
                  View Products
                </Link>
                <a
                  href="https://wa.me/919602911100?text=Hi%20Siddharth%2C%20I%20want%20to%20place%20a%20bulk%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order on WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-6 mt-10 text-navy-300">
                {["Bulk Orders", "Best Prices", "Pan Delhi Delivery"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-gold-500/20 rounded-3xl blur-xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden shadow-2xl h-48">
                      <Image src="https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=400&h=300&fit=crop" alt="School Uniforms" width={400} height={300} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl h-64">
                      <Image src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop" alt="Sarees" width={400} height={400} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden shadow-2xl h-64">
                      <Image src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop" alt="Bedsheets" width={400} height={400} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl h-48">
                      <Image src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" alt="Fabrics" width={400} height={300} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter target={14} label="Years Experience" suffix="+" />
            <AnimatedCounter target={5000} label="Happy Clients" suffix="+" />
            <AnimatedCounter target={50000} label="Products Delivered" suffix="+" />
            <AnimatedCounter target={200} label="Schools Served" suffix="+" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-navy-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our <span className="text-primary-500">Categories</span></h2>
            <p className="section-subtitle">हमारी सभी कैटेगरी देखें</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (<div key={i} className="h-48 rounded-2xl shimmer" />))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.id}`} className="group card card-hover p-4 text-center">
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{cat.icon}</div>
                  <h3 className="font-semibold text-navy-900 text-sm md:text-base">{cat.name}</h3>
                  <p className="text-xs text-primary-500 mt-1">{cat.nameHi}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div>
              <h2 className="section-title">Featured <span className="text-primary-500">Products</span></h2>
              <p className="section-subtitle">हमारे बेस्ट सेलिंग प्रोडक्ट्स</p>
            </div>
            <Link href="/products" className="btn-outline mt-4 md:mt-0">View All Products →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (<div key={i} className="h-80 rounded-2xl shimmer" />))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="card card-hover group">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="badge bg-primary-500 text-white text-xs">Wholesale</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary-500 font-medium mb-1">{product.categoryName}</p>
                    <h3 className="font-semibold text-navy-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                    <p className="text-xs text-navy-400 mt-1">{product.nameHi}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-lg font-bold text-navy-900">₹{product.price}</span>
                        <span className="text-xs text-navy-400 ml-1">/{product.unit}</span>
                      </div>
                      <span className="text-xs text-navy-400">Min: {product.minOrderQty} {product.unit}</span>
                    </div>
                    {product.bulkPricing.length > 0 && (
                      <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        Bulk: ₹{product.bulkPricing[product.bulkPricing.length - 1].pricePerUnit}/{product.unit}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-navy-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose <span className="text-primary-500">Us?</span></h2>
            <p className="section-subtitle">हमें क्यों चुनें?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "💰", title: "Wholesale Prices", titleHi: "थोक दाम", desc: "Best wholesale rates in Delhi NCR. Direct manufacturer prices with no middlemen." },
              { icon: "🏆", title: "Premium Quality", titleHi: "उत्तम गुणवत्ता", desc: "Only premium quality fabrics and materials. Every product passes quality checks." },
              { icon: "🚚", title: "Fast Delivery", titleHi: "तेज़ डिलीवरी", desc: "Quick delivery across Delhi NCR. Bulk orders delivered within 3-5 business days." },
              { icon: "🤝", title: "Trusted Since 2010", titleHi: "2010 से विश्वसनीय", desc: "14+ years of experience serving schools, hotels, and retailers. 5000+ happy clients." },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center group hover:bg-gradient-to-br hover:from-navy-900 hover:to-navy-800">
                <div className="text-4xl mb-4 group-hover:animate-bounce-gentle">{item.icon}</div>
                <h3 className="font-heading font-bold text-navy-900 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-primary-500 text-sm mt-1">{item.titleHi}</p>
                <p className="text-navy-500 group-hover:text-navy-200 text-sm mt-3 transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our <span className="text-primary-500">Clients Say</span></h2>
            <p className="section-subtitle">हमारे ग्राहकों की राय</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rajesh Sharma", role: "Principal, DPS Rohini", text: "We have been ordering school uniforms from Rohini Dresses for 5 years. Excellent quality and always on time delivery.", rating: 5 },
              { name: "Hotel Royal Palace", role: "Purchase Manager", text: "Best wholesale supplier for hotel bedsheets and curtains. Siddharth ji always provides premium quality at competitive prices.", rating: 5 },
              { name: "Priya Gupta", role: "Retail Shop Owner", text: "I buy sarees and dress materials in bulk. The variety and quality is amazing. Best wholesale prices in Rohini area.", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-navy-600 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-navy-100">
                  <p className="font-semibold text-navy-900">{t.name}</p>
                  <p className="text-xs text-navy-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-navy-900 to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-gold-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to Place Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400">Bulk Order?</span>
          </h2>
          <p className="text-navy-200 text-lg mb-8 max-w-2xl mx-auto">Contact Siddharth directly for the best wholesale prices. Free samples available for bulk orders!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/919602911100?text=Hi%20Siddharth%2C%20I%20want%20to%20discuss%20a%20bulk%20order" target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp Now
            </a>
            <a href="tel:+919602911100" className="btn-primary text-lg">📞 Call Now</a>
            <Link href="/contact" className="btn-outline text-lg !border-white !text-white hover:!bg-white hover:!text-navy-900">Send Inquiry</Link>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919602911100" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse-gold">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </div>
  );
}
