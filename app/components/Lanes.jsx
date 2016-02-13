import React from 'react';
import Lane from './Lane.jsx';


export default ({lanes}) => {
    return (
        <div className="row">{lanes.map(lane =>
            <Lane key={lane.id} lane={lane} />
        )}</div>
    );
}