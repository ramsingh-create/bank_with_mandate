import React, { useState, useEffect } from "react";
import logo from "../../assets/images/SupermoneyLogoW.png";
import mandatebg from "../../assets/images/mandatebg.png";
import mndatesuccessman from "../../assets/images/mndatesuccessman.png";
import { useDispatch } from "react-redux";
// import { setIsLoading, setToken, setLoggedInUser } from "../../store/appSlice";
import setIsLoading, { routeChange, setApplicationId, setAuthToken, setCustomerID, setLoginId } from "../../store/appSlice"
// import setToken from "../../store/appSlice"
import setLoggedInUser from "../../store/appSlice"
import { makeAPIPOSTRequest } from "../../utils/apiActions";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLocation, useNavigate } from "react-router-dom";

export const Success: React.FC = () => {
    const [height, setHeight] = useState<number>(window.innerHeight);
    const [urmnNo, setUrmnNo] = useState<string>("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app)
    const dial = () => {
        console.log("Dial functionality");
    };

    const copyNumber = () => {
        navigator.clipboard
            .writeText(urmnNo)
            .then(() => {
                alert(`Copied the Number: ${urmnNo}`);
            })
            .catch((err) => console.error("Failed to copy: ", err));
    };

    const getbankDetails = () => {

        dispatch(routeChange("start"));
        let data = {
            customerId: app.customerID,
            applicationId: app.applicationId,
        };

        const options = {
            successCallBack: (res: any) => {
                //   const JSONData = response.data;
                let existingBank = false;
                if (res.userBankList.length != 0) {


                    res.bankDetails = res.userBankList[0];


                } else {
                    existingBank = false;
                }
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                // handle error
                console.log("display  ==" + error);
                dispatch(routeChange('end'))
            }
        }
        makeAPIPOSTRequest("/supermoney-service/bank/customer/active", {}, data, options)
    }

    const fetchApplicationId = () => {
        dispatch(routeChange("start"));
        let request = {
            customerId: app.customerID,
            applicationId: new URLSearchParams(window.location.search).get("applicationId"),
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange('end'))
                console.log(res);
                //   const JSONData = response.data;
                // let companyName = res.getCustomerApplicationResponseList[0].programDetails.company;
                getbankDetails()
            },
            failureCallBack: (error: any) => {
                // handle error
                console.log("display  ==" + error);
            }
        }
        makeAPIPOSTRequest("/supermoney-service/customer/application/get", {}, request, options)
    }

    const getMandateDetails = () => {
        dispatch(routeChange("start"));

        let data = {
            customerId: app.customerID,
            applicationId: new URLSearchParams(window.location.search).get("applicationId"),
        };

        let activeMandateFlag = false;

        const options = {
            successCallBack: (res: any) => {
                // const JSONData = response.data;

                if (res.getMandateDetailsRespList.length > 0) {
                    // urmnNo = res.getMandateDetailsRespList[0].umrn;
                    setUrmnNo(res.getMandateDetailsRespList[0].umrn);
                } else {
                    activeMandateFlag = false;
                }
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                // handle error
                console.log("display  ==" + error);
                 dispatch(routeChange('end'))
            }
        }
        makeAPIPOSTRequest("/mandate-services/mandate/digio/get", {}, data, options)
    }

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        getMandateDetails();
        fetchApplicationId();

        return () => window.removeEventListener("resize", handleResize);
       
    }, []);

    return (
        <div
            className="max-w-[450px] text-left bg-[#4328ae] mx-auto flex flex-col"
            style={{ height: `${height}px`, minHeight: "100%" }}
        >
            {/* Header */}
            <div className="flex mx-4 mt-4">
                <div className="text-left cursor-pointer w-1/4"></div>
                <div className="text-center w-2/4">
                    <img className="w-[138px] mx-auto" alt="logo" src={logo} />
                </div>
                <div className="text-right w-1/4" onClick={dial}>
                    <span className="text-[#4328ae] p-0 material-icons">phone</span>
                </div>
            </div>

            {/* Main Content Centered */}
            <div className="flex-grow flex flex-col justify-center items-center ">
                {/* Banner with background image */}
                <div className="relative w-full mb-6">
                    <img className="w-full" src={mandatebg} alt="background" />
                    <div className="absolute inset-0 flex flex-col justify-center pl-12 pt-4">
                        <div className="font-bold text-2xl text-white">
                            Awesome...All Done!
                        </div>
                        <div className="text-sm text-white mt-1">
                            Autopay has been successfully
                            <br />
                            registered
                        </div>
                    </div>
                </div>

                {/* Illustration + UMRN together */}
                <div className="flex flex-col items-center space-y-4 w-full px-20">
                    <img
                        className="mx-auto max-w-[85%]"
                        src={mndatesuccessman}
                        alt="success illustration"
                    />

                    <div
                        className="text-white text-left p-4 flex w-full bg-[#7e67da] rounded-xl cursor-pointer m-0"
                        onClick={copyNumber}
                    >
                        <div className="flex-grow">
                            <span className="text-sm">UMRN No.</span>
                            <br />
                            <span className="text-sm font-medium">{urmnNo}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-white material-icons">content_copy</span>
                        </div>
                    </div>

                    <span className="text-xs text-[#b39ddb] block text-center m-0">
                        Keep this UMRN No for future reference
                    </span>
                </div>
            </div>
        </div>
    );
};

