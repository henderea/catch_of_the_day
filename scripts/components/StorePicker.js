/*
 Store Picker
 This will let us make <StorePicker/>
 */

import React from 'react';
import { browserHistory } from 'react-router';
import h from '../helpers';
import { SyncInputText } from './form/controls';
import autobind from 'autobind-decorator';

@autobind
class StorePicker extends React.Component {
  constructor() {
    super();
    this.state = { storeId: h.getFunName() };
  }

  goToStore(e) {
    e.preventDefault();
    var storeId = this.state.storeId;
    browserHistory.push(`/store/${storeId}`);
  }

  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter A Store</h2>
        <SyncInputText context={this} field="storeId" required={true} />
        <input type="submit" />
      </form>
    );
  }
}

export default StorePicker;