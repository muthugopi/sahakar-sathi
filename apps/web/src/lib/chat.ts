import type {
  ChatMessage,
  ChatResponse,
  FeedbackInput,
  KnowledgeCategory,
  LanguageCode,
} from '@sahakar/shared';
import { api } from './api';

export interface SendMessageArgs {
  message: string;
  conversationId?: string;
  language?: LanguageCode;
  category?: KnowledgeCategory;
}

export function sendMessage(args: SendMessageArgs): Promise<ChatResponse> {
  return api<ChatResponse>('/chat', {
    method: 'POST',
    body: args,
    timeoutMs: 45_000, // model + retrieval can be slow on the first call
  });
}

export interface ChatHistory {
  conversationId: string;
  language: LanguageCode;
  messages: ChatMessage[];
}

export function getHistory(conversationId: string): Promise<ChatHistory> {
  return api<ChatHistory>(`/chat/history?conversationId=${encodeURIComponent(conversationId)}`);
}

export function sendFeedback(input: FeedbackInput): Promise<{ ok: true }> {
  return api('/feedback', { method: 'POST', body: input });
}

const STORAGE_KEY = 'sahakar.conversation';

export function loadConversationId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveConversationId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode / storage disabled — conversation just won't persist */
  }
}

export function clearConversationId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
