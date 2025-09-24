import React, { use, useEffect, useState } from 'react';
import mandateHeadIcon from '../../assets/images/mandateheadicon.png';
import nachLogo from '../../assets/images/NACH.png';
import npciLogo from '../../assets/images/NPCI.png';
import digioLogo from '../../assets/images/digio.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routeChange } from '../../store/appSlice';
import { useSelector } from 'react-redux';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { RootState } from '../../store/store';

interface BankDetails {
    bankName: string;
    bankAccountNo: string;
}

export const BankMandateInfo = () => {
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('Something went wrong');
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        bankName: 'HDFC Bank',
        bankAccountNo: 'XXXXXX1234',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);

    const redirectToMandate = () => {
        navigate("/BankMandateSelectOnboarding");
    };

    const getBankDetails =  () => {

        dispatch(routeChange("start"));
        const data = {
            "customerId": app.customerID,
            "applicationId": app.applicationId
        };
        const options = {
            successCallBack: (responseData: any) => {

                let userBankList = responseData.userBankList;
                if (userBankList.length != 0) {


                    setBankDetails(userBankList[0]);



                } else {
                    setBankDetails({ bankName: '', bankAccountNo: '' });
                }
                dispatch(routeChange("end"));
            },
            failureCallback: (error: any) => {
                // handle error
                console.log("display  ==" + error);
                dispatch(routeChange("end"));
            }
        }

        makeAPIPOSTRequest("/supermoney-service/bank/customer/active", {}, data, options)
    
    }
   
    useEffect(() => {
        getBankDetails();
    }, [])
    return (
        <div className="max-w-[450px] text-left font-montserrat min-h-screen bg-white mx-auto">
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{alertMessage}</span>
                    <button
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setAlert(false)}
                    >
                        <svg
                            className="fill-current h-6 w-6 text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <title>Close</title>
                            <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="bg-[#f3f0fc] pt-10">
                <div className="flex items-start px-4">
                    <div className="w-1/4 text-center">
                        <img src={mandateHeadIcon} alt="Mandate Icon" />
                    </div>
                    <div className="w-3/4">
                        <p className="text-[16px] font-bold text-[#4328ae]">Set Up Auto Repayment</p>
                        <span className="text-[12px] text-[#616065] leading-4">
                            Follow instructions to set up auto
                            <br/>
                            repayment
                        </span>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center mt-5 bg-[#ede7f6] rounded-t-[22px] px-5 pt-2 pb-7">
                    <div className="bg-[#97C93E] rounded-[12px] px-2 text-white text-[12px] font-bold">2</div>
                    <div className="text-[12px] text-black mt-1">/4</div>
                    <div className="text-[12px] text-black ml-3">Setup Autopay</div>
                </div>

                {/* Bank Details */}
                <div className="bg-white rounded-t-[22px] mt-[-20px] px-8 py-6">
                    <span className="text-[12px]">{bankDetails.bankName}</span><br />
                    <span className="text-[12px] text-[#828282]">A/C : {bankDetails.bankAccountNo}</span>
                </div>

                <hr className="border-t border-gray-400 " />

                {/* Instructions */}
                <div className="bg-white px-8 py-6">
                    <p className="text-[14px] font-bold mb-4">Please follow these steps</p>

                    {/* {[
                        'Select the relevant repayment option which is well supported with your bank',
                        'You will be redirected to our secured partnered portal ‘Digio’',
                        'Enter required details for processing authentication and set up auto repayment',
                    ].map((text, idx) => (
                        <div key={idx} className="flex items-start mb-4">
                            <div className="w-4 text-center text-[#97C93E]">
                                <span className="material-icons text-[16px]">check_circle</span>
                            </div>
                            <div className="pl-3 text-[12px] text-[#616065] leading-4">{text}</div>
                        </div>
                    ))} */}

                        <div className="flex items-start">
                            <div className="w-4 text-center text-[#97C93E] flex flex-col">
                                <span className="material-icons text-[24px]">check_circle</span>
                                <hr className="transform rotate-90 w-8 border-t-2 border-gray-400 my-4 -mx-1" />
                            </div>
                            <div className="ml-6 text-[12px] text-[#616065] "><span className='leading-[2]'>Select the relevant repayment option <br /> which is well supported with your bank</span></div>
                        </div>
                        <div className="flex items-start mb-4">
                            <div className="w-4 text-center text-[#97C93E] flex flex-col ">
                                <span className="material-icons text-[24px]">check_circle</span>
                                <hr className="transform rotate-90 w-8 border-t-2 border-gray-400 my-4 -mx-1" />
                            </div>
                            <div className="ml-6 text-[12px] text-[#616065]"><span className='leading-[2]'>You will be redirected to our secured partnered <br /> portal ‘Digio’</span></div>
                        </div>
                        <div className="flex items-start mb-4">
                            <div className="w-4 text-center text-[#97C93E]">
                                <span className="material-icons text-[24px]">check_circle</span>
                            </div>
                            <div className="ml-6 text-[12px] text-[#616065]"><span className='leading-[2]'>Enter required details for processing <br />authentication and set up auto <br />repayment </span></div>
                        </div>

                    {/* CTA Button */}
                    <div className="pt-12 pb-6 max-w-[450px] mx-auto">
                        <button
                            className="w-full bg-[#7E67DA] text-white py-3 rounded font-bold"
                            onClick={redirectToMandate}
                        >
                            Set Up Autopay
                        </button>
                    </div>

                    {/* Footnotes */}
                    <p className="text-[12px] text-[#aaa8a8] leading-4">
                        *Due amount will be deducted using auto<br />debit only once they are due
                    </p>

                    <div className="mt-4 flex items-center text-[12px] text-[#737477]">
                        <span className="material-icons text-[#7E67DA] mr-2">info_outline</span>
                        Want to know more – <u>FAQs</u>
                    </div>

                    {/* Logos */}
                    <div className="mt-4 pb-12 text-center">
                        <p className="text-[12px] text-[#737477]">Powered by</p>
                        <div className="flex justify-center gap-4 mt-2">
                            <img src={nachLogo} alt="NACH" className="w-[47px]" />
                            <img src={npciLogo} alt="NPCI" className="w-[47px]" />
                            <img src={digioLogo} alt="Digio" className="w-[26px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
