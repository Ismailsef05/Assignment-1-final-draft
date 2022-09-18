// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var histo = d3.select("#histo")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("NLDI.csv", function(data) {

  // X axis: scale and draw:
  let tickLabels = ['A','B','C','D'];
  var x = d3.scaleLinear()
      .domain([0,1])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    histo.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat((d,i) => tickLabels[i])).selectAll('.tick text')
      .style('font-size', 12);

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return d.NLDI; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(4)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, 1]);   // d3.hist has to be called before the Y axis obviously
    histo.append("g")
      .call(d3.axisLeft(y)).selectAll('.tick text')
      .style('font-size', 12);

  // append the bar rectangles to the svg element
  histo.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")
        
        

});

//graph title
histo.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("NLDI of the countries in 2006");

// Y label
histo.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y",  - margin.left + margin.left/2.5)
        .attr("x", - height / 4)
        .attr("transform", "rotate(-90)")
        .text("NLDI ");





