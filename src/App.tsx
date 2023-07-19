import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {GanttDemo} from "./component/gantt-task/gantt/gantt-demo"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={GanttDemo}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
