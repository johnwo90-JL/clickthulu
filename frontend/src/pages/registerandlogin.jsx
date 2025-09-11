import styles from "../styles/registerandlogin.module.css";
import { useEffect, useState } from "react";
import loginUser from "../utils/loginController";
import createUser from "../utils/registerController";

const RegisterLogin = () => {
  const [login, setLogin] = useState(true);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  function handleUpdate(e) {
    const { value } = e.target;
    if (e.target.name == "username") {
      setUsername(value);
    } else if (e.target.name == "password") {
      setPassword(value);
    } else if (e.target.name == "email") {
      setEmail(value);
    } else if (e.target.name == "confirmPassword") {
      setConfirmPassword(value);
    }
  }

  return (
    <>
      {/* Login */}
      {login && (
        <div className={styles.LoginCard}>
          <h2>Login</h2>
          <form className={styles.ForceLeft}>
            <p>Username:</p>
            <input
              name="username"
              type="text"
              className={styles.ForceWide}
              onChange={handleUpdate}
            />
            <p>Password:</p>
            <input
              name="password"
              type="password"
              className={styles.ForceWide}
              onChange={handleUpdate}
            />
          </form>
          <p onClick={() => setLogin(!login)} className={styles.FakeLink}>
            Don't have an account?
          </p>
          <button
            className={styles.LoginButton}
            onClick={() => loginUser({ username, password })}
          >
            Login
          </button>
        </div>
      )}
      {/* Register */}
      {!login && (
        <div className={styles.LoginCard}>
          <h2>Register</h2>
          <form className={styles.ForceLeft}>
            {/* <p>Full Name:</p>
            <input type="text" className={styles.ForceWide} /> */}
            <p>Email:</p>
            <input
              name="email"
              type="email"
              className={styles.ForceWide}
              onChange={handleUpdate}
            />
            <p>Username:</p>
            <input
              name="username"
              type="text"
              className={styles.ForceWide}
              onChange={handleUpdate}
            />
            <p>Password:</p>
            <input
              name="password"
              type="password"
              className={styles.ForceWide}
              onChange={handleUpdate}
            />
            {/* <p>Confirm Password:</p>
            <input
              name="confirmPassword"
              type="password"
              className={styles.ForceWide}
              onChange={handleUpdate}
            /> */}
          </form>
          <p onClick={() => setLogin(!login)} className={styles.FakeLink}>
            Already have an Account?
          </p>
          <button
            className={styles.LoginButton}
            onClick={() => {
              createUser({ username, email, password });
            }}
          >
            Register
          </button>
        </div>
      )}
    </>
  );
};

export default RegisterLogin;
