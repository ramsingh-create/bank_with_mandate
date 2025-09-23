import React, { useEffect, useState } from 'react';
import bankverification from "../../assets/images/bankverification.png";
import { useDispatch } from 'react-redux';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';

interface BankItem {
    bankName: string;
    isfcCode: string;
    name: string;
    accountType: string;
}

interface BankOption {
    name: string;
    id: number;
    ifscCode?: string;
}

export const BankDetails = () => {

    const [existingBank, setExistingBank] = useState(false);
    const [error, setError] = useState<string | null>('');
    const [positionSelected, setPositionSelected] = useState<number | null>(null);
    const [bankFinalList, setBankFinalList] = useState<BankItem[]>([]);
    const [banklist, setBanklist] = useState<BankOption[]>([]);
    const [sortedArray, setSortedArray] = useState<BankOption[]>([]);

    const [bankID, setBankID] = useState<BankOption | null>(null);
    const [accountNo, setAccountNo] = useState('');
    const [bankIfsc, setBankIfsc] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [items, setItems] = useState<string[]>(['Savings', 'Current']);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app);

    const changeBoolean = () => { 
        setExistingBank(!existingBank);
    };
    const changeSelection = (index: number) => { 
        // this.positionSelected = position;
        // this.bankDetails = this.bankFinalList[position];
        setPositionSelected(index);
    };
    const addNewBank = () => {
        if (existingBank) {
            let data = {
                // accNo: this.bankDetails.bankAccountNo,
                // accType: this.bankDetails.accountType,
                // accHoldName: this.bankDetails.accountHolderName,
                // defaultAccountFlag: true,
                // ifscCode: this.bankDetails.isfcCode,
                // micrCode: this.bankDetails.micrCode,
                // personalAccountFlag: true,
                // applicationId: Number(this.$store.getters.applicationId),
                // customerId: Number(this.$store.getters.customerID)
            };
            callAddBankFunction(data);
        } else {
            let character = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
            // if (character.test(accountNo)) {
            //     this.accuntFlag = false;
            // } else {
            //     this.accuntFlag = true;
            // }

            if (bankID?.name != "") {
                if (accountNo != "" && accountNo.length >= 8 && !character.test(accountNo)) {
                    if (bankIfsc != "" && bankIfsc.length > 0) {
                        if (accountName != "" && accountName.length > 0) {
                            if (accountType != "") {
                                let data = {
                                    accNo: accountNo,
                                    accType: accountType,
                                    accHoldName: accountName,
                                    defaultAccountFlag: true,
                                    ifscCode: bankIfsc,
                                    micrCode: bankID?.id,
                                    personalAccountFlag: true,
                                    applicationId: Number(app.applicationId),
                                    customerId: Number(app.customerID)
                                };
                                callAddBankFunction(data);
                            } else {
                                console.log("this is false");
                                setError("Please Select Account Type");
                            }
                        } else {
                            setError("Please Select Bank IFSC");
                        }
                    } else {
                        setError("Please Select Bank IFSC");
                    }
                } else {
                    setError("Please Enter Valid Bank Account Number");
                }
            } else {
                setError("Please Select Bank Name");
            }
        }
     };

    const callAddBankFunction = (data: any) => {
        dispatch(routeChange("start"));

        const options = {
            successCallBack: (res: any) => {
                let successFlag = res.successFlag;
                if (successFlag) {
                    navigate("/BankMandateInfo");
                } else {

                    if (res.header.hostStatus === "E") {
                        setError(res.header.error.errorDesc);
                    } else {
                        setError(res.data.message);
                    }
                }

                dispatch(routeChange("end"));
                //self.getbankDetails();
            },
            failureCallBack: (err: any) => {
                console.log("display  ==" + error);

                setError("Server Connection Failed");
            }
        };
        makeAPIPOSTRequest('/supermoney-service/bank/customer/add', {}, data, options)
    }

    const bankListFun = () => {

        dispatch(routeChange('start'));

        const options = {
            successCallBack: (res: any) => {
                console.log(res);

                setBanklist(res.bankDetails);

                dispatch(routeChange('end'))
                //self.getbankDetails();
            },
            failureCallBack: (err: any) => {
                console.log("display  ==" + error);
            }
        };
        makeAPIPOSTRequest('/supermoney-service/getBankDetails', {}, {}, options)
    }

    const getIFSCBankList = (bankID: any) => {
        dispatch(routeChange("start"));

        let data = {
            bankCode: bankID.id,
            searchTxt: bankID.name,
        };
            
        const options = {
            successCallBack: (res: any) => {
                console.log(res);

                setSortedArray(res.ifscDetails.sort((a: any,b: any) => a.ifscCode.localeCompare(b.ifscCode)));
                // self.setBankID = self.bankID.id;

                dispatch(routeChange("end"));
            },
            failureCallBack: (err: any) => {
                console.log("display  ==" + error);
            }
        };

        makeAPIPOSTRequest('/supermoney-service/ifscSearch', {}, data, options)
    }
    useEffect(() => {
        bankListFun()
    }, [])

    useEffect(() => {
        if (bankID?.name) {
            getIFSCBankList(bankID);
        }
    }, [bankID])

    return (
        <div
            className="flex min-h-screen items-center justify-center  p-0 pt-0 max-w-[450px] w-full p-3 mx-auto text-left  min-h-screen bg-white"
        >
            {/* Alert */}
            {/* Replace with your own alert logic */}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
            </div>}

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
                <div className="text-left mt-[-20px] rounded-[22px] bg-white mb-7 px-4 pt-2" >
                    {existingBank &&
                        bankFinalList.map((item, index) => (
                            <div
                                key={index}
                                className={`mt-5 rounded-[22px] bg-[#f7f5ff] mb-7 p-6 cursor-pointer ${positionSelected === index ? 'border border-[#7E67DA]' : 'border border-[#f7f5ff]'
                                    }`}
                                onClick={() => changeSelection(index)}
                            >
                                <div className="flex justify-between mb-2" >
                                    <div>
                                        <span className="text-xs font-bold" > HDFC Bank </span>
                                        < br />
                                        <span className="text-xs text-[#828282]" > A / C : {item.bankName} </span>
                                    </div>
                                    < div className="text-right" >
                                        <span className="text-xs text-[#636266]" > IFSC code </span>
                                        < br />
                                        <span className="text-xs font-bold" > {item.isfcCode} </span>
                                    </div>
                                </div>
                                < div className="flex justify-between" >
                                    <div>
                                        <span className="text-xs text-[#636266]" > Account Holder’s Name </span>
                                        < br />
                                        <span className="text-xs font-bold" > {item.name} </span>
                                    </div>
                                    < div className="text-right" >
                                        <span className="text-xs text-[#636266]" > Account Type </span>
                                        < br />
                                        <span className="text-xs font-bold" > {item.accountType} </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {
                        existingBank && (
                            <button
                                className="w-full border border-[#7E67DA] text-[#7E67DA] py-2 rounded cursor-pointer flex items-center justify-center gap-2"
                                onClick={changeBoolean}
                            >
                                <span className="material-icons text-sm" > add </span>
                                < span className="font-bold" > Add New Bank </span>
                            </button>
                        )
                    }

                    {
                        !existingBank && (
                            <div className="text-left mt-5" >
                                <div className="mb-4" >
                                    <label className="block text-sm font-medium mb-1" > Select your bank </label>
                                    < select
                                        className="w-full border rounded px-3 py-2"
                                        value={bankID?.name || ''
                                        }
                                        onChange={(e) =>
                                            setBankID(banklist.find((b) => b.name === e.target.value) || null)
                                        }
                                    >
                                        <option value="" > Select </option>
                                        {
                                            banklist.map((bank) => (
                                                <option key={bank.name} value={bank.name} >
                                                    {bank.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                < div className="mb-4" >
                                    <label className="block text-sm font-medium mb-1" > Bank Account Number </label>
                                    < input
                                        type="text"
                                        maxLength={18}
                                        value={accountNo}
                                        onChange={(e) => setAccountNo(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                < div className="mb-4" >
                                    <label className="block text-sm font-medium mb-1" > IFSC Code </label>
                                    < input
                                        type="text"
                                        value={bankIfsc}
                                        onChange={(e) => setBankIfsc(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        list="ifsc-options"
                                    />
                                    <datalist id="ifsc-options" className='text-red-500' >
                                        {
                                            sortedArray.map((item) => (
                                                <option key={item.ifscCode} value={item.ifscCode} />
                                            ))
                                        }
                                    </datalist>
                                </div>

                                < div className="mb-4" >
                                    <label className="block text-sm font-medium mb-1" > Account Holder Name </label>
                                    < input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                < div className="text-xs text-[#4328ae] mt-[-20px] mb-5" >
                                    Put Primary Account Holder Name for Joint Account
                                </div>

                                < div className="mb-4" >
                                    <label className="block text-sm font-medium mb-1" > Account Type </label>
                                    < select
                                        className="w-full border rounded px-3 py-2"
                                        value={accountType}
                                        onChange={(e) => setAccountType(e.target.value)}
                                    >
                                        <option value="" > Select </option>
                                        {
                                            items.map((type) => (
                                                <option key={type} value={type} >
                                                    {type}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        )}

                    <div className="pt-12 pb-[15%] max-w-[450px] mx-auto" >
                        <button
                            className="w-full bg-[#7E67DA] text-white py-3 rounded cursor-pointer"
                            onClick={addNewBank}
                        >
                            <b>Submit </b>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
