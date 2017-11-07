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
