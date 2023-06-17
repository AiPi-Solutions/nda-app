"use client";
import type { NextPage } from "next";
import RootLayout from '../components/RootLayout';
import '../app/globals.css';
import { ChangeEvent, MouseEvent, useState } from "react";
import Link from 'next/link';

import LoadingModal from "../components/LoadingModal";

const ManualPage: NextPage = () => {
    const [text, setText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloadReady, setisDownloadReady] = useState(false);
    const [processedData, setProcessedData] = useState<any[]>([]);

    const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      
        setText(e.target.value);
      };
    
      const onUploadText = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        if (!text) {
          return;
        }
        setIsLoading(true); // start loading
    
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
          });
    
          if (!response.ok) {
            throw new Error(`Text upload failed with status ${response.status}`);
          }
    
          const data = await response.json();
          setProcessedData(data); // Store the processed data
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false); // end loading
          setisDownloadReady(true);
        }
      };



  return (
    <RootLayout>
    <div className="flex items-center justify-center h-screen">
      <LoadingModal isLoading={isLoading} />
      <div className="relative py-3 w-6/12 sm:mx-auto bg-white shadow rounded-3xl sm:p-10">
        <div className="flex flex-col justify-between p-4">
          <h1 className="mb-10 text-3xl font-bold text-gray-900">
            Type in your NDA
          </h1>

          <form
            className="w-full p-3 border border-gray-500 border-dashed"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col md:py-4">
              <textarea
                className="w-full h-64 p-2 mb-4 border text-black border-gray-300 rounded-md"
                value={text}
                onChange={onTextChange}
              />

              <div className="flex flex-row justify-between mt-4 h-1/2 md:mt-0 gap-1.3">
                <button
                  disabled={!text}
                  onClick={onUploadText}
                  className="w-1/3 h-full px-6 py-6 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-blue-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-blue-600"
                >
                  Upload text
                </button>
                <button
                  disabled={!isDownloadReady}
                  //onClick={onDownloadFile}
                  className="w-1/3 h-full px-6 py-6 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-green-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-green-600"
                >
                  Download file
                </button>
              </div>
            </div>
            
          </form>
          <h2 className="text-center text-gray-500 text-xs"><Link href="/"> <br></br>Back to File Upload Version here</Link></h2>
        </div>
      </div>
     
    </div>
    </RootLayout>
  );
};

export default ManualPage;