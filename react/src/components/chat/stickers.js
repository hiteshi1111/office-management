import React, { useEffect, useState } from 'react';
import { GiHollowCat } from "react-icons/gi";
import { IoIosClose } from 'react-icons/io';
import Search from '../custom/search';
import { useDispatch, useSelector } from 'react-redux';
import { PostRequest } from '../../utils/request';
import ChatSocket from "../../socket/chat-socket";
import { chatActions } from '../../store/chat-slice';
import stickersList from "../../data/stickers.json";

const Stickers = ({setOpenSticker=()=>{}}) => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { currentChat } = useSelector((state) => state.chat);

    const [filteredStickers, setFilteredStickers] = useState(stickersList);
    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        if (searchKey.length > 0){
            const filtered = stickersList.filter(index => {
                return index.keyword.includes(searchKey)
            });
            setFilteredStickers(filtered)
        }else{
            setFilteredStickers(stickersList)
        }
    },[searchKey])

    function sendStickerHandler(sticker) {
        const formData = new FormData();
        formData.append('conversationId', currentChat?.convoId);
        formData.append('from', accountInfo?.data._id);
        formData.append('to', currentChat?.userData._id);
        formData.append('message', "");
        formData.append('image', sticker);
        setSearchKey("")
        setOpenSticker(false)
        PostRequest(`${process.env.REACT_APP_URL}/message`, formData).then(response => {
            ChatSocket.emitNewMessage(response.data.message, accountInfo?.data);
            dispatch(chatActions.setMessage(""))
        }).catch(error => {
            console.log("send sticker error >>>", error);
        });
    }

    return (
        <div className='bg-white border-x rounded-t-[20px]'>
            <div className='flex justify-between items-center gap-[10px] mx-[10px]'>
                <Search
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder='Search your pookie...'
                    className='max-w-[200px] mt-[5px]'
                />
                <IoIosClose
                    size={25}
                    className='cursor-pointer'
                    onClick={() => setOpenSticker(false)}
                    title="close"
                />
            </div>
            {filteredStickers.length > 0 ? (
                <div className='mx-[10px] border-b p-[10px] flex gap-[10px] flex-wrap max-h-[200px] overflow-hidden overflow-y-scroll mt-[5px]'>
                    {filteredStickers.map((item, i) => (
                        <button key={i} onClick={() => sendStickerHandler(item.sticker)} className='max-w-[150px] max-h-[150px] h-auto border relative overflow-hidden'>
                            <img
                                src={item.sticker}
                                alt="Selected"
                                className='object-contain'
                            />
                        </button>
                    ))}
                </div>
            ):(
                searchKey?.length > 0 ? (
                    <p className='text-center w-full py-[10px]'>No Results!</p>
                ):(
                    <p className='text-center w-full py-[10px] flex justify-center items-center gap-[5px]'> <GiHollowCat size={20} color='#800080' /> Pookies Loading...</p>
                )
            )}
        </div>
    )
}

export default Stickers;