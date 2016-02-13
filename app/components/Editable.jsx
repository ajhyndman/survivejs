import React from 'react';


class Editable extends React.Component {
    render() {

        const {value, onEdit, onValueClick, editing, ...props} = this.props;
        // Render the component differently based on state.

        return (
            <div {...props}>
                {editing ? this.renderEdit() : this.renderValue()}
            </div>
        );
    };

    renderEdit = () => {
        // Deal with blur and input handlers.  These map to DOM events.
        return <input type="text"
                ref = {
                    (e) => e ? e.selectionStart = this.props.value.length : null
                }
                autoFocus={true}
                defaultValue={this.props.value}
                onBlur={this.finishEdit}
                onKeyPress={this.checkEnter}
            />;
    };

    renderValue = () => {
        const onDelete = this.props.onDelete;

        return (
            <div onClick={this.props.onValueClick}>
                <span className="value">{this.props.value}</span>
                { onDelete ? this.renderDelete() : null }
            </div>
        );
    };

    renderDelete = () => {
        return (
            <div className="card-action">
                <button
                   className="waves waves-light btn-floating red right"
                   onClick={this.props.onDelete}
                >⨉</button>
            </div>
        );
    };

    checkEnter = (e) => {
        if (e.key === 'Enter') {
            // The user hit *enter*, let's finish up.
            this.finishEdit(e);
        }
    };

    finishEdit = (e) => {
        const value = e.target.value;

        if (this.props.onEdit && value.trim()) {
            this.props.onEdit(value);
        }
    };
};

export default Editable;