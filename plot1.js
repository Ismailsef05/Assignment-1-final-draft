var margin = {top: 40, right: 100, bottom: 50, left: 100},
    width = 610 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#plot1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("GDP_ALL.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["Spain", "Switzerland", "Nigeria", "USA"]
    var parseYear = d3.timeParse('%Y');
    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: parseYear(d.year), value: +d[grpName]};
        })
      };
    });
    // I strongly advise to have a look to dataReady with
     console.log(dataReady)

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet1);
   
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain([parseYear(2001),parseYear(2011)])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)).selectAll('.tick text')
      .style('font-size', 14);
    
    // X label 

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end") 
    .attr("x", width / 2)
    .attr("y",height + margin.bottom -10 )
    .text("Years");

    
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,100000])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y)).selectAll('.tick text')
      .style('font-size', 12);

    // Y label

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y",  - margin.left + 35 )
    .attr("x", (- height / 4 ) + 15)
    .attr("transform", "rotate(-90)")
    .text("GDP per capita (Current US$)");

    // Add the lines
    var line = d3.line()
      .x(function(d) { return x(+d.time) })
      .y(function(d) { return y(+d.value) })
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 2)
        .style("fill", "none")

    // Add the points
    svg
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.name) })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.time) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 4)
        .attr("stroke", "white")

    // Add a legend at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
          .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15)

    // Graph Title
    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("GDP of country per year");

})


