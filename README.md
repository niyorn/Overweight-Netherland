# Overweight-Netherland
This page show the overweight rate of Netherland over time from 1986  to 2016.

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

So we first of all we will convert the CSV file to a text file and remove unnecessary text.
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
