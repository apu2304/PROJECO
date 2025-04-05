import { useAuthContext } from "@/context/AuthContext"
import { FaUserEdit } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UpdateProfileFormSchema } from "@/lib/validation";
import FileUploader from "@/components/shared/FileUploader";
import { useUpdateProfile } from "@/lib/Query&Mutation/query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const { user, setUser } = useAuthContext()
  const navigate = useNavigate()
  const {mutateAsync: updateProfile} = useUpdateProfile()
  const form = useForm<z.infer<typeof UpdateProfileFormSchema>>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: {
      userName: "",
      profileImage: [],
      companyName: "",
      userId: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UpdateProfileFormSchema>) {
    // Do something with the form values.
    const updatedProfile= await updateProfile({
      ...values,
      id: user?.id,
      userName: values.userName,
      profileImage: values.profileImage,
      imageUrl: user?.imageUrl,
      imageId: user?.imageId,
      companyName: user?.companyName,
      email: user?.email
    })
    if (updatedProfile) {
      setUser({
        ...user,
        userName: values.userName,
        imageUrl: updatedProfile?.imageUrl,
        companyName: updatedProfile.companyName,
        email: updatedProfile.email,
        imageId: updatedProfile.imageId,
      })
      toast("profile updated successfully")
    }
    if (!updatedProfile) {
      toast("failed to update profile")
    }
    navigate("/")
    console.log(values)
  }
  return (
    <div className="max-w-screen-sm flex flex-col items-center 
    w-full gap-6 md:gap-9  md:px-8 md:py-10 px-4 py-5">
      <div className="rounded-xl border border-dark-4 px-4 py-5 w-[300px]">
        <div className="flex justify-between items-center">
          <div className=" max-w-screen-sm flex flex-col items-center 
      text-center w-full gap-6 md:gap-9 relative">
            {user?.imageUrl ? (
              <img src={user?.imageUrl} alt={user?.userName} className="w-15 h-15 rounded-full" />
            ): (
              <img src="/images/placeholder.png" alt={user?.userName} className="w-15 h-15 rounded-full" />
            )}
            <Popover>
              <PopoverTrigger><FaUserEdit  className="text-2xl text-white 
          absolute top-0 right-24 cursor-pointer"/></PopoverTrigger>
              <PopoverContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="User Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                       <FormField
                        control={form.control}
                        name="profileImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <FileUploader fieldChange={field.onChange} mediaUrl={user?.imageUrl} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>

            <h2 className="text-2xl font-medium text-white w-full">{user?.userName}</h2>
            <p className="text-white w-full"> Email: {user?.email}</p>
            <p className="text-white w-full">Company Name: {user?.companyName}</p>
          </div>
        </div>

      </div>
    </div>

  )
}

export default ProfilePage
