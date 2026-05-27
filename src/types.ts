/**
 * Enterprise RAG Intelligence Platform
 * Shared TypeScript Types & Interface Declarations
 */

export type UserRole = 'Admin' | 'Finance' | 'HR' | 'Security' | 'Operations' | 'Guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type DocumentClassification = 'Unclassified' | 'Internal' | 'Confidential' | 'Restricted' | 'Secret';

export type DocumentSource = 'PDF' | 'DOCX' | 'CSV' | 'SQL' | 'JSON' | 'Text';

export interface DocumentChunk {
  id: string;
  document_id: string;
  text: string;
  pageNumber?: number;
  lineNumber?: number;
  allowed_roles: UserRole[];
  score?: number; // BM25, Dense or Reranker score
}

export interface Document {
  id: string;
  document_id: string;
  title: string;
  content: string;
  department: string;
  classification: DocumentClassification;
  source: DocumentSource;
  created_at: string;
  allowed_roles: UserRole[];
  pageCount?: number;
}

export type PipelineStepId = 
  | 'router' 
  | 'rbac' 
  | 'retrieval' 
  | 'fuser' 
  | 'rerank' 
  | 'agent_pdf' 
  | 'agent_sql' 
  | 'agent_logs' 
  | 'agent_sec' 
  | 'supervisor' 
  | 'grounder';

export type PipelineStepStatus = 'pending' | 'running' | 'success' | 'error' | 'forbidden' | 'skipped';

export interface PipelineStep {
  id: PipelineStepId;
  name: string;
  description: string;
  status: PipelineStepStatus;
  output?: string;
  details?: any; // Sub-metrics or internal logs
  durationMs?: number;
}

export interface RAGSourceCitation {
  document_id: string;
  title: string;
  source: DocumentSource;
  department: string;
  snippet: string;
  pageNumber?: number;
  lineNumber?: number;
  relevanceScore: number;
}

export interface RAGResponse {
  query: string;
  intent: 'PDF' | 'Database' | 'Logs' | 'Security' | 'Mixed Source';
  answer: string;
  confidence: number; // 0 to 100
  sources: RAGSourceCitation[];
  pipeline: PipelineStep[];
  timestamp: string;
  rbacBlocked: boolean;
  success: boolean;
  auditId: string;
}

export interface AuditLog {
  id: string;
  user: string;
  email: string;
  role: UserRole;
  query: string;
  timestamp: string;
  retrieved_documents: string[];
  response: string;
  confidence: number;
  allowed: boolean;
  intent: string;
  feedback?: 'up' | 'down';
  feedbackComment?: string;
}

export interface SystemStats {
  totalQueries: number;
  averageResponseTimeMs: number;
  rbacBlocks: number;
  averageConfidence: number;
  feedbackCount: { up: number; down: number };
  activeDocumentCount: number;
  agentActivations: Record<string, number>;
  queriesByDepartment: Record<string, number>;
}
