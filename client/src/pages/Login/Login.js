import { useRef, useContext, useState } from "react";
import "./styles.css";
import { AuthContext } from "../../contexts/AuthContext"
import { Link } from "react-router-dom";
import authService from "../../services/AuthService";

export default function Login() {
  const mail = useRef()
  const password = useRef()
  const [saveLogin, setSaveLogin] = useState(false);
  const { user, channel, setUser, setChannel } = useContext(AuthContext)
  const [errormes, setErrormes] = useState();

  const onLogin = () => {
    authService.login(mail.current.value, password.current.value, saveLogin)
      .then(res => {
        setUser(res.user);
        setChannel(res.channel);
      })
      .catch(err => {
        setErrormes(err.message);
      });
  };

  return (
    <div className="auth-background">
    <form className="auth-form" onSubmit={(e)=> { e.preventDefault(); onLogin()}}>
      <label>Login</label>
      <label style={{color: 'red'}}>{errormes}</label>
      <input
        className="auth-field"
        type="email"
        placeholder="E-mail"
        required
        ref={mail}
      />
      <input
        className="auth-field"
        type="password"
        placeholder="Password"
        required
        minLength={6}
        ref={password}
      />
      <div className="reset-forget">
        <input className="auth-button" type="reset" value="Reset" />
        <input className="auth-button" type="button" defaultValue="Forget?" />
      </div>
      <div className="remember" style={{ display: "flex" }}>
        <input type="checkbox" onChange={(e)=>setSaveLogin(!saveLogin)}/>
        <label>Remember me</label>
      </div>
      <div className="logreg">
        <input className="auth-button" type="submit" value="Login"/>
        <Link to="/register">
          <input className="auth-button" type="button" defaultValue="Register" />
        </Link>
      </div>
    </form>
  </div>
  );
}