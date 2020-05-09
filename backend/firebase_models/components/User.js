import React, {Component} from 'react';
import db from '../base'

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            uuid: ''
        }
        this.firebaseRef = db.database().ref("Users");
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    pushUserToFirebase(event) {
        const {name, email, uuid} = this.state;
        event.preventDefault();
        this.firebaseRef.child(this.state.uuid).set({
            name: this.state.name, 
            email: this.state.email, 
            uuid: this.state.uuid, 
            studentCourseList: ["dummy_course_id"], 
            instructorCourseList: ["dummy_course_id"],
            postList: ["dummy_post_id"],
            commentList: ["dummy_comment_id"],
            followingList: ["dummy_post_id"],
            icon: "anonymous.jpg"
        });
        //this.setState({name: '', email: '', uuid: ''});
    }

    
    getStudentCourseList(callback) {
        var userId = "user1";
        var userRef = db.database().ref("Users/"+userId+"/studentCourseList");
        userRef.on('value', function(snapshot) {
            callback(snapshot.val());
        });
    }

    async addStudentCourse(event) {
        var courseId = "course2";
        var userId = "user1";
        var userRef = db.database().ref("Users/"+userId+"/studentCourseList");
        getStudentCourseList(
            (courseList) => {
                courseList.push(courseId)
                db.database().ref("Users").child(userId).child("studentCourseList").set(courseList);
            },
        );
    }



    componentDidMount() {
        this.setState({name: "gary", email: "g1@ucsd.edu", uuid: "user1"});
    }

    render() {
        
        return( 
            <div>
                <button onClick={this.pushUserToFirebase.bind(this)}>Submit</button>
                <button onClick={this.addStudentCourse.bind(this)}>Add Course</button>
            </div>
        );

    }
}

export default User;