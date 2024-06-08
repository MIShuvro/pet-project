<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev

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



