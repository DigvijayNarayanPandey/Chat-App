import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* LEFT SIDE */}
      <div className={`w-full md:w-80 bg-base-200/50 backdrop-blur-sm flex flex-col md:border-r border-base-content/10 ${selectedUser ? "hidden md:flex" : "flex"}`}>
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={`flex-1 flex flex-col bg-base-100/50 backdrop-blur-sm ${selectedUser ? "flex" : "hidden md:flex"}`}>
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}
export default ChatPage;
