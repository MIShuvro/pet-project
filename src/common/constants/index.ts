import e from "express";

export const GROUP_IDENTIFIER = {
  USER: "user",
  ADMIN: "admin"
};


export const PERMISSION_STATUS = {
  ACTIVE: "active",
  IN_ACTIVE: "in_active"
};

export const ADMIN_PERMISSION = {
  QUIZ_CREATE: "quiz.create",
  QUIZ_VIEW: "quiz.view",
  QUIZ_DELETE: "quiz.delete",
  QUIZ_RESULT: "quiz.result"
};
