import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/items");
    }

  }, [navigate]);


  const signupHandler=()=>{
    navigate("/signup");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const userLogin ={username:username, password:password}
    try {
      const response = await axios.post("/user/login", userLogin);
      localStorage.setItem("token", response.data.token);
      navigate("/items");
    } catch (err) {
      setError("Invalid username/password");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
        <button onClick={signupHandler}>Not a user? Sign up to your account today!</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
}

export default Login;