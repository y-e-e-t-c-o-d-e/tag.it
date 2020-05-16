import axios from "axios";

export default {
    /** USERS */
    getUser: function (uuid) {
        const config = {
            params: {
                userUUID: uuid
            }
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
            }
        };
        return axios(config);
    },

    /** POSTS */
    // Returns a PROMISE Object
    getPost: function (uuid) {
        const config = {
            params: {
                postUUID: uuid
            }
        };
        return axios.get("/api/post", config);
    },
}