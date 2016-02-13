import React from 'react';

import Note from './Note.jsx';
import NoteActions from '../actions/NoteActions';


const Notes = ({notes, onValueClick, onEdit, onDelete}) => {
    return (
        <ul className="card-content">{notes.map((note) =>
            <Note
                editing={note.editing}
                id={note.id}
                key={note.id}
                note={note}
                notes={notes}
                onDelete={onDelete}
                onEdit={onEdit}
                onMove={NoteActions.move}
                onValueClick={onValueClick}>
            </Note>
        )}</ul>
    );
};

export default Notes;