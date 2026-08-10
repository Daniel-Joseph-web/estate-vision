"use client";

import { useState, useEffect } from "react";
import { PlusIcon, Trash2Icon, UserCheckIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addWatchlistItem, deleteWatchlistItem } from "@/app/actions/manage-watchlist";
import { getDb, getIdToken, currentUid } from "@/lib/firebase/client";

interface WatchlistItem {
  id: string;
  name: string;
  image_data: string;
  created_at: string;
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadWatchlist() {
    setLoading(true);
    try {
      const db = getDb();
      const q = query(collection(db, "watchlist"), where("user_id", "==", currentUid()));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WatchlistItem));
      setItems(docs);
    } catch {
      toast.error("Couldn't load watchlist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWatchlist();
  }, []);

  async function handleAddSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !file) return toast.error("Please provide a name and photo.");

    setSubmitting(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        const idToken = await getIdToken();
        const res = await addWatchlistItem({ idToken: idToken ?? "", name, imageData });

        if (res.ok) {
          toast.success(`Added ${name} to watchlist`);
          setName("");
          setFile(null);
          void loadWatchlist();
        } else {
          toast.error(res.message);
        }
        setSubmitting(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to upload photo.");
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, subjectName: string) {
    try {
      const idToken = await getIdToken();
      const res = await deleteWatchlistItem({ idToken: idToken ?? "", itemId: id });
      if (res.ok) {
        toast.success(`Removed ${subjectName}`);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="ev-label text-neutral-400">Intelligence Zone</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
          Watchlist Management
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Upload clear front-facing reference photos. Any camera detection matching these individuals will automatically trigger an alert.
        </p>
      </header>

      {/* Upload Form */}
      <form onSubmit={handleAddSubject} className="flex flex-wrap items-end gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
        <div className="min-w-64 flex-1 space-y-2">
          <label className="text-xs font-medium text-neutral-300">Subject Full Name</label>
          <Input
            placeholder="e.g., John Doe (Resident / Person of Interest)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="min-w-64 flex-1 space-y-2">
          <label className="text-xs font-medium text-neutral-300">Reference Photo</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={submitting}
          />
        </div>

        <Button type="submit" disabled={submitting || !name || !file} className="h-10 bg-red-600 px-6 font-semibold text-white hover:bg-red-700">
          {submitting ? <Loader2Icon className="animate-spin size-4" /> : <PlusIcon className="size-4" />}
          Add Subject
        </Button>
      </form>

      {/* Active Watchlist Grid */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-neutral-200">Active Watchlist ({items.length})</h2>

        {loading ? (
          <p className="text-sm text-neutral-500">Loading subjects...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 py-12 text-center">
            <UserCheckIcon className="size-8 text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-400">No watchlist subjects added yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3 min-w-0">
                  <Image
                    src={item.image_data}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="size-12 rounded-xl object-cover border border-neutral-700"
                  />
                  <p className="truncate text-sm font-medium text-neutral-100">{item.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.name)} className="text-neutral-500 hover:text-red-500">
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}