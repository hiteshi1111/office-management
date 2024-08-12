import React from 'react';

const Loader = ({className="", loaderCss=""}) => {
    return (
        <div className={`h-full w-full absolute top-[0] left-[0] bottom-0 bg-[#000]/[50%] z-[11] flex justify-center items-center ${className}`}>
            <div className="box-loader relative text-[30px]">
                <div className={`loader-info relative w-[.25em] h-[.5em] text-[#000] ${loaderCss}`}></div>
            </div>
        </div>
    )
}

export default Loader;