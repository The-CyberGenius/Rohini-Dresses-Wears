"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/categories", label: "Categories", icon: "📁" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "📩" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsLoggedIn(!!token);
    setChecking(false);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError("Invalid username or password");
      }
    } catch {
      setLoginError("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsLoggedIn(false);
    router.push("/admin");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-navy-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-heading font-bold text-2xl">R</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Admin Panel</h1>
            <p className="text-navy-300 mt-1">Rohini Dresses & Wears</p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-navy-900 mb-6">Login</h2>
            {loginError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{loginError}</div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Username</label>
                <input
                  required type="text" placeholder="admin"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
                <input
                  required type="password" placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Login</button>
            </form>
            <p className="text-xs text-navy-400 mt-4 text-center">
              Default: admin / rohini@2024
            </p>
          </div>
          <div className="text-center mt-6">
            <Link href="/" className="text-navy-400 hover:text-navy-200 text-sm">← Back to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-navy-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-gold-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-heading font-bold text-navy-900 text-sm">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-navy-50">
          <svg className="w-6 h-6 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-navy-200 transition-transform duration-300`}>
          <div className="p-6 border-b border-navy-100 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-heading font-bold">R</span>
              </div>
              <div>
                <h2 className="font-heading font-bold text-navy-900 text-sm">Admin Panel</h2>
                <p className="text-xs text-navy-400">Rohini Dresses</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-navy-600 hover:bg-navy-50 hover:text-navy-900"
                  }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-navy-100">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm text-navy-500 hover:text-navy-700 rounded-lg hover:bg-navy-50 mb-2">
              🌐 View Website
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 w-full">
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
