import React from 'react'
import { IoChevronBackOutline } from 'react-icons/io5';
import { uiActions } from '../../store/ui-slice';
import { useDispatch } from 'react-redux';

const BackButton = () => {
    const dispatch = useDispatch();
    return (
        <button onClick={() => dispatch(uiActions.setDrawer(true))} className='my-[10px] flex md:hidden items-center gap-[5px]'>
            <IoChevronBackOutline size={20} />
            <span>Back</span>
        </button>
    )
}

export default BackButton;