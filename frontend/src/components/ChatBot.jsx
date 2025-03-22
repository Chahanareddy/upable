import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { job, career } = location.state || {};

  
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
        const res = await axios.post("http://localhost:5000/gemini-quick-chat", {
            messages: newMessages,
            career, // ✅ Send this!
          });
          

      setMessages([...newMessages, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>Ask Me Anything</h2>

      <div style={{ maxHeight: "300px", overflowY: "auto", background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
        {messages.map((msg, i) => (
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
        onClick={() => navigate("/results", { state: { job, career } })}
        style={{ marginTop: "2rem" }}
      >
        Continue to Results →
      </button>
    </div>
  );
}

export default ChatBot;
