interface UploadedDocument {
    name?: string;
    file?: File | null;
    previewUrl?: string;
    documentUrl?: string;
    documentName?: string;
}
export const DocumentSection = ({
        title,
        document,
        onChooseFile,
        onViewFile,
        inputId,
        onInputChange,
        nullDocuments,
        downloadImg
    }: {
        title: string;
        document: UploadedDocument;
        onChooseFile: () => void;
        onViewFile: () => void;
        inputId: string;
        onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        nullDocuments: () => void,
        downloadImg: () => void

    }) => (
        <div className="mt-3 border border-[#d1c4e9] rounded-2xl p-6">
            <div className="flex items-center justify-between">
                <div className="w-8/12 text-left">
                    <span className="text-base font-bold text-[#7e67da]">{title}</span>
                </div>
                <div className={`flex ${document?.file ? 'w-2/12 justify-between' : 'w-4/12 justify-end'}`}>
                    {document?.file && (
                        <div className="w-4/12 text-text-right pt-1" onClick={onViewFile}>
                            <svg className="w-5 h-5 text-[#7E67DA] mx-auto text-right " fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}

                    <div

                        onClick={onChooseFile}
                    >
                        {/* <svg className="w-5 h-5 text-[#7E67DA] mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg> */}
                        <svg
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            width="22px"
                            height="30px"
                            viewBox="0 0 22 30"
                            enable-background="new 0 0 22 30"
                        // xml:space="preserve"
                        >
                            <image
                                id="image0"
                                width="22"
                                height="30"
                                x="0"
                                y="0"
                                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAMAAAAfOR5kAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAPFBMVEUAAAB6Zdp6ZdR+Ztp+
Z9h+Ztp9Z9t+ZdqAcM99Zdp8ZNd/Z9p8Z9h4aNd+Z9p+Ztl8aNuAaNd+Z9r///+OR739AAAAEnRS
TlMAMDDvkKC/kBBgQJ+QIJCgQEBZ+mBRAAAAAWJLR0QTDLtclgAAAAlwSFlzAAAWJQAAFiUBSVIk
8AAAAAd0SU1FB+YJBgwtHveN8XoAAABeSURBVCjP1c7RCoAwCAVQ27qrVavl/39syJBoCj1G90H0
PKhErxmCqzEGT5mti1pvanwEEnMCprlbk5mz80nHyypRln4rRKXdUtZp9/mQ8tz9NVegOnzn52xD
dHp8Afp2DoRJHLgyAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA5LTA2VDEyOjQ1OjMwKzAwOjAw
ijKwUwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wOS0wNlQxMjo0NTozMCswMDowMPtvCO8AAAAo
dEVYdGRhdGU6dGltZXN0YW1wADIwMjItMDktMDZUMTI6NDU6MzArMDA6MDCseikwAAAAAElFTkSu
QmCC"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {document?.file && (
                <>
                    <div className="w-full my-2 border-t-2 border-[#d1c4e9]"></div>
                    <span className="text-sm text-[#666666]">Uploaded Document</span>
                    <br />
                    <div className="flex items-center mt-2">
                        <span className="text-xs">{document.name}</span>
                        <svg
                            className="w-5 h-5 text-[#7E67DA] mx-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            onClick={downloadImg}
                        >
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <svg
                            className="w-5 h-5 text-[#7E67DA]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            onClick={nullDocuments}
                        >
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                </>
            )}

            <input
                id={inputId}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/bmp, application/pdf"
                onChange={onInputChange}
            />
        </div>
    );