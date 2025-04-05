import { NavLink, useNavigate } from "react-router-dom"
import { GoHomeFill } from "react-icons/go";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { IoSearch } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import { AiFillProject } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { motion } from "framer-motion"
import { useAuthContext } from "@/context/AuthContext";
import {useGetUserOffline, useLogOutAccount } from "@/lib/Query&Mutation/query";
import { useEffect } from "react";
const LeftSideBar = () => {
  const {user} = useAuthContext()
  const {mutate: logOut, isSuccess} = useLogOutAccount()
  const {mutateAsync: makeUserOffline} = useGetUserOffline()
  const navigate = useNavigate()
  useEffect(() => {
    if(isSuccess){
      navigate("/login")
    }
  }, [isSuccess,navigate])
const handleLogOut = async () => {
  await makeUserOffline(user.id)
  await logOut()
}
  return (
    <div className="hidden md:flex z-50 min-[230px] px-6 py-10 flex-col justify-between
    bg-linear-to-b from-[var(--violet-blue)] to-[var(--lavender-pink)]  from-85% h-screen">
      <div className="flex flex-col items-center gap-11">
     <div className="flex items-center gap-2 mb-10">
     <LiaProjectDiagramSolid className="text-2xl text-white"/> 
     <h1 className=" text-2xl font-bold text-white">
    PROJECO</h1>
     </div>
      <NavLink to={"/profile"} className="flex items-center gap-2">
        {user?.imageUrl && (
          <img src={user.imageUrl} alt={user.userName} className="w-8 h-8 rounded-full"/>
        )}
        <span className="text-lg text-medium text-white">{user?.userName}</span> 
      </NavLink>
      <ul className="flex flex-col gap-8">
        <motion.li initial={{
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
          }}
            whileHover={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)",
              scale: 1.05, borderRadius: "10px",
            }}
            whileTap={{
              background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
            }}
            transition={{ duration: 0.8 }}>
          <NavLink to={"/"} className={({isActive}) => isActive ? 
          "flex items-center gap-2 bg-white w-[230px] rounded-lg px-3 py-2  text-[var(--violet-blue)]" 
          : "flex items-center gap-2 px-3 py-2 text-white"}>
            <GoHomeFill className="text-3xl"/>
            <span className="text-lg text-medium">Dashboard</span>
          </NavLink>
        </motion.li>
        <motion.li initial={{
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
          }}
            whileHover={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)",
              scale: 1.05, borderRadius: "10px",
            }}
            whileTap={{
              background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
            }}
            transition={{ duration: 0.8 }}>
          <NavLink to={"/create"} className={({isActive}) => isActive ? 
          "flex items-center gap-2 bg-white w-[230px] rounded-lg px-3 py-2  text-[var(--violet-blue)]" 
          : "flex items-center gap-2 px-3 py-2 text-white"}>
            <IoAdd  className="text-3xl"/>
            <span className="text-lg medium">Add Project</span>
          </NavLink>
        </motion.li>
        <motion.li initial={{
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
          }}
            whileHover={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)",
              scale: 1.05, borderRadius: "10px",
            }}
            whileTap={{
              background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
            }}
            transition={{ duration: 0.8 }}>
          <NavLink to={"/search"} className={({isActive}) => isActive ? 
          "flex items-center gap-2 bg-white w-[230px] rounded-lg px-3 py-2  text-[var(--violet-blue)]" 
          : "flex items-center gap-2 px-3 py-2 text-white"}>
            <IoSearch  className="text-3xl"/>
            <span className="text-lg medium">Search</span>
          </NavLink>
        </motion.li>
        <motion.li initial={{
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
          }}
            whileHover={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)",
              scale: 1.05, borderRadius: "10px",
            }}
            whileTap={{
              background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
            }}
            transition={{ duration: 0.8 }}>
          <NavLink to={"/myProject"} className={({isActive}) => isActive ? 
          "flex items-center gap-2 bg-white w-[230px] rounded-lg px-3 py-2  text-[var(--violet-blue)]" 
          : "flex items-center gap-2 px-3 py-2 text-white"}>
            <AiFillProject  className="text-3xl"/>
            <span className="text-lg medium">My Project</span>
          </NavLink>
        </motion.li>
      </ul>
      </div>
      <div className="flex items-center gap-2 group cursor-pointer" onClick={handleLogOut}>
      <IoLogOut className="text-3xl text-white"/>
      <span className="text-lg medium text-white">LogOut</span>
      </div>
    </div>
  )
}

export default LeftSideBar
