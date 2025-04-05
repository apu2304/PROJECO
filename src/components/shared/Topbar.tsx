import { useAuthContext } from "@/context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { IoLogOut } from "react-icons/io5";
import { useGetUserOffline, useLogOutAccount } from "@/lib/Query&Mutation/query";
import AllUsers from "./AllUsers";
import { useEffect } from "react";
import { LiaProjectDiagramSolid } from "react-icons/lia";

const Topbar = () => {
  const { user } = useAuthContext()
  const { mutate: logOut, isSuccess } = useLogOutAccount()
    const {mutateAsync: makeUserOffline} = useGetUserOffline()
  const navigate = useNavigate()
   useEffect(() => {
      if(isSuccess){
        navigate("/login")
      }
    }, [isSuccess])
  
const handleLogOut = async () => {
  await makeUserOffline(user.id)
  await logOut()
}
  return (
 <div className="md:hidden sticky top-0 z-50  w-screen
 px-6 py-3 bg-[var(--violet-blue)]">
     <div className=" flex justify-between items-center  ">
      <Link to="/" className="flex items-center gap-2">
      <LiaProjectDiagramSolid className="text-xl text-white"/> 
        <h1 className="text-2xl font-bold text-white">PROJECO</h1>
      </Link>
      <div className="flex items-center gap-3">
      <Link to="/profile"
          className="flex items-center gap-2 px-3 py-2 text-white">
          {user?.imageUrl && (
            <img src={user.imageUrl} alt={user.userName} className="w-8 h-8 rounded-full" />
          )}
        </Link>
        <div className="flex items-center gap-2" onClick={handleLogOut}>
          <IoLogOut className="text-3xl text-white" />
        </div>
      </div>
    </div>
   <div className="mt-3">
   <AllUsers/>
   </div>
 </div>
  )
}

export default Topbar
