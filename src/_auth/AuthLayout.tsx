import { useAuthContext } from "@/context/AuthContext"
import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
  const  {isAuthenticated} = useAuthContext()
  return (
    <div>
      {isAuthenticated ? <Navigate to="/" /> :  (
        <section className="bg-[url(/assets/Untitled-2.svg)]
        h-screen bg-cover bg-no-repeat w-screen flex justify-center items-center">
          <Outlet />
        </section>
      )}
    </div>
  )
}

export default AuthLayout
