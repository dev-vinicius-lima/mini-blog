import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export interface Document {
  id: string;
  createdAt: Date;
  title: string;
  body: string;
  tags: string[];
  displayName: string;
  image: string;
  post: boolean;
  createdBy: string;
}

export const useFetchDocument = (docCollection: string, id: string) => {
  const [document, setDocument] = useState<Document | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function loadDocument() {
      if (cancelled) return;
      setLoading(true);

      try {
        const docRef = doc(db, docCollection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDocument(docSnap.data() as Document);
        } else {
          setDocument(null);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          console.error(error);
          setError("ops... ocorreu um erro");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDocument();

    return () => {
      setCancelled(true);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [docCollection, id, cancelled]);

  return {
    document,
    loading,
    error,
  };
};
