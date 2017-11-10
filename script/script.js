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
  var dataSetType = 'overweight'; // dit wordt gebruikt bij het inladen

  //This  line chart is based on the bar chart of d3noob
  //src: https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
  //From here ------------------------------------------------------------------->
  // set the dimensions and margins of the graph
  var svg = d3.select("svg"),
    margin = {
      top: 5,
      right: 20,
      bottom: 30,
      left: 30
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
    .attr('class', 'ax x-ax')
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
    .attr('class', 'ax y-ax')
    .attr('transform', 'translate(40)')
    .call(d3.axisLeft(y));

  var gender = g.selectAll(".gender")
    .data(nestData)
    .enter()
    .append('g')
    .attr('class', 'gender')

  // Add the valueline path.
  gender.append("path")
    .attr("class", function(d, i) {
      return 'line ' + d.gender
    })
    .attr("d", function(d) {
      return valueline(d.values)
    })
    .attr("stroke", "#F50057");
  //To here<----------------------------------------------------------------------

  //created dot on top of line
  //Bind data
  var dot = gender.selectAll("dot")
    .data(data);

  //Enter (this will create dom element that arent there)
  dot.enter()
    .append('circle')
    .attr('class', 'dot')
    .attr("r", 5)
    .attr("cx", function(d) {
      return x(d.year)
    })
    .attr("cy", function(d) {
      return y(d.overweight)
    })
    .on("mouseover", showTooltip)
    .on("mouseout", removeTooltip)
    .on("click", renderSankey);

  //function that will render a tooltip
  function showTooltip(d, i) {
    var gender = d.gender;
    var data = d[dataSetType];
    var date = d.year;
    // I want the tooltip slight above the dot, thats why
    //we will add an offset
    var offset = -10;
    //get the x and y
    var xPosition = d3.select(this).attr("cx");
    /*When we select the cy attribute its a string,
    we need to covert it to number so we're able to apply
    the offset*/
    var yPosition = Number(d3.select(this).attr("cy") - offset);

    //show the year in the html
    var year = d3.select('.container-line-chart')
      .append('span')
      .attr('class', 'tooltip year')
      .text(date)

    //render tooltip
    var tooltip = d3.select('.container-line-chart')
      .append('div')
      .attr('class', "tooltip")
      .style('left', xPosition + "px")
      .style('top', yPosition + "px");
    tooltip.append('span')
      .text(gender)
    tooltip.append('span')
      .text('\n' + data + "%");
  }

  //remove tooltip
  function removeTooltip() {
    d3.selectAll('.tooltip').remove();
  }

  //Update graph when the menu items are clicked
  d3.selectAll('.menuitem button').on("click", function() {
    //Get the value of the button
    var dataValue = this.value.toString();
    dataSetType = dataValue;

    //add active state on the buttons
    d3.selectAll('.menuitem button').classed('active', false)
    d3.select(this).attr('class', 'active');

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

    var dot = g.selectAll(".dot").data(data)

    dot.exit().remove();

    //Create element if not exist
    dot.enter()
      .append('circle')
      .attr('class', 'dot')

    //update cy position
    svg.selectAll('.dot')
      .duration(1000)
      .attr("cy", function(d) {
        return y(d[dataValue])
      })
  });

  /////////////////////////////////////////////////////////
  //RENDER SANKEY FUNCTION
  //This is still work in progess
  ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  function renderSankey(d) {
    var gender = d.gender;
    var year = d.year;
    d3.select('.container-sankey-chart img').attr('class', 'active');
    if(gender == 'Mannen'){
      d3.text('data-mannen.csv')
        .mimeType('text/plain;charset=iso88591')
        .get(onload);
    }
    else if(gender == 'Vrouwen'){
      d3.text('data-vrouwen.csv')
        .mimeType('text/plain;charset=iso88591')
        .get(onload);
    }
    //Function that clean the data so we can use it for D3
    function onload(err, text) {
      if (err) throw err;
      //replace unnecessary symbols
      text = text.replace(/";"/g, ",").replace(/"/g, '').trim();

      //get everything from the total dataset
      var dataStart = text.indexOf(gender);
      var dataEnd = text.indexOf('©');
      //Remove unneeded text
      text = text.slice(dataStart, dataEnd);

      //Add function that remap the data so we have an array of data that we can use
      function map(d) {
        let data = {
          gender: d[0],
          age: d[1],
          year: d[3],
          underweight: d[4],
          normalweight: d[5],
          overweight: d[6],
          moderateOverweight: d[7],
          extremeOverweight: d[8]
        }
        return data
      }

      //Parse the data
      var data = d3.csvParseRows(text, map);

      console.log(data);
      // For easy acces to the data, we will nest it. So we can select only the "man" data or the  "wome data"
      var nestData = d3.nest()
        .key(function(d) {
          return d.year;
        })
        .entries(data).map(function(d) {
          return {
            year: d.key,
            values: d.values
          }
        });

      //The sankey is made based on the sankey of d3 d3noob
      //src: https://bl.ocks.org/d3noob/013054e8d7807dff76247b81b0e29030
      //From here --------------------------------------
      var units = "Widgets";

      // set the dimensions and margins of the graph
      var margin = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        },
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

      // format variables
      var formatNumber = d3.format(",.0f"), // zero decimal places
        format = function(d) {
          return formatNumber(d) + " " + units;
        },
        color = d3.scaleOrdinal(d3.schemeCategory20);

      // append the svg object to the body of the page
      // append the svg object to the body of the page
      var svg = d3.select("sankey-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          var svg = d3.select(".sankey-chart"),
            margin = {
              top: 5,
              right: 20,
              bottom: 30,
              left: 30
            },
            width = svg.attr("width") - margin.left - margin.right,
            height = svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set the sankey diagram properties
      var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([width, height]);

      var path = sankey.link();

      // load the data
      d3.json("sankey.json", function(error, graph) {

        sankey
          .nodes(graph.nodes)
          .links(graph.links)
          .layout(32);

        // add in the links
        var link = svg.append("g").selectAll(".link")
          .data(graph.links)
          .enter().append("path")
          .attr("class", "link")
          .attr("d", path)
          .style("stroke-width", function(d) {
            return Math.max(1, d.dy);
          })
          .sort(function(a, b) {
            return b.dy - a.dy;
          });

        // add the link titles
        link.append("title")
          .text(function(d) {
            return d.source.name + " → " +
              d.target.name + "\n" + format(d.value);
          });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
          .data(graph.nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
          .call(d3.drag()
            .subject(function(d) {
              return d;
            })
            .on("start", function() {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
          .attr("height", function(d) {
            return d.dy;
          })
          .attr("width", sankey.nodeWidth())
          .style("fill", function(d) {
            return d.color = color(d.name.replace(/ .*/, ""));
          })
          .style("stroke", function(d) {
            return d3.rgb(d.color).darker(2);
          })
          .append("title")
          .text(function(d) {
            return d.name + "\n" + format(d.value);
          });

        // add in the title for the nodes
        node.append("text")
          .attr("x", -6)
          .attr("y", function(d) {
            return d.dy / 2;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "end")
          .attr("transform", null)
          .text(function(d) {
            return d.name;
          })
          .filter(function(d) {
            return d.x < width / 2;
          })
          .attr("x", 6 + sankey.nodeWidth())
          .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
          d3.select(this)
            .attr("transform",
              "translate(" +
              d.x + "," +
              (d.y = Math.max(
                0, Math.min(height - d.dy, d3.event.y))) + ")");
          sankey.relayout();
          link.attr("d", path);
        }
      });
      //To here------------------------------------------
    }
  }
}
