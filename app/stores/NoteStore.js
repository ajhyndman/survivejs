import alt from '../lib/alt';
import uuid from 'node-uuid';

import NoteActions from '../actions/NoteActions';


class NoteStore {
    constructor() {
        this.bindActions(NoteActions);

        this.notes = [];

        this.exportPublicMethods({
            assignLane: this.assignLane.bind(this),
            getNotesByLane: this.getNotesByLane.bind(this)
        });
    }

    create(note) {
        const notes = this.notes;

        note.id = uuid.v4();

        this.setState({
            notes: notes.concat(note)
        });
    }

    delete(id) {
        this.setState({
            notes: this.notes.filter(note => note.id !== id)
        });
    }

    assignLane({sourceId, targetId}) {
        const notes = this.notes.map(note => {
            if (note.id === sourceId) {
                return Object.assign({}, note, { lane: targetId });
            }
            return note;
        });

        this.setState({notes});
    }

    move({sourceId, targetId}) {
        const sourceNoteIndex = this.notes.findIndex(function (element, index) {
            return (element.id === sourceId) ? true : false;
        });

        // extract sourceNote
        const before = this.notes.slice(0, sourceNoteIndex);
        const sourceNote = this.notes[sourceNoteIndex];
        const after = this.notes.slice(sourceNoteIndex + 1, this.notes.length);
        const result = before.concat(after);

        // find the targetNote
        const targetNoteIndex = result.findIndex(function (element, index) {
            return (element.id === targetId) ? true : false;
        });

        // ensure the sourceNote ends up in the right lane
        sourceNote.lane = result[targetNoteIndex].lane;

        // reinsert the sourceNote
        result.splice(targetNoteIndex, 0, sourceNote);
        this.setState({notes: result});
    }

    update(updatedNote) {
        const notes = this.notes.map(note => {
            if (note.id === updatedNote.id) {
                return Object.assign({}, note, updatedNote);
            }
            return note;
        });

        // This is same as `this.setState({notes: notes})`
        this.setState({notes});
    }

    getNotesByLane(lane) {
        return this.notes.filter(note => note.lane === lane);
    }
}


export default alt.createStore(NoteStore, 'NoteStore');