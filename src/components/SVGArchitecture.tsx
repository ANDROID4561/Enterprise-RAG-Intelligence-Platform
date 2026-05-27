import { useState } from 'react';
import { 
  ShieldCheck, 
  Binary, 
  Map, 
  Combine, 
  Compass, 
  Zap, 
  Eye, 
  FileText, 
  Database, 
  Network 
} from 'lucide-react';

interface StageDetails {
  title: string;
  icon: any;
  color: string;
  desc: string;
  inputs: string;
  outputs: string;
  benefits: string;
  codeSnippet?: string;
}

export default function SVGArchitecture() {
  const [activeStageId, setActiveStageId] = useState<string>('router');

  const stages: Record<string, StageDetails> = {
    'router': {
      title: 'Supervisor Intent Router',
      icon: Compass,
      color: 'from-amber-500 to-yellow-600',
      desc: 'The front-facing gatekeeper of the platform. Using prompt classification heuristics and routing signals, it maps incoming natural language queries to their corresponding workspace domains: unstructured files, relational tabular databases, or network log files.',
      inputs: 'Raw user question string, historical context lines.',
      outputs: 'Target Agent routing routing label (PDF, Database, Logs, Security, Mixed Source).',
      benefits: 'Drastically decreases prompt load overhead on downstream agents by eliminating unneeded records early.',
      codeSnippet: `classification = route_model.predict(user_query)`
    },
    'rbac': {
      title: 'Governance RBAC Verification',
      icon: ShieldCheck,
      color: 'from-rose-500 to-red-600',
      desc: 'Enforces absolute structural boundaries before executing retrieve commands. It evaluates user roles against document classification tiers and allowed scopes to prevent accidental prompt leaks of unauthorized corporate entities.',
      inputs: 'Active JSON Web Token, requester clearance role, metadata filters.',
      outputs: 'Gate authorization boolean or immediate 403 Forbidden Access termination.',
      benefits: 'Enforces Zero-Trust compliance directly on the retrieval engine, not merely at the LLM summary layer.',
      codeSnippet: `if user_role not in doc["allowed_roles"]: throw ForbiddenException()`
    },
    'dual': {
      title: 'Dual Index Workspace (Sparse + Dense)',
      icon: Binary,
      color: 'from-blue-500 to-sky-600',
      desc: 'Initiates a parallel query over dual structures: dense cosine search mapping conceptual topics, alongside sparse lexical calculations that preserve exact matches key metrics (such as ID hash keys, timestamps, IP profiles).',
      inputs: 'Sanitized query tokens, document allowed lists.',
      outputs: 'Two separate lists of matching candidate chunks, containing score metrics.',
      benefits: 'Retains semantic understanding of natural topics without losing precision over precise technical sub-indices.',
      codeSnippet: `qdrant_results = qdrant.search(dense_vector)\nxapian_results = bm25.search(query_tokens)`
    },
    'rrf': {
      title: 'Reciprocal Rank Fusion (RRF)',
      icon: Combine,
      color: 'from-indigo-500 to-indigo-600',
      desc: 'Normalizes and aggregates ordinal rankings of independent sparse and dense search pipelines, preventing bias from differing mathematical score scales.',
      inputs: 'Sparse ranks array, Dense vector ranks array.',
      outputs: 'A single, uniformly prioritized array of candidate text segments.',
      benefits: 'Provides highly stable and mathematically sound ranking regardless of individual score fluctuations.',
      codeSnippet: `rrf_score = 1 / (60 + dense_rank) + 1 / (60 + sparse_rank)`
    },
    'rerank': {
      title: 'BGE-Reranker Module',
      icon: Network,
      color: 'from-purple-500 to-purple-600',
      desc: 'Runs cross-attention calculations over top candidate chunks to optimize semantic relevance, sorting document-level details relative to the users literal questions.',
      inputs: 'Top 15 fused chunks, sanitized queries.',
      outputs: 'Top 5 highly prioritized segments with normalized percentage similarity.',
      benefits: 'Saves valuable context window metrics and refines answer alignment, boosting answers precision metric significantly.',
      codeSnippet: `reranked_chunks = bge_reranker.compute_scores(query, chunks)`
    },
    'agents': {
      title: 'Segmented Routing Agents',
      icon: Zap,
      color: 'from-emerald-500 to-teal-600',
      desc: 'Active LangGraph workspace agent modules specializing in particular file states: PDF Extraction formats, SQL relational SQL joins, JSON raw scanning, or Security compliance registries.',
      inputs: 'Prioritized chunks list, designated agent classification.',
      outputs: 'Synthesizer context variables and structured tabular references.',
      benefits: 'Decouples business workflow rules, enabling agents to parse specialized layouts independently.',
      codeSnippet: `agent_payload = active_agent.execute_context_scan(reranked_chunks)`
    },
    'ground': {
      title: 'Hallucination Grounding Validator',
      icon: Eye,
      color: 'from-teal-500 to-emerald-600',
      desc: 'Dual-phase validator. Compares the synthetically created response sentence-by-sentence with the provided source context chunks. If unsupported arguments are detected, the response is discarded or flagged.',
      inputs: 'Drafted response text, validated source contexts.',
      outputs: 'Factual Grounding score (0% to 100%), grounding status string.',
      benefits: 'Practically eliminates loose hallucination, ensuring answering contains 100% verifiably traceable statements only.',
      codeSnippet: `if not check_grounding(llm_answer, source_chunks): raise HallucinationException()`
    }
  };

  const activeStage = stages[activeStageId] || stages['router'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Interactive SVG Flowchart Area */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-3 left-4 flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Interactive Pipeline Schema</span>
        </div>
        <p className="text-xs text-slate-400 mt-3 mb-6 font-sans">
          Click any active stage node below to view corporate RAG operations design decisions, algorithmic parameters, and source equations in real time.
        </p>

        {/* Custom Responsive Flowchart Grid */}
        <div className="flex flex-col space-y-4 max-w-md mx-auto py-2">
          {Object.entries(stages).map(([id, s]) => {
            const IconComp = s.icon;
            const isActive = activeStageId === id;
            return (
              <button
                key={id}
                id={`arch-node-${id}`}
                onClick={() => setActiveStageId(id)}
                className={`w-full text-left p-4 rounded-xl border transition-all relative ${
                  isActive 
                    ? 'bg-slate-800 border-indigo-500 shadow-lg translate-x-1 ring-1 ring-indigo-500/30' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Visual Connection Arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color} text-white`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{s.title}</h4>
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-1">{s.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-500'}`}>
                      {isActive ? 'Selected' : 'View'}
                    </span>
                  </div>
                </div>

                {/* Vertical Connector Dots */}
                <div className="absolute -bottom-4 left-6 h-4 w-[2px] bg-indigo-500/20 pointer-events-none last:hidden"></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Detail Viewer Drawer Card */}
      <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between self-stretch">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeStage.color} text-white shadow`}>
              <activeStage.icon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Architecture Specification</span>
              <h3 className="text-base font-bold text-slate-100">{activeStage.title}</h3>
            </div>
          </div>

          <div className="space-y-4 font-sans">
            <div>
              <h5 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Functional Role & Scope</h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeStage.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Input Payload</span>
                <p className="text-[11px] text-slate-300 mt-0.5 font-medium leading-normal">{activeStage.inputs}</p>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Output Parameters</span>
                <p className="text-[11px] text-slate-300 mt-0.5 font-medium leading-normal">{activeStage.outputs}</p>
              </div>
            </div>

            <div className="pt-2">
              <h5 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Architectural Benefit</h5>
              <p className="text-xs text-emerald-400 mt-1 leading-relaxed">{activeStage.benefits}</p>
            </div>
          </div>
        </div>

        {/* Pseudo-Code Section */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">Execution Pseudocode</span>
          <div className="mt-1.5 p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto select-all">
            <code>{activeStage.codeSnippet}</code>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono italic">
            * This node is executed server-side to guarantee Zero-Trust compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
