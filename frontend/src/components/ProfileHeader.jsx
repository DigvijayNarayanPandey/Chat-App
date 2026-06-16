import { useState, useRef } from "react";
import { Settings } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import SettingsModal from "./SettingsModal";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { authUser, logout, updateProfile, onlineUsers } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const fileInputRef = useRef(null);

  // The current user is online if their ID is in the onlineUsers array
  const isOnline = onlineUsers.includes(authUser?._id);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

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

  return (
    <>
      <div className="p-4 border-b border-base-content/10 bg-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div className={`avatar ${isOnline ? "online" : "offline"}`}>
              <button
                className="w-12 h-12 rounded-full overflow-hidden relative group"
                onClick={() => fileInputRef.current?.click()}
                title="Change profile photo"
              >
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                  <span className="text-white text-[10px] font-medium">Change</span>
                </div>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* NAME & STATUS */}
            <div className="min-w-0">
              <h3 className="font-semibold text-base-content truncate max-w-[160px]">
                {authUser?.fullName}
              </h3>
              <p className={`text-xs font-medium ${isOnline ? "text-success" : "text-base-content/50"}`}>
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* SETTINGS BUTTON */}
          <button
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch(() => {});
              setIsSettingsOpen(true);
            }}
            title="Settings"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          setTheme={handleThemeChange}
          authUser={authUser}
          isOnline={isOnline}
          isSoundEnabled={isSoundEnabled}
          toggleSound={toggleSound}
          logout={logout}
        />
      )}
    </>
  );
}
export default ProfileHeader;