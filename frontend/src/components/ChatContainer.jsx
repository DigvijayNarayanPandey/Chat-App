import { useEffect, useRef, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Check, CheckCheck } from "lucide-react";

function ChatContainer() {
  // Get state values from the hook
  const {
    selectedUser,
    messages,
    isMessagesLoading,
  } = useChatStore();

  // Get API functions from the store's getState
  const chatStoreApi = useChatStore.getState();
  const {
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = chatStoreApi;

  // Get authUser and socket from auth store
  const { authUser } = useAuthStore();
  const authStoreApi = useAuthStore.getState();
  const { socket } = authStoreApi;

  const messageEndRef = useRef(null);

  // Helper function to format date header
  const getDateHeader = (date) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const thisWeek = new Date(Date.now() - 7 * 86400000).toDateString();

    if (date === today) return "Today";
    if (date === yesterday) return "Yesterday";
    if (date > thisWeek) {
      // Return day name (Mon, Tue, etc.)
      return new Date(date).toLocaleDateString('en-GB', { weekday: 'long' });
    }
    // Return short date format (e.g., 10/25 or 10/25/23)
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Process messages to add date headers
  const processedMessages = useMemo(() => {
    const processed = [];
    let previousDate = null;

    messages.forEach((msg) => {
      const messageDate = new Date(msg.createdAt).toDateString();
      if (previousDate !== messageDate) {
        processed.push({ type: 'date', date: messageDate });
        previousDate = messageDate;
      }
      processed.push({ type: 'message', message: msg });
    });

    return processed;
  }, [messages]);

  // Fetch messages and subscribe to new messages when selectedUser changes
  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // Cleanup
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Listen for read receipts to update messages when the other user reads our messages
  useEffect(() => {
    const handleMessagesRead = ({ readerId }) => {
      // If we are the reader or the readerId doesn't match the selected user, ignore
      if (authUser._id === readerId || readerId !== selectedUser._id) {
        return;
      }
      // Refetch messages to get updated readAt statuses
      getMessagesByUserId(selectedUser._id);
    };

    if (socket) {
      socket.on("messagesRead", handleMessagesRead);
      return () => {
        socket.off("messagesRead", handleMessagesRead);
      };
    }
  }, [selectedUser, authUser._id, socket, getMessagesByUserId]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-3 md:px-6 overflow-y-auto py-4 md:py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            {processedMessages.map((item, index) => {
              if (item.type === 'date') {
                return (
                  <div key={`date-${index}`} className="text-center text-xs text-muted-content mb-2 mt-4">
                    {getDateHeader(item.date)}
                  </div>
                );
              }

              const msg = item.message;
              const isSentByCurrentUser = msg.senderId === authUser._id;
              let receipt = null;
              if (isSentByCurrentUser) {
                // If the message has been read by the receiver
                if (msg.readAt) {
                  // Two blue check marks (read)
                  receipt = (
                    <span>
                      <CheckCheck className="w-3 h-3 text-[#008ec3]" />
                    </span>
                  );
                } else {
                  // Single gray check mark (sent but not read)
                  receipt = (
                    <span>
                      <Check className="w-3 h-3 text-gray-900" />
                    </span>
                  );
                }
              }

              return (
                <div
                  key={`message-${msg._id}`}
                  className={`chat ${isSentByCurrentUser ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat-bubble ${isSentByCurrentUser
                        ? "chat-bubble-primary"
                        : "chat-bubble-neutral"
                      }`}
                  >
                    {msg.image && (
                      <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                    )}
                    {msg.text && <p className="mt-2">{msg.text}</p>}
                    <div className="flex justify-between items-start">
                      <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {receipt}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;