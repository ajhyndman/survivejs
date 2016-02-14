import AltContainer from 'alt-container';
import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Lanes from 'Lanes';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';


@DragDropContext(HTML5Backend)
class App extends React.Component {
    render() {
        return (
            <div className="blue-grey-text text-darken-2 container">
                <div className="section">
                    <button className="waves-effect waves-light btn-floating blue-grey" onClick={this.addLane}>＋</button>
                </div>
                <AltContainer
                    stores={[LaneStore]}
                    inject={{
                        lanes: () => LaneStore.getState().lanes
                    }}
                >
                    <Lanes />
                </AltContainer>
            </div>
        );
    };

    addLane() {
        LaneActions.create({name: 'New lane'});
    }
};


export default App;