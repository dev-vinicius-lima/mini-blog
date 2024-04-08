import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../../hooks/useAuthentication";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import style from "./MenuHamburguer.module.css";
import { useAuthValue } from "../../context/AuthContext";
const MenuHamburguer = () => {
  const { logout } = useAuthentication();
  const [open, setOpen] = useState(false);
  const authValue = useAuthValue();
  const { user } = authValue || {};

  return (
    <div className={style.menu}>
      <div className={style.icon}>
        <button onClick={() => setOpen(!open)} className={style.icon}>
          {open ? <IoMdClose size={20} /> : <FiMenu size={30} />}
        </button>
      </div>
      {open && (
        <div className={style.modalOpen}>
          <Link to={"/"} className={style.link}>
            Home
          </Link>
          <Link to={"/posts/create"}>Novo Post</Link>
          <Link to={"/register"}>Cadastrar</Link>
          <Link to={"/dashboard"}>Dashboard</Link>
          <Link to={"/about"}>Sobre</Link>
          {user && (
            <button onClick={logout} className="btn btn-outline">
              Sair
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuHamburguer;
