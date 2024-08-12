import React, { useState } from 'react'
import Header from '../layout/header';
import Footer from '../layout/footer';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { checkEmptyFields, validateEmail, validatePhone } from '../utils/formValidation';
import Label from '../components/custom/label';
import TextInput from '../components/custom/textInput';
import Textarea from '../components/custom/textarea';
import Button from '../components/custom/button';
import { PostRequest } from '../utils/request';
import Error from '../components/custom/error';
import { FiThumbsUp } from "react-icons/fi";

const Contact = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false)
  const [formInput, setFormInput] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const nameHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
    setFormInput((prevState) => ({
      ...prevState,
      [name]: cleanedValue
    }));
    setError("");
  };

  const emailHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(" ", "").toLowerCase();
    setFormInput((prevState) => ({
      ...prevState,
      [name]: cleanedValue
    }));
    setError("");
  };

  const phoneHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/\D/g, '');
    setFormInput((prevState) => ({
      ...prevState,
      [name]: cleanedValue
    }))
    setError("");
  }

  const messageHandler = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = () => {
    if (checkEmptyFields(formInput)) {
      setError("Field must not be empty");
    } else if (!validateEmail(formInput.email)) {
      setError("Email is invalid");
    } else if (!validatePhone(formInput.phone)) {
      setError("Phone number is invalid");
    } else {
      PostRequest(`${process.env.REACT_APP_URL}/contact`, formInput).then((response) => {
        setSuccess(true)
        setFormInput({
          fullName: "",
          email: "",
          phone: "",
          message: "",
        })
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      }).catch((error) => {
        setError(error.data.error)
      })
    }
  };

  return (
    <>
      <Header />
      {/* <!-- Hero Section --> */}
      <div className="md:py-[90px] max-md:py-[50px] text-center bg-[linear-gradient(0deg,#fff_0%,#c5eaf9_100%)]">
        <div className="container mx-auto">
          <div className='md:px-[40px] max-md:px-[15px]'>
            <h2 className="md:text-[54px] md:leading-[64px] max-md:text-[40px] max-md:leading-[54px] text-[#000] md:mb-[30px] max-md:mb-[20px] max-w-[650px] mx-auto">Connect with us and join the conversation!</h2>
            <p className="md:text-[20px] md:leading-[30px] max-md:text-[18px] max-md:leading-[28px] text-[#6b747b] max-w-[990px] mx-auto">
              Your satisfaction is of paramount importance to us, and your feedback, questions, or concerns are always welcome. We are committed to providing you with the support you need, whether you have.
            </p>
          </div>
        </div>
      </div>
      {/* <!-- end of Hero Section  --> */}

      {/* Contact info */}
      <div className="md:pb-[90px] max-md:pb-[50px] bg-[#fff]">
        <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
          <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-[20px] max-w-[1240px] mx-auto'>
            <div className="p-[30px] bg-[#f1f9fc] rounded-[15px]">
              <div className="md:mb-[20px] max-md:mb-[10px]">
                <FaMapMarkedAlt size={32} />
              </div>
              <div className="card-body">
                <h5 className="text-[20px] text-[#000] mb-[10px]">Office</h5>
                <p className="text-[16px] text-[#6b747b] mb-[15px]">Come say hello at our office optix</p>
                <p className="text-[16px] text-[#000] mb-0">2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
              </div>
            </div>
            <div className="p-[30px] bg-[#f1f9fc] rounded-[15px]">
              <div className="md:mb-[20px] max-md:mb-[10px]">
                <FaEnvelope size={32} />
              </div>
              <div className="card-body">
                <h5 className="text-[22px] text-[#000] mb-[10px]">Email</h5>
                <p className="text-[16px] text-[#6b747b] mb-[15px]">Get in touch & say hello</p>
                <p className="text-[16px] text-[#6b747b] mb-0"><Link to="mailto:" className='text-[#000]'>tim.jennings@example.com</Link></p>
              </div>
            </div>
            <div className="p-[30px] bg-[#f1f9fc] rounded-[15px]">
              <div className="md:mb-[20px] max-md:mb-[10px]">
                <FaPhoneAlt size={32} />
              </div>
              <div className="card-body">
                <h5 className="text-[22px] text-[#000] mb-[10px]">Phone</h5>
                <p className="text-[16px] text-[#6b747b] mb-[15px]">Monday - Friday from 9 am to 6 pm</p>
                <p className="text-[16px] text-[#6b747b] mb-0"><Link to="mailto:" className='text-[#000]'>+1-480-555-0103</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- end contact --> */}

      <div className="md:pb-[90px] max-md:pb-[20px] bg-[#fff]">
        <div className="container mx-auto">
          {success ?
            <div className="py-24 text-center ">
              <div className="text-center py-20">
                <h2>Thank You</h2>
                <p className='text-[20px] text-[#008000] font-bold'>We have received your message.</p>
                <FiThumbsUp size={80} className='mx-auto' />
              </div>
              <p className='text-[16px] font-bold'>You will be contacted soon by one of our team member.</p>
            </div>
            :
            <div className='md:px-[40px] max-md:px-[15px]'>
              <h2 className="md:text-[34px] max-md:text-[30px] text-[#000] md:mb-[30px] max-md:mb-[20px] text-center">Send us a message</h2>
              <div className='max-w-[750px] mx-auto'>
                {error && <Error message={error} />}

                <div className="mb-[15px] mt-[5px]">
                  <Label title='Full Name' isImportant className='block text-[16px] mb-[3px]' />
                  <TextInput
                    name="fullName"
                    value={formInput.fullName}
                    onChange={nameHandler}
                    maxLength={30}
                  />
                </div>
                <div className="mb-[15px]">
                  <Label title='Enter Your Email' isImportant className='block text-[16px] mb-[3px]' />
                  <TextInput
                    name="email"
                    value={formInput.email}
                    onChange={emailHandler}
                    maxLength={50}
                  />
                </div>
                <div className="mb-[15px]">
                  <Label title='Enter Your Phone' isImportant className='block text-[16px] mb-[3px]' />
                  <TextInput
                    name="phone"
                    value={formInput.phone}
                    onChange={phoneHandler}
                    maxLength={10}
                  />
                </div>
                <div className="mb-[15px]">
                  <Label title='Enter Your Message' isImportant className='block text-[16px] mb-[3px]' />
                  <Textarea
                    name="message"
                    value={formInput.message}
                    onChange={messageHandler}
                    maxLength={300}
                  />
                </div>
                <div>
                  <Button className='inline-flex justify-center items-center gap-[5px] border border-[#594cda] text-[#fff] !bg-[#594cda] hover:text-[#594cda] hover:!bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[8px] text-[16px] leading-[27px] font-medium text-center rounded-full h-auto' label={`Send Message`} onClick={handleSubmit} />
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <Footer />
    </>
  )
}
export default Contact;