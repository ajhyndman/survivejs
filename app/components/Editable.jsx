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
        return <textarea
                autoFocus={true}
                className="materialize-textarea"
                ref = {
                    (e) => e ? e.selectionStart = this.props.value.length : null
                }
                defaultValue={this.props.value}
                onBlur={this.finishEdit}
                onKeyPress={this.checkEnter}
                styles={{boxSizing: 'border-box', maxWidth: '100%'}}
            />;
    };

    renderValue = () => {
        return (
            <div onClick={this.props.onValueClick}>
                <div>{this.props.value}</div>
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