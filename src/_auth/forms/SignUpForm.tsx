import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SignUpformSchema } from "@/lib/validation"
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
import { toast } from "sonner"
import { useCreateAccount } from "@/lib/Query&Mutation/query"
import { useAuthContext } from "@/context/AuthContext"

const SignUpForm = () => {
  const navigate = useNavigate()
  const { mutateAsync: createUserAcount, isPending } = useCreateAccount()
  const { checkAuthUser, isLoading } = useAuthContext()
  const form = useForm<z.infer<typeof SignUpformSchema>>({
    resolver: zodResolver(SignUpformSchema),
    defaultValues: {
      userName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpformSchema>) {
    // Do something with the form values.
    if (values.password !== values.confirmPassword) {
      return toast("Passwords do not match")
    }
    const newUser = await createUserAcount(values)
    if (!newUser) {
      return toast("Sign up failed. Please try again")
    }
   
    const isLoggedIn = await checkAuthUser()
    if (isLoggedIn) {
      form.reset()

      navigate("/")
    } else {
      
      return toast("Sign up failed. Please try again")
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
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email"  {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p>Already have an account? <Link to="/login" className="text-white font-medium">Login</Link></p>
          <Button type="submit" className="bg-linear-to-b from-[var(--lavender-pink)] to- text-white">
            {isPending || isLoading ? "Signing up..." : "Sign up"}</Button>
        </form>
      </Form>
    </div>
  )
}

export default SignUpForm
