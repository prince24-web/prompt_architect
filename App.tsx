import React, { useState } from 'react';
import { 
  Github, 
  Twitter, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { enhancePrompt } from './services/geminiService';

const App: React.FC = () => {
  const [promptInput, setPromptInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEnhance = async () => {
    if (!promptInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // We combine context and prompt if context is provided, otherwise just prompt
      const finalPrompt = contextInput.trim() 
        ? `Project Name/Context: ${contextInput}\n\nTask: ${promptInput}`
        : promptInput;

      const enhancedText = await enhancePrompt(finalPrompt);
      setResult(enhancedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-60" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <Sparkles className="w-5 h-5 text-slate-900" />
          <span>Prompt Architect</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-16 px-4 sm:px-6 pb-20">
        
        {/* Hero Text */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Better prompts, Better results.
          </h1>
          <p className="text-lg text-slate-600">
            Enter your rough idea, and let AI structure a comprehensive professional specification instantly.
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
          <div className="space-y-6">
            
            {/* Context Input (replaces Website URL from design to fit functionality) */}
            <div className="space-y-2">
              <label htmlFor="context" className="block text-sm font-medium text-slate-700">
                Project Name / Context <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="context"
                type="text"
                placeholder="e.g. Portfolio Website, E-commerce Store"
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              />
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-700">
                Your Idea
              </label>
              <textarea
                id="prompt"
                rows={4}
                placeholder="e.g. Create a minimalist portfolio for a frontend developer using React and Tailwind..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all resize-none"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleEnhance}
              disabled={isLoading || !promptInput.trim()}
              className={`w-full py-3.5 px-6 rounded-lg font-medium text-white shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                ${isLoading || !promptInput.trim() 
                  ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 hover:bg-slate-800'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Architecting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Enhance Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 w-full max-w-2xl bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-8 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Generated Specification</h3>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
             </div>
             <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                  <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {result}
                  </pre>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Prompt Architect. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;