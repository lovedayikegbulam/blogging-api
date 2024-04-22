const data = {
  "message": "Welcome to the base route",
  "name": "Loveday Ikegbulam",
  "email": "lovedayikegbulam515@gmail.com",
  "projectName": "Blogging Api",
  "projectRepo": "https://github.com/lovedayikegbulam/blogging-api",
  "Routes": {
    "authRoute": {
      "method": "POST",
      "signup": "https://blogging-api-ur0o.onrender.com/api/auth/signup",
      "login": "https://blogging-api-ur0o.onrender.com/api/auth/login"
    },
    "postRoute": {
      "createPost": {
        "method": "POST",
        "url": "https://blogging-api-ur0o.onrender.com/api/posts/create"
      },
      "updatePost": {
        "method": "PATCH",
        "url": "https://blogging-api-ur0o.onrender.com/api/posts/postId"
      },
      "getAllPublishedPost": {
        "method": "GET",
        "url": "https://blogging-api-ur0o.onrender.com/api/posts/all"
      },
      "getAllUserPost": {
        "method": "GET",
        "url": "https://blogging-api-ur0o.onrender.com/api/posts/user"
      },
      "getPostById": {
        "method": "GET",
        "url": "https://blogging-api-ur0o.onrender.com/api/posts/postId"
      },
      "deletePost": {
        "method": "DELETE",
        "url": "https://blogging-api-ur0o.onrender.com/api/posts/postId"
      }
    }
  }
}


export default data;
