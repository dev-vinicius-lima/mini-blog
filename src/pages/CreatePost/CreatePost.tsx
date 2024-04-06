import { useState } from "react";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/UseInsertDocuments";
import styles from "./CreatePost.module.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const { insertDocument, response } = useInsertDocument("posts");
  const authContext = useAuthValue();
  const user = authContext?.user;

  const navigate = useNavigate();

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
    const tagsArray: string[] = createTagsArray(tags.join(","));

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

    insertDocument({
      title,
      image,
      body,
      tags: tagsArray,
      uid: user.uid,
      displayName: user.displayName,
      createdBy,
    });

    // redirect home page
    navigate("/");
  };

  return (
    <div className={styles.create_post}>
      <h1>Criar post</h1>
      <p>Escreva sobre oque quiser e compartilhe o seu conhecimento!</p>
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
            value={tags.join(", ")}
          />
        </label>
        {formError && <p className="error">{formError}</p>}
        {!response.loading && <button className="btn">Cadastrar</button>}
        {response.loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {response.error && <p className="error">{response.error}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
