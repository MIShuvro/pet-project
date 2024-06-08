import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type QuizResultDocument = QuizResult & Document;

@Schema({
  collection: "quiz_result",
  timestamps: true,
  timeseries: {
    timeField: "timestamp",
    metaField: "user",
    granularity: "minutes"
  }
})
export class QuizResult {
  @Prop({ required: true })
  option_id: string;

  @Prop({ required: true })
  is_correct: boolean;

  @Prop({ type: Types.ObjectId, ref: "Quiz" })
  quiz: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ required: true })
  timestamp: Date;
}

export const QuizResultSchema = SchemaFactory.createForClass(QuizResult);
