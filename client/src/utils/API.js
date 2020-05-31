import axios from "axios";
import db from "../base"

const authHeaders = () => {
    return { Authorization: `Bearer ${db.auth().currentUser.uid}` }
}

const baseURL = process.env.NODE_ENV === "development" ? "" : "https://tag-it-server.herokuapp.com";

export default {
    /** USERS */
    getUser: function (uuid) {
        const config = {
            params: {
                userUUID: uuid
            },
            headers: authHeaders()
        };
        return axios.get(`${baseURL}/api/user`, config);
    },
    createUser: function (name, email, uuid) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/user`,
            data: {
                name: name,
                email: email,
                uuid: uuid
            },
            headers: authHeaders()
        };
        return axios(config);
    },

    /** POSTS */
    // Returns a PROMISE Object
    getPost: function (uuid) {
        const config = {
            params: {
                postUUID: uuid
            },
            headers: authHeaders()
        };
        return axios.get(`${baseURL}/api/post`, config);
    },

    createPost: function (title, content, course) {
        const config = {
            method: 'post', 
            url: `${baseURL}/api/post`,
            data: {
                title: title,
                content: content,
                author: db.auth().currentUser.uid,
                course: course
            },
            headers: authHeaders()
        };
        return axios(config);
    },
    /** COURSES */
    // courses is an array of course objects
    addToCourses: function (courses) {

    },

    getCourse: function (uuid) {
        const config = {
            headers: authHeaders()
        };
        return axios.get(`${baseURL}/api/course/${uuid}`, config);
    },

    updateCourse: function (courseUUID, courseName) {
        const config = {
            method: 'put',
            url: `${baseURL}/api/course`,
            data: {
                uuid: courseUUID,
                name: courseName,
            },
            headers: authHeaders()
        };
        return axios(config);
    },

    addToCourse: function(courseId, accountType=null) {
        
        const config = {
            method: 'post',
            url: `${baseURL}/api/user/${courseId}`,
            headers: authHeaders(),
            data: accountType ? {
                type: accountType
            } : {}
        };
        return axios(config);
    },
    getAllCourses: function() {

        const config = {
            headers: authHeaders(),
            transformResponse: [function (data) {
                const jsonData = JSON.parse(data);
                // Convert object to array of objects
                const courseArray = Object.keys(jsonData).map(i => jsonData[i]);
                return courseArray;
            }]
        };
        return axios.get(`${baseURL}/api/course`, config);
    },

    confirmVerificationLink: function(courseId, inviteId) {
        const config = {
            headers: authHeaders()
        };
        console.log(courseId);
        console.log(inviteId);
        return axios.get(`${baseURL}/api/course/${courseId}/${inviteId}`, config);

    /** COMMENTS */
    createComment: function (content, visibility, parentComment, postId) {
        const anonymous = visibility === "public, anonymous"
        const config = {
            method: 'post',
            url: `${baseURL}/api/comment`,
            headers: authHeaders(),
            data: {
                content: content,
                isAnonymous: anonymous,
                parentComment: parentComment,
                postId: postId
            }
        };
        return axios(config);
    },

    getComments: function (postUUID) {
        const config = {
            headers: authHeaders(),
            params: {
                postUUID: postUUID
            },
            transformResponse: [function (data) {
                const jsonData = JSON.parse(data);
                // Convert object to array of objects
                const courseArray = Object.keys(jsonData).map(i => jsonData[i]);
                return courseArray;
            }]
        };
        return axios.get(`${baseURL}/api/comment`, config);
    }
}

export { baseURL };