import React from 'react'
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";


const footer = () => {
  return (
    <>
      {/* <!-- Footer --> */}
      <div className="footer bg-[linear-gradient(180deg,#fff_0%,#c5eaf9_100%)] pt-[70px]">
        <div className="container mx-auto md:px-[40px] max-md:px-[15px] md:pb-[50px] max-md:pb-[20px]">
          <h4 className="md:mb-[40px] max-md:mb-[30px] text-center lg:max-w-3xl lg:mx-auto text-[#000]">Mantaraa is a web application for office management and you can reach our team at <Link className="text-indigo-600 hover:text-gray-500" to="mailto:email@domain.com">email@domain.com</Link></h4>
          <div className="flex justify-center gap-[10px]">
            <Link to="#" className="inline-flex justify-center items-center bg-[#fff] hover:bg-[#000] hover:text-[#fff] w-[48px] h-[48px] rounded-full">
              <FaFacebookF size={22} />
            </Link>
            <Link to="#" className="inline-flex justify-center items-center bg-[#fff] hover:bg-[#000] hover:text-[#fff] w-[48px] h-[48px] rounded-full">
              <FaTwitter size={22} />
            </Link>
            <Link to="#" className="inline-flex justify-center items-center bg-[#fff] hover:bg-[#000] hover:text-[#fff] w-[48px] h-[48px] rounded-full">
              <FaInstagram size={22} />
            </Link>
          </div>
        </div>
        {/* <!-- Copyright -->  */}
        <div className="copyright py-[20px]">
          <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
            <div className='lg:grid lg:grid-cols-2'>
              <div className="flex flex-wrap justify-center p-small">
                <div className="mb-2"><Link to="#" className='text-[#6b747b] mr-[20px] mb-[5px]'>Refund Policy</Link></div>
                <div className="mb-2"><Link to="#" className='text-[#6b747b] mr-[20px] mb-[5px]'>Terms & Conditions</Link></div>
                <div className="mb-2"><Link to="#" className='text-[#6b747b] mb-[5px]'>Privacy Policy</Link></div>
              </div>
              <p className="py-[10px] p-small text-center text-[#6b747b]">Copyright © 2024 <Link to="#" className="no-underline">Mantaraa</Link></p>
            </div>
          </div>
        </div>
        {/* <!-- end of copyright --> */}
      </div>
      {/* <!-- end of footer --> */}
    </>
  )
}

export default footer
