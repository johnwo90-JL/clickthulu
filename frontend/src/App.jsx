import { useEffect, useState } from "react";
import styles from "./style/LoginRegister.module.css";

function LoginRegister() {
  const [login, setLogin] = useState(true);

  return (
    <>
      {/* Login */}
      {login && (
        <div className={styles.LoginCard}>
          <h2>Login</h2>
          <div>
            <form>
              <p>Username:</p>
              <input type="text" />
              <p>Password:</p>
              <input type="password" />
            </form>
          </div>
          <p onClick={() => setLogin(!login)}>Don't have an account?</p>
          <button>Login</button>
        </div>
      )}
      {/* Register */}
      {!login && (
        <div className={styles.LoginCard}>
          <div>
            {/* No way to return to login screen */}
            <h2 onClick={() => setLogin(!login)}>Register</h2>
            <form>
              <p>Full Name:</p>
              <input type="text" />
              <p>Email:</p>
              <input type="email" />
              <p>Username:</p>
              <input type="text" />
              <p>Password:</p>
              <input type="password" />
              <p>Confirm Password:</p>
              <input type="password" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginRegister;
