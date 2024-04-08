import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { useDeleteDocument } from "../../hooks/UseDeleteDocuments";
import { State } from "../../hooks/UseDeleteDocuments";

interface DeleteDocumentHookReturn {
  deleteDocuments: (id: string) => Promise<void>;
  response: State;
}

const Dashboard = () => {
  const authContext = useAuthValue();
  const { user } = authContext || {};
  const uid = user?.uid;

  const { deleteDocuments }: DeleteDocumentHookReturn =
    useDeleteDocument("posts");

  const { documents: posts, loading } = useFetchDocuments("posts", null, uid);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <p>Gerencie os seus posts</p>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrado posts </p>
          <Link to={"/posts/create"} className="btn">
            Criar primeiro post!
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Título</span>
            <span>Ações</span>
          </div>
          {posts &&
            posts.map((post) => (
              <div key={post.id}>
                <div className={styles.post_row}>
                  <p>{post.title}</p>
                  <div className={styles.button_container}>
                    <Link
                      to={`/posts/${post.id}`}
                      className="btn btn-outline btn-dashboard"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/posts/edit/${post.id}`}
                      className="btn btn-outline btn-dashboard"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteDocuments(post.id)}
                      className="btn btn-outline btn-danger btn-dashboard"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;
