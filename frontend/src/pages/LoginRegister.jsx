import { useState } from "react";

function LoginRegister() {
  const [login, setLogin] = useState();

  return (
    <>
      {/* Login */}
      {login && <div></div>}
      {/* Register */}
      {!login && <div></div>}
    </>
  );
}

export default LoginRegister;
