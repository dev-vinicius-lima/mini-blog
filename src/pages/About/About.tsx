import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h1>
        Sobre o Mini <span>Blog</span>
      </h1>
      <p>
        Este projeto consiste em um blog feito com React e Typescript no
        front-end e o back-end no Firebase
      </p>
      <Link to={"/posts/create"} className="btn">
        Criar post
      </Link>
    </div>
  );
};

export default About;
