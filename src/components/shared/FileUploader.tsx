import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { IoImage } from "react-icons/io5";
type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl)
  const [file, setFile] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // Do something with the files
    setFile(acceptedFiles)
    fieldChange(acceptedFiles)
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.svg',]
    }
  })
  return (
    <div {...getRootProps()} className='border-1 border-gray-300 rounded-lg p-4'>
      <input {...getInputProps()} />
      {fileUrl ?
        (
          <>
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
              <img src={fileUrl} alt="image"
                className='w-full h-full rounded-lg' />
            </div>
            <p className='text-center text-gray-500'>
              Click photo to replace
            </p>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center w-full h-full'>
             <IoImage className='text-8xl opacity-30'/>
            <h3 className='base-midum text-light-2 mb-2 mt-6'>
              Drag & Drop your file</h3>
            <p className='text-light-4 small-regular mb-6'>
              SVG, PNG, JPG</p>
          </div>
        )
      }
    </div>
  )
}

export default FileUploader
