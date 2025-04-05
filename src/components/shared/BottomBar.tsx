import {  NavLink } from "react-router-dom"
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import { AiFillProject } from "react-icons/ai";
import { motion } from "framer-motion"

const BottomBar = () => {
  return (
    <div className="md:hidden sticky bottom-0 z-50 w-screen px-6 py-3 block rounded-4xl
     items-center bg-[var(--violet-blue)]">
       <ul className="flex items-center justify-evenly gap-8">
        <motion.li initial={{
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
            borderRadius: "50px",
          }}
            whileHover={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)",
              scale: 1.05, borderRadius: "50px",
            }}
            whileTap={{
              background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
              borderRadius: "50px",
            }}
            transition={{ duration: 0.8 }}
            className="">
          <NavLink to={"/"} className={({ isActive }: any) => isActive ?
                "bg-white rounded-full px-3 py-2 flex items-center text-[var(--violet-blue)]"
                : "flex items-center px-3 py-2 text-white"}>
            <GoHomeFill className="text-3xl"/>
          </NavLink>
        </motion.li>
        <motion.li >
          <NavLink to={"/create"}  className={({ isActive }: any) => isActive ?
                "bg-white rounded-full px-3 py-2 flex items-center text-[var(--violet-blue)]"
                : "flex items-center px-3 py-2 text-white"}>
            <IoAdd  className="text-3xl"/>
          </NavLink>
        </motion.li>
        <motion.li >
          <NavLink to={"/search"}  className={({ isActive }: any) => isActive ?
                "bg-white rounded-full px-3 py-2 flex items-center text-[var(--violet-blue)]"
                : "flex items-center px-3 py-2 text-white"}>
            <IoSearch  className="text-3xl"/>
          </NavLink>
        </motion.li>
        <motion.li >
          <NavLink to={"/myProject"} className={({ isActive }: any) => isActive ?
                "bg-white rounded-full px-3 py-2 flex items-center text-[var(--violet-blue)]"
                : "flex items-center px-3 py-2 text-white"}>
            <AiFillProject  className="text-3xl"/>
          </NavLink>
        </motion.li>
      </ul>
    </div>
  )
}

export default BottomBar
