import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./ChatBot.css";
import SuccessStoriesButton from "./SuccessStoriesButton";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { job, career, disability } = location.state || {}; //the answer keys for this page to remember

  //if the user's input in the first userinfo page have the word dyslex in it then the website considers it as dyslexia and changes the web to support them
  const isDyslexic = disability?.toLowerCase().includes("dyslex"); 

  
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
        const res = await axios.post("http://localhost:5000/gemini-quick-chat", {
            messages: newMessages,
            career, //Send this
          });
          

      setMessages([...newMessages, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  //Changes fonts of the words to dyslexic font if like the keyword is found
  //A lot of html is also here
  return (
    <div className={isDyslexic ? "dyslexic-font" : ""}> 
    <div className="container" style={{ padding: "2rem" }}>
    <SuccessStoriesButton />
    
      <h2>Hi, I'm your Career Assistant, <br></br>Ask Me Anything About Your Chosen Role!</h2>

      <div className="chat-box">{messages.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: "100%", marginTop: "1rem" }}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} disabled={loading} style={{ marginTop: "0.5rem" }}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <button
        onClick={() => navigate("/results", { state: { job, career, disability } })}
        style={{ marginTop: "2rem" }} //moves to the results page when u click
      >
        Continue to Results →
      </button>
    </div>
    </div>
  );  
}

export default ChatBot;
