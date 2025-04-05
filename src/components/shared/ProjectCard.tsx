
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'

type ProjectProps = {
    project: Models.Document,
    users: Models.Document
}

const ProjectCard = ({project, users}: ProjectProps ) => {

  return (
    <div className='rounded-xl border border-dark-4 pb-3 w-[300px] '>
      <div className='flex justify-between items-center relative'>
       <Link to={`/details/${project.$id}`}>
         {project.projectImage && (
            <img src={project.projectImage} alt={project.projectName} 
            className='w-full rounded-xl object-cover'/>
         )}
         <div className='flex justify-end absolute top-2 right-3'>
         <p className={`text-sm text-white rounded-full shadow-md
          px-4 py-2 ${project.status === "Completed" ? "bg-green-500" : "bg-amber-600"}`}>{project.status}</p>
         </div>
        <div className='p-3'>
        <h1 className='text-xl font-bold text-white'>{project.projectName}</h1>
        <p className='text-sm text-gray-200 '>{project.description}</p>
        </div>
        <h2 className='text-lg text-gray-200 p-3'>Project Assigned To:</h2>
        <div className='flex gap-2 p-3'>
          {Array.isArray(users) && users.map((user: any) => (
            <img src={user.imageUrl} key={user.$id}
            alt={user.userName} className='w-8 h-8 rounded-full'/>

          ))}
        </div>
       </Link>
      </div>
    </div>
  )
}

export default ProjectCard
