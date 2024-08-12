import React from 'react';
import headersmartphone from "../assets/images/header-smartphone.png"
import { Link } from 'react-router-dom';
import Header from '../layout/header';
import { FaApple, FaGooglePlay, FaChevronRight, FaFacebookF, FaTwitter, FaInstagram, FaChevronCircleRight } from "react-icons/fa";
import featuresicon1 from "../assets/images/features-icon-1.svg"
import featuresicon2 from "../assets/images/features-icon-2.svg"
import featuresicon3 from "../assets/images/features-icon-3.svg"
import featuresicon4 from "../assets/images/features-icon-4.svg"
import featuresicon5 from "../assets/images/features-icon-5.svg"
import featuresicon6 from "../assets/images/features-icon-6.svg"
import details1 from "../assets/images/details-1.jpg"
import details2 from "../assets/images/details-2.jpg"
import details3 from "../assets/images/conclusion-smartphone.png"


const Home = () => {
    return (
        <>
            <Header />
            <div className="bg-[linear-gradient(0deg,#fff_0%,#c5eaf9_100%)] md:py-[90px] max-md:py-[50px]">
                <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
                    <div className='lg:grid lg:grid-cols-2 lg:gap-x-8'>
                        <div className="mb-[30px] lg:mt-[40px] xl:mt-40 xl:mr-12 max-lg:text-center">
                            <h1 className="md:text-[54px] md:leading-[64px] max-md:text-[40px] max-md:leading-[54px] text-[#000] md:mb-[30px] max-md:mb-[20px]">Team management web application</h1>
                            <p className="md:text-[20px] md:leading-[30px] max-md:text-[18px] max-md:leading-[28px] text-[#6b747b] md:mb-[40px] max-md:mb-[30px]">Welcome to Mantaraa, the ultimate platform for efficient team management. With Mantaraa, company admins can create employee profiles, chat directly with team members, and seamlessly assign and track tasks. Simplify your workplace communication and boost productivity with Mantaraa today.</p>
                            <div className='flex flex-wrap gap-[10px] max-lg:justify-center'>
                                <Link className="inline-flex justify-center items-center gap-[5px] border border-[#594cda] text-[#fff] bg-[#594cda] hover:text-[#594cda] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full" href="#"><FaChevronCircleRight size={16} />Get started</Link>
                                <Link className="inline-flex justify-center items-center gap-[5px] border border-[#eb427e] text-[#fff] bg-[#eb427e] hover:text-[#eb427e] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full" href="#"><FaChevronCircleRight size={16} />Contact Us</Link>
                            </div>
                        </div>
                        <div className="lg:text-right max-lg:text-center">
                            <img className="inline" src={headersmartphone} alt="alternative" />
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Introduction --> */}
            <div className="md:pb-[90px] max-md:pb-[50px] text-center bg-[#fff]">
                <div className="container mx-auto">
                    <div className='md:px-[40px] max-md:px-[15px]'>
                        <p className="text-gray-800 md:text-[30px] md:leading-[40px] max-md:text-[24px] max-md:leading-[34px] lg:max-w-6xl lg:mx-auto">Discover a streamlined approach to company management. With Mantaraa, effortlessly create and manage employee profiles, communicate through integrated chat, and efficiently assign and track tasks. Transform your workplace for better productivity and collaboration.</p>
                    </div>
                </div>
            </div>
            {/* <!-- end of introduction --> */}

            {/* <!-- Features --> */}
            <div className="md:pb-[90px] max-md:pb-[50px] bg-[#fff]">
                <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
                    <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-[20px] max-w-[1240px] mx-auto'>
                        <div className="p-[30px] bg-[#f1f9fc] rounded-[15px] text-center">
                            <div className="md:mb-[20px] max-md:mb-[10px]">
                                <img src={featuresicon1} alt="alternative" className='md:w-[70px] md:h-[70px] max-md:w-[50px] max-md:h-[50px] mx-auto' />
                            </div>
                            <div className="card-body">
                                <h5 className="text-[#000] md:mb-[10px] max-md:mb-[5px]">Platform Integration</h5>
                                <p className="text-[16px] text-[#6b747b] mb-0">You sales force can use the app on any smartphone platform without compatibility issues</p>
                            </div>
                        </div>
                        <div className="p-[30px] bg-[#f1f9fc] rounded-[15px] text-center">
                            <div className="md:mb-[20px] max-md:mb-[10px]">
                                <img src={featuresicon2} alt="alternative" className='md:w-[70px] md:h-[70px] max-md:w-[50px] max-md:h-[50px] mx-auto' />
                            </div>
                            <div className="card-body">
                                <h5 className="text-[#000] md:mb-[10px] max-md:mb-[5px]">Easy On Resources</h5>
                                <p className="text-[16px] text-[#6b747b] mb-0">Works smoothly even on older generation hardware due to our optimization efforts</p>
                            </div>
                        </div>
                        <div className="p-[30px] bg-[#f1f9fc] rounded-[15px] text-center">
                            <div className="md:mb-[20px] max-md:mb-[10px]">
                                <img src={featuresicon3} alt="alternative" className='md:w-[70px] md:h-[70px] max-md:w-[50px] max-md:h-[50px] mx-auto' />
                            </div>
                            <div className="card-body">
                                <h5 className="text-[#000] md:mb-[10px] max-md:mb-[5px]">Great Performance</h5>
                                <p className="text-[16px] text-[#6b747b] mb-0">Optimized code and innovative technology insure no delays and ultra-fast responsiveness</p>
                            </div>
                        </div>
                        <div className="p-[30px] bg-[#f1f9fc] rounded-[15px] text-center">
                            <div className="md:mb-[20px] max-md:mb-[10px]">
                                <img src={featuresicon4} alt="alternative" className='md:w-[70px] md:h-[70px] max-md:w-[50px] max-md:h-[50px] mx-auto' />
                            </div>
                            <div className="card-body">
                                <h5 className="text-[#000] md:mb-[10px] max-md:mb-[5px]">Multiple Languages</h5>
                                <p className="text-[16px] text-[#6b747b] mb-0">Choose from one of the 40 languages that come pre-installed and start selling smarter</p>
                            </div>
                        </div>
                        <div className="p-[30px] bg-[#f1f9fc] rounded-[15px] text-center">
                            <div className="md:mb-[20px] max-md:mb-[10px]">
                                <img src={featuresicon5} alt="alternative" className='md:w-[70px] md:h-[70px] max-md:w-[50px] max-md:h-[50px] mx-auto' />
                            </div>
                            <div className="card-body">
                                <h5 className="text-[#000] md:mb-[10px] max-md:mb-[5px]">Free Updates</h5>
                                <p className="text-[16px] text-[#6b747b] mb-0">Don't worry about future costs, pay once and receive all future updates at no extra cost</p>
                            </div>
                        </div>
                        <div className="p-[30px] bg-[#f1f9fc] rounded-[15px] text-center">
                            <div className="md:mb-[20px] max-md:mb-[10px]">
                                <img src={featuresicon6} alt="alternative" className='md:w-[70px] md:h-[70px] max-md:w-[50px] max-md:h-[50px] mx-auto' />
                            </div>
                            <div className="card-body">
                                <h5 className="text-[#000] md:mb-[10px] max-md:mb-[5px]">Community Support</h5>
                                <p className="text-[16px] text-[#6b747b] mb-0">Register the app and get acces to knowledge and ideas from the Pavo online community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- end of features --> */}

            {/* <!-- Details 1 --> */}
            <div className="bg-[#fff] md:pb-[90px] max-md:pb-[50px]">
                <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
                    <div className='lg:grid lg:grid-cols-12 lg:gap-x-12'>
                        <div className="lg:col-span-5">
                            <div className="lg:mb-0 xl:mt-[60px] mb-[30px] max-lg:text-center">
                                <h2 className="md:text-[34px] max-md:text-[30px] text-[#000] md:mb-[30px] max-md:mb-[20px]">Results driven ground breaking technology</h2>
                                <p className="md:text-[20px] max-md:text-[16px] md:leading-[30px] max-md:leading-[27px] text-[#6b747b] mb-[15px]">Based on our team's extensive experience in developing line of business applications and constructive customer feedback we reached a new level of revenue.</p>
                                <p className="md:text-[20px] max-md:text-[16px] md:leading-[30px] max-md:leading-[27px] text-[#6b747b] mb-0">We enjoy helping small and medium sized tech businesses take a shot at established Fortune 500 companies</p>
                            </div>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="xl:ml-14 lg:text-right max-lg:text-center">
                                <img className="inline" src={details1} alt="alternative" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Details 2 --> */}
            <div className="bg-[#fff] md:pb-[90px] max-md:pb-[50px]">
                <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
                    <div className='grid lg:grid-cols-12 lg:gap-x-12'>
                        <div className="lg:col-span-7 max-lg:order-2">
                            <div className="xl:mr-14 lg:text-left max-lg:text-center">
                                <img className="inline" src={details2} alt="alternative" />
                            </div>
                        </div>
                        <div className="lg:col-span-5 max-lg:order-1">
                            <div className="lg:mb-0 xl:mt-[15px] mb-[30px] max-lg:text-center">
                                <h2 className="md:text-[34px] max-md:text-[30px] text-[#000] md:mb-[30px] max-md:mb-[20px]">Instant results for the marketing department</h2>
                                <p className="md:text-[20px] max-md:text-[16px] md:leading-[30px] max-md:leading-[27px] text-[#6b747b] mb-[15px]">Based on our team's extensive experience in developing line of business applications and constructive customer feedback we reached a new level of revenue.</p>
                                <ul className="list mb-[30px] space-y-2 max-lg:text-left">
                                    <li className="flex gap-[4px] items-baseline">
                                        <FaChevronRight />
                                        <div>
                                            <p className='text-[16px] leading-[27px] text-[#6b747b]'>Features that will help you and your marketers</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-[4px] items-baseline">
                                        <FaChevronRight />
                                        <div>
                                            <p className='text-[16px] leading-[27px] text-[#6b747b]'>Smooth learning curve due to the knowledge base</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-[4px] items-baseline">
                                        <FaChevronRight />
                                        <div>
                                            <p className='text-[16px] leading-[27px] text-[#6b747b]'>Ready out-of-the-box with minor setup settings</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className='flex flex-wrap gap-[10px] max-lg:justify-center'>
                                    <Link className="inline-flex justify-center items-center gap-[5px] border border-[#594cda] text-[#fff] bg-[#594cda] hover:text-[#594cda] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full" href="#"><FaApple />Download</Link>
                                    <Link className="inline-flex justify-center items-center gap-[5px] border border-[#eb427e] text-[#fff] bg-[#eb427e] hover:text-[#eb427e] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full" href="#"><FaGooglePlay />Download</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- CDN Section --> */}
            <div className="md:py-[90px] max-md:py-[50px] text-center bg-[#f1f9fc]">
                <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
                    <div className='mb-[40px]'>
                        <h2 className="md:text-[34px] max-md:text-[30px] text-[#000] mb-[20px]">Start your free trial today</h2>
                        <p className="font-medium text-gray-800 md:text-[16px] md:leading-[27px] max-w-[800px] mx-auto">Try Landwind Platform for 30 days. No credit card required.</p>
                    </div>
                    <div>
                        <Link className="inline-flex justify-center items-center gap-[5px] border border-[#eb427e] text-[#fff] bg-[#eb427e] hover:text-[#eb427e] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full mb-[15px]" href="#"><FaChevronCircleRight />Free trial</Link>
                    </div>
                </div>
            </div>

            {/* <!-- Pricing --> */}
            <div className="md:py-[90px] max-md:py-[50px] text-center bg-[#fff]">
                <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
                    <div className='mb-[40px]'>
                        <h2 className="md:text-[34px] max-md:text-[30px] text-[#000] mb-[20px]">Pricing options for all budgets</h2>
                        <p className="font-medium text-gray-800 md:text-[16px] md:leading-[27px] max-w-[800px] mx-auto"> Team management mobile apps don’t get better than Pavo. It’s probably the best app in the world for this purpose. Don’t hesitate to give it a try today and you will fall in love with it</p>
                    </div>
                    <div className='space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0'>
                        <div className='flex flex-col p-[30px] text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow'>
                            <h3 className="mb-[20px] text-[26px] font-semibold text-[#000]">Starter</h3>
                            <p className="text-[18px] text-[#6b747b] max-w-[290px] mx-auto">Best option for personal use &amp; for your next project.</p>
                            <div className="flex items-baseline justify-center my-8">
                                <span className="mr-2 md:text-[50px] md:leading-[50px] max-md:text-[35px] max-md:leading-[35px] font-extrabold">₹2500</span>
                                <span className="text-gray-500 text-[18px]">/month</span>
                            </div>
                            <ul className="mb-[40px] space-y-4 text-left text-[16px]">
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Individual configuration</span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>No setup, or hidden fees</span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Team size: <span className="font-semibold">1 developer</span></span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Premium support: <span className="font-semibold">6 months</span></span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Free updates: <span className="font-semibold">6 months</span></span>
                                </li>
                            </ul>
                            <div>
                                <Link className="inline-flex justify-center items-center gap-[5px] border border-[#eb427e] text-[#fff] bg-[#eb427e] hover:text-[#eb427e] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full mb-[15px]" href="#"><FaGooglePlay />Download</Link>
                            </div>
                        </div>
                        <div className='flex flex-col p-[30px] text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow'>
                            <h3 className="mb-[20px] text-[26px] font-semibold text-[#000]">Starter</h3>
                            <p className="text-[18px] text-[#6b747b] max-w-[290px] mx-auto">Best option for personal use &amp; for your next project.</p>
                            <div className="flex items-baseline justify-center my-8">
                                <span className="mr-2 md:text-[50px] md:leading-[50px] max-md:text-[35px] max-md:leading-[35px] font-extrabold">₹4500</span>
                                <span className="text-gray-500 text-[18px]">/month</span>
                            </div>
                            <ul className="mb-[40px] space-y-4 text-left text-[16px]">
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Individual configuration</span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>No setup, or hidden fees</span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Team size: <span className="font-semibold">10 developer</span></span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Premium support: <span className="font-semibold">24 months</span></span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Free updates: <span className="font-semibold">24 months</span></span>
                                </li>
                            </ul>
                            <div>
                                <Link className="inline-flex justify-center items-center gap-[5px] border border-[#eb427e] text-[#fff] bg-[#eb427e] hover:text-[#eb427e] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full mb-[15px]" href="#"><FaGooglePlay />Download</Link>
                            </div>
                        </div>
                        <div className='flex flex-col p-[30px] text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow'>
                            <h3 className="mb-[20px] text-[26px] font-semibold text-[#000]">Enterprise</h3>
                            <p className="text-[18px] text-[#6b747b] max-w-[290px] mx-auto">Best option for personal use &amp; for your next project.</p>
                            <div className="flex items-baseline justify-center my-8">
                                <span className="mr-2 md:text-[50px] md:leading-[50px] max-md:text-[35px] max-md:leading-[35px] font-extrabold">₹9000</span>
                                <span className="text-gray-500 text-[18px]">/month</span>
                            </div>
                            <ul className="mb-[40px] space-y-4 text-left text-[16px]">
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Individual configuration</span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>No setup, or hidden fees</span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Team size: <span className="font-semibold">100+ developer</span></span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Premium support: <span className="font-semibold">36 months</span></span>
                                </li>
                                <li className="flex items-baseline space-x-2">
                                    <FaChevronRight className='text-[#594cda]' />
                                    <span>Free updates: <span className="font-semibold">36 months</span></span>
                                </li>
                            </ul>
                            <div>
                                <Link className="inline-flex justify-center items-center gap-[5px] border border-[#eb427e] text-[#fff] bg-[#eb427e] hover:text-[#eb427e] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full mb-[15px]" href="#"><FaGooglePlay />Download</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- end of Pricing --> */}

            {/* <!-- Details 3 --> */}
            <div className="bg-[#fff] md:pb-[90px] max-md:pb-[50px]">
                <div className="container mx-auto md:px-[40px] max-md:px-[15px]">
                    <div className='grid lg:grid-cols-12 lg:gap-x-12 items-center'>
                        <div className="lg:col-span-7 max-lg:order-2">
                            <div className="text-center">
                                <img className="inline" src={details3} alt="alternative" />
                            </div>
                        </div>
                        <div className="lg:col-span-5 max-lg:order-1">
                            <div className="lg:mb-0 mb-[30px] max-lg:text-center">
                                <h2 className="md:text-[34px] max-md:text-[30px] text-[#000] md:mb-[30px] max-md:mb-[20px]">Team management mobile applications don’t get much better than Pavo. Download it today</h2>
                                <p className="md:text-[20px] max-md:text-[16px] md:leading-[30px] max-md:leading-[27px] text-[#6b747b] mb-0">We enjoy helping small and medium sized tech businesses take a shot at established Fortune 500 companies</p>
                                <div className='flex flex-wrap gap-[10px] max-lg:justify-center mt-[30px] md:pt-[10px]'>
                                    <Link className="inline-flex justify-center items-center gap-[5px] border border-[#594cda] text-[#fff] bg-[#594cda] hover:text-[#594cda] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full" href="#"><FaApple />Download</Link>
                                    <Link className="inline-flex justify-center items-center gap-[5px] border border-[#eb427e] text-[#fff] bg-[#eb427e] hover:text-[#eb427e] hover:bg-[#fff] md:px-[15px] md:py-[12px] max-md:px-[10px] max-md:py-[10px] text-[16px] leading-[27px] font-medium md:w-[180px] max-md:w-[150px] text-center rounded-full" href="#"><FaGooglePlay />Download</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
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
                            <div className="flex flex-wrap justify-center gap-[15px] mb-4 p-small">
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

export default Home;