import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { chatService } from '../api/chatService';
import { aiService } from '../api/aiService';
import type { ChatMessage } from '../types';
import { toast } from 'react-toastify';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const history = await chatService.getChatHistory();
        setMessages(history);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const messageText = inputMessage;
    setInputMessage('');
    setSending(true);
    
    try {
      // First try the direct AI chat endpoint
      try {
        // Get AI response from the API
        const aiResponse = await aiService.chatWithAI(messageText);
        
        if (!aiResponse || !aiResponse.response) {
          throw new Error('No response received from AI');
        }
        
        // Create a new chat message in the database with both message and AI response
        const newMessage = await chatService.createChatMessage(messageText, aiResponse.response);
        
        // Update the messages state
        setMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
      } catch (aiError) {
        console.error('Error with AI chat service, falling back to chat service:', aiError);
        
        // Since we couldn't get an AI response, we'll use a default response
        const fallbackResponse = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
        
        // Fallback to the regular chat service with the fallback response
        const newMessage = await chatService.createChatMessage(messageText, fallbackResponse);
        setMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Restore input if failed
      setInputMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      try {
        await chatService.clearChatHistory();
        setMessages([]);
        toast.success('Chat history cleared');
      } catch (error) {
        console.error('Error clearing chat history:', error);
        toast.error('Failed to clear chat history');
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading chat...</div>;
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>AI Chat Assistant</h1>
        <div className="chat-actions">
          <button
            className="clear-btn"
            onClick={handleClearHistory}
            disabled={messages.length === 0}
          >
            Clear History
          </button>
          <Link to="/dashboard" className="back-btn">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="chat-content">
        <div className="messages-container">
          {/* Ensure messages is an array and check its length */}
          {(!Array.isArray(messages) || messages.length === 0) ? (
            <div className="welcome-message">
              <h2>Welcome to AI Chat!</h2>
              <p>
                Ask me anything related to your studies, and I'll do my best to help you.
                You can ask for explanations, summaries, or any other academic questions.
              </p>
            </div>
          ) : (
            // Safe access to map method with array check
            Array.isArray(messages) && messages.map((msg) => (
              <div key={msg.id} className="message-group">
                <div className="user-message">
                  <div className="message-content">{msg.message}</div>
                  <div className="message-timestamp">{formatTimestamp(msg.createdAt)}</div>
                </div>
                <div className="ai-message">
                  <div className="message-content">{msg.response}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
          />
          <button type="submit" disabled={sending || !inputMessage.trim()}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
