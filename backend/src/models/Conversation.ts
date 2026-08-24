import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  booking?: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
