import React, { useState, useEffect } from "react";
import logo from "../../assets/images/SupermoneyLogoW.png";
import character from "../../assets/images/character.png";
import { useDispatch } from "react-redux";
// import { setIsLoading, setToken, setLoggedInUser } from "../../store/appSlice";
import setIsLoading, { routeChange, setApplicationId, setAuthToken, setCustomerID, setLoginId } from "../../store/appSlice"
// import setToken from "../../store/appSlice"
import setLoggedInUser from "../../store/appSlice"
import { makeAPIPOSTRequest } from "../../utils/apiActions";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [mobno, setMobno] = useState("");
    // const [errorMob, setErrorMob] = useState("");   
    const [mobErrormsg, setMobErrormsg] = useState("");
    const [otp, setOtp] = useState("");
    const [otpVisibility, setOtpVisibility] = useState(false);
    const [countDown, setCountDown] = useState(30);
    const [countDownFinished, setCountDownFinished] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const loginId = useSelector((state: RootState) => state.app.loginId)
    const app = useSelector((state: RootState) => state.app)
    // Timer for OTP countdown
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpVisibility && !countDownFinished && countDown > 0) {
            timer = setTimeout(() => setCountDown(countDown - 1), 1000);
        }
        if (countDown === 0) {
            setCountDownFinished(true);
        }
        return () => clearTimeout(timer);
    }, [countDown, otpVisibility, countDownFinished]);

    const removeDuplicateCharacters = (string: string) => {
        const temp = string
            .split("")
            .filter((item, pos, self) => self.indexOf(item) === pos)
            .join("");
        console.log("this is the mobile length", temp.length);
        return temp.length;
    };

    const checkInitialLetter = (string: string) => {
        return parseInt(string.split("")[0]) > 4 ? true : false;
    };

    const verifyCustomer = () => {
        setAlert(false);
        if (mobno.length === 10 && removeDuplicateCharacters(mobno) > 1 && checkInitialLetter(mobno)) {
            console.log("this is true");
            setMobErrormsg("");
            setAlert(false);

        } else {
            setAlert(true);
            setAlertMessage("Please Enter A Valid Mobile Number");
        }

        if (mobno.length === 10 && !alert) {
            dispatch(routeChange("start"));
            var self = this;
            var url = "/supermoney-service/send/mobile/otp";

            var employeeDetails = {
                mobileNo: "+91" + mobno,
                otpFor: "loginPin",
            };
            console.log("display  === " + JSON.stringify(employeeDetails));

            const options = {
                successCallBack: (res: any) => {
                    const successFlag = res.successFlag;
                    console.log("register succcesss", successFlag);
                    if (successFlag) {
                        // self.$store.commit("setloginId", {
                        //     loginId: "+91" + self.mobno,
                        // });
                        dispatch(setLoginId(`+91${mobno}`))
                        dispatch(routeChange('end'))
                        setOtpVisibility(true);
                        // self.transactionCode = JSONData.transactionCode;
                        setCountDown(20);
                        setCountDownFinished(false);
                        // countDownTimer();
                    } else {
                        const errors = res.error[0].errorDesc;
                        setAlert(true);
                        setAlertMessage(errors);

                        dispatch(routeChange('end'))
                    }

                },
                failureCallBack: (error: any) => {
                    // handle error
                    setAlert(true);
                    setAlertMessage("Server Connection Failed");
                    console.log("this is the error", error);
                    dispatch(routeChange("end"));
                },

            }
            makeAPIPOSTRequest("/supermoney-service/send/mobile/otp", {}, employeeDetails, options);
        } else {
            if (mobno.length === 0) {
                //   this.errorMob = true;
                // setErrorMob(true);
                setMobErrormsg("Enter A Mobile Number");
            } else {
                // setErrorMob(true);
                setMobErrormsg("Enter A Valid Mobile Number");
            }
            console.log("this is mobile number", mobno.length);
        }
    };

    const countDownTimer = () => {
        if (countDown > 0) {
            setTimeout(() => {
                setCountDown((prev) => prev - 1);
                countDownTimer();
            }, 1000);
        } else {
            setCountDownFinished(true);
        }
    }

    const verifyOtp = () => {
        if (otp != "" && otp.length == 6) {
            dispatch(routeChange("start"));

            const data = {
                userName: app.loginId,
                password: otp
            };

            const options = {
                successCallBack: (res: any) => {
                    console.log(res);
                    // self.authToken = JSONData.token;
                    // self.companyName = JSONData.data.companyName

                    dispatch(setLoginId(res.user.userName))

                    // axios.defaults.headers.common["Authorization"] = JSONData.token;

                    dispatch(setAuthToken(res.token))
                    // self.$store.commit("setCustomerID", {
                    //   customerID: JSONData.user.customerId,
                    // });

                    dispatch(setCustomerID(res.user.customerId))
                    getProgramDetails();
                },
                failureCallBack: (error: any) => {
                    console.error(error);
                    setAlert(true);
                    setAlertMessage("Invalid OTP");
                    dispatch(routeChange("end"));
                }
            };

            makeAPIPOSTRequest("/identityservices/auth/v1/customer/otp/login", {}, data, options);
            // setAlert(false);
        } else {
            setAlert(true);
            setAlertMessage("Please enter a valid 6 digit OTP.");
        }

    };

    const getProgramDetails = () => {
        if (otp != "" && otp.length == 6) {
            //payload
            const data = {
                requestId: new URLSearchParams(window.location.search).get("requestID"),
            };
            dispatch(routeChange("start"));


            const options = {
                successCallBack: (res: any) => {
                    const programId = res.getProgramsList[0].programId;
                    console.log("Fetched ProgramId:", programId);
                    getApplicationDetails(programId)
                    // 🔥 you can chain another API call here like getApplicationDetails(programId)
                    dispatch(routeChange("end"));
                },
                failureCallBack: (error: any) => {
                    // console.error(error);
                    setAlert(true);
                    setAlertMessage("Invalid OTP");
                    dispatch(routeChange("end"));
                }
            };

            makeAPIPOSTRequest("/supermoney-service/programs/get", {}, data, options);
        } else {
            setAlert(true);
            setAlertMessage("Please Enter A Valid OTP");
        }
    }

    const getApplicationDetails = (programId: any) => {
        if (otp != "" && otp.length == 6) {
            dispatch(routeChange("start"));

            // payload
            var data = {
                customerId: app.customerID,
                programId: programId,
            };

            const options = {
                successCallBack: (res: any) => {
                    console.log(res);
                    let mintwalkLender = false;
                    res.getCustomerApplicationResponseList.forEach((element: any) => {
                        if (element.programLenderResp.lenderId == 4) {
                            mintwalkLender = true;
                            // self.$store.commit("setApplicationId", {
                            //     applicationId:
                            //         res.getCustomerApplicationResponseList[0]
                            //             .applicationId,
                            // });
                            dispatch(setApplicationId(res.getCustomerApplicationResponseList[0].applicationId))
                        }
                    });
                    if (mintwalkLender) {
                        getbankDetails();
                    } else {
                        setAlert(true);
                        setAlertMessage("Application details not found with Mintwalk");
                        dispatch(routeChange("end"));
                    }

                },
                failureCallBack: (error: any) => {
                    // handle error
                    setAlert(true);
                    setAlertMessage("Invalid OTP");
                    dispatch(routeChange("end"));
                }
            }
            dispatch(routeChange("start"));
            makeAPIPOSTRequest("/supermoney-service/customer/application/get", {}, data, options);
        } else {
            setAlert(true);
            setAlertMessage("Please Enter A Valid OTP");
        }
    }

    const getbankDetails = () => {
        dispatch(routeChange("start"));

        let data = {
            customerId: app.customerID,
            applicationId: app.applicationId,
        };
        let activeBankFlag = false;

        const options = {
            successCallBack: (res: any) => {

                if (res.userBankList.length != 0) {
                    for (let i = 0; i < res.userBankList.length; i++) {
                        if (res.userBankList[i].defaultFlag === true) {
                            activeBankFlag = true;
                            break;
                        }
                    }

                    if (!activeBankFlag) {
                        // self.$router.push({
                        //     path: "/BankDetails",
                        // });
                        navigate('/BankDetails')
                    } else {
                        getMandateDetails();
                        // self.$router.push({
                        //   path: "/Mandate",
                        // });
                    }
                    //else {
                    //   self.$router.push({
                    //     path: "/Success",
                    //     query: {
                    //       page: "",
                    //     },
                    //   });
                    // }
                } else {
                    // self.$router.push({
                    //     path: "/BankDetails",
                    // });
                    navigate('/BankDetails')

                }
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.log("display  ==" + error);
                dispatch(routeChange('end'))
            }
        }

        makeAPIPOSTRequest('/supermoney-service/bank/customer/active', {}, data, options)
    }

    const getMandateDetails = () => {
        // self.$store.commit("routeChange", "start");
        dispatch(routeChange('start'))

        //  var url = 'http://13.126.28.53:8080/MintReliance/MintReliance/kycCheck'
        const data = {
            customerId: app.customerID,
            applicationId: app.applicationId,
        };

        const options = {
            successCallBack: (res: any) => {
                const userMandateList = res.getMandateDetailsRespList;
                console.log(userMandateList, "userMandateList")

                //   self.$router.push({
                //     path: "/BankMandateInfo",
                //   });
                navigate('/BankMandateInfo')

                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.log("display  ==" + error);
                dispatch(routeChange('end'))
            }
        }

        makeAPIPOSTRequest('/mandate-services/mandate/digio/details/get', {}, data, options)
    }

    return (
        <div className="flex min-h-screen items-center justify-center  p-0 pt-0">
            <div className="w-full max-w-md inline-block mb-auto">
                {/* Alert */}
                {alert && (
                    <div className="mb-4 rounded bg-[#ff5252] border-[#ff5252] p-3 text-sm text-white ">
                        <div className="flex justify-between ">
                            <span>{alertMessage}</span>
                            <button onClick={() => setAlert(false)} className="ml-2">
                                ✖
                            </button>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className=" bg-[#4328ae] p-6 text-white w-xl">
                    <img src={logo} alt="Logo" className="w-[120px] mb-4" />
                    <img src={character} alt="Character" className="w-[180px] mb-4" />
                    <div className="text-[14px] font-bold">
                        Congratulations! You’ve been granted a pre-approved credit limit
                    </div>
                    <div className="mt-2 text-[12px]">
                        Set up auto repayment to avail this credit limit
                    </div>
                </div>

                {/* Login Form */}
                <div className="rounded-b-lg bg-white p-6 text-gray-700">
                    <div className="text-[14px] font-bold">Login to your account</div>
                    <div className="mt-2 text-[12px] text-gray-600">
                        We will send you a One Time Password(OTP) to your mobile number
                    </div>

                    <div className="relative mt-5">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={mobno}
                            onChange={(e) =>
                                /^\d*$/.test(e.target.value) &&
                                e.target.value.length <= 10 &&
                                setMobno(e.target.value)
                            }
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                setIsFocused(false);
                                setIsTouched(true);
                            }}
                            className={`peer w-full rounded border px-3 pt-2 pb-2 text-base/6 text-sm focus:outline-none
      ${mobErrormsg && isTouched
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-blue-600"}
    `}
                        />
                        <label
                            className={`absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
    ${isFocused || mobno
                                    ? "-top-1 text-xs px-1 bg-white"
                                    : "top-3 text-sm"}
    ${mobErrormsg && isTouched ? "text-red-500" : "peer-focus:text-blue-600"}
  `}
                        >
                            Mobile Number
                        </label>
                        {mobErrormsg && isTouched && (
                            <p className="mt-1 text-xs text-red-600">{mobErrormsg}</p>
                        )}
                    </div>


                    {/* <input
                        type="number"
                        placeholder="Mobile Number"
                        value={mobno}
                        onChange={(e) =>
                            e.target.value.length <= 10 && setMobno(e.target.value)
                        }
                        className="mt-5 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    /> */}

                    {mobErrormsg && (
                        <p className="mt-1 text-xs text-red-600">{mobErrormsg}</p>
                    )}

                    <button
                        className="mt-6 w-40 rounded bg-[#4328ae] py-2 text-white hover:bg-[#341f8d] "
                        onClick={verifyCustomer}
                    >
                        Get OTP
                    </button>

                    {/* OTP Section */}
                    {otpVisibility && (
                        <div className="mt-6">
                            <div className="text-[14px] font-bold">Verify with OTP</div>

                            {/* <input
                                type=""
                                placeholder={`Enter OTP sent to ${mobno.substring(0, 2)}******${mobno.substring(8, 10)}`}
                                value={otp}
                                onChange={(e) =>
                                    // (e.target.value.length) <= 6 && setOtp(e.target.value)
                                    /^\d*$/.test(e.target.value) && e.target.value.length <= 6 && setOtp(e.target.value)
                                }
                                className="mt-5 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            /> */}

                            <div className="relative mt-5">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder=" " // blank placeholder for floating label
                                    value={otp}
                                    onChange={(e) =>
                                        /^\d*$/.test(e.target.value) && e.target.value.length <= 6 && setOtp(e.target.value)
                                    }
                                    className={`peer w-full rounded border px-3 pt-2 pb-2 text-base/6 text-sm 
      focus:border-blue-500 focus:outline-none
      ${alertMessage === "Invalid OTP" ? "border-red-500" : "border-gray-300"}`}
                                />
                                <label
                                    className={`absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
      ${otp ? "-top-1 text-xs px-1 bg-white" : "top-3 text-sm"}
      peer-focus:-top-1 peer-focus:text-xs peer-focus:px-1 peer-focus:bg-white
      ${alertMessage === "Invalid OTP" ? "text-red-500" : "peer-focus:text-blue-600"}`}
                                >
                                    {`Enter OTP sent to ${mobno.substring(0, 2)}******${mobno.substring(8, 10)}`}
                                </label>
                            </div>

                            {/* Error message */}
                            {/* {alertMessage === "Invalid OTP" && (
  <p className="mt-1 text-xs text-red-600">{alertMessage}</p>
)} */}
                            {!countDownFinished ? (
                                <div className="mt-3 text-left text-sm text-gray-600">
                                    Resend OTP in {countDown} seconds
                                </div>
                            ) : (
                                <div className="mt-3 text-left text-sm">
                                    <span className="block text-lg text-gray-700">Didn’t get an OTP?</span>
                                    <button
                                        className=" w-40 max-h-8 rounded border border-[#4328ae] py-1 text-[#4328ae] hover:bg-violet-50"
                                        onClick={verifyCustomer}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            )}

                            <button
                                className="mt-4 w-40 rounded bg-[#4328ae] py-2 text-white hover:bg-[#341f8d]"
                                onClick={verifyOtp}
                            >
                                Verify
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
