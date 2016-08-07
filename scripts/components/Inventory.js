/*
 Inventory
 */

import React from 'react';
import Firebase from 'firebase'
import { SyncInputText, SyncSelect, SyncTextArea } from './form/controls';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import firebaseConfig from '../properties/firebase';

const ref = Firebase.initializeApp(firebaseConfig);

@autobind
class Inventory extends React.Component {
  static propTypes = {
    fishes:      React.PropTypes.object.isRequired,
    context:     React.PropTypes.object.isRequired,
    addFish:     React.PropTypes.func.isRequired,
    removeFish:  React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    params:      React.PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      uid: ''
    }
  }

  getProvider(provider) {
    if(provider === 'twitter') {
      return new Firebase.auth.TwitterAuthProvider();
    } else {
      return new Firebase.auth.GithubAuthProvider();
    }
  }

  authenticate(provider) {
    ref.auth().signInWithPopup(this.getProvider(provider)).then(this.authHandler).catch(this.authError)
  }

  authError(error) {
    console.error(error);
  }

  componentWillMount() {
    ref.auth().onAuthStateChanged((user)=> {
      this.configureForUser(user);
    })
  }

  logout() {
    ref.auth().signOut().then(() => {
      this.setState({ uid: null });
    });
  }

  authHandler(result) {
    this.configureForUser(result.user);
  }

  configureForUser(user) {
    const storeRef = ref.database().ref(this.props.params.storeId);
    storeRef.on('value', (snapshot)=> {
      var data = snapshot.val() || {};
      // claim it as our own if there is no owner already
      if(!data.owner) {
        storeRef.set(
          {
            owner: user.uid
          });
      }

      this.setState(
        {
          uid:   user.uid,
          owner: data.owner || user.uid
        });
    })
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log In with GitHub</button>
        <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')}>Log In with Twitter</button>
      </nav>
    )
  }

  renderInventory(key) {
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
  }

  render() {
    let logoutButton = (
      <button onClick={this.logout}>Log Out!</button>
    );
    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      )
    }
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store</p>
          {logoutButton}
        </div>
      )
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

export default Inventory;