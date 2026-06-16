import { XIcon, ArrowLeftIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-base-300 border-b border-base-content/10 px-4 py-3 shrink-0">
      <div className="flex items-center gap-3">
        {/* Back arrow — only visible on mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
          title="Back to chats"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-10 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-base-content leading-tight">{selectedUser.fullName}</h3>
          <p className={`text-xs font-medium ${isOnline ? "text-success" : "text-base-content/50"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close / deselect — visible on md+ */}
      <button
        onClick={() => setSelectedUser(null)}
        className="hidden md:flex btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
        title="Close chat"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
export default ChatHeader;
