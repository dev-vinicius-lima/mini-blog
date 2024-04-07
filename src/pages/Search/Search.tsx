import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { useQuery } from "../../hooks/UseQuery";
import PostDetail from "../../components/PostDetail/PostDetail";
import { Link } from "react-router-dom";
import styles from "./Search.module.css";
const Search = () => {
  const query = useQuery();
  const search = query.get("q");
  const { documents: posts } = useFetchDocuments("posts", search);

  return (
    <div className={styles.searchContainer}>
      <h1>Search</h1>
      <div className={styles.searchContainer}>
        {!posts ||
          (posts.length === 0 && (
            <>
              <p>Não form encontrados posts a partir da sua busca...</p>
              <Link to={"/"} className="btn btn-outline">
                Voltar
              </Link>
            </>
          ))}
        {posts &&
          posts.map((post) => <PostDetail key={post.title} post={post} />)}
      </div>
    </div>
  );
};

export default Search;
