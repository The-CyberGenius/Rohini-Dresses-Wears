export default function AboutPage() {
  return (
    <div className="pt-20 md:pt-24 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-950 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-60 h-60 bg-primary-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400">Rohini Dresses</span>
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Your trusted wholesale partner since 2015. Providing premium quality clothing and fabrics at unbeatable wholesale prices.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Our <span className="text-primary-500">Story</span></h2>
              <div className="space-y-4 text-navy-600 leading-relaxed">
                <p>
                  <strong className="text-navy-900">Rohini Dresses & Wears</strong> was founded in 2015 by <strong className="text-primary-600">Siddharth</strong> with a vision to provide
                  the best quality wholesale clothing at affordable prices to businesses across India.
                </p>
                <p>
                  Starting from a small shop in Rohini, we have grown into one of the most trusted wholesale
                  clothing suppliers in India. Today, we serve over 10,000 clients including schools, hotels,
                  retailers, and institutional buyers.
                </p>
                <p>
                  Our product range covers everything from school uniforms and hotel bedsheets to sarees, dress materials,
                  curtains, and ready-made dresses. We believe in building long-term relationships with our clients
                  through quality, reliability, and competitive pricing.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "14+", label: "Years in Business", icon: "📅" },
                { num: "5000+", label: "Happy Clients", icon: "😊" },
                { num: "50K+", label: "Products Delivered", icon: "📦" },
                { num: "200+", label: "Schools Served", icon: "🏫" },
              ].map((stat, i) => (
                <div key={i} className="card p-6 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-heading font-bold text-primary-500">{stat.num}</div>
                  <div className="text-sm text-navy-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Owner */}
        <section className="py-16 border-t border-navy-100">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-heading font-bold text-3xl">S</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-navy-900 mb-2">Siddharth</h2>
            <p className="text-primary-500 font-medium mb-4">Founder & Owner</p>
            <p className="text-navy-600 leading-relaxed max-w-xl mx-auto">
              With over 10 years of experience in the wholesale clothing industry, Siddharth has built
              Rohini Dresses & Wears into a name synonymous with quality and trust. His hands-on approach
              and commitment to customer satisfaction has earned the business a loyal clientele across India.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <a href="tel:+919602911100" className="btn-primary">📞 Call Siddharth</a>
              <a href="https://wa.me/919602911100" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 border-t border-navy-100">
          <h2 className="section-title text-center mb-12">What We <span className="text-primary-500">Offer</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎓", title: "School Uniforms", desc: "Complete school uniform solutions for schools. Shirts, trousers, pinafores, ties, belts - everything at wholesale rates." },
              { icon: "🛏️", title: "Hotel Bedsheets", desc: "Premium hotel-grade bedsheets, pillow covers, and towels. White, colored, and custom printed options." },
              { icon: "🪟", title: "Curtains", desc: "Blackout, sheer, and decorative curtains for hotels, offices, and homes. Bulk orders welcome." },
              { icon: "👗", title: "Sarees", desc: "Banarasi, cotton, georgette, chiffon - wide range of sarees for retailers at wholesale prices." },
              { icon: "🧵", title: "Dress Materials", desc: "Quality fabrics by the meter - cotton, silk, polyester, georgette, and more." },
              { icon: "👘", title: "Ready-made Dresses", desc: "Trendy ready-made kurtis, suits, and kids wear. Latest designs at best wholesale rates." },
            ].map((item, i) => (
              <div key={i} className="card p-6 hover:bg-primary-50 transition-colors">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-heading font-bold text-navy-900">{item.title}</h3>
                <p className="text-navy-500 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
