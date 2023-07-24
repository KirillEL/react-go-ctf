import {useContext, createContext} from "react";


interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
  }
  
  interface IUserData {
    data?: IUser | null;
    message: string;
  }
  
  
const d: IUser | undefined = {
    id: 0,
    name: "",
    email: "",
    password: "",
}

const searchData: IUserData | null = {
    data: {...d},
    message: '',
}

export const HomePageContext = createContext({
    searchData,
    setSearchData: function(data: IUserData) {
        this.searchData.message = data.message
        if (data.data != null && data.data != undefined) {
            this.searchData.data = data.data
        }
        else this.searchData.data = undefined;
    }
});

export function useHomePageContext() {
    return useContext(HomePageContext)
}