import Loader from "@/components/shared/Loader"
import ProjectCard from "@/components/shared/ProjectCard"
import { useGetMyProjects } from "@/lib/Query&Mutation/query"
import { Models } from "appwrite"


const MyProject = () => {
  const {data: projects, isLoading: isProjectLoading, 
    isError: isErrorPRoject, error} = useGetMyProjects()
    if(isErrorPRoject){
      return (
        <div>{error.message}</div>
    )}
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll 
       md:px-8 md:py-10 px-4 py-5">
        <div className=" max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
            <h2 className="text-2xl font-medium text-white text-left w-full">
                My Projects
            </h2>
            {isProjectLoading && !projects ? (
              <p className="text-white "><Loader/></p>
            ): (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {projects?.map((project: Models.Document) => (
                  <ProjectCard key={project.$id} project={project} users={project.assignedUsersDetails}/>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default MyProject
