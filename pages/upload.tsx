"use client";
import type { NextPage } from "next";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { Document, IRunOptions, Packer, Paragraph, TextRun } from "docx";
import Link from 'next/link';
import { diffWordsWithSpace } from 'diff';
import RootLayout from '../components/RootLayout';

import LoadingModal from "../components/LoadingModal";
import { printCustomRoutes } from "next/dist/build/utils";

const UploadPage: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadReady, setisDownloadReady] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    setFile(null);
    setIsLoading(false);
    setisDownloadReady(false);
    setProcessedData([]);
    setOriginalFileName("");
    setFileName(null);
  }, []);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setFile(null);
      setFileName(null);
    }
  };

  const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFile(null);
    setFileName(null);
    setisDownloadReady(false);

    // Clear the file input element
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }
    setOriginalFileName(file.name);
    setIsLoading(true); // start loading
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("🚀 ~ file: page.tsx:47 ~ onUploadFile ~ data:", data);
      setProcessedData(data); // Store the processed data

      //console.log("reached back");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // end loading
      setisDownloadReady(true);
    }
  };

  /*const onDownloadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    processedData.map((data, index) => {
      console.log(`Data ${index + 1}:`, data.processed);
    });
    
     // Create a new paragraph for each processed section
    const paragraphs = processedData.map(
      (section) => new Paragraph(section.processed)
      
    );

    // Create a single section with all paragraphs
    const sections = [
      {
        properties: {},
        children: paragraphs,
      },
    ];

    const doc = new Document({ sections });

    // Export the document to a .docx file
    const packer = new Packer();
    const blob = await Packer.toBlob(doc);

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    setIsLoading(false);
    // Set the download attribute to automatically download the .docx file
    link.download = `${originalFileName.split('.').slice(0, -1).join('.')}-modified.docx`;

    // Append the link to the body
    document.body.appendChild(link);

    // Simulate a click on the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link); 
  }; */
  /*const onDownloadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Create a new paragraph for each change in the diff result
    const paragraphs = processedData.map((change, index) => {
      const diffResult = change.diffResult;
      const textRuns = diffResult.map((diffItem: any) => {
        let color;
        let strike = false;
        let highlight;
        
        if (diffItem.added) {

            highlight = "green"; // Set highlight color to green for additions
            
        } else if (diffItem.removed) {
          
          highlight = "red"; // Set highlight color to green for additions
          strike = true; // Add strikethrough for removed text
          diffItem.value += " ";
        }
  
        return new TextRun({
          text: diffItem.value,
          color: color,
          strike: strike,
          highlight: highlight,
        });
      });
  
      return new Paragraph({
        children: textRuns,
      });
    });

    
    // Create a single section with all paragraphs
      const sections = [
      {
        properties: {},
        children: paragraphs,
      },
    ];
  
    const doc = new Document({ sections });
  
    // Export the document to a .docx file
    const packer = new Packer();
    const blob = await Packer.toBlob(doc);
  
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
  
    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    setIsLoading(false);
    // Set the download attribute to automatically download the .docx file
    link.download = `${originalFileName.split('.').slice(0, -1).join('.')}-modified.docx`;
  
    // Append the link to the body
    document.body.appendChild(link);
  
    // Simulate a click on the link
    link.click();
  
    // Remove the link from the body
    document.body.removeChild(link);  
  };*/
  const onDownloadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Create a new paragraph for each processed section
    const paragraphs = processedData.map(
      (section) => new Paragraph(section.processed)
    );
  
    // Create a single section with all paragraphs
    const sections = [
      {
        properties: {},
        children: paragraphs,
      },
    ];
  
    const doc = new Document({ sections });
  
    // Export the document to a .docx file
    const packer = new Packer();
    const blob = await Packer.toBlob(doc);
  
    // Create a new FormData instance
    const formData = new FormData();
    if(!file){
      console.log("no file");
      return;
    }
    console.log("🚀 ~ file: upload.tsx:227 ~ onDownloadFile ~ file:", file);
    
     // Append the original and modified files to the FormData instance
    formData.append('file1', file); // original file
    formData.append('file2', new File([blob], `${originalFileName.split('.').slice(0, -1).join('.')}-modified.docx`)); // modified file
  
    // Send a POST request to the new API route
    const response = await fetch("/api/convert", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      const responseBody = await response.text();
      console.error(`File comparison failed with status ${response.status}. Response body: ${responseBody}`);
      throw new Error(`File comparison failed with status ${response.status}`);
    }
  
    // Get the result from the response
    const result = await response.arrayBuffer();
  
    // Create a blob from the result
    const blobResult = new Blob([new Uint8Array(result)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  
    // Create a URL for the blob
    const url = URL.createObjectURL(blobResult);
  
    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    
    // Set the download attribute to automatically download the .docx file
    link.download = `${originalFileName.split('.').slice(0, -1).join('.')}-compared.docx`;
  
    // Append the link to the body
    document.body.appendChild(link);
  
    // Simulate a click on the link
    link.click();
  
    // Remove the link from the body
    document.body.removeChild(link);  
    setIsLoading(false);
  };
  
  
  
  
  
  
  
  
  
  
  
  

  return (
    <RootLayout>
    <div className="flex items-center justify-center h-screen">
      <LoadingModal isLoading={isLoading} />
      <div className="relative py-3 w-6/12 sm:mx-auto bg-white shadow rounded-3xl sm:p-10">
        <div className="flex flex-col justify-between p-4">
          <h1 className="mb-10 text-3xl font-bold text-gray-900">
            Upload your NDA
          </h1>

          <form
            className="w-full p-3 border border-gray-500 border-dashed"
            onSubmit={(e) => e.preventDefault()}
            encType="multipart/form-data"
          >
            <div className="flex flex-col md:py-4">
              <label className="flex flex-col items-center justify-center flex-grow h-full py-3 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 ">
                <strong className="text-sm font-medium">
                  {fileName || "Select a file"}
                </strong>
                <input
                  className="hidden"
                  name="file"
                  type="file"
                  accept=".docx"
                  onChange={onFileUploadChange}
                />
              </label>

              <div className="flex flex-row justify-between mt-4 h-1/2 md:mt-0 gap-1.3">
                <button
                  disabled={!file}
                  onClick={onCancelFile}
                  className="w-1/3 h-full px-6 py-6 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-red-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-red-600"
                >
                  Cancel file
                </button>
                <button
                  disabled={!file}
                  onClick={onUploadFile}
                  className="w-1/3 h-full px-6 py-6 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-blue-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-blue-600"
                >
                  Upload file
                </button>
                <button
                  disabled={!isDownloadReady} //will need to modify this to download the file and the states for when downlad is ready
                  onClick={onDownloadFile}
                  className="w-1/3 h-full px-6 py-6 mt-4 text-sm font-medium text-white transition-colors duration-300 bg-green-500 rounded-md md:w-auto md:text-base disabled:bg-gray-400 hover:bg-green-600"
                >
                  Download file
                </button>
              </div>
            </div>
            
          </form>
        </div>
        <h2 className="text-center text-gray-500 text-xs"><Link href="/">Manual Entry Version here</Link></h2>
      </div>
    </div>
    </RootLayout>
  );
};

export default UploadPage;