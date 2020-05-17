import axios from "axios";
// import { AuthContext } from "./Auth";
import { AuthContext } from "../auth/Auth"
import db from "../base"

const authHeaders = () => {
    return { Authorization: `Bearer ${db.auth().currentUser.uid}` }
}

export default {
    /** USERS */
    getUser: function (uuid) {
        const config = {
            params: {
                userUUID: uuid
            },
            headers: authHeaders()
        };
        return axios.get("/api/user", config);
    },
    createUser: function (name, email, uuid) {
        const config = {
            method: 'post', 
            url: '/api/user',
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
        return axios.get("/api/post", config);
    },

    /** COURSES */
    // courses is an array of course objects
    addToCourses: function(courses) {
        
    }
}