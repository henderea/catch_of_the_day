/*
 Fish
 */

import React from 'react';
import h from '../helpers';
import autobind from 'autobind-decorator';

@autobind
class Fish extends React.Component {
  static propTypes = {
    addToOrder: React.PropTypes.func.isRequired,
    index:      React.PropTypes.string.isRequired,
    details:    React.PropTypes.shape(
      {
        name:   React.PropTypes.string.isRequired,
        price:  React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
        status: React.PropTypes.oneOf(['available', 'unavailable']).isRequired,
        desc:   React.PropTypes.string.isRequired,
        image:  React.PropTypes.string.isRequired
      }
    )
  };

  onButtonClick() {
    this.props.addToOrder(this.props.index);
  }

  render() {
    var details     = this.props.details;
    var isAvailable = details.status === 'available';
    var buttonText  = (isAvailable ? 'Add To Order' : 'Sold Out!');
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  }
}

export default Fish;