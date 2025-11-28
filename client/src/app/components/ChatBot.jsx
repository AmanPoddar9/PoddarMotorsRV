'use client'

import { useState, useRef, useEffect } from 'react'
import { IoMdSend, IoMdClose, IoMdChatbubbles } from 'react-icons/io'
import { FaRobot } from 'react-icons/fa'
import axios from 'axios'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hi! I'm Poddar AI. I can help you find cars, check finance options, or book a service. How can I help you today?" 
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Send last 10 messages to maintain context without overloading
      const contextMessages = [...messages, userMessage].slice(-10)
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        messages: contextMessages
      })

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.message 
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having a little trouble connecting right now. Please try again or call our support team." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-custom-accent hover:bg-yellow-400'
        }`}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <IoMdClose className="text-white text-2xl" />
        ) : (
          <FaRobot className="text-custom-black text-2xl" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right border border-gray-200 ${
          isOpen 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-custom-black p-4 flex items-center space-x-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-custom-accent/20 flex items-center justify-center border border-custom-accent/50">
            <FaRobot className="text-custom-accent text-xl" />
          </div>
          <div>
            <h3 className="text-white font-bold">Poddar AI Assistant</h3>
            <p className="text-custom-platinum text-xs flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-custom-accent text-custom-black rounded-tr-none font-medium'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cars, finance..."
              className="flex-1 p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-custom-accent/50 text-gray-800 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-custom-black text-custom-accent rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoMdSend className="text-xl" />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">
              AI can make mistakes. Please verify details with our team.
            </p>
          </div>
        </form>
      </div>
    </>
  )
}

export default ChatBot
