import styles from "./Post.module.css";

// hooks
import { useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/UseFetchDocument";

const Post = () => {
  const { id } = useParams();
  const { document: post, loading } = useFetchDocument("posts", id ?? "");

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando Post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.errorContainer}>
        <p>Post não encontrado.</p>
      </div>
    );
  }

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className={styles.postContainer}>
      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} />
      <p>{post.body}</p>
      <h2>Este poste trata sobre:</h2>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <p key={tag}>
            <span>#</span>
            {tag}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Post;
