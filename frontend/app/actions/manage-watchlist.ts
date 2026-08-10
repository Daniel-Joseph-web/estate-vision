"use server";

import { getAdminDb, requireUser } from "@/lib/firebase/admin";

export async function addWatchlistItem(input: {
  idToken: string;
  name: string;
  imageData: string; // Base64 data URL
}) {
  try {
    const user = await requireUser(input.idToken);
    const db = getAdminDb();

    const docRef = db.collection("watchlist").doc();
    await docRef.set({
      user_id: user.uid,
      name: input.name,
      image_data: input.imageData,
      created_at: new Date().toISOString(),
    });

    return { ok: true, id: docRef.id };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to add subject.",
    };
  }
}

export async function deleteWatchlistItem(input: {
  idToken: string;
  itemId: string;
}) {
  try {
    const user = await requireUser(input.idToken);
    const db = getAdminDb();

    const docRef = db.collection("watchlist").doc(input.itemId);
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.user_id !== user.uid) {
      return { ok: false, message: "Item not found or unauthorized." };
    }

    await docRef.delete();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete subject.",
    };
  }
}