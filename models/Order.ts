import mongoose, { Schema, Model } from "mongoose";

interface IOrderItem {
  productId: number;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

interface IOrder {
  userId: mongoose.Types.ObjectId;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;

  paymentMethod: "simulation" | "sslcommerz";
  paymentStatus: "pending" | "paid" | "failed";

  // SSLCommerz transaction information
  transactionId?: string;
  validationId?: string;
  bankTransactionId?: string;

  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      postcode: {
      type: String,
      required: true,
      trim: true,
    },
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "An order must contain at least one product.",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["simulation", "sslcommerz"],
      default: "sslcommerz",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    validationId: {
      type: String,
      trim: true,
    },
    bankTransactionId: {
      type: String,
      trim: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
