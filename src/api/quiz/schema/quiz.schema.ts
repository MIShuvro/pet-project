import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { QuizOptionDocument } from "./quiz-option.schema";

export type QuizDocument = Quiz & Document;

@Schema({
  collection: "quizzes",
  timestamps: true
})
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  creator_id: string;

  options: QuizOptionDocument[]
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
