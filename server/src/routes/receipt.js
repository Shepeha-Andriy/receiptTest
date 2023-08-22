import express from 'express'
import { Receipt, ProductInReceipt, Product } from '../models/models.js'
const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const products = await ProductInReceipt.findAll({ where: { receipt_id: id }, include: { model: Product, attributes: ['name', 'price'] } })
    const receipt = await Receipt.findOne({ where: { id } })
 
    res.status(200).json({ products, receipt })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/create', async (req, res) => {
  try {
    const documents = await Receipt.count()
    const receipt = await Receipt.create({ number: documents })
    
    res.status(201).json(receipt)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/close/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { total } = req.body

    if (!total) {
      return res.status(400).json({message: 'data missing'})
    }
    
    const receipt = await Receipt.update({ total, date: Date.now() }, { where: { id } })
    
    res.status(200).json({ receipt, message: 'Receipt successfully closed' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/add', async (req, res) => {
  try {
    const { receipt_id, product_id, price } = req.body

    if (!receipt_id || !product_id || !price) {
      return res.status(400).json({message: 'data missing'})
    }

    const productExist = await ProductInReceipt.findOne({ where: { receipt_id, product_id } })
    if ( productExist ) {
      return res.status(400).json({ message: 'Product has already added to receipt' })
    }
    
    await ProductInReceipt.create({ receipt_id, product_id, price })
    const product = await ProductInReceipt.findOne({ where: { receipt_id, product_id }, include: { model: Product, attributes: ['name', 'price'] } })
    await Receipt.increment('total', { by: price, where: { id: receipt_id } })

    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/delete', async (req, res) => {
  try {
    const { receipt_id, product_id, price } = req.body.product

    if (!receipt_id || !product_id || !price) {
      return res.status(400).json({message: 'data missing'})
    }
  
    await ProductInReceipt.destroy({ where: {
      receipt_id,
      product_id
    } })

    const products = await ProductInReceipt.findAll({ where: { receipt_id }, include: { model: Product, attributes: ['name', 'price'] } })
    await Receipt.decrement('total', { by: price, where: { id: receipt_id } })

    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/quantity', async (req, res) => {
  try {
    const { action, receipt_id, product_id } = req.body;

    if (!receipt_id || !product_id || !action) {
      return res.status(400).json({message: 'data missing'})
    }

    const productInReceipt = await ProductInReceipt.findOne({
      where: { receipt_id, product_id }, include: { model: Product, attributes: ['name', 'price'] }
    });

    if (action === 'increase') {
      await productInReceipt.increment('quantity', { by: 1 });
      await productInReceipt.increment('price', { by: productInReceipt.product.price });
      await Receipt.increment('total', { by: productInReceipt.product.price, where: { id: receipt_id } })
    } else {
      await productInReceipt.decrement('quantity', { by: 1 });
      await productInReceipt.decrement('price', { by: productInReceipt.product.price });
      await Receipt.decrement('total', { by: productInReceipt.product.price, where: { id: receipt_id } })
    }

    await productInReceipt.save()

    res.status(200).json(productInReceipt)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
