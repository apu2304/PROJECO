import { Models } from "appwrite";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CreateFormSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import DatePicker from "../shared/DatePicker";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { useCreateProject, useGetAllUsers, useUpdateProject } from "@/lib/Query&Mutation/query";
import MultiSelect from "../shared/MultiSelect";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

type ProjectFormProps = {
    project?: Models.Document;
    action: "Create" | "Update";
};

const CreateForm = ({ project, action }: ProjectFormProps) => {
    const {user} = useAuthContext()
    const users = useGetAllUsers();
    console.log(users)
    const navigate = useNavigate()
    const {mutateAsync: createProject, isPending: isLoadingCreate} = useCreateProject()
    const {mutateAsync: updateProject, isPending: isLoadingUpdate} = useUpdateProject()

    const form = useForm<z.infer<typeof CreateFormSchema>>({
        resolver: zodResolver(CreateFormSchema),
        defaultValues: {
            projectName: project?.projectName ?? "",
            description: project?.description ?? "",
            projectImage: [],
            category: project?.category ?? "",
            assignedUsers: project?.assignedUsers ?? [],
            dueDate: project?.dueDate ?? undefined,
            status: project?.status ?? "",
            companyName: project?.companyName ?? "",
            userId: project?.userId ?? "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof CreateFormSchema>) {
        // Do something with the form values.
        if(project && action === "Update"){
            const updatedProject = await updateProject({
                ...values,
                id: project.$id,
                imageId: project.imageId,
                imageUrl: project.projectImage,
                status: project.status,
                companyName: user.companyName,
                userId: user.id
            })
            if(!updatedProject){
                toast("Project update failed. Please try again")
            }
            navigate("/")
            return

        }
        const newProject = await createProject({
            ...values,
            status: "Pending",
            companyName: user.companyName,
            userId: user.id
        })
        if(!newProject){
            toast("Project creation failed. Please try again")
        }
        navigate("/")
        console.log(values)
    }
    return (
        <div className="bg-white/30 backdrop-blur-lg py-6 px-12 rounded-lg border-2 
        border-white  text-white
        w-[22rem] md:w-[26rem]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8">
                    <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl>
                                    <Input type="text"  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Discription</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="projectImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Image</FormLabel>
                                <FormControl>
                                    <FileUploader fieldChange={field.onChange} mediaUrl={project?.projectImage} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input type="text"  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="assignedUsers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assigned Users</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        name={field.name}
                                        control={form.control}
                                        options={
                                           users.data ?  users.data?.map((user: any) => ({
                                            value: user.$id,
                                            label: user.userName,
                                            imageUrl: user.imageUrl
                                        })) : []
                                            }
                                    />

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                    <DatePicker value={field.value as Date | undefined} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="bg-linear-to-b 
        from-[var(--lavender-pink)] to-[var(--brilliant-rose)] text-white">
            {isLoadingCreate || isLoadingUpdate  && <Loader/> }
              {action} Project
            </Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateForm
