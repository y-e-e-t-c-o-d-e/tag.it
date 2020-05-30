import React, { useState } from 'react'
import './style.css';
import { Button, ListGroup, Row, Col } from "react-bootstrap";

// Display a single tag
const EachTag = props => {
    return (
        <button className="tagItem"><b>{props.tag.title}</b></button>
    );
}

const TagList = ({}) => {
    // Hard-coded tags
    let hctags = [];
    for (let i = 0; i < 20; i++) {
        hctags.push({
            title: "tag" + i,
            uuid: i
        })
    }

    const [tags, setTags] = useState(hctags);
    const [search, setSearch] = useState(""); // default to no search input
    
    return (
        <div className="tag-section">
            <Row>
                <Col>
                    <input className="search" type="text" placeholder="Search..." onChange={ e => setSearch(e.target.value)} />
                </Col>
                <Col>
                    <Button variant="warning" className="btn-style search-btn"><b>search.it</b></Button>
                </Col>
            </Row>

            <div className="tagList">
                { 
                    tags.filter(
                        tag => tag.title.includes(search)
                    ).map(tag => {
                        return <Button variant="primary" block key={tag.uuid} className="tagItem"><b>{tag.title}</b></Button>
                    }) 
                }
            </div>
        </div>
    );
}

// export class TagList extends React.Component {

//     // Tags
//     state = {
//         tags: hctags
//     };

//     // Display all tags
//     showTags = tags => {
//         return tags.map(tag => {
//             return <EachTag tag={tag} key={tag.id} />;
//         });
//     }

//     render() {
//         return (
//             <div className="tag-section">
//                 <input className="search" type="text" placeholder="Search..." />
//                 <button className="btn-style search-btn"><b>search.it</b></button>
//                 <div className="filter-dropdown">
//                     <button className="btn-style filter-btn"><b>filter.it</b></button>
//                     <div className="filter-dropdown-content"> 
//                         <button ><b>Pinned</b></button>
//                         <button ><b>Most Liked</b></button>
//                     </div>
//                 </div>
//                 <div className="tagList">
//                     {this.showTags(this.state.tags)}
//                 </div>
//             </div>
//         );
//     }
// }

export default TagList
