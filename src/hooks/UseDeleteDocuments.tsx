import { useState, useEffect, useReducer } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const initialState = {
  loading: null,
  error: null,
};

export type State = {
  loading: null | boolean;
  error: null | string;
};

type Action = {
  type: string;
  payload?: string | null | void;
};

const deleteReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload || null };
    default:
      return state;
  }
};

export const useDeleteDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer<React.Reducer<State, Action>>(
    deleteReducer,
    initialState
  );
  const [cancelled, setCancelled] = useState(false);
  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  // interface DocumentProps {
  //   title: string;
  //   image: string;
  //   body: string;
  //   tags: string[];
  //   displayName: string | undefined;
  //   uid: string;
  //   createdBy: string;
  // }

  const deleteDocument = async (id: string) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });
    try {
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));
      checkCancelBeforeDispatch({
        type: "DELETED_DOC",
        payload: deletedDocument,
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

  return { deleteDocuments: deleteDocument, response };
};
