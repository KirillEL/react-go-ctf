import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import { useState } from "react";



interface IUserLoginForm {
  Email: string;
  Password: string;
}

interface IResponseData {
  data: string;
  message: string;
}

function LoginForm() {
 
  const [, setIncorrect] = useState<null | boolean>(null);
  const [, setResponseData] = useState<IResponseData | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean | null>(null);
  const [userNotFound, setUserNotFound] = useState<boolean | null>(null);


  const navigate = useNavigate();

  
  
  const validationSchema = Yup.object().shape({
    Email: Yup.string().required('Email is required').email('Email is invalid'),
    Password: Yup.string().required('Password is required')
  })

  const {register,handleSubmit,formState: { errors }} = useForm<IUserLoginForm>({
    resolver: yupResolver(validationSchema)
  });
  
  const onSubmit = (data: IUserLoginForm) => {
      
      const fetchData = async () => {
        const response: Response = await fetch("http://localhost:4040/api/login", {
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(data).toLowerCase(),
          headers: { 'Content-Type': 'application/json'}
        });
        const responseData: IResponseData = await response.json();
        setResponseData(responseData);
        if(responseData?.message === "success login") {
          setIncorrect(false);
          navigate('/');
        }
        if(responseData?.message === "incorrect password") {
            setIncorrect(true);
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 1200);
        } 
        if(responseData?.message === "user not found") {
          setUserNotFound(true);
          setTimeout(() => setUserNotFound(false),1200);
        }
      }
      fetchData()
  }

  


  return (
    <div>
    <main className="app-main">
    <h1 id="signin" className="h3 mb-3 fw-normal text-center text-white">Please sign in</h1>
    <div className="register-form">
    <form onSubmit={handleSubmit(onSubmit)}>

    <div className="form-floating">
      <input type="text" {...register('Email')} className={`form-control ${errors.Email ? 'is-invalid' : ''}`} id="floatingEmail" placeholder="name@example.com" />
      <label id="labelFloatingEmail" htmlFor="floatingInput">Email address</label>
      <div className="invalid-feedback">{errors.Email?.message}</div>
      {userNotFound ? <span className="text-danger">user not found</span> : ""}
    </div>

    <div className="form-floating">
      <input type="password" {...register('Password')} className={`form-control ${errors.Password ? 'is-invalid': ''} `} id="floatingPassword" placeholder="Password"/>
      <label id="labelFloatingPassword" htmlFor="floatingPassword">Password</label>
      <div className="invalid-feedback">{errors.Password?.message}</div>
      {showErrorMessage ? <span className="text-danger">incorrect password</span> : ""}
    </div>
    
    <button id="btnLogin" type="submit" className="w-100 btn btn-lg btn-primary btn-outline-danger btn-dark">Sign in</button>
    </form>
    </div>
  </main>
    </div>
  )
}

export default LoginForm;