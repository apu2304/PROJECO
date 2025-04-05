
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Routes, Route } from "react-router-dom"
import AuthLayout from "./_auth/AuthLayout"
import SignUpForm from "./_auth/forms/SignUpForm"
import LogIn from "./_auth/forms/LogIn"
import RootLayout from "./_root/RootLayout"
import Home from "./_root/pages/Home"
import { Toaster } from "@/components/ui/sonner"
import CreateProject from "./_root/pages/CreateProject"
import ProductDetailsPage from "./_root/pages/ProductDetailsPage"
import ProfilePage from "./_root/pages/ProfilePage"
import MyProject from "./_root/pages/MyProject"
import SearchPage from "./_root/pages/SearchPage"
import UpdatePRoject from "./_root/pages/UpdatePRoject"
function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <main>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<AuthLayout/>}>
           <Route path="/signup" element={<SignUpForm/>} />
           <Route path="/login" element={<LogIn/>} />
          </Route>
          <Route element={<RootLayout/>}>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<CreateProject/>} />
          <Route path="/details/:id" element={<ProductDetailsPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/myProject" element={<MyProject/>} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/editPrject/:id" element={<UpdatePRoject/>}/>
          </Route>
        </Routes>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      </main>
    </>
  )
}

export default App
