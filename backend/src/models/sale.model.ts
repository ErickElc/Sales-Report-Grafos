import mongoose, { Document, Schema } from 'mongoose';

export interface ISale extends Document {
  brandId: mongoose.Types.ObjectId;
  month: number;
  value: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    year: {
      type: Number,
      required: true,
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

SaleSchema.index({ brandId: 1, year: 1, month: 1 });

export const Sale = mongoose.model<ISale>('Sale', SaleSchema);

