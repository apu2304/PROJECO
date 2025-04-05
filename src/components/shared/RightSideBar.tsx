import { useGetAllUsers } from "@/lib/Query&Mutation/query"
import { GoDotFill } from "react-icons/go";

const RightSideBar = () => {
  const { data: users } = useGetAllUsers()
  return (
    <div className="hidden md:flex z-50 min-[230px] px-6 py-10 flex-col
    bg-linear-to-b from-[var(--violet-blue)] to-[var(--lavender-pink)]  from-85% h-screen">
      <h2 className="h3-bold text-3xl text-white pb-8">All Users</h2>
      <div className="flex flex-col gap-3">
        {users && users.map((user: any) => (
          <div key={user.$id}>
            <div className="flex flex-row overflow-y-scroll gap-2 items-center relative">
              <img src={user.imageUrl} alt={user.userName} className="w-8 h-8 rounded-full" />
              <span className="text-lg text-medium text-white"> {user.userName}</span>
              <GoDotFill className={`text-xl ${user.isOnline === true ? 'text-green-500' : 'text-transparent'}
            absolute bottom-4 left-5`} />
            </div>
          </div>))}
      </div>
    </div>
  )
}

export default RightSideBar
