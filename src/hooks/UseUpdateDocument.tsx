import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

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
  payload?: string | null | void;
};

const updateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload || null };
    default:
      return state;
  }
};

export const UseUpdateDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer<React.Reducer<State, Action>>(
    updateReducer,
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
    displayName: string;
    uid: string;
    createdBy: string;
    id: string;
  }

  const updateDocument = async (
    id: DocumentProps,
    data: { [key: string]: string }
  ) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      const docRef = await doc(db, docCollection, id.id);
      const updateDocument = await updateDoc(docRef, data);

      checkCancelBeforeDispatch({
        type: "UPDATED_DOC",
        payload: updateDocument,
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

  return { updateDocument, response };
};
