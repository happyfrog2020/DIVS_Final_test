const width = 960;
const height = 500;
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x0 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);


const x1 = d3.scaleBand()
  .padding(0.05);

const y = d3.scaleLinear()
  .rangeRound([height, 0]);

const xAxis = d3.axisBottom(x0);

const yAxis = d3.axisLeft(y)
  .tickFormat(d3.format(".2s"));

d3.csv("./women-stem.csv", data => {
  // grouping the data by major and creates an array ti hold objects in each major.
  const majors = d3.nest()
    .key(d => d.Major)
    //wait to add men and women
    .entries(data);
    //not able to show the array
    // console.log(majors);
  

//mapping the array with genders
  x0.domain(majors.map(d => d.key));
  //sets the domain of the x1 scale to be an array of men and women
  x1.domain(["Men", "Women"]).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, d => d.Total)]);
  console.log(majors);


  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Population");

  const major = svg.selectAll(".major")
    .data(majors)
    .enter().append("g")
    .attr("class", "major")
    .attr("transform", d => `translate(${x0(d.key)},0)`);

    // reference: https://dataviz.unhcr.org/tools/d3/d3_grouped_column_chart.html
    // bar for men
  major.selectAll("rect")
    .data(d => d.values)
    .enter().append("rect")
    .attr("class", "male")
    .attr("x", d => x1("Men"))
    .attr("y", d => y(d.Men))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y(d.Men))
    .style("fill", "#6B78FF");


  //bar for women
    major.selectAll("rect")
    .data(d => d.values)
    .enter().append("rect")
    .attr("class", "female")
    .attr("x", d => x1("Women"))
    .attr("y", d => y(d.Women))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y(d.Women))
    .style("fill", "##FF3E9B");
});