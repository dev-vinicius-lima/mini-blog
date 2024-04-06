import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

type State = {
  loading: null | boolean;
  error: null | string;
};

type Action = {
  type: string;
  payload?: string | null;
};

const insertReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload || null };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer<React.Reducer<State, Action>>(
    insertReducer,
    initialState
  );
  const [cancelled, setCancelled] = useState(false);
  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  interface DocumentProps {
    title: string;
    image: string;
    body: string;
    tags: string[];
    // user: {
    //   uid: string;
    // };
    displayName: string | undefined;
    uid: string;
    createdBy: string;
  }

  const insertDocument = async (document: DocumentProps) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });
    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );
      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument.id,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        checkCancelBeforeDispatch({
          type: "ERROR",
          payload: error.message,
        });
      }
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { insertDocument, response };
};
