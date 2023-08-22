import { configureStore } from '@reduxjs/toolkit'
import productSlice from './productSlice'
import receiptSlice from './receiptSlice'


export const store = configureStore({
  reducer: {
    product: productSlice,
    receipt: receiptSlice
  }
})
