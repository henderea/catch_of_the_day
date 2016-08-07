/*
 Add Fish Form
 */

import React from 'react';
import { SyncInputText, SyncSelect, SyncTextArea } from './form/controls';
import autobind from 'autobind-decorator';

@autobind
class AddFishForm extends React.Component {
  static propTypes = {
    addFish: React.PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      name:         '',
      price:        '',
      status:       'available',
      desc:         '',
      image:        '',
      imageDisplay: 'http://vignette3.wikia.nocookie.net/spore/images/6/6c/Question-mark.png/revision/latest?cb=20110427230528'
    };
  }

  handleImageUpdate(field, value) {
    this.setState({ imageDisplay: value });
  }

  handleImageDisplayError(e) {
    e.preventDefault();
    this.setState({ imageDisplay: 'http://vignette3.wikia.nocookie.net/spore/images/6/6c/Question-mark.png/revision/latest?cb=20110427230528' });
  }

  createFish(e) {
    e.preventDefault();
    var fish = {
      name:   this.state.name,
      price:  this.state.price,
      status: this.state.status,
      desc:   this.state.desc,
      image:  this.state.image
    };
    this.props.addFish(fish);
    this.setState(this.getInitialState());
  }

  render() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <SyncInputText context={this} field="name" placeholder="Fish Name" />
        <SyncInputText context={this} field="price" placeholder="Fish Price" />
        <SyncSelect context={this} field="status" options={{ "available": "Fresh!", "unavailable": "Sold Out!" }} />
        <SyncTextArea context={this} field="desc" placeholder="Desc" />
        <SyncInputText context={this} field="image" placeholder="URL to Image" onChange={this.handleImageUpdate} />
        <div style={{ textAlign: "center", width: "100%" }}>
          <img src={this.state.imageDisplay} style={{ maxWidth: "100%", maxHeight: "100%" }} onError={this.handleImageDisplayError} />
        </div>
        <button type="submit">+ Add Item</button>
      </form>
    );
  }
}

export default AddFishForm;