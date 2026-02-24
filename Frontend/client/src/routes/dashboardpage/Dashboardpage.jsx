import { TypeAnimation } from 'react-type-animation'
import { FaCircleArrowUp } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import './dashboardpage.css'
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const Dashboardpage = () => {

const queryClient = useQueryClient()

const navigate = useNavigate();

// Mutations
  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      // server returns { id: savedId }
      const id = data && (data.id ?? data);
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
      if (id) navigate(`/dashboard/chats/${id}`);
    },
  });

  const handlesubmit = async (e) => {
  e.preventDefault();
  const text = e.target.text.value;
  if (!text) return;

  mutation.mutate(text)
      
  };
  return (
   <div className='dashboardpage'>
    <div className="logopage">
     <div className="logo">
      <img src="amclogo2.JPG" alt="" />
      <span>
        <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'How can I assist you today?',
        3000, // wait 1s before replacing precisely and seamelesly
        'What campus information can I assist you with?',
        2000,
        'Looking for courses, admissions, or facilities?',
        2000,
        'Campus assistance, ready when you are...',
        3000
      ]}
      wrapper="span"
      speed={80}
      style={{ fontSize: '2em', display: 'inline-block' }}
      repeat={Infinity}
      cursor={true}
    />
      </span>
      </div>
      <div className="formcontainer">
        <form onSubmit={handlesubmit} >
          <div className="chatbar">
          <span className='plus'><GrAdd /></span>
          <input type="text" name='text' placeholder='Ask me anything...' /></div>
          <button><FaCircleArrowUp /> </button>
        </form>
      </div>
   </div>
   </div>
  )
}
export default Dashboardpage ;