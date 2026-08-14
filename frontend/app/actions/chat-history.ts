"use server";

import { getFirestore } from "firebase-admin/firestore";
import { requireUser } from "@/lib/firebase/admin";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  screenshot?: string;
  timestamps?: Array<{ seconds: number; description: string }>;
}

export async function getChatHistory(input: { idToken: string; videoId: string }) {
  try {
    await requireUser(input.idToken);
    
    // Automatically uses the initialized Firebase Admin app
    const db = getFirestore(); 
    const docSnap = await db.collection("video_chats").doc(input.videoId).get();
    
    if (docSnap.exists) {
      return { ok: true, messages: (docSnap.data()?.messages || []) as ChatMessage[] };
    }
    return { ok: true, messages: [] };
  } catch {
    // Removed the unused 'error' variable binding to satisfy ESLint
    return { ok: false, messages: [], message: "Failed to load chat history." };
  }
}

export async function saveChatHistory(input: { idToken: string; videoId: string; messages: ChatMessage[] }) {
  try {
    await requireUser(input.idToken);
    const db = getFirestore();
    
    await db.collection("video_chats").doc(input.videoId).set({
      messages: input.messages,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    
    return { ok: true };
  } catch {
    return { ok: false, message: "Failed to save chat history." };
  }
}

export async function clearChatHistory(input: { idToken: string; videoId: string }) {
  try {
    await requireUser(input.idToken);
    const db = getFirestore();
    await db.collection("video_chats").doc(input.videoId).delete();
    return { ok: true };
  } catch {
    return { ok: false, message: "Failed to clear chat history." };
  }
}