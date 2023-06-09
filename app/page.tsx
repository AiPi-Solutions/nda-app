"use client"
import type { NextPage } from "next";
import { ChangeEvent, MouseEvent, useState } from "react";

const UploadPage: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFile(null);
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    

    <div className="flex items-center justify-center h-screen">
    <div className="relative py-3 w-1/2 sm:mx-auto bg-white shadow rounded-3xl sm:p-10">
      <div className="flex flex-col justify-between p-4">
        <h1 className="mb-10 text-3xl font-bold text-gray-900">
          Upload your files
        </h1>
  
        <form
          className="w-full p-3 border border-gray-500 border-dashed"
          onSubmit={(e) => e.preventDefault()}
          encType="multipart/form-data"
        >
          <div className="flex flex-col md:flex-row gap-1.5 md:py-4">
            <label className="flex flex-col items-center justify-center flex-grow h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
              <strong className="text-sm font-medium">Select a file</strong>
              <input
                className="block w-0 h-0"
                name="file"
                type="file"
                accept=".docx"
                onChange={onFileUploadChange}
              />
            </label>
            <div className="flex mt-4 md:mt-0 md:flex-col justify-center gap-1.5">
              <button
                disabled={!file}
                onClick={onCancelFile}
                className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
              >
                Cancel file
              </button>
              <button
                disabled={!file}
                onClick={onUploadFile}
                className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
              >
                Upload file
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  



  );
};

export default UploadPage;
