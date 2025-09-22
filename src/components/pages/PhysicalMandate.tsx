import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import physicalmandateupload from "../../assets/images/physicalmandateupload.png";
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDispatch } from "react-redux";
// import { setIsLoading, setToken, setLoggedInUser } from "../../store/appSlice";
import setIsLoading, { routeChange, setApplicationId, setAuthToken, setCustomerID, setLoginId } from "../../store/appSlice"
// import setToken from "../../store/appSlice"
import setLoggedInUser from "../../store/appSlice"
import { makeAPIPOSTRequest } from "../../utils/apiActions";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Types
interface PhysicalMandateProps {
    agreementUrl?: string;
}

interface WorkflowData {
    customerId: string;
    profileId: string;
    workFlowId: string;
    legalEntityType: string;
}

export const PhysicalMandate: React.FC<PhysicalMandateProps> = ({ agreementUrl }) => {

    const [alertMessage, setAlertMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [fileDownloadUrl, setFileDownloadUrl] = useState<string>('');
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [workflowData, setWorkflowData] = useState<WorkflowData>({
        customerId: '',
        profileId: '',
        workFlowId: '',
        legalEntityType: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app)

    // This would typically come from your state management (like Redux or Context)
    useEffect(() => {
        // Mock data - replace with actual state management
        setWorkflowData({
            customerId: '12345', // Replace with actual value
            profileId: '67890', // Replace with actual value
            workFlowId: 'workflow-123', // Replace with actual value
            legalEntityType: 'Individual' // Replace with actual value
        });

        // Set authorization header
        const authToken = localStorage.getItem('authtoken');
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = authToken;
        }

        // Load PDF if URL is provided
        if (agreementUrl) {
            loadImageFun(agreementUrl);
        }
    }, [agreementUrl]);

    const loadImageFun = async (imageUrl: string) => {
        try {
            const res = await axios.get(imageUrl, {
                responseType: 'blob',
            });
            const fileDownloadUrl = URL.createObjectURL(res.data as Blob);
            setFileDownloadUrl(fileDownloadUrl);
        } catch (err) {
            console.log(err)
            setAlertMessage('Failed to load the PDF document');
            setShowAlert(true);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleDownload = () => {
        const anchor = document.createElement('a');
        anchor.href = fileDownloadUrl;
        anchor.download = 'UnsignedMandate.pdf';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    const redirectToMandate = () => {
        // // This would typically use React Router
        // window.location.href = '/PhysicalMandateUpload';
        navigate('/PhysicalMandateUpload')
    };

    const goToPreviousPage = () => {
        setPageNumber(prevPage => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
    };


    return (
        <div className="max-w-[450px] mx-auto text-left font-montserrat min-h-screen bg-white">
      {/* Alert */}
      {showAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{alertMessage}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3" 
            onClick={() => setShowAlert(false)}
          >
            &times;
          </button>
        </div>
      )}

      <div className="h-auto pt-10 bg-[#f3f0fc]">
        <div className="flex items-center px-4">
          <div className="w-1/4 text-center">
            <img 
              src={physicalmandateupload} 
              alt="Physical Mandate" 
              className="mx-auto"
            />
          </div>
          <div className="w-3/4 text-left ">
            <h2 className="text-base font-bold text-[#4328ae]">Sign Autopay Form</h2>
            <p className="text-xs text-[#616065] mt-1">
              Please download the autopay<br />
              form and sign it
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-5 rounded-t-2xl bg-[#ede7f6] pb-7 px-4 pt-2.5 flex items-start">
          <div className="w-fit bg-[#97c93e] rounded-xl h-fit">
            <div className="text-xs text-white px-2 py-0.5 font-bold">3</div>
          </div>
          <div className="text-xs text-black mt-1 ml-1">/4</div>
          <div className="text-xs text-black ml-2.5 mt-1">Select Autopay Method</div>
        </div>

        <div className="rounded-t-2xl bg-white px-7 pt-6 -mt-5">
          {/* PDF Viewer */}
          <div className="h-[500px] overflow-auto border border-gray-200 rounded-lg">
            {fileDownloadUrl ? (
              <Document
                file={fileDownloadUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="flex justify-center items-center h-full">Loading PDF...</div>}
              >
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                Loading PDF document...
              </div>
            )}
          </div>

          {/* PDF Controls */}
          {numPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button 
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {pageNumber} of {numPages}
              </span>
              <button 
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Download button */}
          <div 
            className="py-4 text-center cursor-pointer "
            onClick={handleDownload}
          >
            <span className="text-[#7e67da] text-sm flex items-center justify-center">
              <svg 
                className="w-5 h-5 mr-1.5 text-[#7E67DA]" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Download
            </span>
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-[#f7f5ff] p-3 rounded-xl">
            <b className="text-sm font-bold">Instructions</b>
            <ol className="mt-2 space-y-2">
              <li className="flex text-xs">
                <span className="w-4">1.</span>
                <span className="flex-1 ml-2">Download the Autopay NACH form and sign at designated place.</span>
              </li>
              <li className="flex text-xs">
                <span className="w-4">2.</span>
                <span className="flex-1 ml-2">All account holders should sign the autopay mandate for Joint Account.</span>
              </li>
              <li className="flex text-xs">
                <span className="w-4">3.</span>
                <span className="flex-1 ml-2">Proprietary stamp is mandatory for Current Account.</span>
              </li>
              <li className="flex text-xs">
                <span className="w-4">4.</span>
                <span className="flex-1 ml-2">Upload signed autopay form in next page.</span>
              </li>
            </ol>
          </div>

          {/* Continue button */}
          <div className="pt-5 pb-6 max-w-[450px] mx-auto mb-12">
            <button
              onClick={redirectToMandate}
              className="w-full bg-[#7E67DA] text-white py-3 rounded font-bold cursor-pointer normal-case"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
    )
}
