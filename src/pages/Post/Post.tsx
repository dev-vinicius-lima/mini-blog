import styles from "./Post.module.css";

// hooks
import { useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/UseFetchDocument";

const Post = () => {
  const { id } = useParams();
  const { document: post, loading } = useFetchDocument("posts", id ?? "");

  return (
    <div className={styles.postContainer}>
      {loading && <p>Carregando Post...</p>}
      {post && (
        <>
          <h1>{post.title}</h1>
          <img src={post.image} alt={post.title} />
          <p>{post.body}</p>
          <h2>Este poste trata sobre:</h2>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
