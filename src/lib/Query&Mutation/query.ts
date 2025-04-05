import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createUserAccount, getAllCategories, getAllProjectByCategory, getAllProjects, getAllUsers, getCommentsByProjectId, getMyProjects, 
    getProjectById, getSearchResults, logInAccount, logOutAccount, 
    makeUserOffline, 
    makeUserOnline, 
    saveProjectToDB, updateProfile, updateProject, updateProjectStatus, uploadComments } from "../appwrite/api";
import { INewProject, INewUser, iProfileUpdate, PayloadComments, UpdateProject,  } from "@/types/type";
import { QUERY_KEYS } from "./QueryKeys";
import { useAuthContext } from "@/context/AuthContext";

export const useCreateAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
}
export const useLogInAcoount = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) => logInAccount(user),
    })
}
export const useLogOutAccount = () => {
    return useMutation({
      mutationFn: () => logOutAccount()
    })
}
export const useGetAllUsers = () => {
    const {user} = useAuthContext()
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_USERS],
        queryFn: getAllUsers,
        enabled: !!user, 
    })
}
export const useCreateProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (project: INewProject) => saveProjectToDB(project),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_PROJECTS]
            })
        }
    })
}
export const useGetRecentProjects = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_PROJECTS],
        queryFn: getAllProjects, 
    })
}
export const usePRojectsById = (projectId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECTS_BY_ID, projectId],
        queryFn: () => getProjectById(projectId), 
        enabled: !!projectId
    })
}
export const useGetSearchProjects = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SEARCH_PROJECTS],
        queryFn: () => getSearchResults({searchTerm}), 
        enabled: !!searchTerm
    })
} 
export const useGetMyProjects = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_MY_PROJECTS],
        queryFn: getMyProjects,
    })
}
export const useCreateComments = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: PayloadComments) => uploadComments(payload), 
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECTS_BY_ID]
            })
        }
    })
}
export const useGetCommentsById = (projectId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS_BY_ID, projectId],
        queryFn: () => getCommentsByProjectId(projectId),
        enabled: !!projectId
    })
}
export const useUpdateProjectStatus = (projectId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => updateProjectStatus(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECTS_BY_ID, projectId]
            })
        }
    })
}
export const useUpdateProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (project: UpdateProject) => updateProject(project),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECTS_BY_ID, data?.$id]
            })
        }
    })
}
export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (profile: iProfileUpdate) => updateProfile(profile),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_USERS, data?.$id]
            })
        }
    })
}
export const useGetProjectsByCategory = (category: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GEET_PROJECCTS_BY_CATEGORY],
        queryFn: () => getAllProjectByCategory(category),
        enabled: !!category && category !== "all", // prevent fetching for "all"
    })
}
export const useGetUserOnline = () => {
    return useMutation({
        mutationFn: (userId: string) => makeUserOnline(userId),
    })
}
export const useGetUserOffline = () => {
    return useMutation({
        mutationFn: (userId: string) => makeUserOffline(userId),
    })
}
export const useGetAllCategories = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_CATEGORIES],
        queryFn: getAllCategories,
        staleTime: 5000 , // 24 hours
    })
}
