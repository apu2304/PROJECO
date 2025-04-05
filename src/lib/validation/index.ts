import { z } from "zod"
 
export const SignUpformSchema = z.object({
  userName: z.string().min(2, {message: "Username must be at least 2 characters long"}),
  companyName: z.string().min(2, {message: "Username must be at least 2 characters long"}),
  email: z.string().email(),
  password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
  confirmPassword: z.string().min(8, {message: "Password must be at least 8 characters long"})
})
export const LoginformSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
})

export const CreateFormSchema = z.object({
  projectName: z.string().min(2, { message: "Product name must be at least 2 characters long" }),
  description: z.string().min(0, { message: "Please add a description" }),
  projectImage: z.custom<File[]>(),
  category: z.string().min(0, { message: "Please put your category" }),
  assignedUsers: z.array(z.string()),
  dueDate: z.date({ required_error: "Due date is required" }).nullable(),
  status: z.string(),
  companyName: z.string(),
  userId: z.string(),
})
export const UpdateProfileFormSchema = z.object({
  userName: z.string().min(2, { message: "Product name must be at least 2 characters long" }),
  profileImage: z.custom<File[]>(),
  companyName: z.string(),
  userId: z.string(),
})