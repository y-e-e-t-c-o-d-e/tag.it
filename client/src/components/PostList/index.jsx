/*PostList defines the component that displays
 a list of questions for the user to browse*/
 
 import React from 'react';
//import reactDOM from 'react-dom';
import './style.css';
import Post from '../Post';



     
// hardcoded questions 
let q1 = 'What\'s the difference between tag.it and piazza?';
let q2 = 'Anyone know how to find the quiz grade?';
let q3 = 'Looking for a project group pls help';
let q4 = 'Could this be another question?';
let q5 = 'Could this be another question?';
let q6 = 'Could this be another very very very very very very very very very very very very very long question?';
let q7 = 'how do react ?';
let q8 = 'Could this be another very very very very very very very very very very very very very very very very very long question?';
// hardcoded length check for truncating question when displayed in list --- need to change
const maxLength = q6.length;

class PostList extends React.Component {
   /* state = {
        isList: true,
    }*/
    
    // makes each question box 
    question = (text) =>  {
        //truncate
        if(text.length > maxLength) {
            text = text.substring(0, maxLength) + '...';
        }
        return (
        <div>
            <button className="question">
                <h2>
                {text}
                </h2>
            </button>
        </div>
        );
    }
    
    // todo: figure out someway to change state to switch between PostList and Post components
    /*goTo = () => (
        this.setState({isList:false})
    );   */ 
    
    // forms full list (todo: loop through actual database)
    list = () => {
        return (
        <div className="list">
            {this.question(q1)}  
            {this.question(q2)}
            {this.question(q3)}
            {this.question(q4)}
            {this.question(q5)}
            {this.question(q6)}
            {this.question(q7)}
            {this.question(q8)}
        </div>
        );
    }

   // make.it button
   makeit = () => {
       return (
        <button className="makeit"><b>make.it</b></button>
       );
    }

    render() {
        return (
            <div>
                {this.list()}
                {this.makeit()}
            </div>
        );
    }
}

    //changes from list of questions to post
    /// to put in render? --> {(this.setState.isList) ? list() : <Post />}

export default PostList;