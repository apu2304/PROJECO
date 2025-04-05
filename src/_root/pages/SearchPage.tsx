import Loader from "@/components/shared/Loader"
import ProjectCard from "@/components/shared/ProjectCard"
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce"
import { useGetSearchProjects } from "@/lib/Query&Mutation/query"
import { Models } from "appwrite"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"

const SearchPage = () => {
  const [searchValue, setSearchvalue] = useState('')
  const debouncedValue = useDebounce(searchValue, 500)
  const {data: searchedProducts, isLoading, isError, error} = useGetSearchProjects(debouncedValue)
  const shouldShowSearchResult = searchValue !== ""
  if(isLoading) return <Loader/>
  if(isError) return <div>{error.message}</div>
  return (
    <div className="flex flex-col flex-1 items-center 
    overflow-scroll py-10 px-5 md:p-14">
      <div className="flex flex-col items-center w-full gap-6 md:gap-9">
        <div className="flex gap-1 px-4 py-8 w-full max-w-sm 
        rounded-lg bg-dark-4 absolute">
          <FaSearch className="text-white text-2xl relative left-8 top-1.5" />
          <Input type="text" placeholder="search" className="pl-10 text-white"
            value={searchValue} onChange={(e) => setSearchvalue(e.target.value)} />
        </div>
      </div>
     <div className="mt-24">
     {shouldShowSearchResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchedProducts?.map((project: Models.Document) => (
              <ProjectCard key={project.$id} project={project} users={project.assignedUsersDetails}/>
            ))}
          </div>
        )}
     </div>

    </div>
  )
}

export default SearchPage
