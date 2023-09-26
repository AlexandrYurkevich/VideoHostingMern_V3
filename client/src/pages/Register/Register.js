import "./styles.css";
import { useRef, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import authService from "../../services/AuthService";
import { Link } from "react-router-dom";

export default function Register() {
  const name = useRef()
  const mail = useRef()
  const password = useRef()
  const repeatPassword = useRef();
  const birthday = useRef()
  const [saveLogin, setSaveLogin] = useState(false);
  const { setUser, setChannel } = useContext(AuthContext)

  const [errormes, setErrormes] = useState();

  const onRegister = () => {
    if(password.current.value != repeatPassword.current.value){
      setErrormes("Repeat password correctly");
      return;
    }
    authService.register({
        name: name.current.value,
        email: mail.current.value,
        password : password.current.value,
        birthday: birthday.current.value
    }, saveLogin).then(res => {
      setUser(res.user);
      setChannel(res.channel);
    })
    .catch(err => {
      setErrormes(err.message);
    })
  }
  
  return (
    <div className="auth-background">
      <form className="auth-form" onSubmit={(e)=> { e.preventDefault(); onRegister()}}>
        <label>Register</label>
        <label style={{color: 'red'}}>{errormes}</label>
        <input
          className="auth-field"
          type="text"
          placeholder="Username"
          required
          ref={name}
        />
        <div className="date-input">
          <label>Birth</label>
          <input type="date" min="1900-1-1" max={(new Date()).toISOString()} required ref={birthday} />
        </div>
        <input className="auth-field" type="email" placeholder="E-mail" required ref={mail}/>
        <input
          className="auth-field" type="password" placeholder="Password" required minLength={6}
          ref={password}
        />
        <input
          className="auth-field"
          type="password"
          placeholder="Repeat password"
          required
          minLength={6}
          ref={repeatPassword}
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
          <input className="auth-button" type="submit" value="Register" />
          <Link to="/login">
            <input className="auth-button" type="button" defaultValue="Login" />
          </Link>
        </div>
      </form>
    </div>
  );
}