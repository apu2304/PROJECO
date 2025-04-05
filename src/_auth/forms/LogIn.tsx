import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoginformSchema } from "@/lib/validation"
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
import { Link, useNavigate } from "react-router-dom"
import { useGetUserOnline, useLogInAcoount } from "@/lib/Query&Mutation/query"
import { useAuthContext } from "@/context/AuthContext"
import { toast } from "sonner"

const LogIn = () => {
  const navigate = useNavigate()
  const {mutateAsync: logInAccount, isPending} = useLogInAcoount()
  const {mutateAsync: makeUserOnline} = useGetUserOnline()
  const {checkAuthUser, user} = useAuthContext()
  const form = useForm<z.infer<typeof LoginformSchema>>({
    resolver: zodResolver(LoginformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LoginformSchema>) {
    // Do something with the form values.
    const session = await logInAccount({email: values.email, password: values.password})
    if(!session) toast("Log in failed. Please try again")
    const isLoggedIn = await checkAuthUser()
    await makeUserOnline(user.id)
    if(isLoggedIn){
      form.reset()
      navigate("/")
    }else{
      return toast("Log in failed. Please try again")
    }
    console.log(values)
  }

  return (
    <div className="bg-white/15 backdrop-blur-lg
      py-6 px-12 rounded-lg border-1 w-[26rem] border-white text-gray-200">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>Don't have an account? <Link to="/signup" className="text-white font-medium">Sign Up</Link></p>
        <Button type="submit" className="bg-linear-to-b from-[var(--lavender-pink)] text-white">
          {isPending ? "Loading..." : "Log In"}</Button>
      </form>
    </Form>
    </div>
  )
}

export default LogIn
