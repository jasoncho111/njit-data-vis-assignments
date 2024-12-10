import React, { Component } from "react";
import "./App.css";
import FileUpload from "./FileUpload";
import ForceLayout from "./ForceLayout";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : []
    };
  }

  set_data = (json_data) => {
    this.setState({ data: json_data });
    console.log(json_data)
  }

  render() {
    return (
      <div>
        <FileUpload set_data={this.set_data}></FileUpload>
        <div className="parent">
          <ForceLayout data={this.state.data}></ForceLayout>
        </div>
      </div>
    );
  }
}

export default App;