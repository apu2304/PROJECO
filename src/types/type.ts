

export type INewUser = {
    userName: string;
    companyName: string;
    email: string;
    password: string;
};
export type IUser = {
    id: string;
    userName: string;
    email: string;
    imageUrl: string;
    imageId: string;
    isOnline: boolean;
    companyName: string
};
export type INewProject = {
    projectName: string;
    description: string;
    projectImage: File[];
    category: string;
    assignedUsers: string[];
    dueDate: Date | null;
    status: string;
    companyName: string;
    userId: string;
};
export type PayloadComments = {
    userId: string;
    projectId: string | undefined;
    Comment: string;
    imageUrl: string;
    userName: string;
}
export type UpdateProject = {
    id: string;
    projectName: string;
    description: string;
    imageId: string;
    imageUrl: URL;
    projectImage: File[];
    category: string;
    assignedUsers: string[];
    dueDate: Date | null;
    status: string;
    companyName: string;
    userId: string;
};
export type iProfileUpdate = {
    id: string;
    userName: string;
    email: string;
    imageId: string;
    imageUrl: URL | string;
    profileImage: File[];
    companyName: string;
}
export interface Project {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    projectName: string;
    projectImage: string;
    description: string;
    userId: string;
    status: "Pending" | "Completed";
    assignedUsers: string[];
  }
  
  export interface ProjectWithUsers extends Project {
    assignedUsersDetails: any[]; // or define a `User` type if you have it
  }