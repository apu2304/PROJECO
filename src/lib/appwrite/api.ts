import { INewProject, INewUser, iProfileUpdate, PayloadComments, Project, ProjectWithUsers, UpdateProject} from "@/types/type";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.userName
        );
        console.log(newAccount);
        const Session = await account.createEmailPasswordSession(
            user.email,
            user.password
        )
        console.log(Session);
        const currentUser = await account.get();
        const avatarUrl = avatars.getInitials(user.userName)
        const newUser = await saveUserToDatabase({
            userId: currentUser.$id,
            email: user.email,
            userName: user.userName,
            imageUrl: avatarUrl,
            isOnline: true,
            companyName: user.companyName
        })
        console.log(newUser);
        return newUser
    } catch (error) {
        console.error(error);
    }
}
export async function saveUserToDatabase(user: {
    userId: string; email: string; userName: string; imageUrl: string; 
    isOnline: boolean; companyName: string
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user
        )
        console.log(newUser);
        return newUser
    } catch (error) {
        console.error(error);
    }
}
export async function logInAccount(user: { email: string, password: string }) {
    try {
        const Session = await account.createEmailPasswordSession(
            user.email,
            user.password
        )
        if (!Session) throw new Error("Session not created")
        console.log(Session);
        return Session
    } catch (error) {
        console.error(error);
    }
}
export async function logOutAccount() {
    try {
        await account.deleteSession("current"); 
        console.log("Session successfully deleted");
        return true; // Explicitly return success
    } catch (error) {
        console.error("Logout Error:", error);
        return false; // Explicitly return failure
    }
}
export async function getCuurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("User not found")
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("userId", currentAccount.$id)]
        )
        if (!currentUser.documents.length) throw new Error("User not found in Database")
        return currentUser.documents[0]
    } catch (error) {
        console.error(error);
    }
}
export async function getAllUsers() {
    try {
        const currentUser = await getCuurrentUser();
        if (!currentUser){
            throw new Error("User not found")
            return
        }
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("companyName", currentUser.companyName)]
        )
        return users.documents
    } catch (error) {
        console.error(error);
    }
}
export async function saveProjectToDB(project: INewProject){
   try{
    const uploadedFile = await uploadFile(project.projectImage[0])
    if(!uploadedFile) throw new Error("File not uploaded")
    const fileUrl = await getFilePreview(uploadedFile.$id)
    if(!fileUrl){
        await deleFile(uploadedFile.$id)
       throw new Error
    }
    const newProject = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.projectsCollectionId,
        ID.unique(),
        {
            projectName: project.projectName,
            description: project.description,
            imageId: uploadedFile.$id,
            projectImage: fileUrl,
            category: project.category,
            assignedUsers: project.assignedUsers,
            dueDate: project.dueDate,
            status: project.status,
            companyName: project.companyName,
            userId: project.userId
        }
    )
    if(!newProject){
        await deleFile(uploadedFile.$id)
       throw new Error
    }
    return newProject
   }catch(error){
    console.log(error)
   }
}
export async function uploadFile(file: File){
    try{
       const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
       )
       return uploadedFile
    }catch(error){
       console.log(error)
    }
}
export async function getFilePreview(fileId: string){
    try{
      const fileUrl = await storage.getFileView(
        appwriteConfig.storageId,
        fileId
      )
      return fileUrl
    }catch(error){
       console.log(error)
    }
}
 export async function deleFile(fileId: string){
    try{
       await storage.deleteFile(appwriteConfig.storageId, fileId)
       return {status: "ok" }
     }catch(error){
        console.log(error)
     }
}
export async function getAllProjects(){
    try{
        const currentUser = await getCuurrentUser();
        if (!currentUser){
            throw new Error("User not found")
        }
        const projects = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.projectsCollectionId,
            [Query.equal("companyName", currentUser.companyName),
            Query.orderDesc("$createdAt"),
            Query.limit(10)
            ]
        )
        const fullProjects = await Promise.all(projects.documents.map(async (proj) => {
            const userDetails = await Promise.all(proj.assignedUsers.map((userId: any) =>
              databases.getDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userId)
            ));
            return { ...proj, assignedUsersDetails: userDetails };
          }));
        return fullProjects
    }catch(error){
        console.log(error)
    }
}

export async function fetchProjectWithUsers(projectId: string) {
    const project = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.projectsCollectionId,
      projectId
    );
    const userPromises = project.assignedUsers.map((userId: string) =>
       databases.getDocument(
         appwriteConfig.databaseId,
         appwriteConfig.usersCollectionId,
         userId
       )
    );
    const users = await Promise.all(userPromises);
    
    return { ...project, assignedUsersDetails: users };
}
export async function getProjectById(projectId: string): Promise<ProjectWithUsers | undefined> {
    try {
        const project = await databases.getDocument<Project>(
          appwriteConfig.databaseId,
          appwriteConfig.projectsCollectionId,
          projectId
        );
    
        const userPromises = Array.isArray(project.assignedUsers)
          ? project.assignedUsers.map((userId: string) =>
              databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                userId
              )
            )
          : [];
    
        const users = await Promise.all(userPromises);
    
        return { ...project, assignedUsersDetails: users };
    } catch (error) {
      console.error(error);
    }
}
export async function getSearchResults({searchTerm}: {searchTerm: string}) {
    try {
      const currentUser = await getCuurrentUser();
      if (!currentUser){
          throw new Error("User not found")
      }
      const projects = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.projectsCollectionId,
        [   Query.equal("companyName", currentUser.companyName),
            Query.search("projectName", searchTerm.trim())
        ]
      );
      const fullProjects = await Promise.all(projects.documents.map(async (proj) => {
        const userDetails = await Promise.all(proj.assignedUsers.map((userId: any) =>
          databases.getDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userId)
        ));
        return { ...proj, assignedUsersDetails: userDetails };
      }));
    return fullProjects
    } catch (error) {
      console.error(error);
    }
}
export async function getMyProjects(){
    try{
      const currentUser = await getCuurrentUser();
      if (!currentUser){
          throw new Error("User not found")
      }
      const projects = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.projectsCollectionId,
        [   Query.equal("companyName", currentUser.companyName),
            Query.search("assignedUsers", currentUser.$id)
        ]
      )
      const fullProjects = await Promise.all(projects.documents.map(async (proj) => {
        const userDetails = await Promise.all(proj.assignedUsers.map((userId: any) =>
          databases.getDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userId)
        ));
        return { ...proj, assignedUsersDetails: userDetails };
      }));
    return fullProjects
    }catch(error){
        console.log(error)
        return []
    }
}
export async function uploadComments(payload: PayloadComments){
    try{
        const responce = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            ID.unique(),
            {
                userId: payload.userId,
                projectId: payload.projectId,
                Comment: payload.Comment,
                imageUrl: payload.imageUrl,
                userName: payload.userName
            }
        )
        return responce
    }catch(error){
        console.log(error)
    }
}
export async function getCommentsByProjectId(projectId: string){
    try{
        const comments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            [Query.equal("projectId", projectId)]
        )
        return comments.documents
    }catch(error){
        console.log(error)
    }
}
export async function updateProjectStatus(projectId: string){
    try{
        const project = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.projectsCollectionId,
            projectId,
            {
                status: "Completed"
            }
        )
        return project
    }catch(error){
        console.log(error)
    }
}
export async function updateProject(project: UpdateProject){

   try {
    const hasFiletoUpdate = project.projectImage.length > 0
    let image = {
        imageId: project.imageId,
        imageUrl: project.imageUrl
     }
      if (hasFiletoUpdate) {
         const uploadedFile = await uploadFile(project.projectImage[0])
         if (!uploadedFile) throw Error
         const fileUrl = await getFilePreview(uploadedFile.$id)
         if (!fileUrl) {
            deleFile(uploadedFile.$id)
            throw Error
         }
         image = {
            ...image,
            imageId: uploadedFile.$id,
            imageUrl: new URL(fileUrl)
         }
      }
        const updatedProject = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.projectsCollectionId,
            project.id,
            {
                projectName: project.projectName,
                description: project.description,
                imageId: image.imageId,
                projectImage: image.imageUrl,
                category: project.category,
                assignedUsers: project.assignedUsers,
                dueDate: project.dueDate,
                status: project.status,
                companyName: project.companyName,
                userId: project.userId,
            }
        )
        if(!updatedProject) {
            await deleFile(image.imageId)  
          throw new Error("Project not updated")
        }
        return updatedProject
    }catch(error){
        console.log(error)
    }
}

export async function updateProfile(profile: iProfileUpdate){
    try {
        const uploadedFile = await uploadProfilePricture(profile.profileImage[0])
        if(!uploadedFile) throw new Error("File not uploaded")
        const fileUrl = await getFilePreviewOfAvater(uploadedFile.$id)
        if(!fileUrl){
            await deleteAvater(uploadedFile.$id)
           throw new Error
        }
            const updatedProfile = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                profile.id,
                {
                    userName: profile.userName,
                    email: profile.email,
                    imageId: uploadedFile.$id,
                    imageUrl: fileUrl,
                    companyName: profile.companyName
                }
            )
            if(!updatedProfile) {
                await deleFile(uploadedFile.$id)  
              throw new Error("Project not updated")
            }
            return updatedProfile
        }catch(error){
            console.log(error)
        }
}
export async function uploadProfilePricture(file: File){
    try{
       const uploadedFile = await storage.createFile(
        appwriteConfig.avaterStorageId,
        ID.unique(),
        file
       )
       return uploadedFile
    }catch(error){
       console.log(error)
    }
}
export async function getFilePreviewOfAvater(fileId: string){
    try{
      const fileUrl = await storage.getFileView(
        appwriteConfig.avaterStorageId,
        fileId
      )
      return fileUrl
    }catch(error){
       console.log(error)
    }
}
export async function deleteAvater(fileId: string){
    try{
       await storage.deleteFile(appwriteConfig.avaterStorageId, fileId)
       return {status: "ok" }
     }catch(error){
        console.log(error)
     }
}
export async function getAllCategories(){
    try{
        const currentUser = await getCuurrentUser();
        if (!currentUser){
            throw new Error("User not found")
        }
        const projects = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.projectsCollectionId,
            [Query.equal("companyName", currentUser.companyName),]
        )
        const categories = [...new Set(projects.documents.map((project) => project.category))]
       return categories.length > 0 ? categories : ["No Categories"]
    }catch(error){
        console.log(error)
    }
}
export async function getAllProjectByCategory(category: string){
    try{
        const currentUser = await getCuurrentUser();
        if (!currentUser){
            throw new Error("User not found")
        }
        const projects = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.projectsCollectionId,
            [Query.equal("companyName", currentUser.companyName),
            Query.equal("category", category)]
        )
        const fullProjects = await Promise.all(projects.documents.map(async (proj) => {
            const userDetails = await Promise.all(proj.assignedUsers.map((userId: any) =>
              databases.getDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userId)
            ));
            return { ...proj, assignedUsersDetails: userDetails };
          }));
        return fullProjects
    }catch(error){
        console.log(error)
    }
}
export async function makeUserOnline(userId: string){
    try{
        const user = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
            {
                isOnline: true
            }
        )
        return user
    }catch(error){
        console.log(error)
    }
}
export async function makeUserOffline(userId: string){
    try{
        const user = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
            {
                isOnline: false
            }
        )
        return user
    }catch(error){
        console.log(error)
    }
}


