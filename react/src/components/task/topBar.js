import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetRequest } from "../../utils/request";
import Avatar from "../custom/avatar";
import { taskActions } from "../../store/task-slice";
import Search from "../custom/search";
import { CgMenuLeft } from "react-icons/cg";
import { uiActions } from "../../store/ui-slice";

export default function TaskTopBar() {
    const dispatch = useDispatch();
    const { activeProject, assignees, projectTrigger } = useSelector((state) => state.task);
    const [searchKey, setSearchKey] = useState("");
    const [searchedResults, setSearchedResults] = useState(assignees);
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        if (activeProject?._id) {
            GetRequest(`${process.env.REACT_APP_URL}/project/assignee/${activeProject?._id}`).then(response => {
                dispatch(taskActions.setAssignees(response.data))
                setSearchedResults(response.data)
            }).catch(error => {
                console.log("err getting assignees list >", error);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeProject, projectTrigger])

    useEffect(() => {
        if (searchKey.length > 0) {
            const allAssigness = assignees.filter(item => {
                return item.fullName.toLowerCase().includes(searchKey.toLowerCase())
            })
            setSearchedResults(allAssigness)
        } else {
            setSearchedResults(assignees)
        }
    }, [searchKey, assignees])

    return (
        <div className='flex items-center justify-between w-full'>
            <div className='flex items-center justify-start gap-[10px] w-[40%]'>
                <CgMenuLeft size={35} onClick={() => dispatch(uiActions.setDrawer(true))} className="lg:hidden cursor-pointer" />
                <div className='text-[20px] text-left font-bold capitalize w-full text-[#264348]'>{activeProject?.title}</div>
            </div>
            <div className="flex relative cursor-pointer w-[60%] justify-end max-md:mr-[10px] md:mr-[20px] lg:mr-[30px]">
                {assignees.length > 0 && assignees.slice(0, 3).map((item, i) => (
                    item && (
                        <Avatar
                            key={i}
                            src={item?.avatar}
                            alt={item?.fullName}
                            className={`ml-[-10px] first:ml-0 bg-white`}
                            noOnline
                        />
                    )
                ))}
                {assignees.length > 3 && (
                    <button
                        onClick={() => setShow(prev => !prev)}
                        className='font-semibold h-[40px] w-[40px] flex justify-center items-center border border-[#aaa] rounded-full bg-white ml-[-10px] relative'
                    >
                        +{assignees.length - 3}
                    </button>
                )}
                <div onMouseLeave={() => setShow(false)} className={`bg-[#f8f4ff] absolute p-4 z-[20] w-full max-w-[250px] right-0 top-[40px] shadow-lg ${show ? "block" : "hidden"}`}>
                    <div className='px-[5px] pb-2'>
                        <Search
                            value={searchKey}
                            placeholder='Search work buddies'
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>
                    {searchedResults.length > 0 ? (
                        <div className='grid grid-cols-5 gap-[5px] pt-2 max-h-[250px] overflow-hidden overflow-y-auto'>
                            {searchedResults.map((item, i) => (
                                <Avatar
                                    key={i}
                                    src={item.avatar}
                                    noOnline
                                    title={item?.fullName}
                                />
                            ))}
                        </div>
                    ) : (
                        searchKey.length > 0 && (
                            <div className='text-center py-[10px]'>No Results!</div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}