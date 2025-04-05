import Loader from "@/components/shared/Loader"
import { usePRojectsById } from "@/lib/Query&Mutation/query"
import { useParams } from "react-router-dom"
import { IoIosAdd } from "react-icons/io";
import CreateForm from "@/components/createForm/CreateForm";

const UpdatePRoject = () => {
  const { id } = useParams()
  const {data: project, isLoading} = usePRojectsById(id || "")
  console.log(project)
  if(isLoading) {
    return <Loader/>
  }
  return (
    <div className="flex flex-1">
      <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll 
       md:px-8 md:py-10 px-4 py-5'>
        <div className='max-w-5xl flex items-center gap-3 justify-start w-full'>
       <IoIosAdd className='text-4xl text-white font-medium '/>
       <h2 className="text-2xl text-left w-full text-white font-medium">
            Edit Projects
          </h2>
       </div>
       <CreateForm project={project} action="Update"/>
      </div>
    </div>
  )
}

export default UpdatePRoject
