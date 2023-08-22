import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'

const initialState = {
  products: [],
  isLoading: false
}

export const getAllProducts = createAsyncThunk('/products', async ( params = {}, { rejectWithValue } ) => {
  try {
    const { data } = await api.get('/product')

    return data
  } catch (error) {
    console.log('get all products slice err', error)
    return rejectWithValue(error.response.data)
  }
})

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      //get all
    .addMatcher(
      (action) => action.type === getAllProducts.pending.type,
      (state) => {
        state.isLoading = true
      }
    )
    .addMatcher(
      (action) => action.type === getAllProducts.fulfilled.type,
      (state, action) => {
        state.products = action.payload
        state.isLoading = false
      }
    )
    .addMatcher(
      (action) => action.type === getAllProducts.rejected.type,
      (state, action) => {
        state.isLoading = false
      }
    )
  }
})

export default productSlice.reducer
