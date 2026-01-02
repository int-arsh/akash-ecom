// Centralize all models and database connection

import { connectDB } from '../config/database.js';
import Order from './order.js';

export { connectDB, Order };
