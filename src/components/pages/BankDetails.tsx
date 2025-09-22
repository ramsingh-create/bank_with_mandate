import React from 'react'
import bankverification from "../../assets/images/bankverification.png";

export const BankDetails = () => {
    return (
        <div
            className="flex min-h-screen items-center justify-center  p-0 pt-0 max-w-[450px] w-full p-3 mx-auto text-left  min-h-screen bg-white"
        >
            {/* Alert */}
            {/* Replace with your own alert logic */}
            {/* <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                Error message here
            </div> */}

            <div className="pb-12 w-[100%]">
                {/* Header Image + Title */}
                <div
                    className="bg-[#f3f0fc] pb-11 pt-[10px]"
                    style={{
                        backgroundImage: "url('https://www.supermoney.in/pobbg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <img
                        src={bankverification}
                        alt="Bank Verification"
                        className="ml-10 mt-14"
                    />
                    <div className="text-start ml-10 mt-16">
                        <span className="text-[#4328ae] text-base font-bold">
                            Bank Verification
                        </span>
                        <br />
                        <span className="text-xs">
                            Please provide the details of your Principal <br />
                            Bank Account of Business.
                        </span>
                    </div>
                </div>

                {/* Stepper */}
                <div className="mt-[-20px] rounded-t-[22px] bg-[#ede7f6] px-4 pt-4 pb-8 flex items-center">
                    <div className="bg-[#97C93E] rounded-lg h-fit w-fit">
                        <div className="text-xs text-white px-2">
                            <b>1</b>
                        </div>
                    </div>
                    <div className="text-xs text-black mt-[2px]">/4</div>
                    <div className="text-xs text-black ml-2">Bank Verification</div>
                </div>

                {/* Card Container */}
                <div className="mt-[-20px] rounded-[22px] bg-white mb-7 px-4 pt-2">
                    {/* Example Existing Bank Card */}
                    {/* <div className="mt-5 rounded-[22px] bg-[#f7f5ff] mb-7 p-6 border border-[#7E67DA]">
                        <div className="flex justify-between mb-4">
                            <div>
                                <span className="text-[12px] font-bold">HDFC Bank</span>
                                <br />
                                <span className="text-[12px] text-[#828282]">A/C : {}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[12px] text-[#636266]">IFSC code</span>
                                <br />
                                <span className="text-[12px] font-bold">{}</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <span className="text-[12px] text-[#636266]">Account Holder’s Name</span>
                                <br />
                                <span className="text-[12px] font-bold">{}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[12px] text-[#636266]">Account Type</span>
                                <br />
                                <span className="text-[12px] font-bold">{}</span>
                            </div>
                        </div>
                    </div> */}

                    {/* Add New Bank Button */}
                    {/* <button className="w-full border border-[#7E67DA] py-2 rounded-lg flex items-center justify-center space-x-2">
                        <span className="text-[#7E67DA] font-bold">+ Add New Bank</span>
                    </button> */}

                    {/* New Bank Form */}
                    <div className="text-start mt-5">
                        <select className="w-full border rounded-md p-2 text-sm mb-3">
                            <option>Select your bank</option>
                        </select>
                        <div className="relative mb-3">
                            <input
                                type="text"
                                maxLength={18}
                                placeholder=" " // keep blank for floating label
                                className="peer w-full rounded-md border px-3 text-base/6 pt-2 pb-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <label
                                className="absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
      top-3 text-sm 
      peer-focus:-top-1 peer-focus:text-xs peer-focus:px-1 peer-focus:bg-white
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm"
                            >
                                Bank Account Number
                            </label>
                        </div>

                        <input
                            type="text"
                            placeholder="IFSC code"
                            className="w-full border rounded-md p-2 text-sm mb-3"
                        />
                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder=" "
                                className="peer w-full rounded-md border px-3 text-base/6 pt-2 pb-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <label
                                className="absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
      top-3 text-sm
      peer-focus:-top-1 peer-focus:text-xs peer-focus:px-1 peer-focus:bg-white
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm"
                            >
                                Account Holder Name
                            </label>
                        </div>

                        <div className="text-xs text-[#4328AE] mt-[-20px] mb-5 pt-5">
                            Put Primary Account Holder Name for Joint Account
                        </div>
                        <select className="w-full border rounded-md p-2 text-sm mb-3">
                            <option>Account Type</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-12 pb-[15%] max-w-[450px] mx-auto">
                        <button className="w-full bg-[#7E67DA] py-2 rounded-lg">
                            <span className="text-white font-bold">Submit</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
