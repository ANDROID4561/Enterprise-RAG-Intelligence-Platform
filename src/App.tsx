/**
 * Enterprise RAG Intelligence Platform
 * Production-Grade Master Frontend Dashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Eye, 
  KeyRound, 
  Send, 
  Upload, 
  Database, 
  FileText, 
  Users, 
  RefreshCw, 
  Trash2, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  ThumbsUp, 
  ThumbsDown, 
  Layers, 
  BarChart3, 
  HelpCircle, 
  Terminal, 
  FileCode, 
  LockKeyhole, 
  Compass, 
  UserSquare2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  Cell
} from 'recharts';

import { 
  UserRole, 
  User, 
  Document, 
  DocumentClassification, 
  DocumentSource, 
  RAGResponse, 
  PipelineStep, 
  AuditLog, 
  SystemStats 
} from './types';

import SVGArchitecture from './components/SVGArchitecture';
import ManualsTab from './components/ManualsTab';

// Predefined Corporate Users List matching the server
const COMP_USERS: Record<string, { name: string; email: string; role: UserRole; title: string; avatarBg: string }> = {
  'alexis': { name: 'Alexis Miller', email: 'alexis.miller@nexuscorps.com', role: 'Admin', title: 'Platform Director', avatarBg: 'bg-violet-600 text-white' },
  'sarah': { name: 'Sarah Jenkins', email: 'sarah.jenkins@nexuscorps.com', role: 'Finance', title: 'Finance Department Manager', avatarBg: 'bg-emerald-600 text-white' },
  'michael': { name: 'Michael Chen', email: 'michael.chen@nexuscorps.com', role: 'Security', title: 'Director of CISO Office', avatarBg: 'bg-amber-600 text-white' },
  'david': { name: 'David Ross', email: 'david.ross@nexuscorps.com', role: 'HR', title: 'Senior HR Advisor', avatarBg: 'bg-sky-600 text-white' },
  'emily': { name: 'Emily Zhao', email: 'emily.zhao@nexuscorps.com', role: 'Operations', title: 'Supply Chain Operations Lead', avatarBg: 'bg-fuchsia-600 text-white' },
  'guest_user': { name: 'Guest Visitor', email: 'guest.visitor@external.com', role: 'Guest', title: 'External Consultant', avatarBg: 'bg-slate-600 text-white' },
};

// Help idea queries
const SUGGESTED_QUERIES = [
  { text: "What was Q3 revenue & performance metrics?", tooltip: "Fin Cleared", minRole: "Finance" },
  { text: "How much did Q3 shipping delays cost Operations?", tooltip: "Mixed Source Agentic reasoning", minRole: "Operations" },
  { text: "Show carryover policy for unused vacation days", tooltip: "HR Cleared", minRole: "Guest" },
  { text: "Identify failed login anomalies on 10.45.2.148", tooltip: "Sec Logs", minRole: "Security" },
  { text: "What is salary grade compensation cap for Tier L8?", tooltip: "HR Restricted Code", minRole: "HR" },
  { text: "Which vendors have shipment delays over 20%?", tooltip: "Relational CSV SQL lookups", minRole: "Operations" }
];

export default function App() {
  // Authentication & session state
  const [activeUserKey, setActiveUserKey] = useState<string>('alexis');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-05',
    name: 'Alexis Miller',
    email: 'alexis.miller@nexuscorps.com',
    role: 'Admin'
  });

  // Navigation Panel State
  const [activeTab, setActiveTab] = useState<'sandbox' | 'upload' | 'audit' | 'matrix' | 'analytics' | 'architecture'>('sandbox');

  // Query engine states
  const [userQuery, setUserQuery] = useState<string>('');
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [pipelineTrack, setPipelineTrack] = useState<PipelineStep[]>([]);
  const [ragResult, setRagResult] = useState<RAGResponse | null>(null);
  const [activeStepDetail, setActiveStepDetail] = useState<string | null>('router');

  // Dynamic system entities retrieved from backend
  const [documents, setDocuments] = useState<Document[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  // New File Upload Form state
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadContent, setUploadContent] = useState<string>('');
  const [uploadDept, setUploadDept] = useState<string>('Operations');
  const [uploadClassification, setUploadClassification] = useState<DocumentClassification>('Internal');
  const [uploadRoles, setUploadRoles] = useState<UserRole[]>(['Admin', 'Operations']);
  const [uploadSource, setUploadSource] = useState<DocumentSource>('PDF');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string>('');

  // Comment Feedback states
  const [activeFeedbackLogId, setActiveFeedbackLogId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSuccessId, setFeedbackSuccessId] = useState<string | null>(null);

  // Chat window state
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Synchronize dynamic datasets from standard Express backend APIs
  const fetchBackendData = async () => {
    try {
      setLoadingDocs(true);
      // Fetch documents
      const docsRes = await fetch('/api/documents');
      if (docsRes.ok) {
        const dJson = await docsRes.json();
        setDocuments(dJson.documents || []);
      }

      // Fetch audits and stats
      const auditRes = await fetch('/api/audit');
      if (auditRes.ok) {
        const aJson = await auditRes.json();
        setAuditLogs(aJson.logs || []);
        setAnalytics(aJson.stats || null);
      }
    } catch (e) {
      console.error("Failed to synchronize with backend endpoints. Make sure Express remains active.", e);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Sync user profile when selected key swaps
  useEffect(() => {
    const info = COMP_USERS[activeUserKey];
    if (info) {
      const u: User = {
        id: activeUserKey === 'alexis' ? 'usr-05' : 
            activeUserKey === 'sarah' ? 'usr-01' : 
            activeUserKey === 'michael' ? 'usr-02' : 
            activeUserKey === 'david' ? 'usr-03' : 
            activeUserKey === 'emily' ? 'usr-04' : 'usr-06',
        name: info.name,
        email: info.email,
        role: info.role
      };
      setCurrentUser(u);
      
      // Auto push alert statement in chat
      setRagResult(null);
      setPipelineTrack([]);
    }
  }, [activeUserKey]);

  // Execute RAG Pipeline Query through server-side GenAI Engine
  const handleQueryRAG = async (customText?: string) => {
    const textToQuery = customText || userQuery;
    if (!textToQuery.trim()) return;

    setQueryLoading(true);
    setUserQuery('');
    setRagResult(null);
    setPipelineTrack([]);
    setActiveStepDetail('router');

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToQuery,
          userId: activeUserKey,
        }),
      });

      if (response.ok) {
        const data: RAGResponse = await response.json();
        setRagResult(data);
        setPipelineTrack(data.pipeline || []);
        
        // Dynamic logs updates
        fetchBackendData();
      } else {
        const errJson = await response.json();
        alert(`Engine pipeline error: ${errJson.error}`);
      }
    } catch (e: any) {
      console.error("Query post failed", e);
      alert(`Query connection failed: ${e.message}`);
    } finally {
      setQueryLoading(false);
    }
  };

  // Register dynamic Custom document uploads
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadContent.trim()) {
      setUploadErrorMsg("Title and document body content fields are mandatory.");
      return;
    }

    setUploading(true);
    setUploadErrorMsg('');
    setUploadSuccessMsg('');

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          content: uploadContent,
          department: uploadDept,
          classification: uploadClassification,
          allowed_roles: uploadRoles,
          source: uploadSource
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUploadSuccessMsg(data.message || "Document successfully ingested and indexed.");
        setUploadTitle('');
        setUploadContent('');
        
        // Refresh tables
        fetchBackendData();
      } else {
        const err = await response.json();
        setUploadErrorMsg(err.error || "Failed indexing custom documents.");
      }
    } catch (err: any) {
      setUploadErrorMsg(`Request connection failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Submit query feedback
  const handleFeedbackSubmit = async (id: string, valence: 'up' | 'down') => {
    try {
      const response = await fetch('/api/audit/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          feedback: valence,
          comment: feedbackComment
        })
      });

      if (response.ok) {
        setFeedbackSuccessId(id);
        setFeedbackComment('');
        setTimeout(() => setFeedbackSuccessId(null), 2500);
        fetchBackendData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to remove this document from the vector store?")) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBackendData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Format timestamp helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', { hour12: false, month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* ---------------------------------------------------------------------- */}
      {/* ENTERPRISE TOP CONTROL BAR (User profile switches & compliance alerts) */}
      {/* ---------------------------------------------------------------------- */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
            <Layers className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase font-mono">Enterprise RAG Intelligence Platform</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>RESTRICTED SECURE IN-MEMORY DATA STORE SHARDS ACTIVE</span>
            </p>
          </div>
        </div>

        {/* Dynamic Identity Simulator */}
        <div className="flex items-center space-x-2.5 bg-slate-950 p-1.5 px-3 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4 text-indigo-400" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Active Identity:</span>
          </div>
          <select
            value={activeUserKey}
            onChange={(e) => setActiveUserKey(e.target.value)}
            className="bg-slate-900 text-xs text-indigo-200 border-none outline-none ring-0 cursor-pointer font-semibold py-0.5 px-1 pr-4 rounded"
          >
            <option value="alexis">Alexis Miller (Admin User)</option>
            <option value="sarah">Sarah Jenkins (Finance Dept)</option>
            <option value="michael">Michael Chen (CISO / Security)</option>
            <option value="david">David Ross (HR Specialist)</option>
            <option value="emily">Emily Zhao (Operations Division)</option>
            <option value="guest_user">Guest Visitor (External Guest)</option>
          </select>
        </div>
      </header>

      {/* Corporate profile card banner */}
      <div className="bg-gradient-to-r from-indigo-950/20 via-slate-900 to-indigo-950/10 px-6 py-2.5 border-b border-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
          <span className="text-slate-400 font-mono text-[11px]">System clearance level assigned to user:</span>
          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
            currentUser.role === 'Admin' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' :
            currentUser.role === 'Security' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
            currentUser.role === 'Finance' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            currentUser.role === 'HR' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
            currentUser.role === 'Operations' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20' :
            'bg-slate-800 text-slate-400'
          }`}>
            {currentUser.role} Level
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-semibold">{currentUser.name} ({COMP_USERS[activeUserKey]?.title})</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest hidden sm:block">
          Governance Invariants: User Clearance IN allowed_roles
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MASTER LAYOUT CONTAINER WRAPPER WITH HORIZONTAL TABS */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Side Tab Icons Sidebar */}
        <aside className="w-full md:w-56 border-r border-slate-900 bg-slate-900/10 flex flex-row md:flex-col p-2 md:p-3 overflow-x-auto md:overflow-x-visible gap-1.5 shrink-0">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase px-2 py-1 mb-1 font-bold hidden md:block">Engine Operations</span>
          {[
            { id: 'sandbox', label: 'Agent Workspace', icon: Sparkles },
            { id: 'upload', label: 'Document Index', icon: Upload },
            { id: 'matrix', label: 'Permissions Matrix', icon: LockKeyhole },
            { id: 'audit', label: 'SIEM Logs / Audit', icon: Database },
            { id: 'analytics', label: 'Query Analytics', icon: BarChart3 },
            { id: 'architecture', label: 'Guides & Schemas', icon: Terminal },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all text-left whitespace-nowrap md:w-full select-none ${
                  isSel 
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          
          <div className="mt-auto pt-6 border-t border-slate-900 space-y-1.5 hidden md:block font-mono">
            <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[10px] text-slate-500">
              <span className="font-semibold text-slate-400">SIEM Statistics:</span>
              <div className="mt-1 flex justify-between">
                <span>Active Files:</span>
                <span className="text-slate-300 font-bold">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Blocks:</span>
                <span className="text-red-400 font-bold">{analytics?.rbacBlocks || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Conf:</span>
                <span className="text-indigo-400 font-bold">{analytics?.averageConfidence || 0}%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------------------------------------------------------------------- */}
        {/* MAIN PANEL VIEW AREA */}
        {/* ---------------------------------------------------------------------- */}
        <main className="flex-1 p-5 lg:p-6 overflow-y-auto">
          
          {/* TAB 1: WORKSPACE SANDBOX */}
          {activeTab === 'sandbox' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Chat workspace pane */}
              <div className="xl:col-span-8 space-y-6">
                
                {/* Visual Dashboard Highlights */}
                <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <span>RAG Assistant Chat Workspace</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-sans">
                      Ask context-grounded queries. Files are dynamically filtered relative to **{currentUser.role}** roles pre-retrieval.
                    </p>
                  </div>
                  
                  {/* Prompt Idea Trigger Drawer */}
                  <div className="text-xs text-slate-400 flex items-center space-x-1.5 bg-slate-950 p-2 border border-slate-800 rounded-lg">
                    <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>Try matching data sources with cross-source references</span>
                  </div>
                </div>

                {/* Simulated Query Box Input */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQueryRAG()}
                      placeholder="Enter query (e.g., 'What was Q3 revenue and how did Zenith shipping delays impact operations?')..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 pr-12 font-mono"
                    />
                    <button
                      onClick={() => handleQueryRAG()}
                      disabled={queryLoading || !userQuery.trim()}
                      className="absolute right-2.5 top-2.5 p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-600 transition-colors cursor-pointer"
                    >
                      {queryLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Suggest queries drawer */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Designated Search Prompts:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_QUERIES.map((q, idx) => {
                        const canRun = currentUser.role === 'Admin' || 
                          (q.minRole === 'Finance' && (currentUser.role === 'Finance')) || 
                          (q.minRole === 'Security' && (currentUser.role === 'Security')) || 
                          (q.minRole === 'HR' && (currentUser.role === 'HR')) || 
                          (q.minRole === 'Operations' && (currentUser.role === 'Operations' || currentUser.role === 'Finance' || currentUser.role === 'Security')) ||
                          (q.minRole === 'Guest');

                        return (
                          <button
                            key={idx}
                            onClick={() => handleQueryRAG(q.text)}
                            disabled={queryLoading}
                            className={`px-2.5 py-1.5 rounded text-[11px] font-mono text-left transition-all tracking-tight border flex items-center space-x-1 ${
                              canRun 
                                ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60' 
                                : 'bg-rose-950/5 border-rose-950/10 text-rose-300/40 cursor-not-allowed italic'
                            }`}
                          >
                            <span>{q.text}</span>
                            <span className={`text-[8px] font-bold px-1 rounded uppercase ${canRun ? 'bg-slate-800 text-indigo-400' : 'bg-rose-950 text-rose-400'}`}>
                              {canRun ? 'RUN' : 'BLOCK'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Active Results Display Pane */}
                {queryLoading && (
                  <div className="p-8 bg-slate-900/20 border border-slate-900/60 rounded-xl flex flex-col items-center justify-center space-y-4 animate-pulse">
                    <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                    <div className="text-center space-y-1">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Active Multi-Source RAG Pipeline Engaged</span>
                      <p className="text-[11px] text-slate-500 font-mono">Routing query &rarr; validating user security context clearance &rarr; cosine matching chunks matches...</p>
                    </div>
                  </div>
                )}

                {ragResult && (
                  <div className="space-y-6">
                    {/* Primary Answer Box */}
                    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-md space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="text-emerald-400 h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200">Grounded Synthesis Answer</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-950 p-1 px-2.5 rounded-full border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Context Grounding Match:</span>
                          <span className={`text-xs font-mono font-bold ${ragResult.confidence > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{ragResult.confidence}%</span>
                        </div>
                      </div>

                      {/* Main Synthesized Text markdown formatted */}
                      <div className="prose prose-invert prose-slate text-xs leading-relaxed max-w-none text-slate-300 font-sans space-y-3 font-normal"
                        dangerouslySetInnerHTML={{ __html: ragResult.answer
                          .replace(/### (.*)/g, '<h4 class="text-sm font-bold text-white uppercase font-mono tracking-tight">$1</h4>')
                          .replace(/\* \*\*(.*)\*\*/g, '<br/>• <strong>$1</strong>')
                          .replace(/\b(VEN-\d+|10\.\d+\.\d+\.\d+|185\.220\.101\.\d+)\b/g, '<code class="bg-indigo-950 text-indigo-300 p-0.5 px-1 rounded font-mono text-[10px]">$1</code>')
                          .replace(/\n/g, '<br/>')
                        }}
                      />

                      {/* Citation block */}
                      {ragResult.sources && ragResult.sources.length > 0 && (
                        <div className="pt-4 border-t border-slate-850/60 space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Traceable Citation Anchors:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {ragResult.sources.map((src, sIdx) => (
                              <div key={sIdx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold font-mono text-indigo-400 truncate max-w-[200px]">{src.title}</span>
                                    <span className="text-[8px] font-mono uppercase px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">{src.source}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 italic line-clamp-2 mt-1 leading-normal font-sans">
                                    &ldquo;{src.snippet}&rdquo;
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 mt-2 pt-1 border-t border-slate-900">
                                  <span>DOC ID: {src.document_id}</span>
                                  <span>{src.pageNumber ? `Page ${src.pageNumber}` : `Line ${src.lineNumber || 1}`}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dynamic Feedback block */}
                      <div className="pt-4 border-t border-slate-850/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1.5">
                          <HelpCircle className="h-4 w-4 text-slate-500" />
                          <span>Does this grounded reply completely resolve your audit criteria?</span>
                        </span>
                        
                        {feedbackSuccessId === ragResult.auditId ? (
                          <div className="flex items-center space-x-1 text-emerald-400 font-mono text-xs font-semibold">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Feedback Recorded (SIEM logged)</span>
                          </div>
                        ) : activeFeedbackLogId === ragResult.auditId ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={feedbackComment}
                              onChange={(e) => setFeedbackComment(e.target.value)}
                              placeholder="Add optional notes..."
                              className="bg-slate-900 border border-slate-850 rounded p-1 text-[11px] font-mono outline-none text-slate-200"
                            />
                            <button
                              onClick={() => handleFeedbackSubmit(ragResult.auditId, 'up')}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 font-mono text-[10px] font-semibold text-white uppercase"
                            >
                              Push
                            </button>
                            <button
                              onClick={() => setActiveFeedbackLogId(null)}
                              className="px-1.5 py-1 text-slate-500 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                handleFeedbackSubmit(ragResult.auditId, 'up');
                              }}
                              className="p-1 px-3 text-[10px] font-mono rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-850 font-bold flex items-center space-x-1"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>CORRECT</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveFeedbackLogId(ragResult.auditId);
                              }}
                              className="p-1 px-3 text-[10px] font-mono rounded bg-slate-900 border border-slate-800 text-rose-400 hover:bg-slate-850 font-bold flex items-center space-x-1"
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span>INACCURATE</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar with clickable Pipeline execution steps */}
              <div className="xl:col-span-4 space-y-6">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">RAG Pipeline Execution Trace</span>
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  </div>

                  {pipelineTrack.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2 font-mono leading-relaxed">
                      Enter a search inquiry on the left console to record live interactive step trace benchmarks.
                    </p>
                  ) : (
                    <div className="space-y-2 font-mono text-[11px]">
                      {pipelineTrack.map((step) => (
                        <button
                          key={step.id}
                          onClick={() => setActiveStepDetail(step.id)}
                          className={`w-full text-left p-2.5 rounded border transition-all ${
                            activeStepDetail === step.id 
                              ? 'bg-slate-950 border-indigo-500/80 text-white shadow-inner shadow-indigo-500/10' 
                              : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-slate-300 truncate max-w-[200px]">{step.name}</span>
                            <span className={`px-1 rounded text-[8px] font-bold uppercase tracking-wider ${
                              step.status === 'success' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/20' :
                              step.status === 'forbidden' ? 'bg-rose-950 text-rose-400 border border-rose-500/20' :
                              step.status === 'running' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/20 animate-pulse' :
                              'bg-slate-850 text-slate-500'
                            }`}>
                              {step.status}
                            </span>
                          </div>
                          
                          {/* Duration info if clicked */}
                          {activeStepDetail === step.id && (
                            <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-900 pt-1.5 space-y-1 leading-normal font-sans">
                              <p className="text-slate-300 italic">{step.description}</p>
                              {step.output && <p className="text-emerald-400 font-mono text-[10px] bg-slate-900 p-1.5 rounded">{step.output}</p>}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Local environment properties info */}
                <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl text-slate-400 space-y-2.5 font-mono text-[11px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-1.5">Platform Components</span>
                  <div className="flex justify-between">
                    <span>Embedding Module:</span>
                    <span className="text-indigo-400">BGE-M3 (Dual index)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank Scoring:</span>
                    <span className="text-indigo-400">Dense + BM25 Fusion</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rerank Architecture:</span>
                    <span className="text-indigo-400">BGE Cross-Encoder</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Engine:</span>
                    <span className="text-indigo-400">Qdrant Vector Cluster</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Core Synthesizer:</span>
                    <span className="text-emerald-400">Gemini 3.5 Flash</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENT INDEX & UPLOADER */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              
              {/* Flex Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Upload Section Form */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5 uppercase font-mono tracking-tight pb-2 border-b border-slate-850">
                      <Upload className="h-4 w-4 text-indigo-400" />
                      <span>Ingest New Corporate Asset</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-sans mt-2">
                      Upload dynamic datasets (TXT, CSV, PDF manuals), select classification boundaries, and set permitted group access values.
                    </p>
                  </div>

                  <form onSubmit={handleUploadDocument} className="space-y-3 font-mono text-[11px]">
                    <div className="space-y-1">
                      <label className="text-slate-500 font-semibold uppercase">Document File Name</label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="e.g. employee_bonus_payouts_2026.docx"
                        className="w-full bg-slate-950 border border-slate-804 border-slate-800 rounded p-2 text-slate-200 outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-semibold uppercase">Department</label>
                        <select
                          value={uploadDept}
                          onChange={(e) => setUploadDept(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none text-xs"
                        >
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="Operations">Operations</option>
                          <option value="Security">Security</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-semibold uppercase">Doc Type Source</label>
                        <select
                          value={uploadSource}
                          onChange={(e) => setUploadSource(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none text-xs"
                        >
                          <option value="PDF">PDF PDF File</option>
                          <option value="DOCX">DOCX Word Document</option>
                          <option value="CSV">CSV Tabular Values</option>
                          <option value="JSON">JSON Server Log</option>
                          <option value="Text">TXT Text File</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-semibold uppercase">Security Clearance Level</label>
                      <select
                        value={uploadClassification}
                        onChange={(e) => setUploadClassification(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none text-xs"
                      >
                        <option value="Internal">Internal (General use)</option>
                        <option value="Confidential">Confidential (HR only)</option>
                        <option value="Restricted">Restricted (Sec logs)</option>
                        <option value="Secret">Secret (Finance metrics)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-semibold uppercase block">Permitted Roles Allowed</label>
                      <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-950 rounded border border-slate-800">
                        {['Admin', 'Finance', 'Security', 'HR', 'Operations', 'Guest'].map((role) => {
                          const isSel = uploadRoles.includes(role as any);
                          return (
                            <label key={role} className="flex items-center space-x-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSel}
                                onChange={() => {
                                  if (isSel) {
                                    setUploadRoles(uploadRoles.filter(r => r !== role));
                                  } else {
                                    setUploadRoles([...uploadRoles, role as UserRole]);
                                  }
                                }}
                                className="rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-800"
                              />
                              <span className="text-slate-300 font-mono text-[10px]">{role}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-semibold uppercase">Document Body Text</label>
                      <textarea
                        rows={5}
                        value={uploadContent}
                        onChange={(e) => setUploadContent(e.target.value)}
                        placeholder="Insert corporate guidelines, table logs, or report content chunks..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none text-xs font-sans leading-normal"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-2.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono transition-all text-xs uppercase cursor-pointer"
                    >
                      {uploading ? "Ingesting Shards..." : "Commit To Vector Storage"}
                    </button>

                    {uploadSuccessMsg && (
                      <p className="p-2.5 bg-emerald-950/50 border border-emerald-900/80 rounded font-semibold text-emerald-400 text-[10px]">
                        {uploadSuccessMsg}
                      </p>
                    )}
                    {uploadErrorMsg && (
                      <p className="p-2.5 bg-rose-950/50 border border-rose-900/80 rounded font-semibold text-rose-400 text-[10px]">
                        {uploadErrorMsg}
                      </p>
                    )}
                  </form>
                </div>

                {/* Right Side Existing Documents list */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <div>
                      <h2 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-tight flex items-center space-x-1">
                        <Database className="h-4 w-4 text-indigo-400" />
                        <span>Corporate File Shards (Pre-Seeded Vector Store)</span>
                      </h2>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Active storage files chunked, embedded and loaded in Qdrant memory.
                      </p>
                    </div>
                  </div>

                  {loadingDocs ? (
                    <div className="p-12 text-center text-xs text-slate-500 font-mono">Syncing datasets...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-[10px] text-slate-400 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-850 text-slate-500 uppercase">
                            <th className="py-2.5">Document Details</th>
                            <th className="py-2.5">Dept</th>
                            <th className="py-2.5">Source</th>
                            <th className="py-2.5">Clearance</th>
                            <th className="py-2.5">Allowed Clearance Groups</th>
                            <th className="py-2.5 text-right">Index Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850/60 text-slate-300">
                          {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-950/40">
                              <td className="py-3 pr-2 font-semibold">
                                <div className="text-slate-100 flex items-center space-x-1">
                                  <span>{doc.title}</span>
                                </div>
                                <div className="text-[9px] text-slate-500 font-normal mt-0.5">DOC ID: {doc.document_id} | Created: {formatDate(doc.created_at)}</div>
                              </td>
                              <td className="py-3">
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{doc.department}</span>
                              </td>
                              <td className="py-3 font-semibold text-slate-400">{doc.source}</td>
                              <td className="py-3">
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                                  doc.classification === 'Secret' ? 'bg-rose-950/50 text-rose-300' :
                                  doc.classification === 'Restricted' ? 'bg-amber-950/50 text-amber-300' :
                                  doc.classification === 'Confidential' ? 'bg-sky-950/50 text-sky-300' :
                                  'bg-slate-800 text-slate-300'
                                }`}>
                                  {doc.classification}
                                </span>
                              </td>
                              <td className="py-3 text-slate-400 italic">
                                {doc.allowed_roles.join(', ')}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="text-rose-400 hover:text-rose-300 p-1 bg-slate-950 border border-slate-800/80 rounded text-[9px] uppercase tracking-wide px-1.5"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: LIVE SECURITY AUDIT SIEM LEDGER */}
          {activeTab === 'audit' && (
            <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-tight flex items-center space-x-2">
                    <Database className="h-4.5 w-4.5 text-indigo-400" />
                    <span>Compliance SIEM Audit Log Ledger</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Failsafe tracking of platform queries completed, classification routes, retrieval parameters, and security blocks status.
                  </p>
                </div>
                <button
                  onClick={fetchBackendData}
                  className="flex items-center space-x-1 hover:text-indigo-400 bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono font-medium self-start sm:self-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh Shard Data</span>
                </button>
              </div>

              {/* Dynamic Table list */}
              <div className="overflow-x-auto font-mono text-[10px]">
                <table className="w-full text-left border-collapse text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase">
                      <th className="py-2.5">Audit Stamp</th>
                      <th className="py-2.5">User Identity</th>
                      <th className="py-2.5">Clearance Group</th>
                      <th className="py-2.5">Inbound Query Parameter</th>
                      <th className="py-2.5">Access Allowed</th>
                      <th className="py-2.5">Routing Vector</th>
                      <th className="py-2.5">Model Confidence</th>
                      <th className="py-2.5 pr-2">Feedback Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className={`hover:bg-slate-950/40 ${!log.allowed ? 'bg-rose-950/10' : ''}`}>
                        <td className="py-3.5">
                          <div className="text-[9px] text-slate-500">{formatDate(log.timestamp)}</div>
                          <div className="text-[8px] text-indigo-400 font-bold mt-0.5">{log.id}</div>
                        </td>
                        <td className="py-3.5 font-semibold text-slate-200">
                          <div>{log.user}</div>
                          <div className="text-[8px] text-slate-500 font-normal">{log.email}</div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            log.role === 'Admin' ? 'bg-violet-950 text-violet-400' :
                            log.role === 'Security' ? 'bg-amber-950 text-amber-400' :
                            log.role === 'Finance' ? 'bg-emerald-950 text-emerald-400' :
                            log.role === 'HR' ? 'bg-sky-950 text-sky-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {log.role}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3 font-medium text-slate-200 max-w-xs truncate" title={log.query}>
                          {log.query}
                        </td>
                        <td className="py-3.5">
                          {log.allowed ? (
                            <span className="text-emerald-400 font-bold flex items-center space-x-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>CLEARED</span>
                            </span>
                          ) : (
                            <span className="text-rose-400 font-bold flex items-center space-x-1 animate-pulse">
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span>BLOCKED (403)</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 font-bold text-slate-400">{log.intent}</td>
                        <td className="py-3.5 font-bold text-slate-300">
                          {log.allowed ? `${log.confidence}%` : "—"}
                        </td>
                        <td className="py-3.5 italic text-slate-400">
                          {log.feedback === 'up' ? (
                            <span className="text-emerald-400 font-bold flex items-center space-x-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span className="text-[9px]">Grounded: Ok</span>
                            </span>
                          ) : log.feedback === 'down' ? (
                            <span className="text-rose-400 font-bold flex items-center space-x-1">
                              <ThumbsDown className="h-3 w-3" />
                              <span className="text-[9px]">Mismatch: {log.feedbackComment || "False"}</span>
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[9px]">No logs</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PERMISSIONS INVARIANT RULES MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-tight flex items-center space-x-2">
                  <Lock className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Clearance Classification Group Settings Matrix</span>
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Corporate Zero-Trust Rules dictate matching access permission before Qdrant cluster indexing lookups block unauthorized sources.
                </p>
              </div>

              {/* Grid rules */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {[
                  { title: "Finance Secret Reports", role: "Finance, Admin", level: "Secret", color: "border-rose-900 bg-rose-950/10", label: "Q3 Fiscal Reports and consolidate cost indices" },
                  { title: "HR Confidential Data", role: "HR, Admin", level: "Confidential", color: "border-sky-900 bg-sky-950/10", label: "Executive contracts, salary codes structures and bonuses" },
                  { title: "Security Protocols", role: "Security, Admin", level: "Restricted", color: "border-amber-900 bg-amber-950/10", label: "Anomalous SSH logins logs and server subnets" },
                  { title: "Operations Manuals", role: "Operations, Finance, Security, Admin", level: "Internal", color: "border-fuchsia-900 bg-fuchsia-950/10", label: "Shipment penalties and active vendors registers" },
                ].map((rule, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${rule.color} font-mono text-xs space-y-3`}>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-200">{rule.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        rule.level === 'Secret' ? 'bg-rose-900 text-rose-300' :
                        rule.level === 'Confidential' ? 'bg-sky-900 text-sky-300' :
                        'bg-amber-900 text-amber-300'
                      }`}>{rule.level}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      {rule.label}
                    </p>

                    <div className="text-[10px] text-slate-300 flex items-center justify-between pt-1 border-t border-slate-800/60 leading-normal">
                      <span className="text-slate-500 uppercase tracking-wider text-[9px]">Permitted Groups:</span>
                      <span className="font-bold text-indigo-300">{rule.role}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Rule Simulator */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-[11px]">
                <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">Logical Role-Intersection Checker</h4>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  The system evaluates compliance criteria pre-retrieval. If the user's logged clearance role group does not intersect with the document allowed list, any query targeting that document triggers an instant 403.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Query: Salary grade Tier L8 (Clearance: Confidential)</span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Role: david (HR)</span>
                        <span className="text-emerald-400 font-bold">CLEARED (Access OK)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Role: sarah (Finance)</span>
                        <span className="text-rose-400 font-bold">DENIED (Blocked 403)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Query: Firewall ssh brute force (Clearance: Restricted)</span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Role: michael (Security)</span>
                        <span className="text-emerald-400 font-bold">CLEARED (Access OK)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Role: david (HR)</span>
                        <span className="text-rose-400 font-bold">DENIED (Blocked 403)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* KPIs Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Query Load Volume", value: analytics?.totalQueries || 0, desc: "Cumulative requests processed through platform", color: "text-indigo-400 border-indigo-950/40" },
                  { title: "Security RBAC Blocks", value: analytics?.rbacBlocked || analytics?.rbacBlocks || 0, desc: "Clearance failures preemptively blocked", color: "text-rose-400 border-rose-950/40" },
                  { title: "Core Factual Confidence", value: `${analytics?.averageConfidence || 0}%`, desc: "Avg query citation completeness rate", color: "text-emerald-400 border-emerald-950/40" },
                  { title: "Knowledge Pool Storage", value: `${documents.length} Files`, desc: "Chunks mapping in vector space", color: "text-amber-400 border-amber-950/40" }
                ].map((k, kIdx) => (
                  <div key={kIdx} className={`p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-1 font-mono text-xs ${k.color}`}>
                    <span className="text-slate-500 uppercase font-bold text-[10px]">{k.title}</span>
                    <div className="text-2xl font-bold font-sans text-slate-100">{k.value}</div>
                    <p className="text-[10px] text-slate-400 font-sans leading-normal pt-1 border-t border-slate-850/60">{k.desc}</p>
                  </div>
                ))}
              </div>

              {/* Graph charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Active queries Trends */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-md space-y-3 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-850 pb-2">Weekly Pipeline Load Tendencies</span>
                  <div className="h-64 font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { name: 'Mon', Queries: 42, RBAC_Blocks: 2, AvgConf: 94 },
                          { name: 'Tue', Queries: 58, RBAC_Blocks: 4, AvgConf: 93 },
                          { name: 'Wed', Queries: 64, RBAC_Blocks: 1, AvgConf: 95 },
                          { name: 'Thu', Queries: 82, RBAC_Blocks: 8, AvgConf: 92 },
                          { name: 'Fri', Queries: 91, RBAC_Blocks: 3, AvgConf: 96 },
                          { name: 'Sat', Queries: 18, RBAC_Blocks: 0, AvgConf: 94 },
                          { name: 'Sun', Queries: 22, RBAC_Blocks: 1, AvgConf: 95 }
                        ]}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="Queries" stroke="#6366f1" fillOpacity={1} fill="url(#colorQueries)" />
                        <Area type="monotone" dataKey="RBAC_Blocks" stroke="#f43f5e" fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Agent Activations ratios */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-md space-y-3 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-850 pb-2">Segmented Agents Activations Ratio</span>
                  <div className="h-64 font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(analytics?.agentActivations || {}).map(([key, val]) => ({
                          name: key,
                          Invocations: val || 0
                        }))}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Bar dataKey="Invocations" fill="#10b981" radius={[4, 4, 0, 0]}>
                          <Cell fill="#6366f1" />
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#a855f7" />
                          <Cell fill="#ec4899" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: SCHEMAS AND GUIDES */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* SVG architecture portal */}
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-tight mb-2">
                  System Architecture Grid Setup Specifications
                </h2>
                <SVGArchitecture />
              </div>

              {/* System documentation tabs */}
              <div className="pt-4 border-t border-slate-900">
                <h2 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-tight mb-4">
                  Accompanying Implementation Manuals & Source Codes
                </h2>
                <ManualsTab />
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Footer system indicators */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-5 py-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
        <span>© 2026 NEXUS ENTERPRISE CO - ZERO-TRUST RAG ENGINE V1.4</span>
        <span className="hidden sm:inline">SHA-256 CHECK: OK | SHARDS SYNCHRONIZED</span>
      </footer>
    </div>
  );
}
