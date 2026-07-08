import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      // Mark messages as read when user opens a chat
      try {
        await axiosInstance.patch(`/messages/read/${selectedUser._id}`);
        // Emit socket event to notify the other user that messages have been read
        const socket = useAuthStore.getState().socket;
        if (socket) {
          const { authUser } = useAuthStore.getState();
          socket.emit("messagesRead", {
            readerId: authUser._id,
            chatUserId: selectedUser._id,
          });
        }
      } catch (error) {
        console.error("Failed to mark messages as read:", error);
      }
    }
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      // Replace the optimistic temp message with the real message from the server
      // Uses get().messages (live state) instead of the stale `messages` closure
      set({ messages: get().messages.map((msg) => (msg._id === tempId ? res.data : msg)) });
    } catch (error) {
      // Remove only the optimistic message on failure, preserving any other new messages
      set({ messages: get().messages.filter((msg) => msg._id !== tempId) });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", async (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      // Since the chat is open, mark the message as read on backend and emit read receipt in real-time
      try {
        await axiosInstance.patch(`/messages/read/${selectedUser._id}`);
        if (socket) {
          const { authUser } = useAuthStore.getState();
          socket.emit("messagesRead", {
            readerId: authUser._id,
            chatUserId: selectedUser._id,
          });
        }
      } catch (error) {
        console.error("Failed to mark incoming message as read:", error);
      }

      // Always read the CURRENT value of isSoundEnabled (avoid stale closure)
      if (get().isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
