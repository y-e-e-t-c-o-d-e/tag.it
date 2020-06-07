# MVC in Tag.it

Models: 

We have a model for each major section of the Database Schema:
- [User](https://github.com/daniel-d-truong/tag.it/blob/master/backend/models/User.js)
- [Course](https://github.com/daniel-d-truong/tag.it/blob/master/backend/models/Course.js)
- [Post](https://github.com/daniel-d-truong/tag.it/blob/master/backend/models/Post.js)
- [Comment](https://github.com/daniel-d-truong/tag.it/blob/master/backend/models/Comment.js)
- [Tag](https://github.com/daniel-d-truong/tag.it/blob/master/backend/models/Tag.js)

Each of these models interact amongst each other and with itself. 

For example, a Course has a list of students (Users) and a list of instructors (Users). It also has a list of Posts and Tags. Each Post has an author (User) and a list of Comments. 

Controllers: 

Models: We have a model for each major section of the Database Schema: User, Course, Post, Comment, and Tag. Each of these models interact amongst each other and with itself. For example, a Course has a list of students (Users) and a list of instructors (Users). It also has a list of Posts and Tags. Each Post has an author (User) and a list of Comments. 
https://github.com/daniel-d-truong/tag.it/tree/master/backend/models

Controllers: Each model has an associated controller, which communicates with the views and requests the information necessary from the model to provide to the views. For example, in courseController.js, on line 23, we provide the addCourse route that calls the Course model’s pushCourseToFirebase method. This happens in response to the frontend sending a request to the controller to add a course. 
https://github.com/daniel-d-truong/tag.it/blob/master/backend/controllers/courseController.js
