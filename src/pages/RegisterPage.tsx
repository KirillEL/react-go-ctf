import {FC} from 'react'
import Header from '../components/header-component/Header'
import Register from '../components/register-component/RegisterForm'




const RegisterPage: FC = () => {
  return (
    <div>
      <Header/>
      <main className="app-main">
      <Register/>
      </main>
    </div>
  )
}

export default RegisterPage;