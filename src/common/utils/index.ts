import { Request } from "express";
import { Types } from "mongoose";

export function concatObject(obj: Object, separator: string = ", ") {
  return Object.keys(obj)
    .map(function(key, index) {
      return obj[key];
    })
    .join(separator);
}

import { hashSync, compare } from "bcryptjs";
import { QuizResultQueryRequestDto } from "../../api/quiz/dto/request/quiz-request.dto";

export function hashPassword(text: string): string {
  return hashSync(text, 12);
}

export function comparePassword(hashPassword: string, plainPassword: string): Promise<boolean> {
  return compare(plainPassword, hashPassword);
}

export interface jwtPayload {
  subscriber: string;
}

export interface SessionRequest extends Request {
  user: jwtPayload;

}

export function stringToMongooseObjectId(objectId: string) {
  return new Types.ObjectId(objectId);
}

export function isMongoDdObjId(objectId: string): boolean {
  try {
    let res = stringToMongooseObjectId(objectId);
    return true;
  } catch (err) {
    return false;
  }
}

export function buildFilterQueryForResultMetric(query: QuizResultQueryRequestDto) {
  let obj = null;
  if (query.range_start_at && query.range_end_at) {
    obj = {
      $match: {
        timestamp: {
          $gte: new Date(query.range_start_at),
          $lte: new Date(query.range_end_at)
        }
      }
    };
  } else if (query.range_start_at) {
    obj = {
      $match: {
        timestamp: {
          $gte: new Date(query.range_start_at)
        }
      }
    };
  } else if (query.range_end_at) {
    obj = {
      $match: {
        timestamp: {
          $lte: new Date(query.range_end_at)
        }
      }
    };
  }
  return obj;
}
