import {FC, useEffect, useMemo, useState} from 'react';
import {Link} from "react-router-dom"
import {useNavigate} from 'react-router-dom';

type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
}

type ResponseDataType = {
  data: UserType;
  message: string;
}

type LogoutType = {
  message: string;
}


const delay = (ms: number) => new Promise(
  resolve => setTimeout(resolve, ms)
);


const Header: FC = () => {

  const [responseD, setResponseD] = useState<ResponseDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const navigate = useNavigate();





  useEffect(() => {
    const fetchData = async () => {
      const response: Response = await fetch("http://localhost:4040/api/user/", {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      });
      const responseData: ResponseDataType = await response.json();
      setResponseD(responseData);
      setIsLoading(false);
    }
    fetchData();
  }, []);
  

  const LogoutRequest = async () => {
    try {
      const response: Response = await fetch("http://localhost:4040/api/logout/", {
        method: "POST",
        credentials: 'include',
        body: "",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const responseData: LogoutType = await response.json()
      if(responseData.message == "success logout") {
        navigate('/');
        location.reload();
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  const searchRequest = () => {
    
    const fetchData = async () => {
      const response: Response = await fetch(`http://localhost:4040/api/search?id=${searchQuery}`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      });
      if(response.status == 200) {
        navigate('/');
        location.reload();
      }
    }
    fetchData()
  
  }

  function checkInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    var re = /[=<>\-]|(?:\b(?:not|NOT|BETWEEN|or)\b)/g;
    if(e.target.value.match(re) || !isNaN(Number.parseInt(e.target.value))) {
      setSearchQuery("");
    }
    else {
      setSearchQuery(e.target.value);
    }
  }


  const checkAuth = useMemo(() => {
    if (isLoading) {
      return <div className="text-center text-danger fs-4">Loading...</div>;
    }

    if (responseD?.message === 'authenticated' && location.pathname === "/profile") {
      return (
        <div className="d-flex">
          <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
            <input type="search" id="headerInput" className="form-control form-control-dark" value={searchQuery} placeholder="Search..." onChange={(e) => {
              checkInputValue(e);
            }} onKeyDown={(e) => {
              if(e.key == "Enter") {
                searchRequest()
              }
            }}/>
          </div>
          <button className="btn btn-warning" onClick={()=>{LogoutRequest()}}>
            Logout
          </button>
        </div>
      );
    } else if (responseD?.message === 'authenticated') {
      return (
        <button className="btn btn-warning" onClick={()=>{LogoutRequest()}}>
            Logout
          </button>
      )
    } else {
      return (
        <>
          <Link className="btn btn-outline-light me-2" to={'/login'}>
            Login
          </Link>
          <Link className="btn btn-warning" to={'/register'}>
            Sign-Up
          </Link>
        </>
      );
    }
  }, [isLoading, responseD, searchQuery, setSearchQuery]);



  const profileLink = (
      <Link
        id="profile-link"
        className="nav-link px-2 text-danger fs-5"
        to={"/profile"}
      >
        Profile
      </Link>
  );
  
  async function changeImg() {
    document.getElementById('pepeDiv')!.style.background = 'url(Troll-Face.svg)';
    document.getElementById('pepeDiv')!.style.backgroundRepeat = 'no-repeat';
    document.getElementById('pepeDiv')!.style.backgroundSize = 'contain';
    document.getElementById('pepeDiv')!.style.backgroundPosition = 'center';

    await delay(1000)


    document.getElementById('pepeDiv')!.style.background = 'url(sad-pepe.svg)';
    document.getElementById('pepeDiv')!.style.backgroundRepeat = 'no-repeat';
    document.getElementById('pepeDiv')!.style.backgroundSize = 'contain';
    document.getElementById('pepeDiv')!.style.backgroundPosition = 'center';
  }

  return (
    <div>
    <header id="header" className="p-3 text-bg-dark">
    <div className="container">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
      
        <ul className="d-flex nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          {responseD?.message === "authenticated" ? (
            <li><Link className="nav-link px-2 text-danger fs-5" to={"/"}>Home</Link></li>
          ) : ""}
          <li onMouseEnter={() => {
            setIsMouseEntered(true);
            changeImg();
          }}>{isMouseEntered || location.pathname === "/profile" || responseD?.message === "unauthenticated" ? "" : profileLink}</li>
        </ul>
        <div className="text-end">
            {checkAuth}
        </div>
      </div>
    </div>
  </header>
    </div>
  )
}

export default Header


