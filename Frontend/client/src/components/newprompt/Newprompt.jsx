
import { FaCircleArrowUp } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import { useEffect, useRef, useState } from 'react'
import './newprompt.css';
import generateResponse from "../../lib/gemini";
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from "@tanstack/react-query";
const Newprompt = ({ data }) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const endRef = useRef(null);
  const formref=useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data,question, answer, history]);

  // Initialize history from props
  useEffect(() => {
    if (data?.history) {
      const formattedHistory = data.history.map((msg, index) => ({
        id: index,
        question: msg.role === "user" ? msg.parts?.[0]?.text : "",
        answer: msg.role === "model" ? msg.parts?.[0]?.text : "",
      }));
      setHistory(formattedHistory);
    }
  }, [data]);

  const queryClient = useQueryClient();

// Mutations
  const mutation = useMutation({
    mutationFn: ({ question: q, answer: a }) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: q ? q : undefined, answer: a }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', data._id] });
      if (formref.current) formref.current.reset();
      setQuestion("");
      setAnswer("");
    },
    onError: (err)=>{
      console.log(err)
    }
  });

  const add = async (text, isInitial) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError('');
    if (!isInitial) setQuestion(text);

    try {
      const messageId = Date.now();
      
      setHistory(prev => [...prev, { 
        id: messageId, 
        question: text, 
        answer: "" 
      }]);

      const ans = await generateResponse(text);
      
      // Typing effect
      let i = 0;
      const interval = setInterval(() => {
        i++;
        const currentText = ans.slice(0, i);
        
        setHistory(prev => prev.map(item => 
          item.id === messageId ? { ...item, answer: currentText } : item
        ));

        if (i >= ans.length) {
          clearInterval(interval);
          setAnswer(ans);
          mutation.mutate({ question: text, answer: ans });
        }
      }, 10);

    } catch (err) {
      console.log(err);
      setError('Failed to generate response');
      setHistory(prev => prev.map((item, index) => 
        index === prev.length - 1 ? { ...item, answer: "Error: Failed to generate response" } : item
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    
    e.target.reset();
    await add(text, false);
  };

  const hasrun = useRef(false)
  useEffect(()=>{
    if (!hasrun.current && data?.history?.length === 1) {
      add(data.history[0].parts[0].text, true);
      hasrun.current = true;
    }
  }, [data]);

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      
        {history.map((item) => (
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
      
      {isLoading && <div className="loading">Generating response...</div>}
      
      <div className="endchat" ref={endRef} ></div>
      
      <div className="formcontain">
        <form onSubmit={handleSubmit} ref={formref}>
          <div className="chaticon">
            <span className='plus'><GrAdd /></span>
            <input 
              type="text"
              placeholder='Ask me anything...' 
              required
              name="text"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading}>
            <FaCircleArrowUp />
          </button>
        </form>
      </div>
    </>
  );
}

export default Newprompt;