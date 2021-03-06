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

    createPost: function (title, content, course, tags, postOptions) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/post`,
            data: {
                title: title,
                content: content,
                author: db.auth().currentUser.uid,
                course: course,
                tagList: tags,
                isAnonymous: postOptions.isAnonymous,
                isPrivate: postOptions.isPrivate
            },
            headers: authHeaders()
        };
        return axios(config);
    },

    toggleFollow: function (user, postUUID) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/post/follow?postUUID=${postUUID}`,
            query: {
                userObj: user,
                // postUUID: postUUID
            },
            headers: authHeaders()
        };
        return axios(config);
    },

    togglePostLike: function (postUUID) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/post/like?postUUID=${postUUID}`,
            headers: authHeaders(),
        };
        return axios(config);
    },

    /** COURSES */
    // courses is an array of course objects
    addToCourses: function (courses) {

    },

    getCourse: function (uuid, invited) {
        const config = {
            headers: authHeaders(),
        };
        return axios.get(`${baseURL}/api/course/${uuid}?invited=${invited ? "true" : "false"}`, config);
    },

    updateCourse: function (courseUUID, courseName, description) {
        const config = {
            method: 'put',
            url: `${baseURL}/api/course`,
            data: {
                uuid: courseUUID,
                name: courseName,
                description: description
            },
            headers: authHeaders()
        };
        return axios(config);
    },

    addToCourse: function (courseId, accountType = null) {
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

    getAllCourses: function () {
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

    confirmVerificationLink: function (courseId, inviteId) {
        const config = {
            headers: authHeaders()
        };
        return axios.get(`${baseURL}/api/course/${courseId}/invite/${inviteId}`, config);
    },

    createCourse: function (name, term, description, tagList) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/course`,
            headers: authHeaders(),
            data: {
                name: name,
                term: term,
                description: description,
                tagList: tagList
            }
        };
        return axios(config);
    },

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

    toggleLike: function (commentUUID) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/comment/like?commentUUID=${commentUUID}`,
            headers: authHeaders(),
        };
        return axios(config);
    },

    getCourseUsers: function (courseUUID) {
        const config = {
            headers: authHeaders(),
        };
        return axios.get(`${baseURL}/api/course/${courseUUID}/users`, config);
    },

    removeUserFromCourse: function (courseUUID, userUUID) {
        const config = {
            headers: authHeaders()
        };
        return axios.delete(`${baseURL}/api/course/${courseUUID}/${userUUID}`, config);
    },

    inviteUserToCourse: function (courseUUID, userEmail, type="instructor") {
        const config = {
            method: 'post',
            url: `${baseURL}/api/course/${courseUUID}/invite`,
            headers: authHeaders(),
            data: {
                email: userEmail,
                type: type
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
    },

    removePendingUserFromCourse: function (courseUUID, email) {
        const config = {
            headers: authHeaders()
        };
        return axios.delete(`${baseURL}/api/course/${courseUUID}/pending/${email}`, config)
    },

    // Use for changing post contents, resolving post, and pinning post
    editPost: function(postUUID, content, isResolved, isPinned) {
        const config = {
            method: 'put',
            headers: authHeaders(),
            url: `${baseURL}/api/post?postUUID=${postUUID}`,
            data: {
                content: content,
                isResolved: isResolved,
                isPinned: isPinned
            }
        };
        return axios(config);
    },
    /** TAGS */

    addRemoveTags: function (addedTags, removeTags, courseId) {
        const config = {
            method: 'post',
            url: `${baseURL}/api/tag`,
            headers: authHeaders(),
            data: {
                courseId: courseId,
                newTags: addedTags,
                removedTags: removeTags
            }
        };
        return axios(config);
    }
}

export { baseURL };