import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { chatWithAI } from '../../services/geminiService';
import { toast } from 'react-toastify';

const AIChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI learning assistant. I can help you with course recommendations, study tips, learning paths, and more. How can I assist you today? 🎓',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Update conversation history for context
      const updatedHistory = [...conversationHistory, 
        { role: 'user', content: inputMessage }
      ];
      setConversationHistory(updatedHistory);

      // Get AI response
      const aiResponse = await chatWithAI(inputMessage, updatedHistory);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      // Add AI response to chat
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation history
      setConversationHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);
      
      toast.success('AI response received!');
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again or check your internet connection.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error(error.message || 'Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: 'Hello! I\'m your AI learning assistant. I can help you with course recommendations, study tips, learning paths, and more. How can I assist you today? 🎓',
        timestamp: new Date()
      }
    ]);
    setConversationHistory([]);
    toast.info('Chat cleared!');
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container className="py-5" style={{ marginTop: '80px' }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="ai-chat-card">
            <Card.Header className="text-center">
              <h3 className="mb-0">
                🤖 AI Learning Assistant
              </h3>
              <p className="text-muted mb-0">
                Get personalized help with your learning journey
              </p>
            </Card.Header>
            
            <Card.Body className="chat-body">
              {/* Quick Questions */}
              <div className="quick-questions mb-3">
                <small className="text-muted d-block mb-2">Quick questions:</small>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "What courses should I take for web development?",
                    "How can I improve my study habits?",
                    "Create a learning path for data science",
                    "Give me study tips for programming"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                      className="quick-question-btn"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${message.isError ? 'error-message' : ''}`}
                  >
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-role">
                          {message.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
                        </span>
                        <small className="message-time">
                          {formatTimestamp(message.timestamp)}
                        </small>
                      </div>
                      <div className="message-text">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="message assistant-message">
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-role">🤖 AI Assistant</span>
                      </div>
                      <div className="message-text">
                        <div className="d-flex align-items-center">
                          <Spinner animation="border" size="sm" className="me-2" />
                          Thinking...
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </Card.Body>

            {/* Chat Input */}
            <Card.Footer>
              <Form onSubmit={handleSendMessage}>
                <Row className="g-2">
                  <Col>
                    <Form.Control
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about learning, courses, or study tips..."
                      disabled={isLoading}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading || !inputMessage.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Sending
                        </>
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-secondary"
                      onClick={clearChat}
                      disabled={isLoading}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AIChatAssistant;
