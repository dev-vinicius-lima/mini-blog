import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";

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

export const useFetchDocuments = (
  docCollection: string,
  search: string | null = null,
  uid: string | null = null
) => {
  const [documents, setDocuments] = useState<Document[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const collectionRef = collection(db, docCollection);

    async function loadData() {
      setLoading(true);
      let q;

      try {
        if (search) {
          q = query(
            collectionRef,
            where("tags", "array-contains", search),
            orderBy("createdAt", "desc")
          );
        } else {
          q = query(collectionRef, orderBy("createdAt", "desc"));
        }

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedDocuments = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Document[];
          setDocuments(fetchedDocuments);
          setLoading(false);
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching documents:", error.message);
          setError(error.message);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [docCollection, search, uid]);

  return {
    documents,
    loading,
    error,
  };
};
