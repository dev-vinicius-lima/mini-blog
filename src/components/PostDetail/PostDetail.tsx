import styles from "./PostDetail.module.css";

import { Link } from "react-router-dom";

import { Document } from "../../hooks/UseFetchDocuments";
interface PostDetailProps {
  post: Document;
}

const PostDetail = ({ post }: PostDetailProps) => {
  const tags = Array.isArray(post.tags) ? post.tags : [];
  return (
    <div className={styles.post_detail}>
      <img src={post.image} alt={post.title} />
      <h2>{post.title}</h2>
      <p className={styles.createdby}>{post.createdBy}</p>
      <div className={styles.tags}>
        {tags.map((tag: string) => (
          <p key={tag}>
            <span>#</span>
            {tag}
          </p>
        ))}
      </div>
      <Link to={`/posts/${post.id}`} className="btn btn-outline">
        Ler
      </Link>
    </div>
  );
};

export default PostDetail;
