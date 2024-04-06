import styles from "./Home.module.css";

// hooks
import { Link } from "react-router-dom";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import PostDetail from "../../components/PostDetail/PostDetail";
// components

const Home = () => {
  const [query, setQuery] = useState("");
  const { documents: posts, loading } = useFetchDocuments("posts");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className={styles.home}>
      <h1>Veja nossos posts mais recentes</h1>
      <form onSubmit={handleSubmit} className={styles.search_form}>
        <input
          type="text"
          placeholder="Ou busque por tags..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-dark">Pesquisar</button>
      </form>
      <div>
        {loading && <p>carregando...</p>}
        {posts && posts.map((post) => <PostDetail post={post} />)}
        {posts && posts.length === 0 && (
          <div className={styles.nopost}>
            <p>Não foram encontrados posts</p>
            <Link to={"/posts/create"} className="btn">
              Criar primeiro post!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
