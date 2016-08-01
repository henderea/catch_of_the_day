var React              = require('react');
var ReactDOM           = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var ReactRouter = require('react-router');
var Router      = ReactRouter.Router;
var Route       = ReactRouter.Route;
import { browserHistory } from 'react-router';

// var $ = require('jquery');

var h = require('./helpers');

//Firebase

var Rebase = require('re-base');
var base   = Rebase.createClass('https://catch-of-the-day-374f3.firebaseio.com');

/*
 Form auto-sync components
 */

import { SyncInputText, SyncSelect, SyncTextArea } from './form_controls';

/*
 App
 */

var App = React.createClass({
                              getInitialState:     function() {
                                return {
                                  fishes: {},
                                  order:  {}
                                }
                              },
                              componentDidMount:   function() {
                                base.syncState(`${this.props.params.storeId}/fishes`, {
                                  context: this,
                                  state:   'fishes'
                                });

                                var localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

                                if(localStorageRef) {
                                  this.setState(
                                    {
                                      order: JSON.parse(localStorageRef)
                                    }
                                  );
                                }
                              },
                              componentWillUpdate: function(nextProps, nextState) {
                                localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
                              },
                              addToOrder:          function(key) {
                                this.state.order[key] = this.state.order[key] + 1 || 1;
                                this.setState({ order: this.state.order });
                              },
                              removeFromOrder:     function(key) {
                                delete this.state.order[key];
                                this.setState({ order: this.state.order });
                              },
                              addFish:             function(fish) {
                                var timestamp                          = (new Date()).getTime();
                                this.state.fishes[`fish-${timestamp}`] = fish;
                                this.setState({ fishes: this.state.fishes });
                              },
                              removeFish:          function(key) {
                                if(confirm(`Are you sure you want to remove ${this.state.fishes[key].name}?`)) {
                                  this.state.fishes[key] = null;
                                  this.setState({ fishes: this.state.fishes });
                                }
                              },
                              loadSamples:         function() {
                                this.setState(
                                  {
                                    fishes: require('./sample-fishes')
                                  }
                                );
                              },
                              renderFish:          function(key) {
                                return (
                                  <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
                                );
                              },
                              render:              function() {
                                return (
                                  <div className="catch-of-the-day">
                                    <div className="menu">
                                      <Header tagline="Fresh Seafood Market" />
                                      <ul className="list-of-fish">
                                        {Object.keys(this.state.fishes).map(this.renderFish)}
                                      </ul>
                                    </div>
                                    <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
                                    <Inventory context={this} addFish={this.addFish} removeFish={this.removeFish} loadSamples={this.loadSamples} fishes={this.state.fishes} />
                                  </div>
                                );
                              }
                            });

/*
 Fish
 */

var Fish = React.createClass({
                               propTypes:     {
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
                               },
                               onButtonClick: function() {
                                 this.props.addToOrder(this.props.index);
                               },
                               render:        function() {
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
                             });

/*
 Add Fish Form
 */

var AddFishForm = React.createClass({
                                      propTypes:               {
                                        addFish: React.PropTypes.func.isRequired
                                      },
                                      getInitialState:         function() {
                                        return {
                                          name:         '',
                                          price:        '',
                                          status:       'available',
                                          desc:         '',
                                          image:        '',
                                          imageDisplay: 'http://vignette3.wikia.nocookie.net/spore/images/6/6c/Question-mark.png/revision/latest?cb=20110427230528'
                                        };
                                      },
                                      handleImageUpdate:       function(field, value) {
                                        this.setState({ imageDisplay: value });
                                      },
                                      handleImageDisplayError: function(e) {
                                        e.preventDefault();
                                        this.setState({ imageDisplay: 'http://vignette3.wikia.nocookie.net/spore/images/6/6c/Question-mark.png/revision/latest?cb=20110427230528' });
                                      },
                                      createFish:              function(e) {
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
                                      },
                                      render:                  function() {
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
                                    });

/*
 Header
 */

var Header = React.createClass({
                                 propTypes: {
                                   tagline: React.PropTypes.string.isRequired
                                 },
                                 render:    function() {
                                   return (
                                     <header className="top">
                                       <h1>
                                         Catch
                                         <span className="ofThe">
                                           <span className="of">of</span>
                                           <span className="the">the</span>
                                         </span>
                                         Day
                                       </h1>
                                       <h3 className="tagline"><span>{this.props.tagline}</span></h3>
                                     </header>
                                   );
                                 }
                               });
/*
 Order
 */

var Order = React.createClass({
                                propTypes:   {
                                  fishes:          React.PropTypes.object.isRequired,
                                  order:           React.PropTypes.object.isRequired,
                                  removeFromOrder: React.PropTypes.func.isRequired
                                },
                                renderOrder: function(key) {
                                  var fish         = this.props.fishes[key];
                                  var count        = this.props.order[key];
                                  var removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>;
                                  if(!fish) {
                                    return (
                                      <li key={key}>Sorry, fish no longer available {removeButton}</li>
                                    )
                                  }
                                  return (
                                    <li key={key}>
                                      <span>
                                        <CSSTransitionGroup
                                          component="span"
                                          transitionName="count"
                                          transitionEnterTimeout={250}
                                          transitionLeaveTimeout={250}
                                        >
                                          <span key={count}>{count}</span>
                                        </CSSTransitionGroup>
                                      <span>{h.pluralize(count, 'lb', 'lbs')} {fish.name}</span>{removeButton}
                                      </span>
                                      <span className="price">{h.formatPrice(count * fish.price)}</span>
                                    </li>
                                  )
                                },
                                render:      function() {
                                  var orderIds = Object.keys(this.props.order);
                                  var total    = orderIds.reduce((prevTotal, key) => {
                                    var fish        = this.props.fishes[key];
                                    var count       = this.props.order[key];
                                    var isAvailable = fish && fish.status === 'available';

                                    if(fish && isAvailable) {
                                      return prevTotal + (count * parseInt(fish.price) || 0)
                                    }
                                    return prevTotal;
                                  }, 0);
                                  return (
                                    <div className="order-wrap">
                                      <h2 className="order-title">Your Order</h2>
                                      <CSSTransitionGroup
                                        className="order"
                                        component="ul"
                                        transitionName="order"
                                        transitionEnterTimeout={500}
                                        transitionLeaveTimeout={500}
                                      >
                                        {orderIds.map(this.renderOrder)}
                                        <li className="total">
                                          <strong>Total:</strong>
                                          {h.formatPrice(total)}
                                        </li>
                                      </CSSTransitionGroup>
                                    </div>
                                  );
                                }
                              });
/*
 Inventory
 */

var Inventory = React.createClass({
                                    propTypes:       {
                                      fishes:      React.PropTypes.object.isRequired,
                                      context:     React.PropTypes.object.isRequired,
                                      addFish:     React.PropTypes.func.isRequired,
                                      removeFish:  React.PropTypes.func.isRequired,
                                      loadSamples: React.PropTypes.func.isRequired
                                    },
                                    renderInventory: function(key) {
                                      return (
                                        <div className="fish-edit" key={key}>
                                          <SyncInputText context={this.props.context} field={`fishes.${key}.name`} placeholder="Fish Name" />
                                          <SyncInputText context={this.props.context} field={`fishes.${key}.price`} placeholder="Fish Price" />
                                          <SyncSelect context={this.props.context} field={`fishes.${key}.status`} options={{ "available": "Fresh!", "unavailable": "Sold Out!" }} />
                                          <SyncTextArea context={this.props.context} field={`fishes.${key}.desc`} placeholder="Desc" />
                                          <SyncInputText context={this.props.context} field={`fishes.${key}.image`} placeholder="URL to Image" />
                                          <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
                                        </div>
                                      );
                                    },
                                    render:          function() {
                                      return (
                                        <div>
                                          <h2>Inventory</h2>
                                          {Object.keys(this.props.fishes).map(this.renderInventory)}
                                          <AddFishForm addFish={this.props.addFish} />
                                          <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
                                        </div>
                                      );
                                    }
                                  });

/*
 Store Picker
 This will let us make <StorePicker/>
 */

var StorePicker = React.createClass({
                                      getInitialState:     function() {
                                        return { storeId: h.getFunName() };
                                      },
                                      handleStoreIdChange: function(e) {
                                        this.setState({ storeId: e.target.value });
                                      },
                                      goToStore:           function(e) {
                                        e.preventDefault();
                                        var storeId = this.state.storeId;
                                        browserHistory.push(`/store/${storeId}`);
                                      },
                                      render:              function() {
                                        return (
                                          <form className="store-selector" onSubmit={this.goToStore}>
                                            <h2>Please Enter A Store</h2>
                                            <input type="text" ref="storeId" value={this.state.storeId} onChange={this.handleStoreIdChange} required="required" />
                                            <input type="submit" />
                                          </form>
                                        );
                                      }
                                    });

/*
 Not Found
 */

var NotFound = React.createClass({
                                   render: function() {
                                     return (
                                       <h1>Not Found</h1>
                                     );
                                   }
                                 });

/*
 Routes
 */

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));