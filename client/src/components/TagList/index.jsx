import React from 'react'
import './style.css';

// Display a single tag
const EachTag = props => {
    return (
        <button className="tagItem"><b>{props.tag.title}</b></button>
    );
}

// Hard-coded tags
let hctags = [];
for (var i = 0; i < 20; i++) {
    hctags.push({
        title: "tag" + i
    })
}

console.log(hctags);

export class TagList extends React.Component {

    // Tags
    state = {
        tags: hctags
    };

    // Display all tags
    showTags = tags => {
        return tags.map(tag => {
            return <EachTag tag={tag} key={tag.id} />;
        });
    }

    render() {
        return (
            <div className="tag-section" style={{ visibility: "hidden" }}>
                <input className="search" type="text" placeholder="Search..." />
                <button className="btn-style search-btn"><b>search.it</b></button>
                <div className="filter-dropdown">
                    <button className="btn-style filter-btn"><b>filter.it</b></button>
                    <div className="filter-dropdown-content">
                        <button ><b>Pinned</b></button>
                        <button ><b>Most Liked</b></button>
                    </div>
                </div>
                <div className="tagList">
                    {this.showTags(this.state.tags)}
                </div>
            </div>
        );
    }
}

export default TagList
