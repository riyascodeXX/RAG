
import { FaCircleArrowUp } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import { useEffect, useRef, useState } from 'react'
import './newprompt.css';
import generateResponse from "../../lib/gemini";
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../../lib/api";
import { useAuth } from "@clerk/clerk-react";
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
    if (Array.isArray(data?.history)) {
      const formattedHistory = data.history.map((msg, index) => ({
        id: index,
        question: msg?.question || (msg?.role === "user" ? msg?.parts?.[0]?.text : ""),
        answer: msg?.answer || (msg?.role === "model" ? msg?.parts?.[0]?.text : ""),
      }));
      setHistory(formattedHistory);
    } else {
      setHistory([]);
    }
  }, [data]);

  const queryClient = useQueryClient();
  const { getToken, isLoaded, userId } = useAuth();

// Mutations
  const mutation = useMutation({
    mutationFn: async ({ question: q, answer: a }) => {
      if (!isLoaded || !userId) {
        throw new Error("Authentication is still loading. Try again.");
      }

      const token = await getToken();
      if (!token) throw new Error("Missing auth token. Please sign in again.");

      const res = await fetch(apiUrl(`/api/chats/${data._id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: q ? q : undefined, answer: a }),
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
            : `Failed to save chat (${res.status})`;
        throw new Error(message);
      }

      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', data._id] });
      if (formref.current) formref.current.reset();
      setQuestion("");
      setAnswer("");
    },
    onError: (err)=>{
      console.log(err)
      setError(err?.message || "Failed to save chat.");
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
      setError(err?.message || 'Failed to generate response');
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
    if (!hasrun.current && Array.isArray(data?.history) && data.history.length === 1) {
      const firstQuestion = data.history[0]?.parts?.[0]?.text || data.history[0]?.question;
      if (!firstQuestion) return;
      add(firstQuestion, true);
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
