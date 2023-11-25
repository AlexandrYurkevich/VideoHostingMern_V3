import { useRef, useContext, useState } from "react";
import "./styles.css";
import "../../shared_styles.css";
import { AuthContext } from "../../contexts/AuthContext"
import { Link } from "react-router-dom";
import authService from "../../services/AuthService";
import { Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";

export default function Login() {
  const mail = useRef()
  const password = useRef()
  const [saveLogin, setSaveLogin] = useState(false);
  const { setUser, setChannel } = useContext(AuthContext)
  const [errormes, setErrormes] = useState();

  const onLogin = () => {
    authService.login(mail.current.value, password.current.value, saveLogin)
      .then(res => {
        setUser(res.user);
        setChannel(res.channel);
      })
      .catch(err => {
        console.log("authservice " + err.message);
        setErrormes(err.message);
      });
  };

  return (
    <div className="auth-background">
      <form className="auth-form" onSubmit={(e)=> { e.preventDefault(); onLogin()}}>
        <Typography variant="h5" color="primary">Login</Typography>
        {errormes && <Typography variant="h5" style={{ color: 'red' }}>{errormes}</Typography>}
        <TextField sx={{ width: '80%' }}
          type="email"
          label="E-mail"
          required
          inputRef={mail}
        />
        <TextField sx={{ width: '80%' }}
          type="password"
          label="Password"
          required
          inputRef={password}
          inputProps={{ minLength: 6 }}
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
          <Button type="submit" variant="contained" sx={{ width: '100%' }}>Login</Button>
          <Link className="detached-container" to="/register"><Button variant="contained" sx={{ width: '100%' }}>Register</Button></Link>
        </div>
      </form>
    </div>
  );
}