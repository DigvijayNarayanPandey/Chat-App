import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-base-content/5 active:bg-base-content/10 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
            <div className="size-12 rounded-full">
              <img src={contact.profilePic || "/avatar.png"} />
            </div>
          </div>
          <h4 className="text-base-content font-medium">{contact.fullName}</h4>
        </div>
      ))}
    </>
  );
}
export default ContactList;
