import CreateForm from "@/components/createForm/CreateForm"


const CreateProject = () => {
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll 
       md:px-8 md:py-10 px-4 py-5">
        <div className="flex gap-3 justify-start">
          <h2 className=" font-medium text-2xl text-white text-left">
            Add Your Products
          </h2>
        </div>
        <CreateForm action={"Create"} />
      </div>
    </div>
  )
}

export default CreateProject
