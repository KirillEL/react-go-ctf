import React, {lazy, Suspense} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoadingSpinner from "../components/spinner-component/Spinner";


const Home = lazy(() => import('../pages/HomePage'))
const Login = lazy(() => import('../pages/LoginPage'))
const Profile = lazy(() => import('../pages/ProfilePage'))
const Register = lazy(() => import('../pages/RegisterPage'))

export const AppRouter = () => {
    return (
        <Router>
            <React.Fragment>
                <Suspense fallback={<LoadingSpinner/>}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                    </Routes>
                </Suspense>
            </React.Fragment>
        </Router>
    )
}