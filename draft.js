// set the dimensions and margins of the graph
var margin = {top: 30, right: 100, bottom: 60, left: 100},
    width = 610 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var histo = d3.select("#histo")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("NLDIv2.csv", function(data) {

  // sort data
//   data.sort(function(b, a) {
//     return a.NLDI - b.NLDI;
//   });
var allGroup = ["Spain", "Switzerland", "Nigeria", "USA"]
//var parseYear = d3.timeParse('%Y');
// Reformat the data: we need an array of arrays of {x, y} tuples
var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
  return {
    name: grpName,
    values: data.map(function(d) {
      return {time: d.country, value: +d[grpName]};
    })
  };
});
// I strongly advise to have a look to dataReady with
//console.log(dataReady)

// A color scale: one color for each group
var myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet1);
  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.country; }))
    .padding(0.2);
  histo.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end").selectAll('.tick text')
      .style('font-size', 12);

  // Add Y axis
  
  var y = d3.scaleLinear()
    .domain([0, 1])
    .range([ height, 0]);
  histo.append("g")
    .call(d3.axisLeft(y)).selectAll('.tick text')
    .style('font-size', 12);

    

    histo.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -30 )
    .attr("x", - margin.left )
    .attr("transform", "rotate(-90)")
    .text("NLDI").selectAll('.tick text')
    .style('font-size', 12);

var color = d3.schemeSet1
  // Bars
  var myColor = d3.scaleOrdinal()
      .domain(data)
      .range(d3.schemeSet1);



    // Graph Title
    histo.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("2006 Night Light Development Index");

    histo.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
              .tickSize(-width)
              .tickFormat("")
      );
    

      histo.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d.country); })
        .attr("y", function(d) { return y(d.NLDI); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.NLDI); })
        .attr("fill",(d,i) =>{
          return color[i]
        }  );

})