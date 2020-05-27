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

    /** COURSES */
    // courses is an array of course objects
    addToCourse: function(courseId) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/user/${courseId}`,
            headers: authHeaders()
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
                console.log(courseArray);
                return courseArray;
            }]
        };
        return axios.get(`${baseURL}/api/course`, config);
    },

    createCourse: function (name, term, description) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/course`,
            headers: authHeaders(),
            data: {
                name: name,
                term: term
            }
        };
        return axios(config);
    }
}