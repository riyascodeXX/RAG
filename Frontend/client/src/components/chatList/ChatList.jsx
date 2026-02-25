import {Link}from 'react-router-dom'
import './chatList.css'
import { useQuery } from '@tanstack/react-query'
import { apiUrl } from '../../lib/api'
import { useAuth } from '@clerk/clerk-react'

const ChatList = () => {
  const { getToken } = useAuth();

 const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(apiUrl("/api/userchats"), {
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      let payload = null;

      try {
        payload = await res.json();
      } catch (_err) {
        payload = null;
      }

      if (!res.ok) {
        const message =
          payload && typeof payload === "object" && "message" in payload
            ? payload.message
            : `Failed to load chats (${res.status})`;
        throw new Error(message);
      }

      if (Array.isArray(payload)) return payload;
      if (payload && typeof payload === "object" && Array.isArray(payload.chats)) {
        return payload.chats;
      }

      return [];
    },
  })

  const chats = Array.isArray(data) ? data : [];

  return (
    <div className="chatList">
    <span className='title'>DASBOARD</span>
    <Link>Create new page</Link>
    <Link>Explore Assistant</Link>
    <Link>Contact</Link>
    <hr />
    <span className='title'>RECENT CHAT</span>
    <div className="list">

        {isPending?
        <span>Loading...</span>
        :error?
        <span>Error loading chats</span>
        :chats.map((chat) => (
          <Link key={chat._id} to={`/dashboard/chats/${chat._id}`}>
            {chat.title}
          </Link>
        ))}
        
    </div>
    <hr />
    <div className="terms">
        <img src="amclogo2.JPG" alt="" width="50%" height="50%" />
        <span >Terms of Service</span>
        <span>&</span>
        <span>Privacy Policy</span>
    </div>
 </div>
  )
}

export default ChatList
