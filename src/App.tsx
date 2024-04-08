import { useAuthentication } from "./hooks/useAuthentication";
import { User, onAuthStateChanged } from "firebase/auth";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useState, useEffect } from "react";
import CreatePost from "./pages/CreatePost/CreatePost";
import Dashboard from "./pages/Dashboard/Dashboard";
import Search from "./pages/Search/Search";
import Post from "./pages/Post/Post";
import EditPost from "./pages/EditPost/EditPost";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const { auth } = useAuthentication();
  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <AuthProvider
        value={
          user
            ? {
                user: { ...user, displayName: user.displayName || "Anonymous" },
              }
            : undefined
        }
      >
        <BrowserRouter>
          <NavBar />
          <div className="container">
            <Routes>
              <Route path="/" element={user ? <Home /> : <Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to={"/"} />}
              />
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to={"/"} />}
              />
              <Route
                path="/posts/create"
                element={user ? <CreatePost /> : <Navigate to={"/login"} />}
              />
              <Route
                path="/posts/edit/:id"
                element={user ? <EditPost /> : <Navigate to={"/login"} />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to={"/login"} />}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
