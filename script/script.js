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
  console.log(dataStart);
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
console.log(data);
}
