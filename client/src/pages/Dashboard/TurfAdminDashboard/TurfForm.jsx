import React, { useState, useEffect, useRef } from "react";
import { X, Save, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../config/Api";
import { useAuth } from "../../../context/AuthContext";

const PLACEHOLDER_SVG = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'>
    <rect width='100%' height='100%' fill='#f3f4f6'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial, Helvetica, sans-serif' font-size='20'>No Image Selected</text>
  </svg>`
);

export default function TurfForm({ isOpen, onClose, onTurfAdded, editingTurf, darkMode }) {
  const { user, role } = useAuth();
  const isAdmin = role === "admin" || user?.role === "admin";
  const [form, setForm] = useState({
    name: "",
    location: "",
    pricePerHour: "",
    sportType: "football",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTurf) {
      setForm({
        name: editingTurf.name || "",
        location: editingTurf.location || "",
        pricePerHour: editingTurf.pricePerHour || "",
        sportType: editingTurf.sportType || "football",
        description: editingTurf.description || "",
        image: editingTurf.image || null,
      });
      setPreview(editingTurf.image || null);
    } else {
      setForm({
        name: "",
        location: "",
        pricePerHour: "",
        sportType: "football",
        description: "",
        image: null,
      });
      setPreview(null);
    }
  }, [editingTurf, isOpen]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.debug('TurfForm: selected file', file);
      setForm({ ...form, image: file });
      // revoke previous blob preview if any
      try { if (previewRef.current && previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current); } catch (e) {}
      const objUrl = URL.createObjectURL(file);
      previewRef.current = objUrl;
      setPreview(objUrl);
      // Also read as data URL as a fallback for environments where blob URLs don't render
      try {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev?.target?.result) {
            // replace the preview with data URL (smaller images OK)
            previewRef.current = ev.target.result;
            setPreview(ev.target.result);
          }
        };
        reader.readAsDataURL(file);
      } catch (e) {
        // ignore FileReader failures
      }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Debug: token before submit ->', localStorage.getItem('token'));
    try {
      // prevent non-admins from submitting
      if (!isAdmin) {
        toast.error("Only admins can add or edit turfs");
        setLoading(false);
        return;
      }

      // Basic client-side validation
      if (!form.name || !form.location || !form.pricePerHour) {
        toast.error('Please fill required fields: name, location, price');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      // Append only defined fields
      Object.entries(form).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        // for files, append the File object; for arrays or objects, stringify
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      const config = {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
        },
      };

      let res;
      if (editingTurf) {
        res = await api.put(`/api/turfs/${editingTurf._id}`, formData, config);
        console.debug('TurfForm: update response', res?.data);
      } else {
        res = await api.post(`/api/turfs`, formData, config);
        console.debug('TurfForm: create response', res?.data);
      }

      // Debug: log imageUrl and turf object
      if (res?.data) {
        console.debug('TurfForm: server returned imageUrl:', res.data.imageUrl);
        console.debug('TurfForm: server returned turf.images:', res.data.turf?.images);
      }
      if (res?.data?.imageUrl) {
        try { if (previewRef.current && previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current); } catch (e) {}
        previewRef.current = null;
        setPreview(res.data.imageUrl);
      }

      toast.success(editingTurf ? "Turf updated" : "Turf created");
      onTurfAdded && onTurfAdded();
      onClose && onClose();
    } catch (err) {
      console.error("Save turf error:", err);
      const msg = err.response?.data?.message || err.message || "Could not save turf";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview object URL on unmount
  useEffect(() => {
    return () => {
      try { if (previewRef.current && previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current); } catch (e) {}
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

          <motion.form
            onSubmit={submit}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative z-10 w-full max-w-lg p-6 rounded-2xl shadow-xl ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingTurf ? "Edit Turf" : "Add New Turf"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Turf Name"
                className={`w-full px-4 py-2 border rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              />

              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
                className={`w-full px-4 py-2 border rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              />

              <input
                type="number"
                required
                value={form.pricePerHour}
                onChange={(e) =>
                  setForm({ ...form, pricePerHour: e.target.value })
                }
                placeholder="Price Per Hour (₹)"
                className={`w-full px-4 py-2 border rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              />

              <select
                value={form.sportType}
                onChange={(e) =>
                  setForm({ ...form, sportType: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <option value="football">Football</option>
                <option value="cricket">Cricket</option>
                <option value="basketball">Basketball</option>
                <option value="volleyball">Volleyball</option>
                <option value="badminton">Badminton</option>
                <option value="tennis">Tennis</option>
              </select>

              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className={`w-full px-4 py-2 border rounded-lg resize-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              ></textarea>

              {/* Image Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  id="turf-image"
                  className="hidden"
                />
                <label
                  htmlFor="turf-image"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    {preview ? "Change Image" : "Upload Turf Image"}
                  </span>
                </label>

                {/* Always render an image element — use placeholder if no preview */}
                <img
                  src={preview || PLACEHOLDER_SVG}
                  alt={preview ? "Preview" : "No preview"}
                  className="w-full h-40 object-cover rounded-lg mt-3"
                />
                {/* Show filename for debugging */}
                {form.image && form.image.name && (
                  <div className="text-xs text-gray-500 mt-2">Selected: {form.image.name}</div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 shadow-md"
              >
                {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
