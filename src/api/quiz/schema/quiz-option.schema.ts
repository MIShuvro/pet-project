import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type QuizOptionDocument = QuizOption & Document;

@Schema({
  collection: "options",
  timestamps: true
})
export class QuizOption {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  is_correct: boolean;

  @Prop({ type: Types.ObjectId, ref: "Quiz" })
  quiz: Types.ObjectId;
}

export const QuizOptionSchema = SchemaFactory.createForClass(QuizOption);
