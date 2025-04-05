import { useAuthContext } from "@/context/AuthContext"
import { useCreateComments, useGetCommentsById, usePRojectsById, useUpdateProjectStatus } from "@/lib/Query&Mutation/query"
import { Link, useParams } from "react-router-dom"
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { SiImessage } from "react-icons/si";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";
import { fetchProjectWithUsers } from "@/lib/appwrite/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { appwriteConfig, client, databases } from "@/lib/appwrite/config";
import { formatDistanceToNow } from "date-fns";
import { FaTrash } from "react-icons/fa";
import { ProjectWithUsers } from "@/types/type";
import Loader from "@/components/shared/Loader";
interface RealtimeResponse {
  events: string[];
  payload: {
    $id: string;
    [key: string]: any; // For other dynamic fields
  };
}
const ProductDetailsPage = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const { data: project, isLoading } = usePRojectsById(id || "") as { data: ProjectWithUsers, isLoading: boolean }
  const [userDetails, setUserDetails] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [messageBody, setMessageBody] = useState('')
  console.log(messages)
  const { mutateAsync: CreateMessage, isPending: isCreating } = useCreateComments()
  const {mutateAsync: updateProject} = useUpdateProjectStatus(project?.$id || "")
  const { data: getMessages } = useGetCommentsById(project?.$id || "")
  console.log(getMessages)
  useEffect(() => {
    if (getMessages) {
      setMessages(getMessages)
    }
  }, [getMessages])
  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.commentsCollectionId}.documents`,
      (responce: RealtimeResponse) => {
        console.log("RealTime", responce)
        if (responce.events.includes('databases.*.collections.*.documents.*.create')) {
          console.log("a message was created")
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some((message) => message.$id === responce.payload.$id);
            if (isDuplicate) return prevMessages; // Do nothing if duplicate
            return [...prevMessages, responce.payload];
          });

        }
        if (responce.events.includes('databases.*.collections.*.documents.*.delete')) {
          console.log("a message was deleted")
          setMessages((prevMessages) => prevMessages.filter(message => message.$id !== responce.payload.$id));
        }
      }
    )
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (project) {
          const assigned = await fetchProjectWithUsers(project?.$id)
          setUserDetails(assigned.assignedUsersDetails)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  console.log(userDetails)

  const handleSubmit = async () => {
    if (!messageBody) return
    const payload = {
      userId: user.id,
      projectId: project?.$id,
      Comment: messageBody,
      imageUrl: user.imageUrl,
      userName: user.userName
    }
    await CreateMessage(payload)
    setMessageBody('')
  }
  const deleteMessage = async (messageId: string) => {
    let responce = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      messageId
    )
    //setMessages(() => messages.filter(message => message.$id !== messageId))
    return responce
  }
  if (isLoading) return <Loader  />
  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll 
    py-10 px-5 md:p-14 items-center">
      <div className="rounded-[30px]
      flex-col flex xl:flex-row border border-dark-4 p-6 relative">
        <img src={project?.projectImage} alt="" className="rounded-2xl object-cover" />
        {user.id === project?.userId && (
          <Link to={`/editPrject/${project.$id}`} className="absolute top-3 right-3 
           text-3xl text-white">
            <BiSolidMessageSquareEdit />
          </Link>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{project?.projectName}</h2>
            <div className="flex items-center gap-5">
              <Sheet>
                <SheetTrigger><SiImessage className="text-2xl text-white mt-2" /></SheetTrigger>
                <SheetContent side="bottom">
                  <SheetHeader>
                    <SheetTitle>Messages</SheetTitle>
                    <SheetDescription></SheetDescription>
                    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                    {messages.map((message) => (
                      <div key={message.$id} className="flex flex-wrap flex-col gap-4 mb-4">
                        <div className="flex justify-between items-center">
                          <div className="w-fit border border-dark-4 
                        rounded-lg p-2 text-[var(--midnight-blue)]">
                            <div className="flex items-center gap-2 mb-3">
                              <img src={message.imageUrl} alt={message.userName} className="w-8 h-8 rounded-full" />
                              <small className="message-timestamp">{formatDistanceToNow(new Date(message.$createdAt))}</small>
                            </div>
                            <div className="flex items-center gap-2 justify-between">
                              <span className="text-">{message.Comment}</span>
                              {user.id === message.userId && <FaTrash className="delete--btn" onClick={() => deleteMessage(message.$id)} />}
                            </div>

                          </div>
                        </div>

                      </div>
                    ))}
                    </ScrollArea>
                    
                  </SheetHeader>
                  <div className="flex justify-center gap-4 items-center max-w-sm" >
                    <Textarea placeholder="Enter Message" className="w-full"
                      onChange={(e) => setMessageBody(e.target.value)} value={messageBody} />
                    <Button onClick={handleSubmit}>{isCreating ? (
                      <Loader />
                    ): "send"}</Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Popover>
                <PopoverTrigger><p className={`text-sm text-white rounded-full shadow-md mt-2
              px-4 py-2 ${project?.status === "Completed" ? "bg-green-500" : "bg-amber-600"}`}
                >{project?.status}</p></PopoverTrigger>
                {project?.assignedUsers?.includes(user.id) && (
                  <PopoverContent onClick={() => updateProject()}>{"Completed"}</PopoverContent>
                )}
              </Popover>
            </div>
          </div>
          <p className="text-sm text-gray-200">{project?.description}</p>
          <h2 className='text-lg text-gray-200 p-3'>Project Assigned To:</h2>
          <div className='flex gap-2 p-3'>
            {userDetails.map((user: any) => (
              <div className="flex items-center gap-2 flex-col" key={user.id}>
                <img src={user.imageUrl} alt={user.userName} className='w-8 h-8 rounded-full' />
                <p className="text-lg text-medium text-white">{user.userName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
