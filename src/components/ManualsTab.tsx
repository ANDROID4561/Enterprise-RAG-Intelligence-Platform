import { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  ShieldCheck, 
  Settings, 
  ClipboardCheck, 
  Copy 
} from 'lucide-react';
import { 
  deploymentGuides, 
  designDecisions, 
  securityDocs, 
  mermaidSpec 
} from '../data/staticManuals';

export default function ManualsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'deploy' | 'design' | 'sec' | 'mermaid'>('deploy');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Tab Select Header */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('deploy')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider ${
            activeSubTab === 'deploy' 
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Docker & Deployment Setup</span>
        </button>

        <button
          onClick={() => setActiveSubTab('design')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider ${
            activeSubTab === 'design' 
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>Architectural Decisions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sec')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider ${
            activeSubTab === 'sec' 
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secure Compliance TCG</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mermaid')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider ${
            activeSubTab === 'mermaid' 
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Mermaid Code</span>
        </button>
      </div>

      <div className="p-5 font-sans leading-relaxed text-sm text-slate-300">
        {/* Subset 1: Deployment & Docker Setup */}
        {activeSubTab === 'deploy' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span className="p-1 rounded bg-slate-800 text-indigo-400"><Terminal className="h-4 w-4" /></span>
                <span>Production multi-instance Docker Compose blueprint</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                This blueprint orchestrates standard microservice images representing FastAPI core, React SPA, Qdrant cluster shards, PostgreSQL persistent, and Redis blacklists.
              </p>
            </div>

            <div className="space-y-5">
              {deploymentGuides.map((guide, idx) => (
                <div key={idx} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950 shadow">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 font-mono text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">{guide.filename}</span>
                    <button
                      onClick={() => handleCopyCode(guide.code, idx)}
                      className="flex items-center space-x-1 hover:text-slate-200 transition-colors bg-slate-800 p-1 px-2 rounded border border-slate-700/60"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <ClipboardCheck className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span className="text-[10px]">Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs text-slate-300 font-mono leading-normal bg-slate-950/90 select-all max-h-80">
                    <code>{guide.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subset 2: Architectural decisions */}
        {activeSubTab === 'design' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide font-mono">
              Core Algorithmic Design Decisions
            </h3>
            <div className="prose prose-invert prose-slate max-w-none text-xs leading-relaxed space-y-4">
              <div className="p-4 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-950/10 mb-4">
                <span className="font-semibold text-slate-200">System Assumptions Documented:</span>
                <ul className="list-disc list-inside mt-2 text-slate-400 space-y-1">
                  <li><strong>Security Baseline</strong>: Requester roles are parsed prior to executing any Qdrant vector retrieval steps.</li>
                  <li><strong>Hybrid Fallback</strong>: Simulates hybrid BM25 via strict word overlaps intersecting with dense embeddings rankings.</li>
                  <li><strong>Model Capabilities</strong>: Defaults to Gemini-3.5-flash for reasoning, reducing chunk lookup hallucinations.</li>
                </ul>
              </div>

              {/* Render Markdowns */}
              <div className="space-y-4 text-slate-300" dangerouslySetInnerHTML={{ __html: designDecisions
                .replace(/### (.*)/g, '<h4 class="text-sm font-bold text-slate-100 mt-4 mb-2 font-mono uppercase">$1</h4>')
                .replace(/\* \*\*(.*)\*\*/g, '<br/>• <strong>$1</strong>')
              }} />
            </div>
          </div>
        )}

        {/* Subset 3: Security & compliance docs */}
        {activeSubTab === 'sec' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide font-mono">
              Governance Sec-Compliance Guide (SIEM Control Protocol)
            </h3>
            <div className="prose prose-invert prose-slate max-w-none text-xs leading-relaxed space-y-4">
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/5 mb-4 font-sans">
                <span className="font-bold text-rose-400">SOC Threat Threshold Alert Matrix:</span>
                <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                  Subnet mappings with multiple concurrent SSH scanning triggers (e.g., matching range 185.220.101.X) spark instant firewall temporary isolation flags inside Redis records. Release requirements require dual Admin signatures.
                </p>
              </div>

              <div className="space-y-4 text-slate-300" dangerouslySetInnerHTML={{ __html: securityDocs
                .replace(/### (.*)/g, '<h4 class="text-sm font-bold text-slate-100 mt-4 mb-2 font-mono uppercase">$1</h4>')
                .replace(/\* \*\*(.*)\*\*/g, '<br/>• <strong>$1</strong>')
              }} />
            </div>
          </div>
        )}

        {/* Subset 4: Mermaid representation */}
        {activeSubTab === 'mermaid' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide font-mono">
                  State Diagram Blueprint (Mermaid Text)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Copy this plaintext input parameter into any Mermaid validator solver to visualize active LangGraph state hierarchies.
                </p>
              </div>
              <button
                onClick={() => handleCopyText(mermaidSpec)}
                className="flex items-center space-x-1 hover:text-slate-200 transition-colors bg-slate-800 px-3 py-1.5 rounded text-xs border border-slate-700/60 font-mono font-medium"
              >
                {copiedText ? (
                  <>
                    <ClipboardCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Mermaid Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 select-all overflow-x-auto max-h-96 whitespace-pre">
              <code>{mermaidSpec}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
