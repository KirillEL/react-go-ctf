import {FC} from 'react'
import Header from '../components/header-component/Header'
import LoginForm from '../components/login-component/LoginForm'

const LoginPage: FC = () => {
  return (
    <div>
      <Header/>
      <main className="app-main">
      <LoginForm/>
      </main>
    </div>
  )
}

export default LoginPage;
