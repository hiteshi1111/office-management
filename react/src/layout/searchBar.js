import React, { useEffect, useState } from 'react'
import Search from '../components/custom/search';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '../hooks/useDebounce';
import { Link } from 'react-router-dom';
import Avatar from '../components/custom/avatar';
import { PostRequest } from '../utils/request';
import { chatActions } from '../store/chat-slice';
import { GiLongLeggedSpider } from "react-icons/gi";

const SearchBar = () => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const [searchKey, setSearchKey] = useState("");
    const [searchedResults, setSearchedResults] = useState([]);

    const handleSearch = () => {
        if (searchKey.length > 1) {
            PostRequest(`${process.env.REACT_APP_URL}/user/search/${accountInfo?.data._id}`, {
                searchKey: searchKey?.toLowerCase(),
                adminId: accountInfo?.data.adminId || ""
            }).then(response => {
                setSearchedResults(response.data)
            }).catch(error => {
                console.log("search error >>>", error);
            });
        } else {
            setSearchedResults([])
        }
    };

    useEffect(() => {
        if (searchKey.length === 0){
            setSearchedResults([])
        }
    },[searchKey])
    
    const debouncedSearch = useDebounce(handleSearch, 1000);
        
    return (
        <div className='relative ml-[10px] lg:ml-0'>
            <Search
                value={searchKey}
                placeholder='Search work buddies...'
                onChange={(e) => {
                    setSearchKey(e.target.value);
                    if (e.target.value.length > 2) {
                        debouncedSearch();
                    }
                }}
            />
            <div className='absolute top-[40px] left-[10px] z-[99] bg-white shadow-md w-[90%]'>
                {searchedResults.length > 0 ? (
                    <div className='max-h-[230px] overflow-y-auto scroll-it'>
                        {searchedResults.map((item, i) => (
                            <>
                            <Link
                                key={i} 
                                to="/chat" 
                                onClick={() => {
                                    dispatch(chatActions.setCurrentChat({
                                        convoId: item?.convoId ? item?.convoId : "", 
                                        userData: item, 
                                        settings: item.settings, 
                                        blockedBy: item.blockedBy
                                    }))
                                    setSearchKey("");
                                    setSearchedResults([])
                                    dispatch(chatActions.setAllMessages([]))
                                    dispatch(chatActions.setCurrentChatRequest(null))
                                    setSearchedResults([])
                                    setSearchKey("")

                                }} 
                                className='flex justify-between items-center gap-[10px] py-[5px] px-[10px] hover:bg-[#f5f5f5] w-full cursor-pointer'
                            >
                                <div className='flex items-center gap-[5px]'>
                                    <Avatar 
                                        src={item.blockedBy?.length > 0 ? "" : item.avatar} 
                                        noOnline 
                                    />
                                    <div className='grid'>
                                        <span className='text-[14px]'>{item.fullName}</span>
                                        <span className='text-[12px] text-[#aaa]'>{item.email}</span>
                                    </div>
                                </div>
                            </Link>
                            <hr/>
                            </>
                        ))}
                    </div>
                ) : (
                    searchKey.length > 0 && (
                        <div className='text-center flex justify-center items-center gap-[10px]'>No Results! <GiLongLeggedSpider size={40} /> </div>
                    )
                )}
            </div>
        </div>
    )
}

export default SearchBar