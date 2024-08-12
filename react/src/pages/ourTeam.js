import React from 'react'
import Header from '../layout/header';

const OurTeam = () => {
    return (
        <>
        <Header />
        <div className="md:py-[90px] max-md:py-[50px] text-center bg-[linear-gradient(0deg,#fff_0%,#c5eaf9_100%)] px-[20px] lg:px-[30px]">
            <div className="container mx-auto">
                <div className='md:px-[40px] max-md:px-[15px]'>
                    <h2 className="md:text-[54px] md:leading-[64px] max-md:text-[40px] max-md:leading-[54px] text-[#000] md:mb-[30px] max-md:mb-[20px] max-w-[650px] mx-auto">{data.title}</h2>
                    <p className="md:text-[20px] md:leading-[30px] max-md:text-[18px] max-md:leading-[28px] text-[#6b747b] max-w-[990px] mx-auto">{data.description}</p>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 max-w-[800px] mx-auto mt-[80px] gap-[30px]'>
                    {data.team.map((item, i) => (
                        <div key={i} className='flex flex-col items-center'>
                            <div className='p-[5px] border-[2px] rounded-full shadow-md'>
                                <img
                                    src={item.image}
                                    alt={item.fullName}
                                    title={item.fullName}
                                    className='rounded-full h-[120px] w-[120px]'
                                />
                            </div>
                            <h4>{item.fullName}</h4>
                            <span className='text-[#aaa]'>({item.role})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}

const data = {
    title: "Meet Our Team",
    description: "Here, you'll get to know the incredible individuals behind our company. Each team member brings unique skills, experiences, and passion to our collective mission. From visionary leaders to creative minds, our team is dedicated to driving innovation, delivering exceptional results, and fostering a collaborative environment. Get to know the people who make it all happen!",
    team: [
        {
            fullName: "Er. Hiteshi",
            image: "https://res.cloudinary.com/dixpqlscx/image/upload/v1721113790/Skype_Picture_2024_07_16T07_09_36_567Z_dhv31i.jpg",
            role: "MERN Developer + Designer"
        },
        {
            fullName: "Priyanka",
            image: "https://res.cloudinary.com/dixpqlscx/image/upload/v1721642325/ImportedPhoto_1721641980358_up2tvk.webp",
            role: "MERN Developer"
        },
        {
            fullName: "Sandeep Gautam",
            image: "https://res.cloudinary.com/dixpqlscx/image/upload/v1721880918/Screenshot_20240114-174357_bswzhg.webp",
            role: "MERN Developer"
        },
        {
            fullName: "Navneet",
            image: "https://res.cloudinary.com/dixpqlscx/image/upload/v1721645168/oqtoqybhiq1nu888femv.jpg",
            role: "Designer"
        },
        {
            fullName: "Shobhana",
            image: "https://res.cloudinary.com/dixpqlscx/image/upload/v1721645402/mu6xoocpvsymkuw3jquv.webp",
            role: "Tester"
        }
    ]
}

export default OurTeam;