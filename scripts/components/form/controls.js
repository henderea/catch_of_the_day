import React from 'react';
import h from './helpers';
import autobind from 'autobind-decorator';

@autobind
export class SyncInputText extends React.Component {
  static propTypes = {
    context:     React.PropTypes.object.isRequired,
    onChange:    React.PropTypes.func,
    field:       React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    required:    React.PropTypes.bool
  };

  handleValueChange(e) {
    var value = e.target.value;
    this.props.context.setState(h.setValueInState(this.props.context.state, this.props.field, value));
    if(this.props.onChange) {
      this.props.onChange(this.props.field, value);
    }
  }

  render() {
    return (
      <input type="text" ref={this.props.field} placeholder={this.props.placeholder} value={h.getValueFromState(this.props.context.state, this.props.field)}
             onChange={this.handleValueChange} required={this.props.required} />
    );
  }
}

@autobind
export class SyncTextArea extends React.Component {
  static propTypes = {
    context:     React.PropTypes.object.isRequired,
    onChange:    React.PropTypes.func,
    field:       React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string
  };

  handleValueChange(e) {
    var value = e.target.value;
    this.props.context.setState(h.setValueInState(this.props.context.state, this.props.field, value));
    if(this.props.onChange) {
      this.props.onChange(this.props.field, value);
    }
  }

  render() {
    return (
      <textarea type="text" ref={this.props.field} placeholder={this.props.placeholder} value={h.getValueFromState(this.props.context.state, this.props.field)}
                onChange={this.handleValueChange} />
    );
  }
}

@autobind
export class SyncSelect extends React.Component {
  static propTypes = {
    context:  React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
    field:    React.PropTypes.string.isRequired,
    options:  React.PropTypes.objectOf(React.PropTypes.string).isRequired
  };

  handleValueChange(e) {
    var value = e.target.value;
    this.props.context.setState(h.setValueInState(this.props.context.state, this.props.field, value));
    if(this.props.onChange) {
      this.props.onChange(this.props.field, value);
    }
  }

  makeOption(opt) {
    return (
      <option value={opt} key={opt}>{this.props.options[opt]}</option>
    );
  }

  render() {
    return (
      <select ref={this.props.field} value={h.getValueFromState(this.props.context.state, this.props.field)} onChange={this.handleValueChange}>
        {Object.keys(this.props.options).map(this.makeOption)}
      </select>
    );
  }
}