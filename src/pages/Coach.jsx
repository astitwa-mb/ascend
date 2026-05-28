import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Bot, Loader2, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "@/components/coach/MessageBubble";

export default function Coach() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (!activeConversation) return;
    const unsub = base44.agents.subscribeToConversation(activeConversation.id, (data) => {
      setMessages(data.messages || []);
      setSending(false);
    });
    return unsub;
  }, [activeConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    const list = await base44.agents.listConversations({ agent_name: "ascend_coach" });
    setConversations(list || []);
    if (list?.length > 0) {
      const conv = await base44.agents.getConversation(list[0].id);
      setActiveConversation(conv);
      setMessages(conv.messages || []);
    }
  };

  const newConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: "ascend_coach",
      metadata: { name: `Session ${new Date().toLocaleDateString()}` },
    });
    setActiveConversation(conv);
    setMessages([]);
    loadConversations();
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    let conv = activeConversation;
    if (!conv) {
      conv = await base44.agents.createConversation({
        agent_name: "ascend_coach",
        metadata: { name: `Session ${new Date().toLocaleDateString()}` },
      });
      setActiveConversation(conv);
      loadConversations();
    }

    await base44.agents.addMessage(conv, { role: "user", content: text });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-gradient-to-br from-background to-purple-400/5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Ascend Coach</h1>
              <p className="text-xs text-accent font-medium">● Online</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={newConversation} className="rounded-xl gap-1">
            <Plus className="w-3 h-3" /> New
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 mx-auto mb-3 text-primary/30" />
            <p className="font-semibold text-foreground mb-1">Hi, I'm your Ascend Coach!</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Ask me about habit building, staying motivated, overcoming procrastination, or anything personal growth.
            </p>
            <div className="flex flex-col gap-2 mt-4 max-w-xs mx-auto">
              {[
                "How can I build better habits?",
                "I'm feeling unmotivated, help me",
                "Review my progress this week",
              ].map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="text-left text-sm bg-muted/50 hover:bg-muted rounded-xl px-4 py-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
        {sending && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 pb-safe bg-card/90 backdrop-blur-xl border-t border-border flex-shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Ask your coach..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            className="flex-1 rounded-xl"
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim() || sending} className="rounded-xl w-11 h-10">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}