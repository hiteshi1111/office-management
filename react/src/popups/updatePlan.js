import React, { useState } from 'react';
import ReactModal from '.';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import { checkEmptyFields } from '../utils/formValidation';
import Error from '../components/custom/error';
import { DeleteRequest, PutRequest } from '../utils/request';
import { GrFormEdit } from "react-icons/gr";
import DeleteConfirmation from './deleteConfirmation';
import Button from '../components/custom/button';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../components/custom/iconButton';
import { superadminActions } from '../store/superadmin-slice';

const UpdatePlan = ({ data }) => {
  const dispatch = useDispatch();
  const { accountInfo } = useSelector((state) => state.account);
  const { triggerPlans } = useSelector((state) => state.superadmin);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("")
  const initialState = ({
    title: data?.title || "",
    employees: data?.employees || "",
    price: data?.price || "",
    days: data?.price || ""
  })
  const [updatedPlan, setUpdatedPlan] = useState(initialState);

  // TITLE INPUT HANDLER
  const titleHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^A-Za-z0-9\s]/g, '');
    setUpdatedPlan((prevState) => ({
      ...prevState,
      [name]: cleanedValue
    }));
    setError("");
  };

  // EMAIL INPUT HANDLER
  const employeeHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9]/g, '');
    setUpdatedPlan((prevState) => ({
      ...prevState,
      [name]: Number(cleanedValue)
    }));
    setError("");
  };

  // PRICE INPUT HANDLER
  const priceHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9]/g, '');
    setUpdatedPlan((prevState) => ({
      ...prevState,
      [name]: Number(cleanedValue)
    }));
    setError("");
  };

  const handleUpdate = () => {
    if (checkEmptyFields(updatedPlan)) {
      setError("Field must not be empty");
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${accountInfo?.token}`,
          'Content-Type': 'application/json',
        },
      };
      PutRequest(`${process.env.REACT_APP_URL}/plan/${data?._id}`, updatedPlan, config).then(response => {
        setOpen(false);
        setError("");
        dispatch(superadminActions.setTriggerPlans(triggerPlans+1))
      }).catch(error => {
        setError(error.data);
      });
    }
  };

  const handleDeletePlan = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accountInfo?.token}`,
        'Content-Type': 'application/json',
      },
    };
    DeleteRequest(`${process.env.REACT_APP_URL}/plan/${data?._id}`,config).then((response) => {
        dispatch(superadminActions.setTriggerPlans(triggerPlans+1))
        setOpen(false);
    }).catch((error) => {
        console.log(error);
    });
  };

  function closeHandler(){
    setOpen(false)
    setUpdatedPlan(initialState)
    setError("")
  }
  return (
    <>
      <IconButton 
        icon={<GrFormEdit color='#fff' size={24} className='cursor-pointer' />}
        onClick={() => setOpen(true)}
        className='hover:!bg-transparent'
      />
      <ReactModal open={open} close={closeHandler} maxWidth="600px" heading="Update Plan">
        {error && <Error message={error} />}
        <div>
          <div>
            <Label title='Title' isImportant />
            <TextInput
              name="title"
              value={updatedPlan.title}
              onChange={titleHandler}
              className='mt-[5px]'
              maxLength={20}
            />
          </div>
          <div className='mt-3'>
            <Label title='No of Employees' isImportant />
            <TextInput
              name="employees"
              value={updatedPlan.employees}
              onChange={employeeHandler}
              className='mt-[5px]'
              maxLength={5}
            />
          </div>
          <div className='mt-3'>
            <Label title='Time Period (in days)' isImportant />
            <TextInput
                name="days"
                value={updatedPlan.days}
                onChange={priceHandler}
                className='mt-[5px]'
                maxLength={10}
            />
          </div>
          <div className='mt-3'>
            <Label title='Price Per Month' isImportant />
            <div className='relative'>
              <span className='absolute top-[15px] left-[5px]'>₹</span>
              <TextInput
                name="price"
                value={updatedPlan.price}
                onChange={priceHandler}
                className='mt-[5px] pl-[20px]'
                maxLength={6}
              />
            </div>
          </div>
          <div className='flex justify-center gap-[10px] mt-[40px]'>
            <DeleteConfirmation
              onClick={handleDeletePlan}
              className='max-w-[120px]'
              close={() => setOpen(false)}
              description={`Are you sure you want to delete plan "${data?.title}"`}
            />
            <Button
              label='Update'
              onClick={handleUpdate}
              secondary
            />
          </div>
        </div>
      </ReactModal>
    </>
  )
}
export default UpdatePlan;