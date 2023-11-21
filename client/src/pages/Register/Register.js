import "./styles.css";
import "../../shared_styles.css"
import { useRef, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import authService from "../../services/AuthService";
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from "@mui/material";

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
      <form className="auth-form" onSubmit={(e)=> {e.preventDefault(); onRegister()}}>
        <Typography variant="h5" color="primary">Register</Typography>
        {errormes && <Typography variant="h5" style={{ color: 'red' }}>{errormes}</Typography>}
        <TextField sx={{ width: '80%' }}
          type="text"
          label="Username"
          placeholder="Username"
          required
          inputRef={name}
        />
        <TextField sx={{ width: '80%' }}
            type="date"
            label="Birth"
            placeholder="Birth"
            inputProps={{ min: '1900-01-01', max: new Date().toISOString() }}
            required
            inputRef={birthday}
          />
        <TextField sx={{ width: '80%' }}
          type="email"
          label="E-mail"
          placeholder="E-mail"
          required
          inputRef={mail}
        />
        <TextField sx={{ width: '80%' }}
          type="password"
          label="Password"
          placeholder="Password"
          required
          inputRef={password}
          minLength={6}
        />
        <TextField sx={{ width: '80%' }}
          type="password"
          label="Repeat password"
          placeholder="Repeat password"
          required
          inputRef={repeatPassword}
          minLength={6}
        />
        <Button type="reset" variant="contained" sx={{ width: '50%' }}>
          Reset
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={saveLogin}
              onChange={(e) => setSaveLogin(e.target.checked)}
            />
          }
          label="Remember me"
        />
        <div className="detached-container">
          <Button type="submit" variant="contained" sx={{ width: '50%' }}>
            Register
          </Button>
          <Link className="detached-container" to="/login">
            <Button variant="contained" sx={{ width: '50%' }}>
              Login
            </Button>
          </Link>
        </div>
      </form>
    </div>
    // <div className="auth-background">
    //   <form className="auth-form" onSubmit={(e)=> { e.preventDefault(); onRegister()}}>
    //     <label>Register</label>
    //     <label style={{color: 'red'}}>{errormes}</label>
    //     <input
    //       className="auth-field"
    //       type="text"
    //       placeholder="Username"
    //       required
    //       ref={name}
    //     />
    //     <div className="date-input">
    //       <label>Birth</label>
    //       <input type="date" min="1900-1-1" max={(new Date()).toISOString()} required ref={birthday} />
    //     </div>
    //     <input className="auth-field" type="email" placeholder="E-mail" required ref={mail}/>
    //     <input
    //       className="auth-field" type="password" placeholder="Password" required minLength={6}
    //       ref={password}
    //     />
    //     <input
    //       className="auth-field"
    //       type="password"
    //       placeholder="Repeat password"
    //       required
    //       minLength={6}
    //       ref={repeatPassword}
    //     />
    //     <div className="reset-forget">
    //       <input className="auth-button" type="reset" value="Reset" />
    //       <input className="auth-button" type="button" defaultValue="Forget?" />
    //     </div>
    //     <div className="remember" style={{ display: "flex" }}>
    //       <input type="checkbox" onChange={(e)=>setSaveLogin(!saveLogin)}/>
    //       <label>Remember me</label>
    //     </div>
    //     <div className="logreg">
    //       <input className="auth-button" type="submit" value="Register" />
    //       <Link to="/login">
    //         <input className="auth-button" type="button" defaultValue="Login" />
    //       </Link>
    //     </div>
    //   </form>
    // </div>
  );
}