import React from 'react';
import Fish from './Fish';
import Order from './Order';
import Header from './Header';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';

import base from '../base';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.addFish = this.addFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    // Initial State
    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    // check if in local storage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    // update state
    const fishes = {...this.state.fishes};
    // add in new state
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;

    // set state
    this.setState({ fishes });
  }

  removeFish(key) {
    // update state
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({fishes});
  }

  updateFish(key, fish) {
    const fishes = {...this.state.fishes};
    fishes[key] = fish;
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    })
  }

  addToOrder(key) {
    // copy order state
    const order = {...this.state.order};
    //Update or add new number
    order[key] = order[key] + 1 || 1;
    // update state
    this.setState({ order })
  }

  removeFromOrder(key) {
    const order = {...this.state.order};

    delete order[key];
    this.setState({order});

    console.log('removing order')
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes)
                    .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order
          removeFromOrder={this.removeFromOrder}
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params} />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          fishes={this.state.fishes}
          loadSamples={this.loadSamples} />
      </div>
    )
  }
}

export default App;
