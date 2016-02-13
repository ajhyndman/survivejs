import alt from '../lib/alt';
import LaneActions from '../actions/LaneActions';
import NoteActions from '../actions/NoteActions';
import uuid from 'node-uuid';


class LaneStore {
    constructor() {
        this.bindActions(LaneActions);
        this.lanes = [];
    };

    create(lane) {
        const lanes = this.lanes;

        lane.id = uuid.v4();

        this.setState({
            lanes: lanes.concat(lane)
        });
    };

    delete(id) {
        this.setState({
            lanes: this.lanes.filter((lane) => lane.id !== id)
        });
    };

    update(updatedLane) {
        const lanes = this.lanes.map(lane => {
            if (lane.id === updatedLane.id) {
                return Object.assign({}, lane, updatedLane);
            }

            return lane;
        });

        this.setState({lanes});
    };
}


export default alt.createStore(LaneStore, 'LaneStore');