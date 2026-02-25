
import './chatpage.css'
import Newprompt from '../../components/newprompt/Newprompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { apiUrl } from '../../lib/api';
import { useAuth } from '@clerk/clerk-react';
const Chatpage = () => {
const { getToken } = useAuth();
  
const path=useLocation().pathname
const chatId=path.split("/").pop()


const { isPending, error, data } = useQuery({
    queryKey: ['chat',chatId],
    queryFn: async () => {
      const token = await getToken();
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
  })

  const historyItems = Array.isArray(data?.history) ? data.history : [];

  return (
    <div className="chatpage">
     <div className="wrapper">
      <div className="chat">
 
        {isPending
        ?"Loading.."
        :error?"Error loading chat data"
        :historyItems.map((item, index) => {
                  const question =
                    item?.question || (item?.role === "user" ? item?.parts?.[0]?.text : "");
                  const answer =
                    item?.answer || (item?.role === "model" ? item?.parts?.[0]?.text : "");

                  return (
                  <div key={item?._id || item?.id || index}>
                    {question && (
                      <div className="message user">{question}</div>
                    )}
                    {answer && (
                      <div className="message">
                        <Markdown>{answer}</Markdown>
                      </div>
                  )}
                </div>  
              )})} 
        
       
        {data && <Newprompt data={data}/>}
        
       </div>
     </div>
    </div>
  )
}

export default Chatpage 
