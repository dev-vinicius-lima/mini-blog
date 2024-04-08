import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | boolean>("");
  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const user = {
      email,
      password,
    };

    const res = await login(user);
    console.log(res);
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
      <p>Faça o login para poder utilizar o sistema</p>
      <p>Não tem uma conta?</p>
      <Link to={"/register"} className={styles.register}>
        criar uma conta
      </Link>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email:</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </label>
        <label>
          <span>Senha:</span>
          <input
            type="password"
            name="password"
            required
            placeholder="Insira sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </label>

        {!loading && <button className="btn">Entrar</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
