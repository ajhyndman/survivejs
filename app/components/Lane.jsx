import AltContainer from 'alt-container';
import React from 'react';
import {DropTarget} from 'react-dnd';

import Editable from './Editable.jsx';
import ItemTypes from '../constants/itemTypes';
import LaneActions from '../actions/LaneActions';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import Notes from './Notes.jsx';


const noteTarget = {
    hover(targetProps, monitor) {
        const targetId = targetProps.lane.id;
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;

        if (monitor.isOver({ shallow: true })) {
            NoteActions.assignLane.defer({sourceId, targetId});
        }
    }
};


@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
}))
class Lane extends React.Component {
    constructor(props) {
        super(props);

        const id = props.lane.id;

        this.addNote = this.addNote.bind(this, id);
    };

    render() {
        const {connectDropTarget, lane, ...props} = this.props;

        return connectDropTarget(
            <div className="col s12 m6 l4">
                <div {...props} className="card grey lighten-5">
                    <div
                        className="section"
                        onClick={this.activateLaneEdit}
                        style={{overflow: 'hidden'}}>
                        <div className="col s3">
                            <button className="waves-effect waves-light btn-floating blue-grey left" onClick={this.addNote}>＋</button>
                        </div>
                        <Editable
                            className="card-title center-align col s6"
                            editing={lane.editing}
                            value={lane.name}
                            onEdit={this.editName}
                        />
                        <div className="col s3">
                            <button className="waves-effect waves-dark btn-floating grey lighten-5 right blue-grey-text text-darken-5 right" onClick={this.deleteLane}>⨉</button>
                        </div>
                    </div>
                    <AltContainer
                        stores={[NoteStore]}
                        inject={{
                            notes: () => NoteStore.getNotesByLane(lane.id)
                        }}
                    >
                        <Notes
                            onValueClick={this.activateNoteEdit}
                            onEdit={this.editNote}
                            onDelete={this.deleteNote}
                        />
                    </AltContainer>
                </div>
            </div>
        );
    };

    editName = (name) => {
        const laneId = this.props.lane.id;

        LaneActions.update({id: laneId, name, editing: false})
    };

    deleteLane = () => {
        const laneId = this.props.lane.id;

        LaneActions.delete(laneId);
    };

    activateLaneEdit = () => {
        const laneId = this.props.lane.id;

        LaneActions.update({id: laneId, editing: true})
    };

    activateNoteEdit(noteId) {
        NoteActions.update({id: noteId, editing: true})
    };

    addNote(laneId, e) {
        e.stopPropagation();

        NoteActions.create({task: 'New task', lane: laneId});
    };

    editNote(noteId, task) {
        NoteActions.update({id: noteId, task, editing: false});
    };

    deleteNote(noteId, e) {
        e.stopPropagation();

        NoteActions.delete(noteId);
    };
}


export default Lane;