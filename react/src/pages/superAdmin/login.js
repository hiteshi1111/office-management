import React, { useState } from 'react';
import TextInput from '../../components/custom/textInput';
import Button from '../../components/custom/button';
import { PostRequest } from '../../utils/request';
import { checkEmptyFields, validateEmail } from '../../utils/formValidation';
import Error from '../../components/custom/error';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/custom/loader';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { accountActions } from '../../store/account-slice';
import Label from '../../components/custom/label';
import { GiThunderSkull } from "react-icons/gi";

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showPass, setShowPass] = useState(false);
    const [loader, setLoader] = useState(false);
    const [formInput, setFormInput] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState({
        email: false,
        password: false,
        message: ""
    });

    function loginHandler(e) {
        e.preventDefault()
        setLoader(true);
        setError(prevState => ({ ...prevState, message: '' }));

        if (checkEmptyFields(formInput)) {
            setError(prevState => ({ ...prevState, message: 'Fields must not be empty!' }));
            setLoader(false);
        } else if (!validateEmail(formInput.email)) {
            setError(prevState => ({ ...prevState, email: true, message: 'Email is invalid!' }));
            setLoader(false);
        } else {
            PostRequest(`${process.env.REACT_APP_URL}/superadmin/login`, {
                email: formInput.email.toLowerCase(),
                password: formInput.password
            }).then(response => {
                localStorage.setItem("xios", response.data._id)
                localStorage.setItem("tokk", response.data.token)
                navigate('/mastermind/dashboard')
                dispatch(accountActions.setAccountInfo({data : response.data}));
            }).catch(error => {
                setError(prevState => ({ ...prevState, message: error.data.error }));
                setLoader(false);
            });
        }
    }
    
    return (
        <div className="bg-mastermind h-[100%]">
             <div className="container mx-auto md:pt-[150px] md:pb-[20px] max-md:py-[100px] md:px-[40px] max-md:px-[15px] h-[100vh]">
                <div className="max-w-[500px] px-[10px] md:px-[30px] py-[40px] relative bg-white mx-auto w-full rounded-[10px] border">
                    {loader && (
                        <Loader />
                    )}
                    <GiThunderSkull size={50} className='mx-auto' />
                    <h2 className='mb-[20px] text-center'>Restricted Area</h2>
                    <Error message={error.message} />
                        <div className="mb-[10px]">
                            <Label
                                title='Email' 
                                htmlFor="Email"
                            />
                            <TextInput
                                value={formInput.email}
                                onChange={(e) => {
                                    setFormInput(prevState => ({ ...prevState, email: e.target.value }));
                                    setError(prevState => ({ ...prevState, email: false, message: "" }));
                                }}
                                placeholder='Email'
                            />
                        </div>
                        <div className='relative mb-[25px]'>
                            <Label
                                title='Password' 
                                htmlFor="password"
                            />
                            <TextInput
                                type={showPass ? "text" : "password"}
                                value={formInput.password}
                                onChange={(e) => {
                                    setFormInput(prevState => ({ ...prevState, password: e.target.value }));
                                    setError(prevState => ({ ...prevState, password: false, message: "" }));
                                }}
                                placeholder='Password'
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
                            label="Sign In"
                            onClick={loginHandler}
                            className='!bg-black hover:!text-white'
                        />
                </div>
            </div>
        </div>
    )
}

export default Login;