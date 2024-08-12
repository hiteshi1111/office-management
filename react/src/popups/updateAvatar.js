import React, { useState } from 'react';
import ReactModal from '.';
import { FiEdit2 } from "react-icons/fi";
import Avatar from '../components/custom/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from '../store/account-slice';
import { PutRequest } from '../utils/request';

const UpdateAvatar = () => {
    const [open, setOpen] = useState(false);
    const { accountInfo } = useSelector((state) => state.account);
    const [avatar, setavatar] = useState("");
    const dispatch = useDispatch();

    const updateAvatarHandler = () => {
        if (avatar) {
            PutRequest(`${process.env.REACT_APP_URL}/user/${accountInfo?.data._id}`, {avatar}).then((response) => {
                const updatedAavatar = { ...accountInfo.data, avatar: avatar };
                dispatch(accountActions.setAccountInfo({data: updatedAavatar}));
                setOpen(false);
            }).catch((error) => {
                console.log(error, "error")
            })
        }
    }
    
    return (
        <>
            <div className='absolute top-[20px] right-[20px]'>
                <button 
                    title='Update Avatar'
                    onClick={() => setOpen(true)}
                ><FiEdit2 size={15} color='#000000' /></button>
            </div>
            <ReactModal open={open} close={() => setOpen(false)} maxWidth="750px" heading="Update Avatar" padding='20px' >
                <div className="flex flex-wrap gap-[10px] py-[10px] mx-auto">
                    {avatarImages.map((item, i) => (
                        <div key={i} onClick={() => setavatar(item)}>
                            <Avatar
                                src={item}
                                noOnline 
                                size={60}
                                className={`h-[90px] w-[90px] overflow-hidden !border transform hover:scale-105 transition duration-300 cursor-pointer ${avatar === item && "border-[2px] border-[#ff0000]"}`} 
                            />
                        </div>
                    ))}
                </div>   
                <button className='w-full border mt-[30px] h-[40px] bg-[#ff4081] text-white rounded-full' onClick={updateAvatarHandler}>Update</button>
            </ReactModal>
        </>
    )
}

const avatarImages = [
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715775020/avatar4_dqnmvq.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715837910/doctor-with-his-arms-crossed-illustration_632498-1_aikpr6.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715837910/isolated-young-handsome-man-different-poses-white-_ru0l8e.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715833865/young-handsome-man-illustration_632498-26_pkiae2.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715837533/young-handsome-man-illustration_632498-26_1_xnlqac.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715775020/avatar1_flh535.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715775020/avatar6_zhhgdi.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715775019/avatar2_gvyjc3.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715775019/avatar3_meercj.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715838358/reading-relaxing-home-with-book-cat-staying-bed-co_oetwhn.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715838616/feminine-instagram-highlight-cover-woman-character_s9yhyy.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715838615/portrait-beautiful-young-woman-with-short-wavy-hai_byg4oj.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1715935274/cute-sloth-with-moon-cartoon-vector-icon-illustrat_qgcib3.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716032519/7184de87ab93a8d24beccf92aac6392d_c0yukn.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716032635/ee26d63461649b0ca06ce3654b98edbd_dpdotn.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716032774/e5bc852f28bae8e49b4a004f512119ea_r2dycl.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716032789/7e4a4b29a38ad95c31fd12dcecb11e13_scycfm.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033071/758a84ba533c07a2925f206309bee5e0_mvcff7.webp",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033321/download_wy8ziq.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033469/4b82189660cb3ecaffb86546e49b256b_bwp6nw.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033574/d2de8e6a61be99e38ec667bc2dd97a01_el6ca9.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033582/5419a19c4e01ba9ff2d72a2994292949_ms4ky0.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033600/5651c9c238265bc0d3c213a9d59cbb19_nxrlo1.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033831/93493c73d2a567ba4483d31ad2de87b9_ivg0u8.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033881/611112cd812323dcb086de0d126085df_qtslvk.jpg",
    "https://res.cloudinary.com/dixpqlscx/image/upload/v1716033915/42c93be5f2456c26e95e4e1375980132_gpsmfd.jpg"
]

export default UpdateAvatar;