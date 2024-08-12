import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../../store/ui-slice';

const LayoutTheme = () => {
    const dispatch = useDispatch();
    const { currentTheme } = useSelector(state => state.ui);
    return (
        <div className='mb-[30px]'>
            <h5 className="mb-[20px] border-b">Layout Background</h5>
            <div className='flex w-full gap-[20px] lg:gap-[30px] flex-wrap'>
                {themeTypes.map((item, i) => (
                    <button 
                        key={i} 
                        className={`border w-full max-w-[200px] flex items-center justify-center h-[50px] relative rounded-full overflow-hidden shadow-md ${item.className === currentTheme && "border-[#264348]"}`}
                        onClick={() => dispatch(uiActions.setCurrentTheme(item.className))}
                    >
                        <div className={`${item.className}`} />
                        <span className={item.className === currentTheme && 'font-semibold'}>{item.title}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

const themeTypes = [
    {
        title: "Solid",
        className: ""
    },
    {
        title: "Branches",
        className: "bg-branches"
    },
    {
        title: "Filled Floral",
        className: "bg-floral-filled"
    },
    {
        title: "Outlined Floral",
        className: "bg-floral-outlined"
    },
    {
        title: "Brick Wall",
        className: "bg-brick"
    },
    {
        title: "Red Glass",
        className: "bg-red-glass"
    },
    {
        title: "Doodle",
        className: "bg-doodle"
    }
]

export default LayoutTheme;