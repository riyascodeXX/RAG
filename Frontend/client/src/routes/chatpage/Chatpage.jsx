
import './chatpage.css'
import Newprompt from '../../components/newprompt/Newprompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { apiUrl } from '../../lib/api';
import { useAuth } from '@clerk/clerk-react';
const Chatpage = () => {
const { getToken, isLoaded, userId } = useAuth();
  
const path=useLocation().pathname
const chatId=path.split("/").pop()


const { isPending, error, data } = useQuery({
    queryKey: ['chat',chatId],
    queryFn: async () => {
      if (!isLoaded || !userId) return null;

      const token = await getToken();
      if (!token) throw new Error("Missing auth token. Please sign in again.");

      const res = await fetch(apiUrl(`/api/chats/${chatId}`), {
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
            : `Failed to load chat (${res.status})`;
        throw new Error(message);
      }

      return payload;
    },
    enabled: isLoaded && !!userId && !!chatId,
  })

  return (
    <div className="chatpage">
     <div className="wrapper">
      <div className="chat">
 
        {isPending
        ?"Loading.."
        :error?"Error loading chat data"
        :data && <Newprompt data={data}/>}
        
       </div>
     </div>
    </div>
  )
}

export default Chatpage 
