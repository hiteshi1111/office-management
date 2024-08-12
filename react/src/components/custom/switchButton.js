import React from 'react'

const SwitchButton = ({checked=false, onToggle=()=>{}}) => {
  return (
    <>
    <div className='relative w-full flex justify-end' title={checked ? "On" : "Off"}>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onToggle}/>
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
      </label>
    </div>
    </>
  )
}

export default SwitchButton
