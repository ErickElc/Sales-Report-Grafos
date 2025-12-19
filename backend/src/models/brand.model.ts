import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BrandSchema.index({ productId: 1 });

export const Brand = mongoose.model<IBrand>('Brand', BrandSchema);

