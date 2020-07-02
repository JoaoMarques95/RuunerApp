import React from "react";
import MapContainer from "./MapContianer";
import About from "./about";
import Menu from "./Menu";
import "./app.css";
import axios from "axios";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:5000/").then((result) => {
      console.log(result, "api");
    });
  }

  render() {
    console.log(this.state.data, "data");
    return (
      <Router>
        <div>
          <Menu />
          <Switch>
            <Route path="/" exact component={MapContainer} />
            {/*This one redirects to the new route as well*/}
            <Route path="/New-Route" component={MapContainer} />
            <Route path="/Last-Routes" component={About} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
