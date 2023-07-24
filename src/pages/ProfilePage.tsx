import { FC, useState, useMemo } from 'react'
import Header from '../components/header-component/Header';
import ProfileInfo from '../components/profile-info-component/ProfileInfo';
import {HomePageContext} from '../context/HomePageContext'
import LoadingSpinner from '../components/spinner-component/Spinner';

interface IUser {
    name: string;
    email: string;
    is_admin: boolean;
}

interface IUserMain extends IUser {
    id: number;
    password: string;
}

interface IUserInfo {
    data: IUserMain;
    message: string;
}

interface IUserData {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface ISearchData {
    data?: IUserData | null;
    message: string;
  }

const ProfilePage: FC = () => {
    
    const [data, setData] = useState<IUser>({
        "email": "",
        "name": "",
        "is_admin": false,
    });
    const [searchData, setSearchData] = useState<ISearchData>({
        data: null,
        message: ''
      });
    
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useMemo(() => {
        
        const fetchData = async () => {
            try {
                const response: Response = await fetch("http://localhost:4040/api/user/", {
                    method: "GET",
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json'}
                })
                const data: IUserInfo = await response.json() as IUserInfo
                setData({
                    email: data?.data?.email,
                    name: data?.data?.name,
                    is_admin: data?.data?.is_admin
                })
                setMessage(data.message);
                setIsLoading(false);
            } 
            catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [isLoading])


    function checkLogin() {
        if(isLoading && message == "") return (
            <main className="app-main">
                <LoadingSpinner/>
            </main>
        );

       
        if(message === "authenticated" && data.is_admin) {
            return (
                <main id="appMainProfile" className="app-main">
                <ProfileInfo data={data}/>
            </main>
            )
        } else if(message === "authenticated") {
            return (
            <main className="app-main">
                <ProfileInfo data={data}/>
            </main>
            )
        }
        else return (
            <h2 className="text-center">You are not login</h2>
        )
    }

  return (
    <div>
    <HomePageContext.Provider value={{searchData, setSearchData}}>
      <Header/>
      {checkLogin()}
      </HomePageContext.Provider>
    </div>
  )
}

export default ProfilePage;
