import firebase from "firebase/compat/app";

interface CreateUserData {
  displayName?: string;
  email: string;
  password: string;
}

import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA7tIC8hRxEFRZzq1G-_cnrvcFjkFYcdQM",
  authDomain: "miniblog-934a3.firebaseapp.com",
  projectId: "miniblog-934a3",
  storageBucket: "miniblog-934a3.appspot.com",
  messagingSenderId: "680064763314",
  appId: "1:680064763314:web:a8dfd79271b8156c1350ab",
};

const initializeFirebase = () => {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
};

export const useAuthentication = () => {
  initializeFirebase();
  const auth = getAuth();
  const [error, setError] = useState<string | null | boolean>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelled, setCancelled] = useState<boolean>(false);

  function checkIfIsCancelled() {
    if (!cancelled) {
      return;
    }
    setLoading(false);
  }
  const createUser = async (data: CreateUserData) => {
    checkIfIsCancelled();

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(user, { displayName: data.displayName });
      setLoading(true);
      return user;
    } catch (error) {
      console.log("Erro ao lado =>", error);
      const firebaseError = error as firebase.auth.Error;
      let systemErrorMessage;
      if (firebaseError.message.includes("password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres";
      } else if (firebaseError.message.includes("email-already")) {
        systemErrorMessage = "Email ja cadastrado!";
      } else {
        systemErrorMessage = "Ocorreu um erro! por favor tente mais tarde";
      }
      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  // logout -sign out
  const logout = () => {
    checkIfIsCancelled();
    signOut(auth);
  };

  // Login - sign in
  interface DataProps {
    email: string;
    password: string;
  }
  const login = async (data: DataProps) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(false);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false);
    } catch (error) {
      const firebaseError = error as firebase.auth.Error;
      let systemErrorMessage;
      if (firebaseError.message.includes("password")) {
        systemErrorMessage = "Usuário não encontrado.";
      } else if (firebaseError.message.includes("wrong-password")) {
        systemErrorMessage = "Senha Incorreta.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }
      setError(systemErrorMessage);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    error,
    loading,
    logout,
    login,
  };
};
