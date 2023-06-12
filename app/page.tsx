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
  <div className="relative py-3 w-2/6 sm:mx-auto bg-white shadow rounded-3xl sm:p-10">
    <div className="flex flex-col justify-between p-4">
      <h1 className="mb-10 text-3xl font-bold text-gray-900">
        Upload your NDA
      </h1>

      <form
        className="w-full p-3 border border-gray-500 border-dashed"
        onSubmit={(e) => e.preventDefault()}
        encType="multipart/form-data"
      >
        <div className="flex flex-col md:flex-row gap-1.5 md:py-4">
          <label className="flex flex-col items-center justify-center flex-grow h-full py-3 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
            <strong className="text-sm font-medium">Select a file</strong>
            <input
              className="block w-0 h-0"
              name="file"
              type="file"
              accept=".docx"
              onChange={onFileUploadChange}
            />
          </label>
          
          <div className="flex flex-col mt-4 md:mt-0 justify-center gap-1.5">
            <button
              disabled={!file}
              onClick={onCancelFile}
              className="w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-red-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-red-600"
            >
              Cancel file
            </button>
            <button
              disabled={!file}
              onClick={onUploadFile}
              className="w-full px-4 py-2 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-blue-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-blue-600"
            >
              Upload file
            </button>
            <button
              disabled={!file} //will need to modify this to download the file and the states for when downlad is ready
              //onClick={onDownloadFile}
              className="w-full px-4 py-2 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-green-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-green-600"
            >
              Download file
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
