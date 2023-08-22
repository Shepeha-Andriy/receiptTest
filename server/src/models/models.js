import { DataTypes } from 'sequelize'
import { sequelize } from './db.js';

export const Product = sequelize.define("product", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, require: true },
  price: { type: DataTypes.INTEGER, require: true }
});

export const Receipt = sequelize.define("receipt", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  number: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATE },
  total: { type: DataTypes.INTEGER, require: true, defaultValue: 0 } 
});

export const ProductInReceipt = sequelize.define("ProductInReceipt", {
  receipt_id: { type: DataTypes.UUID, primaryKey: true, references: { model: 'receipts', key: 'id' } },
  product_id: { type: DataTypes.UUID, primaryKey: true, references: { model: 'products', key: 'id' } },
  quantity: { type: DataTypes.INTEGER, require: true, defaultValue: 1 },
  price: { type: DataTypes.INTEGER, require: true }
});

ProductInReceipt.belongsTo(Receipt, { foreignKey: 'receipt_id' });
ProductInReceipt.belongsTo(Product, { foreignKey: 'product_id' });

Receipt.hasMany(ProductInReceipt, { foreignKey: 'receipt_id' });
Product.hasMany(ProductInReceipt, { foreignKey: 'product_id' });
