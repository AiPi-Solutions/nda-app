"use client";
import type { NextPage } from "next";
import { useRef } from "react";
import '../app/globals.css';
import { ChangeEvent, MouseEvent, useState } from "react";
import Link from 'next/link';

import LoadingModal from "../components/LoadingModal";

const ManualPage: NextPage = () => {
    const [text, setText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
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
          const response = await fetch("/api/manual", {
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
        }
    };

    const outputRef = useRef<HTMLDivElement>(null);


  const copyToClipboard = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!outputRef.current) {
      return;
    }
    navigator.clipboard.writeText(outputRef.current.innerText).then(() => {
      alert("Output copied to clipboard!");
    }, (err) => {
      console.error("Could not copy text: ", err);
    });
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 gap-y-10">
    <div className="w-full mt-24 max-w-4xl">
      <div className="relative py-3 w-full bg-white shadow rounded-3xl sm:p-10">
        <LoadingModal isLoading={isLoading} />
      <div className="relative py-3 w-full max-w-4xl sm:mx-auto bg-white rounded-3xl sm:p-10">
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
                onClick={() => setText('')}
                className="w-1/3 h-full px-6 py-6 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-red-500 rounded-md md:w-auto md:text-base hover:bg-red-600"
              >
                Clear Text
              </button>
              <button
                disabled={!text}
                onClick={onUploadText}
                className="w-1/3 h-full px-6 py-6 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-blue-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-blue-600"
              >
                Upload Text
              </button>
            </div>
          </div>
        </form>
          <h2 className="text-center text-gray-500 text-xs"><Link href="../upload"> <br></br>File Upload Version here</Link></h2>
        </div>
      </div>
      </div>

      {/* Output Card */}
      {processedData.length > 0 && (
      <div className="w-full max-w-4xl mb-24">
        <div className="relative py-3 w-full bg-white shadow rounded-3xl sm:p-10">
          <div className="flex flex-col justify-between p-4">
            <div className="flex justify-between items-center">
              <h1 className="mb-10 text-3xl font-bold text-gray-900">
                Output
              </h1>
              <button onClick={copyToClipboard} className="px-4 py-2 text-white bg-blue-500 rounded-md">
                Copy to Clipboard
              </button>
            </div>
            <div ref={outputRef} className="w-full p-3 border border-gray-500 border-dashed">
              <div className="flex flex-col md:py-4">
                {processedData.map((data, index) => (
                  <p key={index} className="mb-4 text-black">
                    {data.processed}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
    
  );
};

export default ManualPage;
