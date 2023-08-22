import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './pl.scss'
import { getAllProducts } from '../redux/productSlice'
import { addToReceipt, createReceipt } from '../redux/receiptSlice'
import { Loader } from './Loader/Loader'

export default function ProductList() {
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector(store => store.product)
  const { receipt_id } = useSelector(store => store.receipt)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  const handeAdd = async (productId, productPrice) => {
    if (!receipt_id) {
      const data = await dispatch(createReceipt())
      dispatch(addToReceipt({ product_id: productId, price: productPrice, receipt_id: data.payload.id }))
      return
    }

    dispatch(addToReceipt({ product_id: productId, price: productPrice, receipt_id }))
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  return (
    <div className='pl'>
      <ul className='pl__list'>
        {
          products.map((product, i) => (
            <li 
              style={{ cursor: 'pointer' }} 
              onClick={() => handeAdd(product.id, product.price)} 
              key={i} 
              className='pl__item'
            >
              <span>{ product.name }</span> <span>{ product.price }грн</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
