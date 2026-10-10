import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  DollarSign, 
  Cpu, 
  ShoppingBag, 
  HelpCircle, 
  Layers, 
  ArrowRight, 
  Loader2,
  Code2,
  Terminal,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function AIShopperModule({ onAddToCart, onToggleCompare, comparedIds, isLiveApi, onOpenDetails }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  // Initial state conforming strictly to hackathon output schema
  const [aiResponse, setAiResponse] = useState({
    interpretedRequirement: "Laptop for Java development and AI learning",
    budget: 1000,
    recommendations: [
      {
        productId: "LAP101",
        productName: "Dell Inspiron 15 AI Edition",
        reason: "16GB RAM, Intel i7 processor, and NVMe SSD storage handle JVM multithreading & AI workloads within $1000 budget.",
        availability: "IN_STOCK",
        price: 949
      },
      {
        productId: "LAP103",
        productName: "Lenovo Legion Slim 5 AI",
        reason: "NVIDIA RTX 4060 provides hardware CUDA acceleration for PyTorch/TensorFlow deep learning tasks.",
        availability: "LOW_STOCK",
        price: 999
      }
    ],
    clarifyingQuestion: null
  });

  const samplePrompts = [
    "Suggest a laptop under $1000 for Java development and AI projects.",
    "Best noise-canceling headphones for deep focus work under $400.",
    "Show me smartphones with flagship cameras and generative AI features.",
    "I need a laptop" // Triggers clarifying question demo
  ];

  const handleRunAiShopper = (inputQuery) => {
    const query = inputQuery || prompt;
    if (!query.trim()) return;

    setIsLoading(true);

    if (isLiveApi) {
      // Connect to team's FastAPI backend
      fetch('http://localhost:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
        .then((res) => res.json())
        .then((data) => {
          setAiResponse(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('FastAPI backend not responding, using local AI fallback:', err);
          simulateLocalAiResponse(query);
        });
    } else {
      simulateLocalAiResponse(query);
    }
  };

  // Local Intent Parsing Engine (Simulates Agentic LLM reasoning)
  const simulateLocalAiResponse = (query) => {
    setTimeout(() => {
      const qLower = query.toLowerCase();

      // Extract budget number if present (e.g. under $1000, 500, etc.)
      const budgetMatch = query.match(/(\$|USD|under|below|around)?\s*(\d{3,4})/i);
      let parsedBudget = budgetMatch ? parseInt(budgetMatch[2], 10) : null;

      let matchedProducts = [];
      let clarifyingQuestion = null;
      let interpretedRequirement = query;

      // Handle Vague Query -> Trigger Clarifying Question
      if (qLower.trim() === 'i need a laptop' || qLower.trim() === 'laptop') {
        interpretedRequirement = "General laptop query (needs specific workload details)";
        clarifyingQuestion = {
          question: "What is your primary use case for the laptop?",
          options: [
            "Java & Backend Development (Under $1000)",
            "Machine Learning / CUDA GPU Workloads",
            "Apple macOS & Battery Portability"
          ]
        };
        matchedProducts = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]];
      } 
      // Headphones & Focus Audio
      else if (qLower.includes('headphone') || qLower.includes('audio') || qLower.includes('noise') || qLower.includes('focus')) {
        interpretedRequirement = "Active noise-canceling headphones for focus work";
        parsedBudget = parsedBudget || 400;
        matchedProducts = [MOCK_PRODUCTS[4]];
      } 
      // Smartphones
      else if (qLower.includes('phone') || qLower.includes('mobile') || qLower.includes('camera') || qLower.includes('samsung')) {
        interpretedRequirement = "Flagship smartphone with AI translation & camera features";
        parsedBudget = parsedBudget || 1200;
        matchedProducts = [MOCK_PRODUCTS[3]];
      } 
      // Smart Home & Robotics
      else if (qLower.includes('vacuum') || qLower.includes('clean') || qLower.includes('robot') || qLower.includes('home')) {
        interpretedRequirement = "AI obstacle-recognition robot vacuum with auto-docking";
        parsedBudget = parsedBudget || 900;
        matchedProducts = [MOCK_PRODUCTS[5]];
      } 
      // Laptops (Default Dev / AI focus)
      else {
        interpretedRequirement = parsedBudget
          ? `High-performance laptop under $${parsedBudget} for development & AI`
          : "Development & AI learning laptop";

        parsedBudget = parsedBudget || 1000;
        matchedProducts = MOCK_PRODUCTS.filter(
          (p) => p.category === 'Laptops' && p.price <= parsedBudget
        );
        if (matchedProducts.length === 0) matchedProducts = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]];
      }

      // Generate structured recommendations matching case study JSON format
      const recommendations = matchedProducts.map((p) => ({
        productId: p.id,
        productName: p.name,
        reason: `${p.specs.processor}, ${p.specs.ram}, ${p.specs.storage} — ${p.aiSummary.pros[0]}`,
        availability: p.availability,
        price: p.price
      }));

      setAiResponse({
        interpretedRequirement,
        budget: parsedBudget,
        recommendations,
        clarifyingQuestion
      });

      setIsLoading(false);
    }, 550);
  };

  const handleSelectClarifyingOption = (optionText) => {
    const updatedQuery = `${prompt} - Focus: ${optionText}`;
    setPrompt(updatedQuery);
    handleRunAiShopper(updatedQuery);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900/80 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> ShopSmart AI Co-Pilot • Module 1 & 2
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI-Powered Product Discovery & Intent Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            State your intended use-case, hardware constraints, or budget in natural language. The AI agent interprets intent, extracts requirements, and generates explainable product recommendations.
          </p>
        </div>
      </div>

      {/* Input Prompt Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Terminal className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAiShopper()}
              placeholder="e.g. Suggest a laptop under $1000 for Java development and AI projects..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium transition-all"
            />
          </div>

          <button
            onClick={() => handleRunAiShopper()}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4" />}
            <span>Execute AI Agent</span>
          </button>
        </div>

        {/* Preset Prompt Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Try Sample Prompts:
          </span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(sp);
                handleRunAiShopper(sp);
              }}
              className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-lg border border-slate-700/60 transition-all"
            >
              "{sp}"
            </button>
          ))}
        </div>
      </div>

      {/* AI Response Output Section */}
      {aiResponse && (
        <div className="space-y-6 animate-fadeIn">
          {/* Interpreted Requirement & Specs Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Interpreted Requirement Intent
                </span>
                <span className="text-base font-extrabold text-white">
                  {aiResponse.interpretedRequirement}
                </span>
              </div>
            </div>

            {aiResponse.budget && (
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block -mb-0.5 font-medium">Extracted Budget</span>
                  <span className="text-sm font-extrabold font-mono text-emerald-300">
                    ${aiResponse.budget} USD
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Clarifying Question Banner (If standard query is incomplete) */}
          {aiResponse.clarifyingQuestion && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-5 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>AI Clarifying Question Needed</span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                {aiResponse.clarifyingQuestion.question}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {aiResponse.clarifyingQuestion.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectClarifyingOption(opt)}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    + {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommended Products with AI Explanations ({aiResponse.recommendations.length})
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {aiResponse.recommendations.map((rec, idx) => {
                const fullProd = MOCK_PRODUCTS.find((p) => p.id === rec.productId) || MOCK_PRODUCTS[0];
                const isCompared = comparedIds.includes(fullProd.id);

                return (
                  <div
                    key={rec.productId}
                    className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    <div className="space-y-3">
                      {/* Rank Tag & Availability */}
                      <div className="flex justify-between items-center">
                        <span className="bg-purple-500/20 text-purple-300 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Rank #{idx + 1} Recommendation
                        </span>

                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          rec.availability === 'LOW_STOCK'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {rec.availability === 'LOW_STOCK' ? 'Low Stock' : 'In Stock'}
                        </span>
                      </div>

                      {/* Title & Brand */}
                      <div className="flex gap-3 items-start">
                        <img
                          src={fullProd.image}
                          alt={fullProd.name}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0 bg-slate-950"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">
                            {fullProd.brand} • {fullProd.id}
                          </span>
                          <h4 className="font-bold text-slate-100 text-base line-clamp-1">{rec.productName}</h4>
                          <span className="font-extrabold font-mono text-lg text-white">${rec.price}</span>
                        </div>
                      </div>

                      {/* Highlighted AI Reasoning Box */}
                      <div className="bg-gradient-to-br from-purple-950/60 to-slate-950 p-3.5 rounded-xl border border-purple-500/30 text-xs text-purple-200 space-y-1.5 shadow-inner">
                        <div className="font-bold flex items-center gap-1.5 text-amber-300 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Explicit AI Reason:
                        </div>
                        <p className="leading-relaxed text-slate-200 text-xs font-medium">
                          {rec.reason}
                        </p>
                      </div>

                      {/* Specs pills */}
                      <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400 pt-1">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {fullProd.specs.processor}
                        </span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {fullProd.specs.ram}
                        </span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {fullProd.specs.storage}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onToggleCompare(fullProd.id)}
                          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                            isCompared ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                        </button>

                        {onOpenDetails && (
                          <button
                            onClick={() => onOpenDetails(fullProd)}
                            className="p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                            title="View Full Specs & Pros/Cons"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => onAddToCart(fullProd)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hackathon API JSON Inspector Accordion */}
          <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
            <button
              onClick={() => setShowJsonInspector(!showJsonInspector)}
              className="w-full p-4 flex items-center justify-between text-xs font-mono font-bold text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/50"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Hackathon Case Study API Response Payload (JSON Schema Inspector)</span>
              </div>
              {showJsonInspector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showJsonInspector && (
              <div className="p-4 border-t border-slate-800">
                <pre className="text-[11px] font-mono text-emerald-400 bg-slate-900 p-4 rounded-xl overflow-x-auto border border-slate-800">
                  {JSON.stringify(aiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
