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
    <div className="flex w-full h-screen overflow-hidden bg-base-200">
      {/*
        SIDEBAR — always visible on md+.
        On mobile: visible ONLY when no user is selected (selectedUser === null).
        When a user is selected on mobile, the chat panel slides in.
      */}
      <div
        className={`
          ${selectedUser ? "hidden" : "flex"} md:flex
          w-full md:w-72 lg:w-80 shrink-0
          bg-base-300 flex-col border-r border-base-content/10
        `}
      >
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/*
        CHAT PANEL — always visible on md+.
        On mobile: visible ONLY when a user is selected.
      */}
      <div
        className={`
          ${selectedUser ? "flex" : "hidden"} md:flex
          flex-1 flex-col bg-base-100 min-w-0
        `}
      >
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}
export default ChatPage;
