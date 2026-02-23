"use client";
import { useState, useEffect } from "react";
import { Inquiry } from "@/types";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchInquiries = () => {
    fetch("/api/inquiries").then((r) => r.json()).then((d) => {
      setInquiries(d.inquiries || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    await fetch("/api/inquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchInquiries();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
    fetchInquiries();
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    closed: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">Inquiries</h1>
          <p className="text-navy-500 mt-1">{inquiries.length} total inquiries</p>
        </div>
        <div className="flex gap-2">
          {["all", "new", "contacted", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === s ? "bg-primary-500 text-white" : "bg-white text-navy-600 hover:bg-navy-50 border border-navy-200"
              }`}
            >
              {s} {s !== "all" && `(${inquiries.filter((i) => i.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (<div key={i} className="h-32 shimmer rounded-xl" />))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="text-5xl mb-4">📩</div>
          <h3 className="text-xl font-semibold text-navy-900">No inquiries found</h3>
          <p className="text-navy-500 mt-2">
            {filter !== "all" ? "Try changing the filter" : "Inquiries will appear here when customers submit them"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => (
            <div key={inq.id} className="bg-white rounded-2xl shadow-sm border border-navy-100 p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-navy-900">{inq.name}</h3>
                    <span className={`badge text-xs capitalize ${statusColors[inq.status] || "bg-navy-100 text-navy-600"}`}>
                      {inq.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-navy-500 mb-3">
                    <span>📞 {inq.phone}</span>
                    {inq.email && <span>✉️ {inq.email}</span>}
                    {inq.productName && <span>📦 {inq.productName}</span>}
                    {inq.quantity && <span>🔢 Qty: {inq.quantity}</span>}
                  </div>
                  <p className="text-navy-600 text-sm bg-navy-50 p-3 rounded-lg">{inq.message}</p>
                  <p className="text-xs text-navy-400 mt-2">
                    {new Date(inq.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {inq.status !== "contacted" && (
                    <button onClick={() => updateStatus(inq.id, "contacted")} className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-100 font-medium">
                      Mark Contacted
                    </button>
                  )}
                  {inq.status !== "closed" && (
                    <button onClick={() => updateStatus(inq.id, "closed")} className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium">
                      Mark Closed
                    </button>
                  )}
                  {inq.status === "closed" && (
                    <button onClick={() => updateStatus(inq.id, "new")} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">
                      Reopen
                    </button>
                  )}
                  <a
                    href={`https://wa.me/91${inq.phone}?text=Hi%20${encodeURIComponent(inq.name)}%2C%20regarding%20your%20inquiry%20on%20Rohini%20Dresses...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium"
                  >
                    WhatsApp
                  </a>
                  <button onClick={() => handleDelete(inq.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
