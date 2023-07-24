import {FC, useEffect, useState} from 'react'
import Header from '../components/header-component/Header'
import LoadingSpinner from '../components/spinner-component/Spinner';

type DataType = {
    id: number;
    name: string;
    email: string;
    password: string;
}

type ResponseDataType = {
    message: string;
    data: DataType;
}

const HomePage: FC = () => {

    const [responseData, setResponseData] = useState<ResponseDataType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("http://localhost:4040/api/user/", {
              method: "GET",
              credentials: 'include',
              headers: {
                "Content-Type": "application/json"
              }
            });
            const responseData: ResponseDataType = await response.json() as ResponseDataType;
            setResponseData(responseData);
            setIsLoading(false);
          } catch (error) {
            console.log(error);
          }
        };
      
        void fetchData();
      }, []);


      

      
      const checkLogin = () => {
        if (isLoading) {
            return (
              <main className="app-main">
                <LoadingSpinner/>
              </main>
            )
        }

        if (responseData?.message === "authenticated") {
            return (
              <div id="pepeDiv">
                
                  <div id="pepeText">
                      <h2>
                         Hello {responseData.data.name}
                      </h2>
                  </div>
              </div>
               
            )
        } else {
            return (
                <div className="text-center">
                    <h2>You are not login</h2>
                </div>
            )
        }
    }
      
    
    

  return (
    <div>
      <Header/>
        {checkLogin()}
    </div>
 )
}

export default HomePage;
