import React, { Component } from 'react';
import './App.css';
import LineGraph from './LineGraph';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>CA Employment App</h1>
        </header>
        <LineGraph />
      </div>
    );
  }
}

export default App;
