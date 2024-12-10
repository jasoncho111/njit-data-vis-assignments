import React, { Component } from "react";
import * as d3 from "d3"

class ForceLayout extends Component {
  constructor(props) {
    super(props)
    this.tweetDetailsRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.data.length > 0) {
        this.renderVisual();
    }
  }

  componentDidUpdate() {
    if (this.props.data.length > 0) {
        this.renderVisual();
    }
  }

  colorBy = "sentiment"
  tweetDetails = []

  renderVisual = () => {
    var data = this.props.data;
    data.forEach(d => d.Selected = false);
    console.log(data)
    data = data.slice(0, 300);

    const monthOrder = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
      ];
      
    const months = [...new Set(data.map(e => e.Month))].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    var margin = {top: 50, left: 50, right: 150, bottom: 50};

    var height = 600, width = 1000;
    var innerHeight = height - margin.top - margin.bottom, innerWidth = width - margin.left - margin.right;

    var svg = d3.select(".svgDiv").select(".my_svg").attr("width", width).attr("height", height)

    var visContainer = svg.selectAll(".visualization").data([0]).join("g").attr("class", "visualization").attr("transform", `translate(${margin.left + innerWidth/2}, ${margin.top})`)

    var circleSize = 6;
      
    var yScale = d3.scaleBand().domain(months).range([0, height-margin.top])

    const sentimentColorScale = d3.scaleLinear().domain([-1, 0, 1]).range(["red", "#ECECEC", "green"]);
    const subjectivityColorScale = d3.scaleLinear().domain([0,1]).range(["#ECECEC","#4467C4"]);

    d3.forceSimulation(data).force("y", d3.forceY().y(d => yScale(d.Month) + yScale.bandwidth()/2 )).force("x", d3.forceX().x(0).strength(.005)).force("collision", d3.forceCollide().radius(circleSize+1))
        .on("tick", () => {
            visContainer.selectAll("circle").data(data).join("circle").attr("r", circleSize).attr("cx", d => d.x).attr("cy", d => d.y).attr("fill", d => this.colorBy === "sentiment" ? sentimentColorScale(d.Sentiment) : subjectivityColorScale(d.Subjectivity))
            .attr("stroke-width", "2px").attr("stroke", d => d.Selected ? "black" : "None")
            .on("click", (e, d) => {
              d.Selected = !d.Selected;
              d3.select(e.target).attr("stroke", el => el.Selected ? "black" : "None");
              if (d.Selected) this.tweetDetails = [d.RawTweet, ...this.tweetDetails];
              else {
                var ind = this.tweetDetails.indexOf(d.RawTweet);
                this.tweetDetails.splice(ind, 1);
              }
              var curRef = this.tweetDetailsRef.current;
              curRef.innerHTML = "";
              this.tweetDetails.forEach(detail => curRef.innerHTML = curRef.innerHTML + `<p>${detail}</p>` )
            })
        });

    //add month labels
    svg.selectAll(".monthGroup").data([0]).join("g").attr("class", "monthGroup").attr("transform", `translate(5, ${margin.top})`)
        .selectAll(".monthLabels").data(months).join("text").attr("x", margin.left/2).attr("y", d => yScale(d) + yScale.bandwidth()/2).attr("class", "monthLabels").text(d => d);

    //render legend
    var colorScale = this.colorBy === "sentiment" ? sentimentColorScale : subjectivityColorScale;
    var legend = svg.selectAll(".legend").data([0]).join("g").attr("class", "legend").attr("transform", `translate(${width - margin.right}, ${margin.top})`)
    var startY = yScale(months[0]) + yScale.bandwidth()/2
    var endY = yScale(months[months.length - 1]) + yScale.bandwidth()/2

    //create gradient
    var defs = legend.selectAll(".defs").data([0]).join("defs").attr("class", "defs");
    var grad = defs.selectAll(".grad").data([0]).join("linearGradient").attr("class", "grad").attr("id", "gradient").attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
    grad.selectAll("stop").data(colorScale.range()).join("stop").attr("offset", (d, i) => `${(100 / (colorScale.range().length - 1)) * i}%`).attr("stop-color", d => d);

    //draw rect
    legend.selectAll(".gradRect").data([0]).join("rect").attr("class", "gradRect").attr("x", 5).attr("y", startY).attr("width", 25).attr("height", endY - startY).attr("fill", "url(#gradient)")

    //add text
    legend.selectAll(".topText").data([0]).join("text").attr("class", "topText").attr("x", 40).attr("y", startY).attr("dominant-baseline", "hanging").text(this.colorBy === "sentiment" ? "Positive" : "Subjective")
    legend.selectAll(".botText").data([0]).join("text").attr("class", "botText").attr("x", 40).attr("y", endY).text(this.colorBy === "sentiment" ? "Negative" : "Objective")
  }

  handleDropdownChange = (e) => {
    this.colorBy = e.target.value;

    // Update circle colors dynamically
    const sentimentColorScale = d3.scaleLinear().domain([-1, 0, 1]).range(["red", "#ECECEC", "green"]);
    const subjectivityColorScale = d3.scaleLinear().domain([0, 1]).range(["#ECECEC", "#4467C4"]);

    const colorScale = this.colorBy === "sentiment" ? sentimentColorScale : subjectivityColorScale;

    d3.select(".visualization")
      .selectAll("circle")
      .attr("fill", d => colorScale(d[this.colorBy === "sentiment" ? "Sentiment" : "Subjectivity"]));
    
    var legend = d3.selectAll(".legend");
    var grad = legend.selectAll(".grad");
    grad.selectAll("stop").data(colorScale.range()).join("stop").attr("offset", (d, i) => `${(100 / (colorScale.range().length - 1)) * i}%`).attr("stop-color", d => d);

    legend.select(".topText").text(this.colorBy === "sentiment" ? "Positive" : "Subjective")
    legend.select(".botText").text(this.colorBy === "sentiment" ? "Negative" : "Objective")
  }

  render() {
    return (
      <div className="vis_root" style={{marginTop:"20px"}}>
        <div className="dropdownDiv">
            <label htmlFor="color" style={{marginRight: "12px"}}>Color By:</label>
            <select name="color" id="color" onChange={this.handleDropdownChange}>
                <option value="sentiment">Sentiment</option>
                <option value="subjectivity">Subjectivity</option>
            </select>
        </div>
        <div className="svgDiv"><svg className="my_svg"></svg></div>
        <div className="tweetDetails" ref={this.tweetDetailsRef}></div>
      </div>
    );
  }
}

export default ForceLayout;