import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  photoUrl: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);