import React, {Component} from 'react'
import './App.css'
import * as d3 from 'd3'

import Child1 from "./Child1.js"
import Child2 from './Child2.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }
    }

    componentDidMount() {
        d3.csv(`${process.env.PUBLIC_URL}/tips.csv`)
        .then(csvData => {
            this.setState({data: csvData})
        })
    }

    render() {
        return (
            <div className="app-root">
                <Child1 data={this.state.data} />
                <hr />
                <Child2 data={this.state.data} />
            </div>
        );
    }
}

export default App;