# Alt School Africa Second Semester Examination project

## Backend NodeJS Second Semester Examination Project (Blogging API)
Description
This project aims to create a robust backend API for a blogging platform using Node.js and MongoDB. The API allows users to sign up, sign in, create, edit, publish, and delete blog posts. It also provides endpoints for fetching published blog posts, filtering, sorting, and paginating them. JWT authentication is used for user authentication, and Winston is integrated for logging purposes.

### Table of Contents
1. [Installation](#Installation)
2. [Usage](#Usage)
3. [Endpoints](#Endpoints)
4. [Models](#Models)
5. [Authentication](#Authentication)
6. [Logging](#Logging)
7. [Testing](#Testing)
8. [Contributing](#Contributing)
9. [License](#License)

#### Installation
1. Clone the repository: git clone <https://github.com/lovedayikegbulam/blogging-api>
2. Install dependencies: npm install
3. Set up environment variables (e.g., MongoDB URI, JWT secret)
4. Start the server: npm start


### Usage
Once the server is running, you can interact with the API using HTTP requests. Below are the available endpoints and their functionalities.



### Endpoints
### Authentication

`POST /signup`

* Description: Creates a new user account.
* Request Body:

json
Copy code
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string"
}
Response: 201 Created
POST /login
Description: Logs in an existing user.
Request Body:
json
Copy code
{
  "email": "string",
  "password": "string"
}
Response: 200 OK
Blogs
GET /blogs
Description: Retrieves a list of published blogs.
Query Parameters:
page (optional): Page number for pagination (default: 1)
limit (optional): Number of blogs per page (default: 20)
search (optional): Search query for filtering by author, title, or tags
sortBy (optional): Sorting criteria (e.g., readCount, readingTime, timestamp)
Response: 200 OK
GET /blogs/:id
Description: Retrieves a single published blog by ID.
Response: 200 OK
POST /blogs
Description: Creates a new blog post.
Request Body:
json
Copy code
{
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "body": "string"
}
Response: 201 Created
PUT /blogs/:id
Description: Updates an existing blog post.
Request Body:
json
Copy code
{
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "body": "string"
}
Response: 200 OK
DELETE /blogs/:id
Description: Deletes an existing blog post.
Response: 204 No Content
Users
GET /users/:id/blogs
Description: Retrieves a list of blogs created by a specific user.
Query Parameters:
page (optional): Page number for pagination (default: 1)
limit (optional): Number of blogs per page (default: 20)
state (optional): Filter by blog state (e.g., draft, published)
Response: 200 OK
Models
User
email: String (required, unique)
firstname: String (required)
lastname: String (required)
password: String (required)
Blog
title: String (required, unique)
description: String
author: ObjectId (reference to User)
state: Enum (draft, published)
readCount: Number
readingTime: Number
tags: Array of Strings
body: String (required)
timestamp: Date
Authentication
JWT (JSON Web Tokens) is used for user authentication. Upon successful login, a JWT token is generated and returned to the client, which should be included in subsequent requests for authentication.

## Logging
Winston is integrated for logging purposes. It logs various events and errors throughout the application, providing insights into the system's behavior and helping in debugging.

## Testing
Tests have been written to cover all endpoints and functionalities of the API. You can run the tests using the command npm test.

## Contributing
Contributions are welcome! Feel free to fork the repository, make changes, and submit pull requests.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
