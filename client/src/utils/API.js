import axios from "axios";

export default {
    // Returns a PROMISE Object
    getPost: function (uuid) {
        const config = {
            params: {
                postUUID: uuid
            }
        };
        return axios.get("http://localhost:4000/api/post", config);
    }
}