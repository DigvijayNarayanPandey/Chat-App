import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-1 p-2 m-2 bg-base-200 rounded-xl">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
          activeTab === "chats"
            ? "bg-primary text-primary-content shadow-sm"
            : "text-base-content/60 hover:text-base-content hover:bg-base-content/5"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
          activeTab === "contacts"
            ? "bg-primary text-primary-content shadow-sm"
            : "text-base-content/60 hover:text-base-content hover:bg-base-content/5"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
