import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import Editable from './Editable.jsx';
import ItemTypes from '../constants/itemTypes';


const noteSource = {
    beginDrag(props) {
        return {
            id: props.id
        };
    }
};

const noteTarget = {
    hover(targetProps, monitor) {
        const targetId = targetProps.id;
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;

        if (sourceId !== targetId) {
            targetProps.onMove({sourceId, targetId});
        }
    }
};

@DragSource(ItemTypes.NOTE, noteSource, (connect) => ({
  connectDragSource: connect.dragSource()
}))
@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
class Note extends React.Component {
    render() {
        const { connectDragSource, connectDropTarget, note, notes, onValueClick,
            onEdit, onDelete, onMove, editing, id} = this.props;

        // Pass through if we are editing
        const dragSource = editing ? a => a : connectDragSource;

        return dragSource(connectDropTarget(<li
            className="card card-panel"
            style={{padding: 0}}>
            <div>
                <Editable
                    className="card-content"
                    editing={note.editing}
                    value={note.task}
                    onValueClick={onValueClick.bind(null, note.id)}
                    onEdit={onEdit.bind(null, note.id)}
                    onMove={onMove.bind(null, note.id)}
                />
                <div
                    className="card-action"
                    style={{overflow: 'auto'}}>
                    <button
                        className="waves-effect btn-floating grey lighten-5 right blue-grey-text text-darken-2"
                        onClick={onDelete.bind(null, note.id)}
                    >⨉</button>
                </div>
            </div>
        </li>));
    }
}


export default Note;