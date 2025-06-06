import { Client , Account, Databases, Storage, Avatars} from 'appwrite';

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    endpoint: import.meta.env.VITE_APPWRITE_PROJECT_URL,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    avaterStorageId: import.meta.env.VITE_APPWRITE_AVATER_STORAGE_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLOCTION_ID,
    projectsCollectionId: import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID,
    commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID
}
export const client = new Client()
client.setProject(appwriteConfig.projectId)
client.setEndpoint(appwriteConfig.endpoint)
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)
