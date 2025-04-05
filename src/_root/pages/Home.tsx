import ProjectCard from "@/components/shared/ProjectCard"
import { useGetAllCategories, useGetProjectsByCategory, useGetRecentProjects } from "@/lib/Query&Mutation/query"
import { Models } from "appwrite"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {useState } from "react"
import useDebounce from "@/hooks/useDebounce"
import Loader from "@/components/shared/Loader"


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const debounceCategory = useDebounce(selectedCategory, 300); // reduced debounce for snappier feel

  const { data: recentProjects, isLoading: isRecentLoading, error: recentError } = useGetRecentProjects();
  const {
    data: categoryProjects,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useGetProjectsByCategory(debounceCategory);

  const { data: categories } = useGetAllCategories();

  const isLoading = debounceCategory === "all" ? isRecentLoading : isCategoryLoading;
  const error = debounceCategory === "all" ? recentError : categoryError;
  const projectsToShow =
  debounceCategory === "all" ? recentProjects : categoryProjects;

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll md:px-8 md:py-10 px-4 py-5">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <div className="flex gap-3 justify-between w-full">
            <h2 className="text-2xl font-medium text-white text-left w-full">
              Recent Projects
            </h2>
            <Select onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-[180px] text-white placeholder:text-gray-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p className="text-white"><Loader/></p>
          ) : error ? (
            <p className="text-red-400">{error.message}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {projectsToShow?.map((project: Models.Document) => (
                <ProjectCard key={project.$id} project={project} users={project.assignedUsersDetails}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Home


