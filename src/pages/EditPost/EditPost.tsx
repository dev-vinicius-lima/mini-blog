import { useEffect, useState } from "react";
import { useAuthValue } from "../../context/AuthContext";

import styles from "./EditPost.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/UseFetchDocument";
import { UseUpdateDocument } from "../../hooks/UseUpdateDocument";

const EditPost = () => {
  const { id } = useParams();
  const { document: post } = useFetchDocument("posts", id || "");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState<string>("");
  const [tags, setTags] = useState<string[] | string>([]);
  const [formError, setFormError] = useState("");
  const { updateDocument, response } = UseUpdateDocument("posts");
  const authContext = useAuthValue();
  const user = authContext?.user;
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setImage(post.image);
      setBody(post.body);
      const textTags = post.tags.join(", ");
      setTags(textTags);
    }
  }, [post]);

  // Função para validar a URL da imagem
  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      setFormError("A imagem precisar ser uma URL");
    }
  };

  // Função para criar o array de tags
  const createTagsArray = (tagsString: string): string[] => {
    return tagsString.split(",").map((tag) => tag.trim().toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!user) {
      setFormError("Você precisa estar autenticado para criar um post.");
      return;
    }

    // Validação da URL da imagem
    if (!isValidImageUrl(image)) {
      setFormError("URL da imagem inválida.");
      return;
    }

    // Criar o array de tags
    const tagsArray: string[] = createTagsArray(
      Array.isArray(tags) ? tags.join(",") : tags
    );

    // Checar todos os valores
    if (formError) return;

    if (!title || !image || !body || tagsArray.length === 0) {
      setFormError("Por favor, preencha todos os campos.");
      return;
    }

    if (typeof user.uid !== "string" || typeof user.displayName !== "string") {
      setFormError("Erro ao recuperar informações do usuário.");
      return;
    }
    const createdBy = user.displayName;

    const data = {
      title,
      image,
      body,
      tags: JSON.stringify(tagsArray),
      uid: user.uid,
      displayName: user.displayName,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    if (id) {
      updateDocument(
        {
          id,
          title: "",
          image: "",
          body: "",
          tags: [],
          displayName: "",
          uid: "",
          createdBy: "",
        },
        data
      );
      navigate("/dashboard");
    } else {
      setFormError("ID do post não encontrado.");
    }
  };

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h1>Editando post: {post?.title}</h1>
          <p>Altere os dados do post como desejar!</p>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Título:</span>
              <input
                type="text"
                name="title"
                required
                placeholder="Pense num bom titulo!"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </label>
            <label>
              <span>URL da Imagem:</span>
              <input
                type="text"
                name="image"
                required
                placeholder="Insira uma Imagem do seu post"
                onChange={(e) => setImage(e.target.value)}
                value={image}
              />
            </label>
            <p className={styles.preview_title}>Preview da imagem atual:</p>
            <img
              className={styles.image_preview}
              src={post.image}
              alt={post.title}
            />
            <label>
              <span>Descrição:</span>
              <textarea
                name="body"
                required
                placeholder="Descrição do post"
                onChange={(e) => setBody(e.target.value)}
                value={body}
              />
            </label>
            <label>
              <span>Tags:</span>
              <input
                type="text"
                name="tags"
                required
                placeholder="Insira as tags do seu post"
                onChange={(e) => setTags(e.target.value.split(","))}
                value={Array.isArray(tags) ? tags.join(", ") : tags}
              />
            </label>
            {formError && <p className="error">{formError}</p>}
            {!response.loading && <button className="btn">Editar</button>}
            {response.loading && (
              <button className="btn" disabled>
                Aguarde...
              </button>
            )}
            {response.error && <p className="error">{response.error}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default EditPost;
