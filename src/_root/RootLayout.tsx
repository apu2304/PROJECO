
import BottomBar from "@/components/shared/BottomBar"
import LeftSideBar from "@/components/shared/LeftSideBar"
import RightSideBar from "@/components/shared/RightSideBar"
import Topbar from "@/components/shared/Topbar"
import{ Outlet} from "react-router-dom"

const RootLayout = () => {
 
  return (
    <>
       <div className="bg-[var(--midnight-blue)]">
       <Topbar />
       <div className="flex justify-between">
       <LeftSideBar />
       <section className="flex flex-1 h-screen">
       <Outlet />
       </section>
       <RightSideBar/>
       </div>
       <BottomBar/>
     </div>
    </>
  )
}

export default RootLayout
