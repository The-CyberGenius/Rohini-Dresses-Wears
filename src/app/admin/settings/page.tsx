"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminSettings() {
  const [heroImages, setHeroImages] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings?key=hero_images");
      const data = await res.json();
      if (data.value && Array.isArray(data.value)) {
        // Ensure there are always exactly 4 slots
        const fetchedUrls = data.value.slice(0, 4);
        while (fetchedUrls.length < 4) fetchedUrls.push("");
        setHeroImages(fetchedUrls);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setSaving(true);
    setMessage("Uploading image...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const newImages = [...heroImages];
        newImages[index] = data.url;
        setHeroImages(newImages);
        setMessage("Image uploaded. Remember to 'Save Changes'!");
      } else {
        setMessage("Upload failed: " + data.error);
      }
    } catch (error) {
      setMessage("Failed to upload image.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("Saving settings...");
    
    // We no longer filter out empty strings. We keep exactly 4 elements.
    const validImages = heroImages.slice(0, 4);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "hero_images",
          value: validImages,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save: " + data.error);
      }
    } catch (error) {
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-navy-900">Site Settings</h1>
        <div className="h-64 shimmer rounded-xl max-w-3xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">Site Settings</h1>
        <p className="text-navy-500 mt-1">Manage global website configurations</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden max-w-4xl">
        <div className="p-6 border-b border-navy-100 flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-navy-900">Homepage Hero Images</h2>
          {message && (
            <span className={`text-sm font-medium px-4 py-2 ${message.includes("success") ? "text-green-600 bg-green-50" : "text-primary-600 bg-primary-50"} rounded-lg`}>
              {message}
            </span>
          )}
        </div>
        
        <div className="p-6">
          <p className="text-navy-500 text-sm mb-6">
            Upload exactly 4 images to showcase in the hero section on the landing page. 
            For best results, use high-quality vertical/square images (e.g. 800x1200 pixels).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {heroImages.map((imgUrl, index) => (
              <div key={index} className="flex flex-col gap-3">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-navy-50 border-2 border-dashed border-navy-200 flex flex-col items-center justify-center">
                  {imgUrl ? (
                    <>
                      <Image src={imgUrl} alt={`Hero ${index + 1}`} fill className="object-cover" />
                      <button 
                        onClick={() => {
                          const newImgs = [...heroImages];
                          newImgs[index] = "";
                          setHeroImages(newImgs);
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md text-xs font-bold transition-colors shadow-md z-10"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="text-navy-300 flex flex-col items-center">
                      <span className="text-3xl mb-2">📸</span>
                      <span className="text-xs font-medium">Image {index + 1}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="url"
                    placeholder="Paste Image URL"
                    value={imgUrl}
                    onChange={(e) => {
                      const newImgs = [...heroImages];
                      newImgs[index] = e.target.value;
                      setHeroImages(newImgs);
                    }}
                    className="input-field text-sm px-3 py-2"
                  />
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-navy-100 flex-1"></div>
                    <span className="text-xs text-navy-400 font-medium">OR</span>
                    <div className="h-px bg-navy-100 flex-1"></div>
                  </div>
                  <label className="w-full cursor-pointer bg-navy-100 hover:bg-navy-200 text-navy-700 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    {saving && imgUrl === "" ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={saving}
                      onChange={(e) => handleImageUpload(index, e)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-navy-100 flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Processing..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
