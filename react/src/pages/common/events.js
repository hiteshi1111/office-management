import 'react-calendar/dist/Calendar.css';
import React, { useEffect, useState } from 'react';
import ReactCalendar from 'react-calendar';
import { useDispatch, useSelector } from 'react-redux';

import kitty from "../../assets/icons/kitty.svg";
import TextInput from '../../components/custom/textInput';
import { DeleteRequest, GetRequest, PostRequest, PutRequest } from '../../utils/request';
import UpdateEvent from '../../popups/updateEvent';
import Delete from '../../popups/deleteEvent';
import Error from '../../components/custom/error';
import Layout from '../../layout';
import { eventActions } from '../../store/event-slice';
import Button from '../../components/custom/button';

const Events = () => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { events } = useSelector((state) => state.event);
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventName, setEventName] = useState("");
    const [trigger, setTrigger] = useState(0);
    const [loading, setLoading] = useState(true);

    const role = accountInfo?.data.role.title.toLowerCase();
    const [error, setError] = useState("")
    
    const clickDateHandler = (date) => {
        setSelectedDate(new Date(date));
    };

    useEffect(() => {
        setLoading(true);
        if (accountInfo){
            GetRequest(`${process.env.REACT_APP_URL}/event/${accountInfo?.data.adminId || accountInfo?.data._id}`).then((response) => {
                const eventsWithDates = response?.data.map(event => ({
                    ...event,
                    eventDate: new Date(event.eventDate)
                }));
                dispatch(eventActions.setEvents(eventsWithDates))
                setLoading(false);
            }).catch((error) => {
                console.log(error, "fetch events error");
                setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, accountInfo]);

    // Creating a new event
    const createEventHandler = () => {
        if(!eventName){
            setError("Field must not be empty")
        }else{
            PostRequest(`${process.env.REACT_APP_URL}/event/${accountInfo?.data._id}`, {
                label: eventName,
                eventDate: selectedDate
            }).then((response) => {
                const newEvent = { ...response.data, eventDate: new Date(response.data.eventDate) };
                dispatch(eventActions.setEvents([...events, newEvent]))
                setSelectedDate(null);
                setEventName("");
                setTrigger(prev => prev + 1);
            }).catch((error) => {
                console.log(error, "add event error");
            });
        }
    };

    // Updating an event
    const updateEventHandler = ({ id, label }) => {
        PutRequest(`${process.env.REACT_APP_URL}/event/${id}`, { label }).then((response) => {
            setTrigger(prev => prev + 1);
        }).catch((error) => {
            console.log(error, "update event error");
        });
    };

    // Deleting an event
    const deleteEventHandler = (id) => {
        DeleteRequest(`${process.env.REACT_APP_URL}/event/${id}`).then((response) => {
            setTrigger(prev => prev + 1);
        }).catch((error) => {
            console.log(error, "remove event error");
        });
    };

    return (
        <Layout>
            <div className='pt-[30px] lg:pt-[50px] w-full' />
            <ReactCalendar
                value={selectedDate}
                onClickDay={clickDateHandler}
                tileClassName={({ date }) =>
                    selectedDate &&
                    date.toDateString() === selectedDate.toDateString()
                        ? "!bg-[#ff4081] text-white"
                        : events?.length>0 && events.some((event) => event.eventDate.toDateString() === date.toDateString())
                            ? "!bg-[#264348] text-white"
                            : ""
                }
                className="!w-full"
            />
            <div className="mt-[30px] py-[50px]">
                {role === "admin" && (
                    <div>
                        <div className='flex gap-[10px] item-center'>
                            <img
                                src={kitty}
                                alt="kitty"
                                className='max-w-[100px] w-full h-auto'
                            />
                            <h2 className='my-auto'>Create Event</h2>
                        </div>
                        {selectedDate ? (
                            <div className='mt-[30px] mx-auto max-w-[700px] w-full'>
                                <div>
                                    {error && <Error message={error}/>}
                                    <p>Selected Date: {selectedDate.toDateString()}</p>
                                    <div className='flex max-md:flex-col gap-[10px] mt-[10px]'>
                                        <TextInput
                                            type="text"
                                            placeholder="Event Name"
                                            value={eventName}
                                            onChange={(e) => {
                                                setEventName(e.target.value); 
                                                setError("")
                                            }}
                                            className='max-md:w-full w-[80%]'
                                            maxLength={30}
                                        />
                                        <Button 
                                            label='Add Event'
                                            onClick={createEventHandler}
                                            secondary
                                            className='w-[10%] max-w-[200px]'
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className='mt-[30px] text-center'>---Select Date to Add Event---</p>
                        )}
                    </div>
                )}
                <div className={role === "admin" ? "mt-[50px]" : "mt-0"}>
                    <h2>All Events</h2>
                    {loading ? (
                        <div className="text-center mt-[30px]">Loading...</div>
                    ) : (
                        events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[30px] gap-[10px]">
                                {events.map((event) =>
                                    <div
                                        key={event._id}
                                        className="rounded-[8px] p-[20px] shadow-md bg-white"
                                    >
                                        <div className="flex justify-between items-center mb-[10px]">
                                            <span className="text-[#007bff] text-[12px]">
                                                {event.eventDate.toDateString()}
                                            </span>
                                            {role === "admin" && (
                                                <div className="flex">
                                                    <UpdateEvent label={event.label} id={event._id} onClick={updateEventHandler} />
                                                    <Delete label={`Are you sure you want to delete event "${event.label}"`} onClick={() => deleteEventHandler(event._id)} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="pb-[10px]">
                                            <p className="text-[#800080] uppercase text-[18px] break-all">{event.label}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center mt-[30px]">---No Events---</div>
                        )
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Events;