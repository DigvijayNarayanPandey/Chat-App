import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings, LogOutIcon, Volume2Icon, VolumeOffIcon, X, Camera, Trash2, User, Mail, CalendarDays, Wifi } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween",
  "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
  "wireframe", "black", "luxury", "dracula", "cmyk", "autumn",
  "business", "acid", "lemonade", "night", "coffee", "winter",
  "dim", "nord", "sunset",
];

const SettingsModal = ({ isOpen, onClose, theme, setTheme, authUser, isOnline, isSoundEnabled, toggleSound, logout }) => {
  const { updateProfile } = useAuthStore();
  const fileInputRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);

  if (!isOpen) return null;

  const joinDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
      setSelectedImg(null);
    };
  };

  const handleDeletePhoto = async () => {
    if (confirm("Delete your profile photo?")) {
      setSelectedImg(null);
      await updateProfile({ deletePic: true });
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-base-200 border border-base-content/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 bg-base-300">
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-base-content">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Bigger avatar: 128px */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 bg-base-300 shadow-xl">
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt={authUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Photo action buttons */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary btn-sm btn-circle shadow-md"
                  title="Upload new photo"
                >
                  <Camera className="size-4" />
                </button>
                {authUser?.profilePic && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="btn btn-error btn-sm btn-circle shadow-md"
                    title="Delete photo"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Info — form-style */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/40">Profile</h3>

            {/* Full Name */}
            <div className="flex items-center gap-3 bg-base-300 rounded-xl px-4 py-3">
              <User className="size-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-base-content/40 font-medium">Full Name</p>
                <p className="text-sm font-semibold text-base-content truncate">{authUser?.fullName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 bg-base-300 rounded-xl px-4 py-3">
              <Mail className="size-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-base-content/40 font-medium">Email</p>
                <p className="text-sm font-semibold text-base-content truncate">{authUser?.email}</p>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-3 bg-base-300 rounded-xl px-4 py-3">
              <CalendarDays className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-base-content/40 font-medium">Member Since</p>
                <p className="text-sm font-semibold text-base-content">{joinDate}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 bg-base-300 rounded-xl px-4 py-3">
              <Wifi className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-base-content/40 font-medium">Status</p>
                <p className={`text-sm font-semibold ${isOnline ? "text-success" : "text-base-content/50"}`}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="divider my-0" />

          {/* Theme Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/40">Appearance</h3>
            <label className="text-sm font-medium text-base-content">Theme</label>
            <select
              className="select select-bordered w-full"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="divider my-0" />

          {/* Sound & Logout */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/40">Preferences</h3>

            <div className="flex items-center justify-between bg-base-300 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-base-content">Sound Effects</span>
              <button
                onClick={() => {
                  mouseClickSound.currentTime = 0;
                  mouseClickSound.play().catch(() => {});
                  toggleSound();
                }}
                className={`btn btn-sm btn-circle ${isSoundEnabled ? "btn-primary" : "btn-ghost"}`}
                title={isSoundEnabled ? "Disable sound" : "Enable sound"}
              >
                {isSoundEnabled ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
              </button>
            </div>

            <button
              onClick={logout}
              className="btn btn-error btn-outline w-full gap-2"
            >
              <LogOutIcon className="size-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;