"use client";
import type { NextPage } from "next";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactFragment, ReactPortal, useRef } from "react";
import '../app/globals.css';
import { ChangeEvent, MouseEvent, useState, useEffect } from "react";
import { diffWordsWithSpace, Change } from 'diff';
import Link from 'next/link';

import LoadingModal from "../components/LoadingModal";

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownBtn from "../components/DropdownBtn";

const ManualPage: NextPage = () => {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [diffResult, setDiffResult] = useState<Change[]>([]);

  useEffect(() => {
    if (processedData.length > 0) {
      const processedText = processedData.map((item) => item.processed).join(' ');
      const diff = diffWordsWithSpace(text, processedText);
      setDiffResult(diff);
    }
  }, [processedData, text]);
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
      console.log("back");
      // Calculate the diff
      const processedText = data.map((item: { processed: any; }) => item.processed).join(' ');
      const diff = diffWordsWithSpace(text, processedText);
      console.log("🚀 ~ file: page.tsx:47 ~ onUploadText ~ diff:", diff)
      console.log("processedData: ", processedData);

      setDiffResult(diff);
      console.log("diff: ", diffResult);
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

          <div>
            <DropdownBtn />
              {/* <div className="relative inline-block text-left">
                <div>
                  <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="false" aria-haspopup="true">
                    ML Model
                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>


                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                  <div className="py-1" role="none">
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-0">Model #1</a>
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-1">Model #2</a>
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">Model #3</a>
                    <form method="POST" action="#" role="none">
                      <button type="submit" className="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" id="menu-item-3">Sign out</button>
                    </form>
                  </div>
                </div>
              </div> */}

              
            </div>

            <form
              className="w-full p-3 border border-gray-500 border-none"
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
                  {diffResult.map((part, index) => (
                    <p key={index} className={`mb-4 text-black ${part.added ? 'bg-green-200' : ''} ${part.removed ? 'line-through bg-red-200' : ''}`}>
                      {part.value}
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
