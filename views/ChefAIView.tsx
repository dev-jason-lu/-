import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { generateCookingAdvice, analyzeFoodImage, createChefChat, fileToGenerativePart } from '../services/geminiService';
import { Send, Camera, Sparkles, ChefHat, Image as ImageIcon, Loader2 } from 'lucide-react';

export const ChefAIView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: "Hello lovebirds! I'm Chef Cupid 💘. I can help you find a recipe, save a burnt dinner, or plan a romantic meal. What's cooking?", timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  
  // Analyze State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!chatSession) {
      const chat = createChefChat();
      setChatSession(chat);
    }
  }, [chatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(userMsg.text);
      const responseText = result.response.text();
      
      setChatHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Oops! I dropped the pan. Can you say that again?",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToGenerativePart(file);
        setSelectedImage(base64); // Store raw base64 for API
        setAnalysisResult('');
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    setAnalysisResult('');
    
    try {
      const result = await analyzeFoodImage(selectedImage, inputText || "Analyze this dish and give me a recipe.");
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisResult("Failed to analyze image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-50">
      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200 p-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-rose-100 text-rose-700' : 'text-slate-500'}`}
        >
          <ChefHat size={18} /> Chat Chef
        </button>
        <button
          onClick={() => setActiveTab('analyze')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 ${activeTab === 'analyze' ? 'bg-rose-100 text-rose-700' : 'text-slate-500'}`}
        >
          <Camera size={18} /> Food Lens
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'chat' ? (
          <>
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-rose-500 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                   <div className="flex gap-1">
                     <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                     <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                     <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                   </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              
              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img 
                    src={`data:image/jpeg;base64,${selectedImage}`} 
                    alt="Upload" 
                    className="w-full max-h-64 object-cover"
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col items-center gap-2 text-slate-400"
                >
                  <Camera size={32} />
                  <span>Tap to upload ingredient or dish photo</span>
                </div>
              )}

              <div className="mt-4">
                <input 
                  type="text"
                  placeholder="Optional: What can I make with this?"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-rose-200 outline-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isLoading}
                  className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${!selectedImage || isLoading ? 'bg-slate-300' : 'bg-rose-500 shadow-lg shadow-rose-200'}`}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  Analyze & Generate Recipe
                </button>
              </div>
            </div>

            {analysisResult && (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-5">
                <h3 className="font-bold text-rose-600 mb-2 flex items-center gap-2">
                  <ChefHat size={18} /> Chef's Analysis
                </h3>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap markdown-body">
                  {analysisResult}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area (Only for Chat) */}
      {activeTab === 'chat' && (
        <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-end sticky bottom-0 z-10">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
            placeholder="Ask Chef Cupid..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-200 outline-none resize-none text-sm max-h-32"
            rows={1}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-full flex-shrink-0 transition-all ${!inputText.trim() ? 'bg-slate-200 text-slate-400' : 'bg-rose-500 text-white shadow-md hover:scale-105'}`}
          >
            <Send size={20} className={inputText.trim() ? 'ml-0.5' : ''} />
          </button>
        </div>
      )}
    </div>
  );
};
