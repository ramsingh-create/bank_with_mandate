import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import physicalmandateupload from '../../assets/images/physicalmandateupload.png';
import { makeAPIGETRequest, makeAPIPOSTRequest } from '../../utils/apiActions';
import { DocumentSection } from '../organisms/DocumentSection';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface UploadedDocument {
    name: string;
    file: File | null;
    previewUrl: string;
    documentUrl?: string;
    documentName?: string;
}

export const PhysicalMandateUpload: React.FC = () => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [fileType, setFileType] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<string>('');
    // const [savingDocument, setSavingDocument] = useState<UploadedDocument>({
    //     name: '',
    //     file: null,
    //     previewUrl: ''
    // });
    const [savingDocument, setSavingDocument] = useState<any>(null);
    // const [jointSavingDocument, setJointSavingDocument] = useState<UploadedDocument>({
    //     name: '',
    //     file: null,
    //     previewUrl: ''
    // });
    const [jointSavingDocument, setJointSavingDocument] = useState<any>(null);
    // const [currentAccount, setCurrentAccount] = useState<UploadedDocument>({
    //     name: '',
    //     file: null,
    //     previewUrl: ''
    // });
    const [currentAccount, setCurrentAccount] = useState<any>(null);
    const [docTypeId, setDocTypeId] = useState<string>('146');
    const [fileLocation, setFileLocation] = useState<string>('');
    const [frontPubLocation, setFrontPubLocation] = useState<string>('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const app = useSelector((state: RootState) => state.app);

    useEffect(() => {
        // dispatch(routeChange('end'));

        // Set authorization header
        const authToken = localStorage.getItem('authtoken') || app.authToken;
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = authToken;
        }

        // Get agreement URL from location state
        // const agreementUrl = (location.state as any)?.agreementUrl;
        // if (agreementUrl) {
        //     setUploadedFile(agreementUrl);
        // }
    }, []);

    const closePopup = () => {
        setDialog(false);
    };

    const viewFile = () => {

        if (savingDocument != null) {
            let breakDown = savingDocument.name.split(".");
            setFileType(breakDown[breakDown.length - 1]);
            console.log(fileType);
        } else if (jointSavingDocument != null) {
            let breakDown = jointSavingDocument.name.split(".");
            setFileType(breakDown[breakDown.length - 1]);
        } else if (currentAccount != null) {
            let breakDown = currentAccount.name.split(".");
            setFileType(breakDown[breakDown.length - 1]);
        }
        console.log(frontPubLocation)
        setUploadedFile(frontPubLocation);
        setDialog(true);


        // let activeDocument: UploadedDocument | null = null;

        // if (savingDocument.file) {
        //     activeDocument = savingDocument;
        // } else if (jointSavingDocument.file) {
        //     activeDocument = jointSavingDocument;
        // } else if (currentAccount.file) {
        //     activeDocument = currentAccount;
        // }
        // if (activeDocument) {
        //     const fileNameParts = activeDocument.name.split('.');
        //     const extension = fileNameParts[fileNameParts.length - 1].toLowerCase();
        //     setFileType(extension === 'pdf' ? 'pdf' : 'image');
        //     setUploadedFile(activeDocument.previewUrl);
        //     setDialog(true);
        // }
    };

    const downloadImg = () => {

        const anchor = document.createElement("a");
        anchor.href = frontPubLocation;

        if (savingDocument != null) {
            let breakDown = savingDocument.name.split(".");
            // fileType = breakDown[breakDown.length - 1];
            setFileType(breakDown[breakDown.length - 1]);
            anchor.download = savingDocument.name;
        } else if (jointSavingDocument != null) {
            let breakDown = jointSavingDocument.name.split(".");
            setFileType(breakDown[breakDown.length - 1]);
            anchor.download = jointSavingDocument.name;
        } else if (currentAccount != null) {
            let breakDown = currentAccount.name.split(".");
            setFileType(breakDown[breakDown.length - 1]);
            anchor.download = currentAccount.name;
        }
        // Simulate a click event to trigger the download
        document.body.appendChild(anchor);
        anchor.click();

        // Clean up: remove anchor element and revoke the Blob URL to free memory
        document.body.removeChild(anchor);


        // let activeDocument: UploadedDocument | null = null;

        // if (savingDocument.file) {
        //     activeDocument = savingDocument;
        // } else if (jointSavingDocument.file) {
        //     activeDocument = jointSavingDocument;
        // } else if (currentAccount.file) {
        //     activeDocument = currentAccount;
        // }

        // if (activeDocument && activeDocument.previewUrl) {
        //     const anchor = document.createElement('a');
        //     anchor.href = activeDocument.previewUrl;
        //     anchor.download = activeDocument.name;
        //     document.body.appendChild(anchor);
        //     anchor.click();
        //     document.body.removeChild(anchor);
        // }
    };

    const redirectToMandate = () => {
        if (savingDocument?.file || jointSavingDocument.file || currentAccount.file) {
            const borrowerId = (location.state as any)?.borrowerId;
            const availableLimit = (location.state as any)?.availableLimit;
            const applicationId = (location.state as any)?.applicationId;
            const companyName = (location.state as any)?.companyName;

            const queryParams = new URLSearchParams({
                borrowerId,
                availableLimit,
                applicationId,
                companyName,
            }).toString();

            navigate(`/Success?${queryParams}`);
        }
    };

    const nullDocuments = () => {
        setSavingDocument(null);
        setJointSavingDocument(null);
        setCurrentAccount(null);
    };

    const chooseFiles1 = () => {
        const input = document.getElementById('savingImage') as HTMLInputElement;
        if (input) input.click();
    };

    const chooseFiles2 = () => {
        const input = document.getElementById('jointSavingDocument') as HTMLInputElement;
        if (input) input.click();
    };

    const chooseFiles3 = () => {
        const input = document.getElementById('currentAccount') as HTMLInputElement;
        if (input) input.click();
    };

    const imageUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            handleFileUpload(file, setSavingDocument);      //came from submitProof
            setJointSavingDocument({ name: '', file: null, previewUrl: '' });
            setCurrentAccount({ name: '', file: null, previewUrl: '' });
        }
    };

    const imageUpload2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            handleFileUpload(file, setJointSavingDocument);
            setSavingDocument({ name: '', file: null, previewUrl: '' });
            setCurrentAccount({ name: '', file: null, previewUrl: '' });
        }
    };

    const imageUpload3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            handleFileUpload(file, setCurrentAccount);
            setSavingDocument({ name: '', file: null, previewUrl: '' });
            setJointSavingDocument({ name: '', file: null, previewUrl: '' });
        }
    };

    const handleFileUpload = (file: File, setDocument: React.Dispatch<React.SetStateAction<UploadedDocument>>) => {
        const previewUrl = URL.createObjectURL(file);
        setDocument({
            name: file.name,
            file: file,
            previewUrl: previewUrl
        });

        submitProof(file);
    };

    const submitProof = (document: File) => {
        dispatch(routeChange('start'));
        const formData = new FormData();
        formData.append("file", document);

        formData.append(
            "request",
            '{ "id":"' +
            app.customerID +
            '","type":"customer", "applicationId":"' +
            app.applicationId +
            '","docTypeId":"25","user":"self"}'
        );

        const options = {
            successCallBack: (res: any) => {
                loadImageFun(res.data.documentName, res.data.documentUrl);
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.error("Upload error:", error);
                dispatch(routeChange('end'));
            }
        }
        makeAPIPOSTRequest("/googlecloudstorage/storage/document/upload", {}, formData, options)
    };

    const loadImageFun = async (imageObj: any,imageUrl: string) => {
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'blob',
        })
        const frontPubLocation = URL.createObjectURL(response.data as Blob);
        setFrontPubLocation(frontPubLocation);
      } catch (err) {
        console.log(err)
      }
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
                        ×
                    </button>
                </div>
            )}

            {/* Dialog Modal */}
            {dialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-5 max-w-md w-full mx-4">
                        <div className="text-right">
                            <button onClick={closePopup} className="text-[#7E67DA] text-xl">×</button>
                        </div>
                        <span className="text-[#4328ae] font-bold">Sample Saving A/C Signed NACH</span>

                        <div className="h-80 my-5 overflow-auto">
                            {fileType === 'pdf' ? (
                                <Document
                                    file={uploadedFile}
                                    loading={<div className="flex justify-center items-center h-full">Loading PDF...</div>}
                                >
                                    <Page pageNumber={1} />
                                </Document>
                            ) : (
                                <img src={uploadedFile} alt="Uploaded document" className="w-full h-full object-contain" />
                            )}
                        </div>

                        <div className="text-center pt-5">
                            <button
                                onClick={downloadImg}
                                className="bg-[#7E67DA] text-white py-2 px-6 rounded-lg flex items-center justify-center mx-auto"
                            >
                                <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="font-bold">Download</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-auto pt-10 bg-[#f3f0fc]">
                <div className="flex items-center px-4">
                    <div className="w-1/4 text-center">
                        <img src={physicalmandateupload} alt="Upload Mandate" className="mx-auto" />
                    </div>
                    <div className="w-3/4 text-left pl-4">
                        <h2 className="text-base font-bold text-[#4328ae]">Upload Autopay Form</h2>
                        <p className="text-xs text-[#616065] mt-1">
                            Upload signed NACH autopay form for autopay registration
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
                    <span className="text-[#666666] font-bold">Choose account type and upload</span>

                    <DocumentSection
                        title="Savings Account"
                        document={savingDocument}
                        onChooseFile={chooseFiles1}
                        onViewFile={viewFile}
                        inputId="savingImage"
                        onInputChange={imageUpload1}
                        nullDocuments={nullDocuments}
                        downloadImg={downloadImg}
                    />

                    <DocumentSection
                        title="Joint Savings Account"
                        document={jointSavingDocument}
                        onChooseFile={chooseFiles2}
                        onViewFile={viewFile}
                        inputId="jointSavingDocument"
                        onInputChange={imageUpload2}
                        nullDocuments={nullDocuments}
                        downloadImg={downloadImg}
                    />

                    <DocumentSection
                        title="Current Account"
                        document={currentAccount}
                        onChooseFile={chooseFiles3}
                        onViewFile={viewFile}
                        inputId="currentAccount"
                        nullDocuments={nullDocuments}
                        downloadImg={downloadImg}
                        onInputChange={imageUpload3}
                    />

                    <div className="flex items-start mt-4">
                        <svg className="w-5 h-5 text-[#7E67DA] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-[#9c9ba1] ml-2">
                            Ensure the uploaded Signed NACH form is as per the provided sample for chosen account type
                        </span>
                    </div>

                    <div className="pt-5 pb-6 max-w-[450px] mx-auto mb-12">
                        <button
                            onClick={redirectToMandate}
                            className="w-full bg-[#7E67DA] text-white py-3 rounded font-bold cursor-pointer normal-case hover:bg-[#6b56b8] transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
