## Documentation

## Installation
```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev

```

## Running the app using docker

```bash
# must have docker install
$ docker compose up 

```

## Test

```bash
# unit tests
$ npm run test:watch

# test coverage
$ npm run test:cov
```

## ENV
```bash
MONGO_DB_URL=
APP_USER_SECRET=user
APP_ADMIN_SECRET=admin
ENABLE_MONGO_DB_LOG=false
REDIS_URL=localhost
REDIS_KEY_PREFIX=ph:
REDIS_DB_INDEX=3
```
## SWAGGER DOCUMENTATION URL
```bash
http://localhost:3000/api-doc/
```

## APPLICATION BASE URL
```bash
http://localhost:3000
```


## Group(Roles), Group Type: user || admin
```bash
 POST: http://localhost:3000/api/v1/groups
 {
  "name": "string",
  "identifier": "user||admin"
}
GET: http://localhost:3000/api/v1/groups
Example Response:
[
    {
      "_id": "string",
      "name": "string",
      "identifier": "string"
    }
  ]
```

## User
```bash
 POST: http://localhost:3000/api/v1/auth/user/sign-up
 {
  "name": "string",
  "email": "string",
  "password": "string"
}
 POST: http://localhost:3000/api/v1/auth/admin/sign-up
 {
  "name": "string",
  "email": "string",
  "password": "string",
  "group_id": "string"
}
Hints: Group Id Comes From[Get]: http://localhost:3000/api/v1/groups

 POST: http://localhost:3000/api/v1/auth/login
 {
  "email": "string",
  "password": "string"
}
Example Response:
{
    "token": "string"
}
```

### Permission(use admin auth), Right now four types of permissions:quiz.create,quiz.view,quiz.delete,quiz.result
```bash
 POST: http://localhost:3000/api/v1/permissions
{
  "name": "string",
  "identifier": "quiz.create",
  "status": "active||in_active"
}
Hints: identifier means permission

GET: http://localhost:3000/api/v1/permissions
Example Response:
[
    {
      "_id": "string",
      "name": "string",
      "identifier": "string",
      "status": "string"
    }
  ]
  
Assign Permission A User, POST: http://localhost:3000/api/v1/permissions/assign
{
  "user_id": "string",
  "permission_id": "string"
}
Hints: Permission Id Comes From[Get]: http://localhost:3000/api/v1/permissions

Unassign Permission A User, DELETE: http://localhost:3000/api/v1/permissions/un-assign
{
  "user_id": "string",
  "permission_id": "string"
}
```

## Quiz
```bash
POST: http://localhost:3000/api/v1/quizzes
{
  "title": "string",
  "status": "active",
  "options": [
    {
      "title": "string",
      "is_correct": true
    }
  ]
}
hints: Admin can create quiz but must have quiz.create permission

GET: http://localhost:3000/api/v1/quizzes
Example Response:
[
    {
      "_id": "string",
      "title": "string",
      "options": [
        {
          "title": "string",
          "_id": "string"
        }
      ]
    }
]

POST: http://localhost:3000/api/v1/quizzes/submission
{
  "quiz_id": "string",
  "option_id": "string"
}
Hints: Use User Token

GET: http://localhost:3000/api/v1/quizzes/result-metrics
Query Params Support:
    range_start_at: new Date()
    range_end_at: new Date()
Example Response:
[
    {
      "_id": "string",
      "title": "string",
      "total_submissions": 0,
      "total_wrong_submissions": 0,
      "total_correct_submissions": 0,
      "percentage_of_wrong_submissions": 0,
      "percentage_of_correct_submissions": 0
    }
  ]
Hints: If you not provide query params then comes all the records, 
provide: range_start_at -> record comes greater than equal
provide: range_end_at -> record comes less than equal,
provide: both, record comes between this range

hints: Admin can Get quiz metrics but must have quiz.result permission

Server Side Event: GET: http://localhost:3000/api/v1/quizzes/result-metrics/event
Example Response:
[
    {
      "_id": "string",
      "title": "string",
      "total_submissions": 0,
      "total_wrong_submissions": 0,
      "total_correct_submissions": 0,
      "percentage_of_wrong_submissions": 0,
      "percentage_of_correct_submissions": 0
    }
  ]
hints: Admin can Get quiz metrics but must have quiz.result permission
Stop Server Side Event: GET: http://localhost:3000/api/v1/quizzes/stop-sending-event
hints: Admin can Stop quiz metrics event but must have quiz.result permission



