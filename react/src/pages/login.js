import React, { useState } from 'react';
import TextInput from '../components/custom/textInput';
import Button from '../components/custom/button';
import { PostRequest } from '../utils/request';
import { checkEmptyFields, validateEmail } from '../utils/formValidation';
import Error from '../components/custom/error';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/custom/loader';
import { useDispatch } from 'react-redux';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { accountActions } from '../store/account-slice';
import Label from '../components/custom/label';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { WindowScroll } from '../utils/windowScroll';
import { encrypt } from '../utils/encryption';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(false);
    const [formInput, setFormInput] = useState({
        email: "",
        password: ""
    })
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");

    const handleEmailInputChange = (e) => {
        const inputValue = e.target.value;
        const val = inputValue.replace(" ", '').toLowerCase(); 
        setFormInput((prevState) => ({ ...prevState, email: val }));
        setError("");
    };

    const handlePasswordInputChange = (e) => {
        const inputValue = e.target.value;
        const val = inputValue.replace(" ", ''); 
        setFormInput((prevState) => ({ ...prevState, password: val }));
        setError("");
    };

    function loginHandler() {
        setDisabled(true);
        setError('');
        if (checkEmptyFields(formInput)) {
            setError('Fields must not be empty!');
            setDisabled(false);
        } else if (!validateEmail(formInput.email)) {
            setError('Email is invalid!');
            setDisabled(false);
        } else {
            PostRequest(`${process.env.REACT_APP_URL}/user/login`, {
                email: formInput.email,
                password: encrypt(formInput.password)
            }).then(response => {
                setDisabled(false);
                localStorage.setItem('xios', response.data._id);
                dispatch(accountActions.setAccountInfo({data: response.data, convoId: response.data.convoId}));
                if (response?.data.role._id === "664f1ec1668fc9642e913b64"){
                    navigate('/mastermind/dashboard')
                }else{
                    navigate('/account')
                }
            }).catch(error => {
                console.log("login error >>>", error);
                setError(error?.data || "Login failed! Try again later!");
                setDisabled(false);
            });
        }
    }

    return (
        <>
        <Header />
        <div className="md:pt-[90px] md:pb-[20px] max-md:py-[50px] bg-[linear-gradient(0deg,#fff_0%,#c5eaf9_100%)]">
        <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
            <div className="max-w-[500px] px-[10px] md:px-[30px] py-[40px] relative bg-white mx-auto w-full rounded-[10px] border" onClick={WindowScroll}>
                {disabled && (
                    <Loader />
                )}
                <h2 className='mb-[20px] text-center md:text-left'>Sign In</h2>
                <div>
                    <Error message={error} />

                    <div className="mb-[10px]">
                        <Label
                            title='Email' 
                            htmlFor="Email"
                        />
                        <TextInput
                            value={formInput.email}
                            onChange={handleEmailInputChange}
                        />
                    </div>
                    <div className='relative mb-[25px]'>
                        <Label
                            title='Password' 
                            htmlFor="password"
                        />
                        <TextInput
                            id="password"
                            type={showPass ? "text" : "password"}
                            value={formInput.password}
                            onChange={handlePasswordInputChange}
                        />
                        {showPass ? (
                            <button onClick={() => setShowPass(false)} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                                <FaRegEyeSlash size={15} />
                            </button>
                        ) : (
                            <button onClick={() => setShowPass(true)} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                                <FaRegEye size={15} />
                            </button>
                        )}
                    </div>
                    <Button
                        label={`Log In`}
                        onClick={loginHandler}
                    />
                    <p className='text-center md:text-left mt-[10px]'>Do not have an account? <Link to="/registration" className='text-[#00f]'>Sign Up</Link></p>
                </div>
            </div>
        </div>
        </div>
        <Footer />
        </>
    )
}

export default Login;