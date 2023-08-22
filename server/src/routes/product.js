import express from 'express'
import { Product } from '../models/models.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll()
    
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
