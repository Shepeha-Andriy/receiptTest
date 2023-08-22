import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import api from './api'

const initialState = {
  products: [],
  receipt_id: localStorage.getItem('receipt_id') || null,
  receipt: null,
  message: null,
  isLoading: false
}

export const getReceiptProducts = createAsyncThunk('/receipt', async ( { receipt_id }, { rejectWithValue } ) => {
  try {
    if (!receipt_id) {
      return
    }

    const { data } = await api.get(`/receipt/${receipt_id}`)
    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

export const createReceipt = createAsyncThunk('/receipt/create', async ( params = {}, { rejectWithValue } ) => {
  try {
    const { data } = await api.post('/receipt/create')

    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

export const addToReceipt = createAsyncThunk('/receipt/add', async ( { product_id, price, receipt_id }, { rejectWithValue } ) => {
  try {
    const { data } = await api.post('/receipt/add', { receipt_id, product_id, price })

    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

export const deleteFromReceipt = createAsyncThunk('/receipt/delete', async ( { product }, { rejectWithValue } ) => {
  try {
    const { data } = await api.patch(`/receipt/delete`, { product })

    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

export const increaseQuantity = createAsyncThunk('/receipt/quantity', async ( { product, receipt_id }, { rejectWithValue } ) => {
  try {
    const { data } = await api.patch(`/receipt/quantity`, { action: 'increase', product_id: product.product_id, receipt_id })

    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

export const decreaseQuantity = createAsyncThunk('/receipt/decreaseQuantity', async ( { product, receipt_id }, { rejectWithValue } ) => {
  try {
    const { data } = await api.patch(`/receipt/quantity`, { action: 'decrease', product_id: product.product_id, receipt_id })

    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

export const closeReceipt = createAsyncThunk('/receipt/close', async ( receipt = {}, { rejectWithValue } ) => {
  try {
    const { data } = await api.patch(`/receipt/close/${receipt.id}`, { total: receipt.total })

    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      //get all
    .addMatcher(
      (action) => action.type === getReceiptProducts.pending.type,
      (state) => {
        state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === getReceiptProducts.fulfilled.type,
      (state, action) => {
        console.log(action)
        state.receipt_id = action.payload.receipt.id
        state.products = action.payload.products
        state.receipt = action.payload.receipt
        state.isLoading = false
      }
    )
    .addMatcher(
      (action) => action.type === getReceiptProducts.rejected.type,
      (state, action) => {
        state.isLoading = false
      }
    )
      //create
    .addMatcher(
      (action) => action.type === createReceipt.pending.type,
      (state) => {
        state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === createReceipt.fulfilled.type,
      (state, action) => {
        localStorage.setItem('receipt_id', action.payload.id)
        state.receipt_id = action.payload.id
        state.receipt = action.payload
        state.isLoading = false
      }
    )
    .addMatcher(
      (action) => action.type === createReceipt.rejected.type,
      (state, action) => {
        state.isLoading = false
      }
    )
      //close
    .addMatcher(
      (action) => action.type === closeReceipt.pending.type,
      (state) => {
        state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === closeReceipt.fulfilled.type,
      (state, action) => {
        localStorage.removeItem('receipt_id')
        state.products = []
        state.receipt_id = null
        state.receipt = null
        state.isLoading = false
        state.message = action.payload.message
      }
    )
    .addMatcher(
      (action) => action.type === closeReceipt.rejected.type,
      (state, action) => {
        state.isLoading = false
      }
    )
      //add
    .addMatcher(
      (action) => action.type === addToReceipt.pending.type,
      (state) => {
        state.message = null
        state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === addToReceipt.fulfilled.type,
      (state, action) => {
        state.receipt.total = state.receipt.total + action.meta.arg.price
        state.products.push(action.payload)
        state.isLoading = false
      }
    )
    .addMatcher(
      (action) => action.type === addToReceipt.rejected.type,
      (state, action) => {
        state.message = action.payload.message
        state.isLoading = false
      }
    )
      //delete
    .addMatcher(
      (action) => action.type === deleteFromReceipt.pending.type,
      (state) => {
        state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === deleteFromReceipt.fulfilled.type,
      (state, action) => {
        state.products = current(state.products).filter(product => product.product_id !== action.meta.arg.product.product_id)
        state.receipt.total = state.receipt.total - action.meta.arg.product.price
        state.isLoading = false
      }
    )
    .addMatcher(
      (action) => action.type === deleteFromReceipt.rejected.type,
      (state, action) => {
        state.isLoading = false
      }
    )
      // increase
    .addMatcher(
      (action) => action.type === increaseQuantity.pending.type,
      (state) => {
        // state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === increaseQuantity.fulfilled.type,
      (state, action) => {
        state.products = current(state.products).map(
          product => product.product_id === action.meta.arg.product.product_id
            ? { ...product, quantity: product.quantity + 1, price: product.price + product.product.price }
            : product)
        state.receipt.total = state.receipt.total + action.meta.arg.product.product.price
        state.isLoading = false
      }
    )
    .addMatcher(
      (action) => action.type === increaseQuantity.rejected.type,
      (state, action) => {
        state.isLoading = false
      }
    )
      //decrease
    .addMatcher(
      (action) => action.type === decreaseQuantity.pending.type,
      (state) => {
        // state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === decreaseQuantity.fulfilled.type,
      (state, action) => {
        state.receipt.total = state.receipt.total - action.meta.arg.product.product.price
        state.products = current(state.products).map(
          product => product.product_id === action.meta.arg.product.product_id ?
            { ...product, quantity: product.quantity - 1, price: product.price - product.product.price }
            : product)
        state.isLoading = false
      }
    )
    .addMatcher(
      (action) => action.type === decreaseQuantity.rejected.type,
      (state, action) => {
        state.isLoading = false
      }
    )
  }
})

export default receiptSlice.reducer
