import React from "react";
import ReactMarkdown from "react-markdown";

const ImageRenderer = (props) => {
    return <img {...props} style={{maxWidth: '100%'}} />
}

const MarkdownEditor = (props) => {
    const newProps = {...props}
    newProps.renderers = newProps.renderers || {}
    newProps.renderers.image = ImageRenderer
    return (<ReactMarkdown {...newProps}  />)
}

export default MarkdownEditor;