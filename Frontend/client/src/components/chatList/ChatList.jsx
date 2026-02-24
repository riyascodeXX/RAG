import {Link}from 'react-router-dom'
import './chatList.css'
import { useQuery } from '@tanstack/react-query'

const ChatList = () => {

 const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,{credentials:"include" }).then((res) =>
        res.json(),
      ),
  })


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
        :data?.map((chat) => (
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