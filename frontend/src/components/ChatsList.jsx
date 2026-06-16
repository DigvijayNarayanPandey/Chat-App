import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-base-content/5 active:bg-base-content/10 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
            <div className="size-12 rounded-full">
              <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
            </div>
          </div>
          <h4 className="text-base-content font-medium truncate">{chat.fullName}</h4>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
