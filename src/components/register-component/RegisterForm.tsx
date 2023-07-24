import {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";


interface IUserSubmitForm {
  Name: string;
  Email: string;
  Password: string;
  PasswordRepeat: string;
}

interface IResponseData {
  data: IUserSubmitForm;
  message: string;
}

const Register: FC = () => {

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
      Name: Yup.string().required('Name is required'),
      Email: Yup.string().required('Email is required').email('Email is invalid'),
      Password: Yup.string().required('Password is required').min(10, 'Password must be at least 10 characters').max(40, 'Password must not exceed 40 characters'),
      PasswordRepeat: Yup.string().required('Confirm password is required').oneOf([Yup.ref('Password'), ''], 'Confirm Password doesnt match')
    });


    const {register,handleSubmit,reset,formState: { errors }} = useForm<IUserSubmitForm>({
      resolver: yupResolver(validationSchema)
    });


    const onSubmit = (data: IUserSubmitForm) => {
      
      const fetchData = async () => {
        const response: Response = await fetch("http://localhost:4040/api/register", {
          method: "POST",
          body: JSON.stringify(data).toLowerCase(),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const responseData: IResponseData  = await response.json();
        if(responseData?.message == "success registration") {
          navigate('/login');
        }
        
      }
      fetchData()
    }

  return (
    <main className="app-main">
    <div className="register-form">
    <h1 id="signup" className="h3 mb-3 fw-normal text-center ">Please sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-floating">
          <input type="text" id="floatingName" {...register('Name')} className={`form-control ${errors.Name ? 'is-invalid' : ''}`} placeholder="Name" />
          <label id="labelFloatingName" htmlFor="floatingName">Name</label>
          <div className="invalid-feedback">{errors?.Name?.message}</div>
        </div>

        <div className="form-floating">
         
          <input type="text" id="floatingEmail" {...register('Email')} className={`form-control ${errors.Email ? 'is-invalid' : ''}`} placeholder="Email" />
          <label id="labelFloatingEmail" htmlFor="floatingEmail">Email</label>
          <div className="invalid-feedback">{errors.Email?.message}</div>
        </div>

        <div className="form-floating">
          <input type="password" id="floatingPassword" {...register('Password')} className={`form-control ${errors.Password ? 'is-invalid' : ''}`} placeholder="Password" />
          <label id="labelFloatingPassword" htmlFor="floatingPassword">Password</label>
          <div className="invalid-feedback">{errors?.Password?.message}</div>
        </div>

        <div className="form-floating">
          <input type="password" id="floatingConfirmPassword" {...register('PasswordRepeat')} className={`form-control ${errors.PasswordRepeat ? 'is-invalid' : ''}`} placeholder="Confirm Password" />
          <label id="labelFloatingConfirmPassword" htmlFor="floatingConfirmPassword">Confirm Password</label>
          <div className="invalid-feedback">{errors.PasswordRepeat?.message}</div>
        </div>
        
        <div className="form-floating">
          <button id="registerBtn" type="submit" className="btn btn-lg btn-primary btn-outline-danger btn-dark mx-3 w-75">
            Register
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-lg btn-outline-success float-right"
          >
            Reset
          </button>
        </div>

      </form>
    </div>
    </main>
  )
}

export default Register;
