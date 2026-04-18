
// export default Dashboard;
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { Shield, LogOut, MessageCircle, User } from "lucide-react";

// Message type for chat history
type Message = {
  role: "user" | "assistant";
  content: string;
};

const Dashboard: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, token, loading, user } = useAuth();



useEffect(() => {
  if (loading) return;

  const checkAuthAndSubscription = async () => {
    if (!token) {
      toast({ title: "You have to login first" });
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.get<{ subscriptions: any[] }>(
        "http://localhost:3000/plan/subs",
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.data.subscriptions.length === 0) {
        toast({ title: "You have no subscription" });
        navigate("/pricing");
      } else {
        setHasSubscription(true);
      }

    } catch (err: any) {
      // Axios throws for 401 here
      if (err.response?.status === 401) {
        logout();
        navigate("/signin");
        toast({
          title: "Session expired",
          description: "Sign in again",
          variant: "destructive",
        });
      } else {
        toast({ title: "Subscription check failed" });
        navigate("/pricing");
      }
    }
  };

  checkAuthAndSubscription();
}, [token, loading]);




  const handleLogout = (): void => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages([...newMessages, { role: "assistant", content: "Typing..." }]);
    setInput("");
    setIsAnalyzing(true);

    try {
      // const base64Payload = btoa(input)
      const res = await axios.get<{ user: string; bot: string }>(
        `http://localhost:3000/chat/bot?q=${encodeURIComponent(input)}`
      );
      const botReply: string = res.data.bot;

      // Replace "Typing..." with real response
      setMessages([...newMessages, { role: "assistant", content: botReply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);

      toast({
        title: "Chat Error",
        description: "Failed to get response from chat API.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setTimeout(
        () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <div className="text-2xl font-bold glow-text text-white">
                <Link to="/" className="hover:text-purple-200">
                  NeuroAudit
                </Link>
              </div>
            </Link>
            <div className="flex gap-4 items-center">
              {token && user ? (
                <>
                  <span className="text-white text-sm md:text-base font-medium">
                    <Link to="/profile" className="hover:text-purple-200">
                      Welcome, {user.name}
                    </Link>
                  </span>
                  <Button
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="cyber-button">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Header */}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0025] via-[#2d0146] to-[#0a0012] px-2 py-8">
        <div className="w-full max-w-2xl neuro-card p-6 flex flex-col h-[70vh] my-[100px]">
          <div className="flex-1 overflow-y-auto pr-2 mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md text-sm whitespace-pre-line
                    ${
                      msg.role === "user"
                        ? "bg-purple-700 text-white rounded-br-none"
                        : "bg-black/60 text-purple-200 rounded-bl-none border border-purple-900"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-purple-300" />
                    ) : (
                      <MessageCircle className="h-4 w-4 text-pink-400" />
                    )}
                    <span className="font-semibold">
                      {msg.role === "user" ? "You" : "AI"}
                    </span>
                  </div>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 mt-auto">
            <Textarea
              className="flex-1 resize-none rounded-lg bg-black/40 border border-purple-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              rows={2}
              placeholder="Type your message..."
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInput(e.target.value)
              }
              onKeyDown={handleInputKeyDown}
              disabled={isAnalyzing}
            />
            <Button
              onClick={handleSend}
              disabled={isAnalyzing || !input.trim()}
              className="cyber-button px-6 text-lg"
            >
              {isAnalyzing ? "..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 SecureCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
