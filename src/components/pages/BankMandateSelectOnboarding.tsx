import React, { useEffect, useState } from 'react';
import { MdChevronRight, MdLock, MdInfoOutline } from 'react-icons/md';
import mandateHeadIcon from '../../assets/images/mandateheadicon.png';
import AadharMandate from '../../assets/images/aadhaarmandate.png';
import DebitCardMandate from '../../assets/images/debitcardmandate.png';
import NetBankingMandate from '../../assets/images/netbankingmandate.png';
import QRMandate from '../../assets/images/qrmandate.png';
import UPIMandate from '../../assets/images/upimandate.png';
import BankDetailsSmall from '../../assets/images/bankdetailssmall.png';
import digioLogo from '../../assets/images/digio.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routeChange, setCompanyName } from '../../store/appSlice';
import { useSelector } from 'react-redux';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { RootState } from '../../store/store';

interface BankDetails {
    bankName: string;
    bankAccountNo: string;
    name?: string;
    isfcCode?: string;
    accountType?: string;
}

export const BankMandateSelectOnboarding = () => {
    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('Something went wrong!');
    const [height, setHeight] = useState<number>(window.innerHeight);

    const [netBankingVisible, setNetBankingVisible] = useState<boolean>(true);
    const [debitCardVisible, setDebitCardVisible] = useState<boolean>(true);
    const [upiVisible, setUpiVisible] = useState<boolean>(true);
    const [aadhaarVisible, setAadhaarVisible] = useState<boolean>(true);
    const [physicalMandateVisible, setPhysicalMandateVisible] = useState<boolean>(true);
    const ChevronRightIcon = MdChevronRight as React.FC<React.SVGProps<SVGSVGElement>>;
    const LockIcon = MdLock as React.FC<React.SVGProps<SVGSVGElement>>;
    const InfoIcon = MdInfoOutline as React.FC<React.SVGProps<SVGSVGElement>>;
    const [financePlan, setFinancePlan] = useState<any>(null);
    const [programId, setProgramId] = useState<any>(null);
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);


    const netBankingMandate = (api: string) => {
        let custIdentifer = app.loginId;
        dispatch(routeChange("start"));

        let data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "api",
            instrumentType: "debit",
            isRecurring: true,
            frequency: "adhoc",
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails?.name,
            customerAccountNumber: bankDetails?.bankAccountNo,
            customerBankIfscCode: bankDetails?.isfcCode,
            customerBankName: bankDetails?.bankName,
            customerAccountType: bankDetails?.accountType === "Saving" ? "Savings" : "Current",
            customerId: app.customerID,
            applicationId: app.applicationId,
            lenderAccountId: financePlan.financePlanDetails.lenderAccountId,
            programId: programId,
        };


        const options = {
            successCallBack: (responseData: any) => {

                if (responseData.id != "") {

                    openDigio(responseData.id, custIdentifer);

                    dispatch(routeChange("end"));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange("end"));
                }

            },            
            failureCallback: (error: any) => {
                setAlert(true);
                setAlertMessage(error.response.data.errors[0]);
                dispatch(routeChange("end"));
            }
        };
        makeAPIPOSTRequest("/mandate-services/mandate/digio/create", {}, data, options)
    };

    const UPIBankingMandate = () => {
        let custIdentifer = app.loginId;
        dispatch(routeChange("start"));

        let data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "upi",
            instrumentType: "debit",
            isRecurring: true,
            frequency: "adhoc",
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            tenure: financePlan.financePlanDetails.tenure,
            tenurePeriod: financePlan.financePlanDetails.tenurePeriod,
            managementCategory: "L001",
            customerName: bankDetails?.name,
            customerAccountNumber: bankDetails?.bankAccountNo,
            customerBankIfscCode: bankDetails?.isfcCode,
            customerBankName: bankDetails?.bankName,
            customerAccountType: bankDetails?.accountType === "Saving" ? "Savings" : "Current",
            customerId: app.customerID,
            applicationId: app.applicationId,
            lenderAccountId: financePlan.financePlanDetails.lenderAccountId,
            programId: programId,
        };

        const options = {
            successCallBack: (responseData: any) => {

                if (responseData.id != "") {
                    const mandateId = responseData.id;

                    // let digio = new Digio(options);
                    // digio.init();
                    openDigio(mandateId, custIdentifer);

                    dispatch(routeChange("end"));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange("end"));
                }
            },
            failureCallback: (error: any) => {
                setAlert(true);
                setAlertMessage(error.response.data.errors[0]);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mandate-services/mandate/digio/create", {}, data, options)
    };

    const openDigio = (KID: string, identifier: any) => {
        let baseUrl = "https://app.digio.in/#/gateway/login/";
        let finalUrl =
            baseUrl +
            KID +
            "/" +
            app.customerID +
            "" +
            Date.now() +
            "/" +
            identifier +
            "?redirect_url=https%3A%2F%2Fwww.supermoney.in%2FBMD%2F%23%2FDigioMandateSuccessInvoice%3FsapplicationId%3D" +
            app.applicationId +
            "&logo=https://www.supermoney.in/supermoneylogo.png&theme=theme: {primaryColor: '#AB3498',secondaryColor: '#000000',}";
        window.location.href = finalUrl;
    }

    const aadhaarMandate = () => {
        let self = this;
        let custIdentifer = app.loginId;
        dispatch(routeChange("start"));

        let data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "esign",
            instrumentType: "debit",
            isRecurring: true,
            frequency: "adhoc",
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails?.name,
            customerAccountNumber: bankDetails?.bankAccountNo,
            customerBankIfscCode: bankDetails?.isfcCode,
            customerBankName: bankDetails?.bankName,
            customerAccountType: bankDetails?.accountType === "Saving" ? "Savings" : "Current",
            customerId: app.customerID,
            applicationId: app.applicationId,
            lenderAccountId: financePlan.financePlanDetails.lenderAccountId,
            programId: programId,
        };

        const options = {
            successCallBack: (responseData: any) => {   
                if (responseData.id != "") {
                    openDigio(responseData.id, custIdentifer);
                    dispatch(routeChange("end"));
                } else {
                    setAlert(true);         
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange("end"));
                }   

            },            
            failureCallback: (error: any) => {
                setAlert(true); 
                setAlertMessage(error.response.data.errors[0]);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mandate-services/mandate/digio/create", {}, data, options)
    };

    const physicalMandate = () => {
        dispatch(routeChange("start"));

        let data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "physical",
            instrumentType: "debit",
            isRecurring: true,
            frequency: "adhoc",
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails?.name,
            customerAccountNumber: bankDetails?.bankAccountNo,
            customerBankIfscCode: bankDetails?.isfcCode,
            customerBankName: bankDetails?.bankName,
            customerAccountType: bankDetails?.accountType === "Saving" ? "Savings" : "Current",
            customerId: app.customerID,
            applicationId: app.applicationId,
            lenderAccountId: financePlan.financePlanDetails.lenderAccountId,
            programId: programId,
        };

        const options = {
            successCallBack: (response: any) => {
                if (response.id != "") {
                    console.log("hello");
                    const mandateId = response.id;
                    physicalMandateLink(mandateId);
                    dispatch(routeChange("end"));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange("end"));
                }
            },
            failureCallback: (error: any) => {
                setAlert(true);
                setAlertMessage(error.response.data.errors[0]);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mandate-services/mandate/digio/create", {}, data, options);

    };

    const physicalMandateLink = (mandateId: string) => {

        dispatch(routeChange("start"));
        let data = {
            mandateId: mandateId,
            customerId: app.customerID,
            applicationId: app.applicationId,
            programId: programId,
        };

        const options = {
            successCallBack: (responseData: any) => {
                if (responseData.mandateId != "") {
                    const fileDownloadUrl = responseData.fileDownloadUrl;
                    const queryData = new URLSearchParams({
                        page: 'physical',
                        agreementUrl: fileDownloadUrl,
                    }).toString();
                    navigate(`/PhysicalMandate?${queryData}`);
                    dispatch(routeChange("end"));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange("end"));
                }
            },
            failureCallback: (error: any) => {
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mandate-services/mandate/digio/physical/form/get", {}, data, options);
    }

    const getBankDetails = () => {

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
                    fetchApplicationFinancePlan()


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

    const fetchApplicationFinancePlan = () => {
        dispatch(routeChange("start"));

        let url = "/supermoney-service/application/finance/get";
        let request = {
            applicationId: app.applicationId,
        };

        const options = {
            successCallBack: (responseData: any) => {
                dispatch(routeChange("end"));
                setFinancePlan(responseData.getApplicationFinancePlanMappingResp[0]);
                fetchApplicationId();
            },
            failureCallback: (error: any) => {
                console.log("display  ==" + error);
            }
        };

        makeAPIPOSTRequest("/supermoney-service/application/finance/get", {}, request, options)

    }

    const fetchApplicationId = () => {
        dispatch(routeChange("start"));

        let request = {
            customerId: app.customerID,
            applicationId: app.applicationId,
        };

        const options = {
            successCallBack: (responseData: any) => {
                dispatch(routeChange("end"));
                setProgramId(responseData.getCustomerApplicationResponseList[0].programDetails.programId);
                dispatch(setCompanyName(responseData.getCustomerApplicationResponseList[0].programDetails.company))
                fetchAvailableMandates();
            },
            failureCallback: (error: any) => {
                console.log("display  ==" + error);
            }
        };

        makeAPIPOSTRequest('/supermoney-service/customer/application/get', {}, request, options)
    }

    const fetchAvailableMandates = () => {
        dispatch(routeChange("start"));

        let request = { programId: programId };

        const options = {
            successCallBack: (responseData: any) => {
                dispatch(routeChange("end"));
                setAadhaarVisible(responseData.esign);
                setNetBankingVisible(responseData.api);
                setDebitCardVisible(responseData.api);
                setPhysicalMandateVisible(responseData.physical);
                setUpiVisible(responseData.upi);
            },
            failureCallback: (error: any) => {
                console.log("display  ==" + error);
            }
        };
        makeAPIPOSTRequest('/supermoney-service/program/mandate/get', {}, request, options)
    }

    useEffect(() => {
        getBankDetails();
    }, [])

    return (
        <div
            className="max-w-[450px] text-left font-montserrat min-h-full bg-white mx-auto"
            style={{ height: `${height}px` }}
        >
            {alert && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {alertMessage}
                </div>
            )}

            <div className="pt-10 bg-[#f3f0fc]">
                <div className="flex">
                    <div className="w-1/4 text-center">
                        <img src={mandateHeadIcon} alt="Mandate Icon" />
                    </div>
                    <div className="w-3/4 text-start">
                        <span className="text-[#4328ae] font-bold text-[16px]">Select Autopay Method</span>
                        <br />
                        <span className="text-[#616065] text-[12px]">
                            Choose an auto repayment <br />method supported by your bank
                        </span>
                    </div>
                </div>

                <div className="mt-5 bg-[#ede7f6] rounded-t-[22px] px-4 pb-8 pt-2 flex items-center">
                    <div className="bg-[#97c93e] rounded-[12px] text-white text-[12px] px-2">
                        <b>3</b>
                    </div>
                    <div className="text-black text-[12px] mt-1 ml-1">/4</div>
                    <div className="text-black text-[12px] ml-2">Select Autopay Method</div>
                </div>

                <div className="mt-[-20px] bg-white rounded-t-[22px] px-8 py-6">
                    <div className="flex items-center">
                        <img src={BankDetailsSmall} alt="Bank Icon" className="mx-2" />
                        <div>
                            <div className="text-[12px] font-bold">{bankDetails?.bankName}</div>
                            <div className="text-[12px] text-[#828282]">A/C : {bankDetails?.bankAccountNo}</div>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-[#d1c4e9]" />

                <div className="bg-white px-8 py-6 space-y-6">
                    {netBankingVisible && (
                        <div
                            className="flex items-center border border-[#d1c4e9] rounded-[18px] p-4 cursor-pointer"
                            onClick={() => netBankingMandate('netBanking')}
                        >
                            <img src={NetBankingMandate} alt="Net Banking" className="w-8" />
                            <div className="flex-grow px-4 text-[16px] font-bold text-[#7e67da]">Net Banking</div>
                            <ChevronRightIcon className="text-[#7e67da]" />
                        </div>
                    )}

                    {debitCardVisible && (
                        <div
                            className="flex items-center border border-[#d1c4e9] rounded-[18px] p-4 cursor-pointer"
                            onClick={() => netBankingMandate('debitCard')}
                        >
                            <img src={DebitCardMandate} alt="Debit Card" className="w-8" />
                            <div className="flex-grow px-4 text-[16px] font-bold text-[#7e67da]">Debit Card</div>
                            <ChevronRightIcon className="text-[#7e67da]" />
                        </div>
                    )}

                    {upiVisible && (
                        <div
                            className="flex items-center border border-[#d1c4e9] rounded-[18px] p-4 cursor-pointer"
                            onClick={UPIBankingMandate}
                        >
                            <img src={UPIMandate} alt="UPI" className="w-8" />
                            <div className="flex-grow px-4 text-[16px] font-bold text-[#7e67da]">UPI Mandate</div>
                            <ChevronRightIcon className="text-[#7e67da]" />
                        </div>
                    )}

                    {aadhaarVisible && (
                        <div
                            className="border border-[#d1c4e9] rounded-[18px] p-4 cursor-pointer"
                            onClick={aadhaarMandate}
                        >
                            <div className="flex items-center">
                                <img src={AadharMandate} alt="Aadhaar" className="w-8" />
                                <div className="flex-grow px-4 text-[16px] font-bold text-[#7e67da]">Aadhaar Mandate</div>
                                <ChevronRightIcon className="text-[#7e67da]" />
                            </div>
                            <div className="text-[#a1a1a1] text-[12px] mt-2 ml-10">
                                Phone No. should be linked with Aadhaar
                            </div>
                        </div>
                    )}

                    {physicalMandateVisible && (
                        <div
                            className="border border-[#d1c4e9] rounded-[18px] p-4 cursor-pointer"
                            onClick={physicalMandate}
                        >
                            <div className="flex items-center">
                                <img src={QRMandate} alt="QR" className="w-8" />
                                <div className="flex-grow px-4 text-[16px] font-bold text-[#7e67da]">Physical QR Mandate</div>
                                <ChevronRightIcon className="text-[#7e67da]" />
                            </div>
                            <div className="text-[#ff5252] text-[12px] mt-2">Higher Processing Time</div>
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <LockIcon className="inline text-[#7e67da] mr-1 h-8 w-4" />
                        <span className="text-[11px] text-[#a1a1a1]">This payment is secured by </span>
                        <img src={digioLogo} alt="Digio" className="inline h-6 mb-[-5px]" />
                    </div>

                    <div className="mt-4 mb-12 bg-[#f7f5ff] p-3 rounded-[12px] flex items-start">
                        <InfoIcon className="text-[#97c93e] mt-1 h-8 w-8" />
                        <span className="text-[12px] text-[#9c9ba1] ml-2">
                            Autopay mandate will be registered for the credit approved limit. But on due date only due amount will be deducted using Auto Debit
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
