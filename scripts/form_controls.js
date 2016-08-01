var React = require('react');
var h     = require('./form_helpers');

exports.SyncInputText = React.createClass({
                                            propTypes:         {
                                              context:     React.PropTypes.object.isRequired,
                                              onChange:    React.PropTypes.func,
                                              field:       React.PropTypes.string.isRequired,
                                              placeholder: React.PropTypes.string
                                            },
                                            handleValueChange: function(e) {
                                              var value = e.target.value;
                                              this.props.context.setState(h.setValueInState(this.props.context.state, this.props.field, value));
                                              if(this.props.onChange) {
                                                this.props.onChange(this.props.field, value);
                                              }
                                            },
                                            render:            function() {
                                              return (
                                                <input type="text" ref={this.props.field} placeholder={this.props.placeholder} value={h.getValueFromState(this.props.context.state, this.props.field)}
                                                       onChange={this.handleValueChange} />
                                              );
                                            }
                                          });

exports.SyncTextArea = React.createClass({
                                           propTypes:         {
                                             context:     React.PropTypes.object.isRequired,
                                             onChange:    React.PropTypes.func,
                                             field:       React.PropTypes.string.isRequired,
                                             placeholder: React.PropTypes.string
                                           },
                                           handleValueChange: function(e) {
                                             var value = e.target.value;
                                             this.props.context.setState(h.setValueInState(this.props.context.state, this.props.field, value));
                                             if(this.props.onChange) {
                                               this.props.onChange(this.props.field, value);
                                             }
                                           },
                                           render:            function() {
                                             return (
                                               <textarea type="text" ref={this.props.field} placeholder={this.props.placeholder} value={h.getValueFromState(this.props.context.state, this.props.field)}
                                                         onChange={this.handleValueChange} />
                                             );
                                           }
                                         });

exports.SyncSelect = React.createClass({
                                         propTypes:         {
                                           context:  React.PropTypes.object.isRequired,
                                           onChange: React.PropTypes.func,
                                           field:    React.PropTypes.string.isRequired,
                                           options:  React.PropTypes.objectOf(React.PropTypes.string).isRequired
                                         },
                                         handleValueChange: function(e) {
                                           var value = e.target.value;
                                           this.props.context.setState(h.setValueInState(this.props.context.state, this.props.field, value));
                                           if(this.props.onChange) {
                                             this.props.onChange(this.props.field, value);
                                           }
                                         },
                                         makeOption:        function(opt) {
                                           return (
                                             <option value={opt} key={opt}>{this.props.options[opt]}</option>
                                           );
                                         },
                                         render:            function() {
                                           return (
                                             <select ref={this.props.field} value={h.getValueFromState(this.props.context.state, this.props.field)} onChange={this.handleValueChange}>
                                               {Object.keys(this.props.options).map(this.makeOption)}
                                             </select>
                                           );
                                         }
                                       });