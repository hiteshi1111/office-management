import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui-slice';

const ChatTheme = () => {
    const dispatch = useDispatch();
    const { chatTheme } = useSelector(state => state.ui);
    return (
        <div className='mb-[30px]'>
            <h5 className="mb-[20px] border-b">Chat Background</h5>
            <div className='flex w-full gap-[20px] lg:gap-[30px] flex-wrap'>
                {themeTypes.map((item, i) => (
                    <button 
                        key={i} 
                        className={`relative overflow-hidden border w-full max-w-[200px] flex items-center justify-center h-[50px] rounded-full ${item.title === chatTheme.title && "border-[#264348]"} ${item.className}` }
                        onClick={() => dispatch(uiActions.setChatTheme(item))}
                    >
                        <div className={`${item.className}`} />
                        <span className={`${item.textColor} ${item.className === chatTheme.className && 'font-semibold'}`}>{item.title}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

const themeTypes = [
    {
        title: "Default",
        className: "bg-[#f5fffa]",
        textColor: "text-black"
    },
    {
        title: "Stone",
        className: "bg-gradient-to-r from-neutral-300 to-stone-400",
        textColor: "text-black"
    },
    {
        title: "Slate",
        className: "bg-gradient-to-r from-slate-300 to-slate-500",
        textColor: "text-white"
    },
    {
        title: "BTS",
        className: "bg-gradient-to-r from-violet-500 to-purple-500",
        textColor: "text-white"
    },
    {
        title: "Barbie",
        className: "bg-gradient-to-r from-violet-200 to-pink-200",
        textColor: "text-black"
    },
    {
        title: "Queen",
        className: "bg-gradient-to-r from-pink-300 to-stone-700",
        textColor: "text-white"
    },
    {
        title: "Aqua",
        className: "bg-gradient-to-br from-cyan-100 to-slate-100",
        textColor: "text-black"
    },
    {
        title: "Waves",
        className: "bg-waves bg-no-repeat",
        textColor: "text-black"
    },
    {
        title: "Black Waves",
        className: "bg-black-waves bg-no-repeat",
        textColor: "text-white"
    }
]

export default ChatTheme;