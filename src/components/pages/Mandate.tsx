import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
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
    const [showAlert, setShowAlert] = useState<boolean>(false);
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
    const [fileDownloadUrl, setFileDownloadUrl] = useState<string>('');
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

        // Set frequency based on company name
        if (app.companyName === 'FTCASH' || app.companyName === 'LOANMANDI') {
            setFrequency('monthly');
        } else {
            setFrequency('adhoc');
        }

        getBankDetails();
    }, []);

    const getBankDetails = () => {
        dispatch(routeChange('start'));

        const instance = axios.create({
        baseURL: "https://live.mintwalk.com/tomcat/mintLoan/mintloan/",
        headers: { "content-type": "application/json" },
      });
    }

    // const getBankDetails = async () => {
    //     dispatch(routeChange('start'));
    //     try {
    //         const authToken = localStorage.getItem('authtoken') || app.authToken;
    //         const loginId = app.loginId || localStorage.getItem('loginId');

    //         const data = {};
    //         const msgHeader = {
    //             authToken,
    //             loginId,
    //             channelType: 'M',
    //             consumerId: '414',
    //             deviceId: 'BankMandate',
    //             source: 'WEB',
    //         };

    //         const deviceFPmsgHeader = {
    //             clientIPAddress: '192.168.0.122',
    //             connectionMode: 'WIFI',
    //             country: 'United States',
    //             deviceManufacturer: 'Xiaomi',
    //             deviceModelNo: 'Mi A2',
    //             dualSim: false,
    //             imeiNo: '09d9212a07553637',
    //             latitude: '',
    //             longitude: '',
    //             nwProvider: 'xxxxxxxx',
    //             osName: 'Android',
    //             osVersion: 28,
    //             timezone: 'Asia/Kolkata',
    //             versionCode: '58',
    //             versionName: '5.5.1',
    //         };

    //         const requestData = { data, deviceFPmsgHeader, msgHeader };

    //         const response = await axios.post(
    //             'https://live.mintwalk.com/tomcat/mintLoan/mintloan/getActiveBankAccountDetails',
    //             requestData
    //         );

    //         const JSONData = response.data;
    //         // const hostStatus = JSONData.header.hostStatus;

    //         if (hostStatus === 'S' || hostStatus === 's') {
    //             if (JSONData.header.authToken) {
    //                 dispatch(setAuthToken(JSONData.header.authToken));
    //                 localStorage.setItem('authtoken', JSONData.header.authToken);
    //             }

    //             const userBankList: BankAccount[] = JSONData.data.userBankList;

    //             if (userBankList.length !== 0) {
    //                 const defaultBank = userBankList.find(bank => bank.defaultFlag === true);

    //                 if (defaultBank) {
    //                     setNetBankingVisible(defaultBank.netBankingMandateEnabled);
    //                     setAadhaarVisible(defaultBank.eSignMandateEnabled);
    //                     setDebitCardVisible(defaultBank.debitCardMandateEnabled);

    //                     setBankDetails({
    //                         bankNameSel: defaultBank.bankName,
    //                         bankIfscSel: defaultBank.isfcCode,
    //                         accountNoSel: defaultBank.bankAccountNo,
    //                         accountType: defaultBank.accountType,
    //                         accountHolderName: defaultBank.accountHolderName,
    //                     });
    //                 }
    //             }
    //         } else {
    //             if (hostStatus === 'E') {
    //                 setAlertMessage(JSONData.header.error.errorDesc);
    //             } else {
    //                 setAlertMessage(JSONData.data.errorDetails[0].errorDesc);
    //             }
    //             setShowAlert(true);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching bank details:', error);
    //         setAlertMessage('Failed to fetch bank details');
    //         setShowAlert(true);
    //     } finally {
    //         dispatch(routeChange('end'));
    //     }
    // };

    // const createMandate = async (authMode: string) => {
    //     dispatch(routeChange('start'));
    //     try {
    //         const accountType = bankDetails.accountType === 'Saving' ? 'Savings' : 'Current';
    //         const customerId = app.customerID || localStorage.getItem('customerID');
    //         const loginId = app.loginId || localStorage.getItem('loginId');
    //         const companyName = app.companyName || localStorage.getItem('companyName');

    //         const data = {
    //             customerMobile: loginId,
    //             companyName,
    //             authMode,
    //             instrumentType: 'debit',
    //             isRecurring: true,
    //             frequency: setFrequency,
    //             firstCollectionDate: new Date().toISOString().substring(0, 10),
    //             managementCategory: 'L001',
    //             customerName: bankDetails.accountHolderName,
    //             customerAccountNumber: bankDetails.accountNoSel,
    //             customerBankIfscCode: bankDetails.bankIfscSel,
    //             customerBankName: bankDetails.bankNameSel,
    //             customerAccountType: accountType,
    //             customerId,
    //         };

    //         const response = await axios.post('/mandate-services/mandate/digio/create', data);
    //         const JSONData = response.data;

    //         if (JSONData.id) {
    //             setMandateId(JSONData.id);

    //             if (authMode === 'physical') {
    //                 physicalMandateLink();
    //             } else {
    //                 // Redirect to Digio for eSign/netbanking/debit card
    //                 const custIdentifer = loginId;
    //                 const url = `https://app.digio.in/#/enach-mandate-direct/${JSONData.id}/vI3atY/${custIdentifer}?redirect_url=https://www.supermoney.in/BWMDev/RedirectionPage`;
    //                 window.location.href = url;
    //             }
    //         } else {
    //             setAlertMessage('Could Not Create Bank Mandate');
    //             setShowAlert(true);
    //         }
    //     } catch (error: any) {
    //         console.error('Error creating mandate:', error);
    //         setAlertMessage(error.response?.data?.errors?.[0] || 'Failed to create mandate');
    //         setShowAlert(true);
    //     } finally {
    //         dispatch(routeChange('end'));
    //     }
    // };

    // const physicalMandateLink = async () => {
    //     dispatch(routeChange('start'));
    //     try {
    //         const customerId = app.customerID || localStorage.getItem('customerID');

    //         const data = {
    //             mandateId,
    //             customerId,
    //         };

    //         const response = await axios.post('/mandate-services/mandate/digio/physical/form/get', data);
    //         const JSONData = response.data;

    //         if (JSONData.mandateId) {
    //             setFileDownloadUrl(JSONData.fileDownloadUrl);
    //             navigate('/PhysicalMandate', {
    //                 state: {
    //                     page: 'physical',
    //                     agreementUrl: JSONData.fileDownloadUrl,
    //                 },
    //             });
    //         } else {
    //             setAlertMessage('Could Not Create Bank Mandate');
    //             setShowAlert(true);
    //         }
    //     } catch (error) {
    //         console.error('Error getting physical mandate:', error);
    //         setAlertMessage('Failed to get physical mandate');
    //         setShowAlert(true);
    //     } finally {
    //         dispatch(routeChange('end'));
    //     }
    // };

    // const netBankingMandate = (type: string) => {
    //     createMandate('api');
    // };

    // const aadhaarMandate = () => {
    //     setMandateType('esign');
    //     // let accountType;
    //     if (bankDetails.accountType === 'Saving'){
            
    //     }
    // };

    // const physicalMandate = () => {
    //     createMandate('physical');
    // };
    return (
        <div className="max-w-[360px] mx-auto text-left font-montserrat">
            {/* Alert */}
            {showAlert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
                    <span className="block sm:inline">{alertMessage}</span>
                    <button
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setShowAlert(false)}
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
                        // onClick={() => netBankingMandate('netBanking')}
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
                        // onClick={() => netBankingMandate('debitCard')}
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
                    // onClick={physicalMandate}
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
