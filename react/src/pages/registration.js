import React, { useEffect, useState } from 'react';
import TextInput from '../components/custom/textInput';
import Button from '../components/custom/button';
import { GetRequest, PostRequest } from '../utils/request';
import { checkEmptyFields, validateEmail, validatePassword } from '../utils/formValidation';
import Error from '../components/custom/error';
import { Link } from 'react-router-dom';
import Label from '../components/custom/label';
import { useDispatch } from 'react-redux';
import { uiActions } from '../store/ui-slice';
import Loader from '../components/custom/loader';
import { FaRegEye, FaRegEyeSlash  } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { WindowScroll } from '../utils/windowScroll';

const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formInput, setFormInput] = useState({
        fullName: "",
        email: "",
        companyTitle: "",
        companyAddress: "",
        password: "",
        confirmPassword: "",
        plan: ""
    })
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [plans, setPlans] = useState([]);
    const [show, setShow] = useState({
        password: false,
        confirmPassword: false
    });
    const [otp, setOtp] = useState({
        input: "",
        received: "",
        userId: ""
    })

    //SHOWS MESSAGE ON SUCCESSFULL REGISTRATION
    useEffect(() => {
        if (success){
            dispatch(uiActions.setToastify("Registered Successfully!"));
            const timer = setTimeout(() => {
                dispatch(uiActions.setToastify(""));
            }, 2000);
            setSuccess(false);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[success]);

    //FETCHES ALL PLANS
    useEffect(() => {
        GetRequest(`${process.env.REACT_APP_URL}/plan`).then(response => {
            setPlans(response.data);
            setFormInput((prevState) => ({ ...prevState, plan: response.data[0]?._id }));
        }).catch(error => {
            console.log("error >", error);
        })
    },[])
    //FULL NAME INPUT HANDLER
    const nameHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
        setFormInput((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };
    
    //EMAIL INPUT HANDLER
    const emailHandler = (e) => {
        const inputValue = e.target.value;
        const val = inputValue.replace(" ", '').toLowerCase(); 
        setFormInput((prevState) => ({ ...prevState, email: val }));
        setError("");
    };

    //PASSWORD INPUT HANDLER
    const passwordHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(" ", '');
        setFormInput((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };

    function verificationHandler(){
        setDisabled(true);
        setError("");
        if (checkEmptyFields(formInput)) {
            setError("Fields must not be empty!");
            setDisabled(false);
        } else if (!validateEmail(formInput.email)) {
            setError("Email is invalid!");
            setDisabled(false);
        } else if (!validatePassword(formInput.password)) {
            setError("Password should contain atleast 8 characters and must contain one uppercase, one lowercase, one digit and one special character!");
            setDisabled(false);
        } else if (formInput.password !== formInput.confirmPassword) {
            setError("Confirm Password should be same as Password!");
            setDisabled(false);
        }else{
            PostRequest(`${process.env.REACT_APP_URL}/user/`, formInput).then(response => {
                setOtp(prevState => ({ ...prevState, received: response.data?.otp, userId: response.data?.id }))
                setDisabled(false);
                setShowOTP(true);
                dispatch(uiActions.setToastify("One time Password has been sent to your mail!"));
                const timer = setTimeout(() => {
                    dispatch(uiActions.setToastify(""));
                }, 3000);
                return () => clearTimeout(timer);
            }).catch(err => {
                setDisabled(false);
                setError(err.data || "Something went wrong!");
            });
        }
    }

    //HANDLES REGISTRATION
    function registrationHandler() {
        setDisabled(true);
        setError("")
        if (!otp.input){
            setError("Enter OTP sent to your mail!");
            setDisabled(false);
        }else if (otp.input !== otp.received.toString()) {
            setError("Incorrect OTP!");
            setDisabled(false);
        }else{
            PostRequest(`${process.env.REACT_APP_URL}/user/save/${otp.userId}`, {plan: formInput.plan}).then(response => {
                dispatch(uiActions.setToastify("Registered Successfully!"));
                const timer = setTimeout(() => {
                    dispatch(uiActions.setToastify(""));
                    navigate("/login")
                }, 2000);
                return () => clearTimeout(timer);
            }).catch(error => {
                console.log("err >", error);
                setDisabled(false);
                setError(error.data || "Something went wrong!")
            })
        }
    }

    return (
        <>
        <Header />
        <div className="md:pt-[90px] md:pb-[20px] max-md:py-[50px] bg-[linear-gradient(0deg,#fff_0%,#c5eaf9_100%)]">
            <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
            <div className="max-w-[700px] px-[10px] md:px-[30px] py-[40px] relative bg-white mx-auto w-full rounded-[10px] border">
                {disabled && (
                    <Loader />
                )}
                <h2 className='mb-[20px] text-center md:text-left'>Sign Up</h2>
                <Error message={error}/>
                <div>
                    <div className="mb-[10px]">
                        <Label 
                            title='Full Name' 
                            htmlFor="fullName"
                        />
                        <TextInput
                            id='fullName'
                            name="fullName"
                            value={formInput.fullName}
                            onChange={nameHandler}
                            disabled={showOTP}
                        />
                    </div>
                    <div className="mb-[10px]">
                        <Label 
                            title='Email' 
                            htmlFor="Email"
                        />
                        <TextInput
                            id='Email'
                            value={formInput.email}
                            type='email'
                            onChange={emailHandler}
                            disabled={showOTP}
                        />
                    </div>
                    <div className="mb-[10px]">
                        <Label 
                            title='Company Title' 
                            htmlFor="company-title"
                        />
                        <TextInput 
                            id='company-title'
                            name="companyTitle"
                            value={formInput.companyTitle}
                            onChange={nameHandler}
                            disabled={showOTP}
                        />
                    </div>
                    <div className="mb-[10px]">
                        <Label 
                            title='Company Full Address' 
                            htmlFor="company-full-address"
                        />
                        <TextInput 
                            id='company-full-address'
                            value={formInput.companyAddress}
                            onChange={(e) => {
                                setFormInput(prevState => ({ ...prevState, companyAddress: e.target.value }));
                                setError("");
                            }}
                            disabled={showOTP}
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-[10px] mb-[10px]'>
                        <div className='relative'>
                            <Label 
                                title='Password' 
                                htmlFor="password"
                            />
                            <TextInput
                                name="password"
                                value={formInput.password}
                                type={show.password ? "text" : "password"}
                                onChange={passwordHandler}
                                disabled={showOTP}
                            />
                            {show.password ? (
                                <button onClick={() => setShow(prevState => ({ ...prevState, password: false }))}  className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                                    <FaRegEyeSlash size={15} />
                                </button>
                            ):(
                                <button onClick={() => setShow(prevState => ({ ...prevState, password: true }))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                                    <FaRegEye size={15} />
                                </button>
                            )}
                        </div>
                        <div className='relative'>
                            <Label 
                                title='Confirm Password' 
                                htmlFor="confirm-password"
                            />
                            <TextInput
                                name="confirmPassword"
                                value={formInput.confirmPassword}
                                type={show.confirmPassword ? "text" : "password"}
                                onChange={passwordHandler}
                                disabled={showOTP}
                            />
                            {show.confirmPassword ? (
                                <button onClick={() => setShow(prevState => ({ ...prevState, confirmPassword: false }))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                                    <FaRegEyeSlash size={15} />
                                </button>
                            ):(
                                <button onClick={() => setShow(prevState => ({ ...prevState, confirmPassword: true }))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                                    <FaRegEye size={15} />
                                </button>
                            )}
                        </div>
                    </div>
                    <label className='text-[12px] font-medium pb-[5px]'>Subscription</label>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[10px] mt-[10px]'>
                        {plans.length > 0 && plans.map((item, i) => (
                            <button 
                                key={i} 
                                onClick={() => setFormInput(prevState => ({ ...prevState, plan: item._id }))}
                                className={`border p-[10px] flex justify-between items-center ${formInput.plan === item._id && "border-black"} ${showOTP && "pointer-events-none bg-[#FAFAFA]"}`}
                            >
                                <span className='font-semibold'>{item.title}</span>
                                <span>{item.price === 0 ? "3 days trial" : `INR ${item.price} / mon`}</span>
                            </button>
                        ))}
                    </div>
                    {showOTP && (
                        <div className='flex justify-start items-center gap-[20px] mt-[15px]'>
                            <Label
                                title="Enter OTP:"
                                htmlFor='otp'
                            />
                            <TextInput 
                                id="otp"
                                value={otp.input}
                                placeholder='OTP'
                                className='max-w-[200px]'
                                onChange={(e) => {
                                    setOtp(prevState => ({ ...prevState, input: e.target.value }));
                                    setError("");
                                }}
                            />
                        </div>
                    )}
                    <div className='mt-[20px] mb-[10px]' onClick={WindowScroll}>
                        {showOTP ? (
                            <Button
                                label="Verify"
                                onClick={registrationHandler}
                            />
                        ):(
                            <Button
                                label="Sign Up"
                                onClick={verificationHandler}
                            />
                        )}
                    </div>
                    <div onClick={WindowScroll}>
                    <p className='text-center md:text-left'>Already have an account? <Link to="/login" className='text-[#f60]'>Sign In</Link></p>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Registration;