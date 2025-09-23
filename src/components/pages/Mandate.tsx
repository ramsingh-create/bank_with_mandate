import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { makeAPIPOSTRequest } from "../../utils/apiActions";
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import supermoneylogo from "../../assets/images/supermoneylogo.png";
import BankIcon from "../../assets/images/Bank.png";
import NetBankingIcon from '../../assets/images/netbanking.png'
import CardIcon from "../../assets/images/Card.png";
import AadhaarIcon from "../../assets/images/aadhaar.png";
import QRIcon from "../../assets/images/QR.png";

interface BankAccount {
    defaultFlag: boolean;
    netBankingMandateEnabled: boolean;
    eSignMandateEnabled: boolean;
    debitCardMandateEnabled: boolean;
    bankName: string;
    isfcCode: string;
    bankAccountNo: string;
    accountType: string;
    accountHolderName: string;
}

export const Mandate = () => {

    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alert, setAlert] = useState(false);
    const [netBankingVisible, setNetBankingVisible] = useState<boolean>(true);
    const [aadhaarVisible, setAadhaarVisible] = useState<boolean>(true);
    const [debitCardVisible, setDebitCardVisible] = useState<boolean>(true);
    const [bankDetails, setBankDetails] = useState<{
        bankNameSel: string;
        bankIfscSel: string;
        accountNoSel: string;
        accountType: string;
        accountHolderName: string;
    }>({
        bankNameSel: '',
        bankIfscSel: '',
        accountNoSel: '',
        accountType: '',
        accountHolderName: '',
    });
    const [mandateId, setMandateId] = useState<string>('');
    const [mandateType, setMandateType] = useState('');
    const [frequency, setFrequency] = useState<string>('adhoc');
    const [deviceType, setDeviceType] = useState<string>('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app);

    useEffect(() => {
        dispatch(routeChange('end'));

        // Device detection
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/android/i.test(userAgent)) {
            setDeviceType('Android');
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            setDeviceType('iOS');
        }

        getBankDetails();
        // Set frequency based on company name
        if (app.companyName === 'FTCASH' || app.companyName === 'LOANMANDI') {
            setFrequency('monthly');
        } else {
            setFrequency('adhoc');
        }

    }, []);

    const getBankDetails = () => {
        dispatch(routeChange('start'));

        const instance = axios.create({
            baseURL: "https://live.mintwalk.com/tomcat/mintLoan/mintloan/",
            headers: { "content-type": "application/json" },
        });

        let msgHeader = {
            authToken: localStorage.getItem("authtoken"), //dynamic
            loginId: app.loginId,
            channelType: "M",
            consumerId: "414",
            deviceId: "BankMandate",
            source: "WEB",
        };
        let deviceFPmsgHeader = {
            clientIPAddress: "192.168.0.122",
            connectionMode: "WIFI",
            country: "United States",
            deviceManufacturer: "Xiaomi",
            deviceModelNo: "Mi A2",
            dualSim: false,
            imeiNo: "09d9212a07553637",
            latitude: "",
            longitude: "",
            nwProvider: "xxxxxxxx",
            osName: "Android",
            osVersion: 28,
            timezone: "Asia/Kolkata",
            versionCode: "58",
            versionName: "5.5.1",
        };

        let employeeDetails = { deviceFPmsgHeader, msgHeader };

        instance
            .post("getActiveBankAccountDetails", employeeDetails)
            .then(function (res: any) {
                const JSONData = res.data;

                let hostStatus = JSONData.header.hostStatus;

                if (hostStatus === "S" || hostStatus === "s") {
                    // self.$store.commit("setauthtoken", {
                    //     authtoken: JSONData.header.authToken,
                    // });
                    dispatch(setAuthToken(JSONData.header.authToken));

                    let userBankList = JSONData.data.userBankList;
                    if (userBankList.length != 0) {
                        // self.activeBankFlag = true;
                        for (let i = 0; i < userBankList.length; i++) {
                            if (userBankList[i].defaultFlag === true) {
                                setNetBankingVisible(userBankList[i].netBankingMandateEnabled);
                                setAadhaarVisible(userBankList[i].eSignMandateEnabled);
                                setDebitCardVisible(userBankList[i].debitCardMandateEnabled);

                                setBankDetails((prev) => (
                                    {
                                        ...prev,
                                        bankNameSel: userBankList[i].bankName,
                                        bankIfscSel: userBankList[i].isfcCode,
                                        accountNoSel: userBankList[i].bankAccountNo,
                                        accountHolderName: userBankList[i].accountHolderName,
                                        accountType: userBankList[i].accountType
                                    }
                                ))
                                break;
                            }

                        }

                    } else {
                        // self.activeBankFlag = false;
                        // self.buttonText = "Add Bank";
                    }
                    dispatch(routeChange('end'))

                    // res.bankDetails = res.userBankList[0];


                } else {
                    if (hostStatus === "E") {
                        setAlertMessage(JSONData.header.error.errorDesc)
                        // setAlertMessage(res.data.errorDetails[0].errorDesc)
                        setAlert(true);
                        dispatch(routeChange('end'))
                    } else {
                        setAlertMessage(JSONData.data.errorDetails[0].errorDesc)
                        setAlert(true)
                        dispatch(routeChange('end'))
                    }
                    // self.showButtonFlag = false;
                }
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==" + error);
                dispatch(routeChange('end'))
            });
    }

    const netBankingMandate = (api: string) => {
        setMandateType(api);

        let custIdentifer = app.loginId;
        dispatch(routeChange("start"));
        // console.log("this is pan no", panno);

        let data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "api",
            instrumentType: "debit",
            isRecurring: true,
            frequency: frequency,
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails.accountHolderName,
            customerAccountNumber: bankDetails.accountNoSel,
            customerBankIfscCode: bankDetails.bankIfscSel,
            customerBankName: bankDetails.bankNameSel,
            customerAccountType: bankDetails.accountType === "Saving" ? "Savings" : "Current",
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (res: any) => {
                console.log(res);
                if (res.id != "") {
                    console.log("hello");
                    setMandateId(res.id);

                    let url = "https://app.digio.in/#/enach-mandate-direct/" + mandateId + "/vI3atY/" + custIdentifer + "?redirect_url=https://www.supermoney.in/BWMDev/RedirectionPage"
                    window.location.href = url

                    dispatch(routeChange('end'));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange('end'))
                }
            },
            failureCallBack: (error: any) => {
                setAlert(true);
                setAlertMessage(error.res.data.errors[0]);
                dispatch(routeChange('end'));
                // bankListFun();
            }
        }
        makeAPIPOSTRequest("/mandate-services/mandate/digio/create", {}, data, options)
    }

    const aadhaarMandate = () => {
        setMandateType('esign');

        var custIdentifer = app.loginId;
        dispatch(routeChange("start"));
        // console.log("this is pan no", panno);

        var data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "esign",
            instrumentType: "debit",
            isRecurring: true,
            frequency: frequency,
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails.accountHolderName,
            customerAccountNumber: bankDetails.accountNoSel,
            customerBankIfscCode: bankDetails.bankIfscSel,
            customerBankName: bankDetails.bankNameSel,
            customerAccountType: bankDetails.accountType === "Saving" ? "Savings" : "Current",
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (res: any) => {
                console.log(res);
                if (res.id != "") {
                    console.log("hello");
                    setMandateId(res.id);

                    let url = `https://app.digio.in/#/enach-mandate-direct/${mandateId}/vI3atY/${custIdentifer}?redirect_url=https://www.supermoney.in/BWMDev/RedirectionPage`;
                    window.location.href = url

                    dispatch(routeChange('end'));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange('end'))
                }
            },
            failureCallBack: (error: any) => {
                setAlert(true);
                setAlertMessage(error.res.data.errors[0]);
                dispatch(routeChange('end'));
                // bankListFun();
            }
        }
        makeAPIPOSTRequest("/mandate-services/mandate/digio/create", {}, data, options)

    };

    const physicalMandate = () => {
        setMandateType("eSign");
        var custIdentifer = app.loginId;
        dispatch(routeChange("start"));
        // console.log("this is pan no", panno);

        var data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "physical",
            instrumentType: "debit",
            isRecurring: true,
            frequency: frequency,
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails.accountHolderName,
            customerAccountNumber: bankDetails.accountNoSel,
            customerBankIfscCode: bankDetails.bankIfscSel,
            customerBankName: bankDetails.bankNameSel,
            customerAccountType: bankDetails.accountType === "Saving" ? "Savings" : "Current",
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (res: any) => {
                console.log(res);
                if (res.id != "") {
                    console.log("hello");
                    setMandateId(res.id);

                    physicalMandateLink();
                    dispatch(routeChange('end'));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange('end'))
                }
                // self.progress = false;
            },
            failureCallBack: (error: any) => {
                setAlert(true);
                setAlertMessage(error.res.data.errors[0]);
                dispatch(routeChange('end'));
                // bankListFun();
            }
        }
        makeAPIPOSTRequest("/mandate-services/mandate/digio/create", {}, data, options)
    }

    const physicalMandateLink = () => {
        setMandateType("physical");

        dispatch(routeChange("start"));

        var data = {
            mandateId: mandateId,   //  app.mandateId
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (res: any) => {
                console.log(res);
                if (mandateId != "") {
                    // self.fileDownloadUrl = JSONData.fileDownloadUrl;
                    const fileDownloadUrl = res?.fileDownloadUrl;
                    navigate(`/PhysicalMandate?page=${mandateType}&agreementUrl=${fileDownloadUrl}`)
                    dispatch(routeChange('end'));
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                    dispatch(routeChange('end'))
                }
                // self.progress = false;
            },
            failureCallBack: (error: any) => {
                dispatch(routeChange('end'));
                if (error) {
                    console.log("display  ==" + error);
                }
            }
        }
        makeAPIPOSTRequest("/mandate-services/mandate/digio/physical/form/get", {}, data, options)
    }

    // const bankID = () => {
    //   console.log("this is bank Id", this.bankID);
    //   this.bankIfsc = "";
    //   var self = this;
    //   var plussym = "+91";

    //   var url = "/mintLoan/mintloan/ifscSearchV2";
    //   var data = {
    //     bankCode: self.bankID.id,
    //     searchTxt: self.bankID.name,
    //   };
    //   axios
    //     .post(url, data)
    //     .then(function (response) {
    //       console.log(response);
    //       const JSONData = response.data;

    //       self.ifscDetails = JSONData.ifscDetails.sort((a,b) => a.ifscCode - b.ifscCode);
    //       self.setBankID = self.bankID.id;
    //     })
    //     .catch(function (error) {
    //       console.log("display  ==" + error);
    //     })
    // }

    return (
        <div className="max-w-[360px] mx-auto text-left font-montserrat">
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
                    <span className="block sm:inline">{alertMessage}</span>
                    <button
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setAlert(false)}
                    >
                        &times;
                    </button>
                </div>
            )}

            <img
                src={supermoneylogo}
                alt="SuperMoney Logo"
                className="w-[120px] mx-auto my-5"
            />

            <div className="flex items-center mt-5">
                <div className="w-1/4">
                    <img src={BankIcon} alt="Bank" />
                </div>
                <div className="w-3/4 text-left pl-4">
                    <h2 className="text-lg font-bold">Bank Mandate</h2>
                    <span className="text-sm">
                        Mandate will be used for auto repayment of Invoice amount outstandings
                    </span>
                </div>
            </div>

            <div className="mt-5 text-left p-2">
                <div className="text-sm font-bold mb-4">
                    Create Bank Mandate using
                </div>

                {/* Net Banking Option */}
                {netBankingVisible && (
                    <div
                        className="mt-6 p-3 shadow-md rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => netBankingMandate('netBanking')}
                    >
                        <div className="flex items-center">
                            <div className="w-1/6">
                                <img src={NetBankingIcon} alt="Net Banking" />
                            </div>
                            <div className="w-5/6">
                                <div className="font-bold text-[#4328ae] flex items-center h-full">
                                    Net Banking
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Debit Card Option */}
                {debitCardVisible && (
                    <div
                        className="mt-6 p-3 shadow-md rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => netBankingMandate('debitCard')}
                    >
                        <div className="flex items-center">
                            <div className="w-1/6">
                                <img src={CardIcon} alt="Debit Card" />
                            </div>
                            <div className="w-5/6">
                                <div className="font-bold text-[#4328ae] flex items-center h-full">
                                    Debit Card
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Aadhaar Mandate Option */}
                {aadhaarVisible && (
                    <div
                        className="mt-6 p-3 shadow-md rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={aadhaarMandate}
                    >
                        <div className="flex items-center">
                            <div className="w-1/6 flex items-center text-center text-[#4328ae] h-[59px]">
                                <img src={AadhaarIcon} alt="Aadhaar" />
                            </div>
                            <div className="w-5/6">
                                <div className="font-bold text-[#4328ae]">
                                    Aadhaar Mandate
                                </div>
                                <div className="text-xs">
                                    Number should be linked to Aadhaar
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Physical QR Mandate Option */}
                <div
                    className="mt-6 p-3 shadow-md rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={physicalMandate}
                >
                    <div className="flex items-center">
                        <div className="w-1/6">
                            <img src={QRIcon} alt="QR Code" />
                        </div>
                        <div className="w-5/6">
                            <div className="font-bold text-[#4328ae]">
                                Physical QR Mandate
                            </div>
                            <div className="text-xs text-red-500">
                                Higher processing time
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
