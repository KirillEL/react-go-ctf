import { FC } from 'react'


interface IUserNameEmailAdmin {
  email: string;
  name: string;
  is_admin: boolean;
}


const ProfileInfo: FC<{data: IUserNameEmailAdmin}> = ({data}) => {
  return (
    <div className="profile-info w-100 app-main">
        <div className="container w-50 text-center">
          <div>
            Email: <span>{data.email}</span>
          </div>
          <div>
            Name: <span>{data.name}</span>
          </div>
          {data?.is_admin ? (
            <div>
              flag {import.meta.env.VITE_FLAG}
            </div>
          ) : ""}
        </div>
    </div>
  )
}

export default ProfileInfo
