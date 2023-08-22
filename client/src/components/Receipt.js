import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import './receipt.scss'
import { closeReceipt, decreaseQuantity, deleteFromReceipt, getReceiptProducts, increaseQuantity } from '../redux/receiptSlice'
import { Loader } from './Loader/Loader';

export default function Receipt() {
  const dispatch = useDispatch()
  const { products, receipt_id, isLoading, receipt, message } = useSelector(store => store.receipt)

  useEffect(() => {
    if (receipt_id) {
      dispatch(getReceiptProducts({ receipt_id }))
    }
  }, [dispatch, receipt_id])

  useEffect(() => {
    toast.error(message)
  }, [message])

  const handleDelete = async (product) => {
    dispatch(deleteFromReceipt({ product }))
  }

  const handleDecrease = async (product) => {
    if (product.quantity === 1) {
      handleDelete(product)
      return
    }

    dispatch(decreaseQuantity({ product, receipt_id }))
  }
  
  const handleIncrease = async (product) => {
    dispatch(increaseQuantity({ product, receipt_id }))
  }

  const handlePay = async () => {
    dispatch(closeReceipt(receipt))
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  if (!receipt_id) {
    return 'Add products to create receipt'
  }

  if (products?.length === 0) {
    return 'Add products to receipt'
  }
 
  return (
    <div className='receipt'>
      
      <ul className='receipt__list'>
        {
          products.map((product, i) => (
            <li key={i} className='receipt__item'>
              <span>{ product.product.name }</span>
              
              <div>
                <span onClick={() => handleDecrease(product)}>-</span> { product.quantity } <span onClick={() => handleIncrease(product)}>+</span>
              </div>

              <span>{ product.price }</span>
              <span onClick={() => {console.log(product)
                 handleDelete(product)}}> X </span>
            </li>
          ))
        }
      </ul>
      { receipt?.total }грн
      { receipt ? <div onClick={handlePay} style={{ cursor: 'pointer' }}> Pay </div> : '' }
    </div>
  )
}
