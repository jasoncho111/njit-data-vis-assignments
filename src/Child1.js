import React, {Component} from 'react'
import * as d3 from 'd3'

class Child1 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: this.props.data
        }
    }

    componentDidMount() {
        if (this.state.data) {
            this.renderChart();
        }
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({ data: this.props.data }, () => {
                this.renderChart();
            });
        }
    }
    
    renderChart = () => {
        if (!this.state.data) return;

        const margin = { top: 80, right: 10, bottom: 80, left: 80 }
        var w = 800;
        var h = 550;

        var data = this.state.data;

        var container = d3.select(".c1_div").select(".c1_svg").attr("width", w).attr("height", h).select(".c1_g1").attr("transform", `translate(${margin.left}, ${margin.top})`)

        var xdata = data.map(e => parseFloat(e.total_bill));
        var ydata = data.map(e => parseFloat(e.tip));

        var xScale = d3.scaleLinear().domain([0, d3.max(xdata)]).range([0, w - margin.left - margin.right]);
        var yScale = d3.scaleLinear().domain([0, d3.max(ydata)]).range([h - margin.top - margin.bottom, 0])

        container.selectAll("circle").data(data).join("circle").attr("cx", d => xScale(d.total_bill)).attr("cy", d => yScale(d.tip)).attr("r", 6).attr("fill", "#69b3a2")

        var x_axis_g = d3.select(".c1_div").select(".c1_svg").selectAll(".c1_x_axis_g").data([0]).join("g").attr("transform", `translate(${margin.left}, ${h - margin.bottom})`).attr("class", "c1_x_axis_g");
        var x_axis_generator = d3.axisBottom(xScale)
        x_axis_g.call(x_axis_generator)
        
        var y_axis_g = d3.select(".c1_div").select(".c1_svg").selectAll(".c1_y_axis_g").data([0]).join("g").attr("transform", `translate(${margin.top}, ${margin.left})`).attr("class", "c1_y_axis_g")
        var y_axis_generator = d3.axisLeft(yScale)
        y_axis_g.call(y_axis_generator)

        d3.select(".c1_svg").selectAll(".c1_title").data([0]).join("text").text("Total Bill vs. Tips").attr("transform", `translate(${margin.left + 0.5*(w - margin.left - margin.right)}, 25)`).attr("text-anchor", "middle").attr("class", "c1_title");
        d3.select(".c1_svg").selectAll(".c1_x_axis_label").data([0]).join("text").text("Total Bill").attr("transform", `translate(${margin.left + 0.5*(w - margin.left - margin.right)}, ${h - margin.bottom + 40})`).attr("text-anchor", "middle").attr("class", "c1_x_axis_label");
        d3.select(".c1_svg").selectAll(".c1_y_axis_label").data([0]).join("text").text("Tips").attr("transform", `translate(${margin.left/2}, ${margin.top + 0.5*(h - margin.top - margin.bottom)}) rotate(-90)`).attr("text-anchor", "middle").attr("class", "c1_y_axis_label");
    }

    render () {
        return(
            <div className='c1_div'>
                <svg className='c1_svg'>
                    <g className='c1_g1'></g>
                </svg>
            </div>
        );
    }
}

export default Child1;