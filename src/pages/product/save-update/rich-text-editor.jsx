import React from 'react';
import PropTypes from 'prop-types';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

export default class RichTextEditor extends React.Component {
    static  propTypes = {
        detail: PropTypes.string
    };
    constructor(props){
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(this.props.detail)
        };
    }
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    };
    render () {

        const {editorState} = this.state;

        return (
            <div style={{border: '1px solid #d9d9d9', height: 300, borderRadius: 4}}>
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                />
            </div>
        )
    }
}