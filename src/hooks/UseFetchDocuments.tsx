import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  QuerySnapshot,
} from "firebase/firestore";

interface Document {
  id: string;
  createdAt: Date;
  title: string;
}

export const useFetchDocuments = (
  docCollection: string,
  search: string | null = null,
  uid: string | null = null
) => {
  const [documents, setDocuments] = useState<Document[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function loadData() {
      if (cancelled) return;
      setLoading(true);

      const collectionRef = collection(db, docCollection);
      const q = query(collectionRef, orderBy("createdAt", "desc"));

      try {
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Document[]
          );
        });
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error);
          setError(error.message);
          setLoading(false);
        }
      }
    }

    loadData();
  }, [docCollection, search, uid, cancelled]);
  useEffect(() => {
    return () => {
      setCancelled(true);
    };
  }, []);

  return {
    documents,
    loading,
    error,
  };
};
