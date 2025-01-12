import { useState } from "react";
import { useLogIn } from "../hooks/useLogin";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogIn();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="loginwrapper">
      <form className="login" onSubmit={handleSubmit}>
        <h1> LogIn</h1>
        <label> Email </label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></input>
        <label> Password </label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        ></input>
        <button disabled={isLoading}> Log In</button>
        {error && <div className="LoginError">{error} </div>}
      </form>
    </div>
  );
};

export default LogIn;