//*******************SET-UP*******************//
//add a function that format csv to .txt so we can edit the text.
//We will remove all the unneed text and the remaing text
//we will parse it to d3
d3.text('data-mannen-vrouwen.csv')
  .mimeType('text/plain;charset=iso88591')
  .get(onload);

//Function that clean the data so we can use it for D3
function onload(err, text) {
  if (err) throw err;
  //replace unnecessary symbols
  text = text.replace(/";"/g, ",").replace(/"/g, '').trim();
  //get everything from the total dataset
  var dataStart = text.indexOf('Mannen');
  var dataEnd = text.indexOf('©');
  //Remove unneeded text
  text = text.slice(dataStart, dataEnd);

  //Add function that remap the data so we have an array of data that we can use
  function map(d) {
    let data = {
      gender: d[0],
      year: d[2],
      underweight: d[4],
      normalweight: d[5],
      overweight: d[6]
    }
    return data
  }

  //Parse the data
  var data = d3.csvParseRows(text, map);

  // For easy acces to the data, we will nest it. So we can select only the "man" data or the  "wome data"
  var nestData = d3.nest()
    .key(function(d) {
      return d.gender;
    })
    .entries(data).map(function(d) {
      return {
        gender: d.key,
        values: d.values
      }
    });

  //This variable is created so we can acces the man or the womans data
  var menData = nestData[0].values;
  var womanData = nestData[1].values;

  //This bar chart is based on the bar chart of d3noob
  //src: https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
  //From here ------------------------------------------------------------------->
  // set the dimensions and margins of the graph
  var svg = d3.select("svg"),
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20
    },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set the ranges
  var x = d3.scaleBand().rangeRound([40, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the line
  var valueline = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) {
      return x(d.year);
    })
    .y(function(d) {
      return y(d.overweight);
    });

  // Scale the range of the data
  x.domain(menData.map(function(d) {
    return d.year;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.overweight
  })]);

  // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', 'x-ax')
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
    .attr('class', 'y-ax')
    .attr('transform', 'translate(40)')
    .call(d3.axisLeft(y));

  var gender = g.selectAll(".gender")
    .data(nestData)
    .enter()
    .append('g')
    .attr('class', 'gender')

  // Add the valueline path.
  gender.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return valueline(d.values)
    })
    .attr("stroke", "red");
  //To here<----------------------------------------------------------------------



  // // Update
  // dot.attr("cx", function(d) {
  //     return x(d.year)
  //   })
  //   .attr("cy", function(d) {
  //     return x(d.overweight)
  //   });

  //Update graph when the menu items are clicked
  d3.selectAll('.menuitem button').on("click", function() {
    //Get the value of the button
    var dataValue = this.value.toString();
    y.domain([0, d3.max(data, function(d) {
      //It is used here to determine which data to show
      return d[dataValue];
    })]);

    /* valueline is created here again, because with
    the variable dataValue we determine the the y position
    from the right dataset*/
    var valueline = d3.line()
      .curve(d3.curveMonotoneX)
      .x(function(d) {
        return x(d.year);
      })
      .y(function(d) {
        return y(d[dataValue]); //determine wich dataset
      });

    //Select the element which we will apply to change to
    var svg = d3.select("svg").transition();
    var gender = g.selectAll(".line").data(nestData);

    gender.exit().remove();
    gender.enter()
      .append('g')
      .attr('class', 'gender');

    // Make the changes
    svg.selectAll(".line") // change the line
      .duration(750)
      .attr("d", function(d) {
        return valueline(d.values)
      });
    svg.select(".y-ax") // change the y axis
      .duration(750)
      .call(d3.axisLeft(y));
  });

}
