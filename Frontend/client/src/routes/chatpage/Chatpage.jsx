
import './chatpage.css'
import Newprompt from '../../components/newprompt/Newprompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { apiUrl } from '../../lib/api';
const Chatpage = () => {
  
const path=useLocation().pathname
const chatId=path.split("/").pop()


const { isPending, error, data } = useQuery({
    queryKey: ['chat',chatId],
    queryFn: () =>
      fetch(apiUrl(`/api/chats/${chatId}`),
        {credentials:"include" }).then((res) =>
        res.json(),
      ),
  })
console.log(data)

  return (
    <div className="chatpage">
     <div className="wrapper">
      <div className="chat">
 
        {isPending
        ?"Loading.."
        :error?"Error loading chat data"
        :data?.history?.map((item) => (
                  <div key={item.id}>
                    {item.question && (
                      <div className="message user">{item.question}</div>
                    )}
                    {item.answer && (
                      <div className="message">
                        <Markdown>{item.answer}</Markdown>
                      </div>
                  )}
                </div>  
              ))} 
        
       
        {data && <Newprompt data={data}/>}
        
       </div>
     </div>
    </div>
  )
}

export default Chatpage 
