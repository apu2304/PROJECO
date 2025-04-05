import { useGetAllUsers } from "@/lib/Query&Mutation/query"
import { GoDotFill } from "react-icons/go";

const AllUsers = () => {
    
    const {data: users} = useGetAllUsers()
  return (
    <div className="flex flex-row overflow-x-scroll gap-2">
      {users && users.map((user: any) => (
        <div key={user.$id}>
        <div className="flex flex-col justify-center relative">
          {user.imageUrl && (
            <img src={user.imageUrl} alt={user.userName} className="w-8 h-8 rounded-full"/>
          )}
           <span className="text-xs text-medium text-white"> {user.userName}</span>
           <GoDotFill className={`text-xl ${user.isOnline === true ? 'text-green-500' : 'text-transparent'}
            absolute bottom-8 left-5 text-center`}/>
        </div>
        </div>))}
    </div>
  )
}

export default AllUsers
