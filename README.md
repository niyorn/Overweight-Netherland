# Overweight Rate in the nederlandNetherland
![alt text](/assets/process-image/graph-final.gif)
*disclaimer: Sankey is still work in progess*

This graph show the overweight rate of the Netherland from 1981 to 2016.

*example of the data*
Mannen;"Totaal";"1981";"Percentages/gemiddelden";"2.1";"67.7";"30.2"			
Mannen;"Totaal";"1982";"Percentages/gemiddelden";"2.3";"68.7";"29.0"			
Mannen;"Totaal";"1983";"Percentages/gemiddelden";"2.6";"67.2";"30.1"			
Mannen;"Totaal";"1984";"Percentages/gemiddelden";"2.8";"66.3";"30.8"			
Mannen;"Totaal";"1985";"Percentages/gemiddelden";"2.8";"66.6";"30.7"			
Mannen;"Totaal";"1986";"Percentages/gemiddelden";"3.2";"66.1";"30.7"			



## Interaction
- With the left menu you're able to choose which dataset the line graph will render.
- On the line graph there are dots, if you hover above the dot a tooltip will be displayed which detailed information;
- When click on the dot a Sankey diagram will be rendered

## Line graph
The x-axes show the the year when the data is collected.
The y-axes the other overweight rate in %;

## Sankey graph
![alt text](/assets/process-image/sankey.svg)
The sankey is a detailed graph of the year when your clicked on a dot.
It shows how the data is consist off.
# Cleaning data
When we load the csv the usual way
```javascript
d3.csv("data.csv", function(data){
    console.log(data);
})
```
We will see that data is not formatted
```
100: Object { "Lengte en gewicht van personen, ondergewicht en overgewicht; vanaf 1981": "Totaal mannen en vrouwen" }
101: Object { "Lengte en gewicht van personen, ondergewicht en overgewicht; vanaf 1981": "Totaal mannen en vrouwen" }
102: Object { "Lengte en gewicht van personen, ondergewicht en overgewicht; vanaf 1981": "Totaal mannen en vrouwen" }
103: Object { "Lengte en gewicht van personen, ondergewicht en overgewicht; vanaf 1981": "Totaal mannen en vrouwen" }
104: Object { "Lengte en gewicht van personen, ondergewicht en overgewicht; vanaf 1981": "Totaal mannen en vrouwen" }
105: Object { "Lengte en gewicht van personen, ondergewicht en overgewicht; vanaf 1981": "Totaal mannen en vrouwen" }
```
To be able to read this file we need to format the CSV what we have to a readable CSV file.
So we first of all, we will convert the CSV file to a text file and remove unnecessary text.

*convert csv to text*
```javascript
d3.text('data.csv')
  .mimeType('text/plain;charset=iso88591')
  .get(onload);
```

After that we will remove the header text and the footer text
```javascript
//Function that clean the data so we can use it for D3
function onload(err, text) {
  if (err) throw err;
  //replace unnecessary symbols
  text = text.replace(/";"/g, ",").replace(/"/g, '').trim();
  //get everything from the total dataset
  var dataStart = text.indexOf('Mannen');
  console.log(dataStart);
  var dataEnd = text.indexOf('©');
  //Remove unneeded text
  text = text.slice(dataStart, dataEnd);
  }
```

And than add a function dat map the data. This data contains only the things that we wants
```javascript
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
```
After this is all done, we will parse it to a data variable
``` javascript
//Parse the data
var data = d3.csvParseRows(text, map);
console.log(data);
```

What we get from this code, is this:

```
28: Object { gender: "Mannen", year: "2009", underweight: "1.9", … }
29: Object { gender: "Mannen", year: "2010", underweight: "1.9", … }
30: Object { gender: "Mannen", year: "2011", underweight: "1.6", … }
31: Object { gender: "Mannen", year: "2012", underweight: "1.7", … }
32: Object { gender: "Mannen", year: "2013", underweight: "1.8", … }
33: Object { gender: "Mannen", year: "2014", underweight: "1.6", … }
34: Object { gender: "Mannen", year: "2015", underweight: "1.4", … }
35: Object { gender: "Mannen", year: "2016", underweight: "1.9", … }
36: Object { gender: "Vrouwen", year: "1981", underweight: "4.6", … }
37: Object { gender: "Vrouwen", year: "1982", underweight: "5.1", … }
38: Object { gender: "Vrouwen", year: "1983", underweight: "4.7", … }
39: Object { gender: "Vrouwen", year: "1984", underweight: "5.0", … }
40: Object { gender: "Vrouwen", year: "1985", underweight: "5.2", … }
41: Object { gender: "Vrouwen", year: "1986", underweight: "5.0", … }
42: Object { gender: "Vrouwen", year: "1987", underweight: "4.5", … }
43: Object { gender: "Vrouwen", year: "1988", underweight: "4.7", … }
44: Object { gender: "Vrouwen", year: "1989", underweight: "4.1", … }
```

We will also add a function that will nest the data so we're able to select the data based on gender.

This is the function
```javascript
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
     console.log(nestData);
```

That will give us This
```
0: Object { gender: "Mannen", values: […] }
1: Object { gender: "Vrouwen", values: […] }
```
So now we are able to select the data based on Gender

# Creating the line graph
This line graph is created based on the example of d3noob
that can be found here:
https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0

## Changes
The first thing that I changed was
```javascript
var x = d3.scaleTime().range([0, width]);
```
to
```javascript
var x =  d3.scaleBand().rangeRound([40, width]);
```
This is because I don't have a date time format in my dataset and the number 40 is added because I want the graph to be a little more to the right

What we get from this code is This
![alt text](/assets/process-image/line-graph-start.PNG)

*This is code written by me*
We got the line, but I want to add dotes on the line where the user can hover it. This dot will than activate a tooltip

First I created a variable dot where I bind the data to it.
```javascript
//Bind data
var dot = gender.selectAll("dot")
  .data(data);
```
Than create the dom element with the dot.enter() Function
```javascript
//Enter (this will create dom element that arent there)
//Enter (this will create dom element that arent there)
dot.enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('fill', 'red')
  .attr("r", 5)
  .attr("cx", function(d) {
      return x(d.year)
    })
  .attr("cy", function(d) {
      return y(d.overweight)
    });
  .on("mouseover", showTooltip)
  .on("mouseout", removeTooltip);
```

And the Function for showing and removing the showTooltip
```javascript
//function that will render a tooltip
function showTooltip(d, i) {
  var gender = d.gender;
  var data = d.overweight;
  var date = d.year;
  // I want the tooltip slight above the dot, thats why
  //we will add a ofset
  var offset = 20;
  //get the x and y
  var xPosition = d3.select(this).attr("cx");
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
    .text('overgewicht \n' + data + "%");
}

//remove tooltip
function removeTooltip() {
  d3.selectAll('.tooltip').remove();
}
```

this is what we get
![alt text](/assets/process-image/line-chart-tooltip.gif)

Than I will so add a buttons where we can change the dataSetType. The function below is the code wich determine which dataset we need to showing

```javascript
//Update graph when the menu items are clicked
d3.selectAll('.menuitem button').on("click", function() {
  //Get the value of the button
  var dataValue = this.value.toString();
  dataSetType = dataValue;
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
```
And this is the result
![alt text](/assets/process-image/line-chart-update.gif)

# Sankey
*The sankey is made based on the sankey of d3 noob*
*src: https://bl.ocks.org/d3noob/013054e8d7807dff76247b81b0e29030*
