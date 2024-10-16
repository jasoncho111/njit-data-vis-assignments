import React, {Component} from 'react'
import * as d3 from 'd3'

class Child2 extends Component {
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

        var aggregateData = d3.flatRollup(
            data,
            group => d3.mean(group, d => d.tip), // aggregate function
            d => d.day // group by day
        )

        var container = d3.select(".c2_div").select(".c2_svg").attr("width", w).attr("height", h).select(".c2_g1").attr("transform", `translate(${margin.left}, ${margin.top})`)

        var xdata = aggregateData.map(e => e[0])
        var ydata = aggregateData.map(e => e[1])

        var xScale = d3.scaleBand().domain(xdata).range([0, w - margin.left - margin.right]).padding(0.2);
        var yScale = d3.scaleLinear().domain([0, d3.max(ydata)]).range([h - margin.top - margin.bottom, 0])

        var g_h = h - margin.top - margin.bottom;
        container.selectAll("rect").data(aggregateData).join("rect").attr("y", d => yScale(d[1])).attr("x", d => xScale(d[0])).attr("height", d => g_h - yScale(d[1])).attr("width", xScale.bandwidth()).attr("fill", "#69b3a2");
        
        var x_axis_g = d3.select(".c2_svg").selectAll(".c2_x_axis_g").data([0]).join("g").attr("transform", `translate(${margin.left}, ${h - margin.bottom})`).attr("class", "c2_x_axis_g");
        var x_axis_generator = d3.axisBottom(xScale);
        x_axis_g.call(x_axis_generator)
        
        var y_axis_g = d3.select(".c2_svg").selectAll(".c2_y_axis_g").data([0]).join("g").attr("transform", `translate(${margin.left}, ${margin.top})`).attr("class", "c2_y_axis_g")
        var y_axis_generator = d3.axisLeft(yScale);
        y_axis_g.call(y_axis_generator);

        d3.select(".c2_svg").selectAll(".c2_title").data([0]).join("text").text("Average Tip by Day").attr("text-anchor", "middle").attr("transform", `translate(${margin.left + 0.5*(w - margin.left - margin.right)}, 25)`).attr("class", "c2_title");
        d3.select(".c2_svg").selectAll(".c2_x_axis_label").data([0]).join("text").text("Day").attr("text-anchor", "middle").attr("transform", `translate(${margin.left + 0.5*(w - margin.left - margin.right)}, ${h - 0.5*margin.bottom})`).attr("class", "c2_x_axis_label")
        d3.select(".c2_svg").selectAll(".c2_y_axis_label").data([0]).join("text").text("Average Tip").attr("text-anchor", "middle").attr("transform", `translate(${margin.left/2}, ${margin.top + g_h/2}) rotate(-90)`).attr("class", "c2_y_axis_label");
    }

    render () {
        return(
            <div className='c2_div'>
                <svg className='c2_svg'>
                    <g className='c2_g1'></g>
                </svg>
            </div>
        );
    }
}

export default Child2;