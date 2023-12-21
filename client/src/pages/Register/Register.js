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
import { IconButton, InputAdornment, Typography } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function Register() {
  const name = useRef()
  const mail = useRef()
  const password = useRef()
  const repeatPassword = useRef();
  const birthday = useRef()
  const [showPassword, setShowPassword] = useState(false);
  const [saveLogin, setSaveLogin] = useState(false);
  const { setUser, setChannel } = useContext(AuthContext)
  const [errormes, setErrormes] = useState();

  const onRegister = () => {
    if(password.current.value != repeatPassword.current.value){
      setErrormes("Repeat password correctly");
      return;
    }
    authService.register({ name: name.current.value, email: mail.current.value, password : password.current.value, birthday: birthday.current.value
    }, saveLogin).then(res => { setUser(res.user); setChannel(res.channel); })
    .catch(err => { setErrormes(err.message); })
  }
  
  return (
    <div className="auth-background">
      <form className="auth-form" onSubmit={(e)=> {e.preventDefault(); onRegister()}}>
        <Typography variant="h5" color="primary">Register</Typography>
        {errormes && <Typography variant="h5" style={{ color: 'red' }}>{errormes}</Typography>}
        <TextField sx={{ width: '80%' }}
          type="text"
          label="Username"
          required
          inputRef={name}
        />
        <TextField sx={{ width: '80%' }}
            type="date"
            label="Birth"
            inputProps={{ min: '1900-01-01', max: new Date().toISOString() }}
            required
            inputRef={birthday}
          />
        <TextField sx={{ width: '80%' }}
          type="email"
          label="E-mail"
          required
          inputRef={mail}
        />
        <TextField sx={{ width: '80%' }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{ endAdornment:
            <InputAdornment position="end">
              <IconButton aria-label="toggle password" onClick={()=>setShowPassword((prev)=> { return !prev})}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }}
          label="Password"
          required
          inputRef={password}
          inputProps={{ minLength: 6 }}
        />
        <TextField sx={{ width: '80%' }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{ endAdornment:
            <InputAdornment position="end">
              <IconButton aria-label="toggle password" onClick={()=>setShowPassword((prev)=> { return !prev})}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }}
          label="Repeat password"
          required
          inputRef={repeatPassword}
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
  );
}