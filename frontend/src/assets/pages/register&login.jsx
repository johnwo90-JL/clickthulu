import styles from "../styles/register&login.module.css";
import { useState } from "react";

const RegisterLogin = () => {
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
          <p onClick={() => setLogin(!login)} className={styles.FakeLink}>
            Don't have an account?
          </p>
          <button>Login</button>
        </div>
      )}
      {/* Register */}
      {!login && (
        <div className={styles.LoginCard}>
          <div>
            {/* No way to return to login screen */}
            <h2>Register</h2>
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
            <p onClick={() => setLogin(!login)} className={styles.FakeLink}>
              Already have an Account?
            </p>
            <button>Register</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterLogin;
