const request = require('request');
var express = require('express');
const path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');
const { exit } = require('process');

var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


var api_key = "55b8f99faa551f58eaca100586fa3bc0";
function info(lati,longi,res){
    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lati + "&lon=" + longi + "&callback=setcurrent&appid=" + api_key;
    var url2 = "https://api.openweathermap.org/data/2.5/forecast?lat=28.644800&lon=77.216721&&callback=set5days&appid=" + api_key;
    request(url, function (error, response, current) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    
        request(url2, function (error, response, fivedays) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            const data = fs.readFileSync(path.join(__dirname+'/public/index.html'),{encoding:'utf8', flag:'r'});
            res.send(data + "<script>"+current+";"+fivedays+";"+"</script>"); // Print the HTML for the Google homepage.
        });
    });
}

function info_bycode(code,res){
  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + code + "&callback=setcurrent&appid=" + api_key;
  var url2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + code + "&&callback=set5days&appid=" + api_key;
  request(url, function (error, response, current) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  
      request(url2, function (error, response, fivedays) {
       console.error('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          
                if (error) throw new Error(error);

                if(response && response.statusCode != 200){
                  const data = fs.readFileSync(path.join(__dirname+'/public/error.html'),{encoding:'utf8', flag:'r'});
                  res.send(data);
                  return;
                } 
                else{
                  const data = fs.readFileSync(path.join(__dirname+'/public/index.html'),{encoding:'utf8', flag:'r'});
                  res.send(data + "<script>"+current+";"+fivedays+";"+"</script>"); // Print the HTML for the Google homepage.
                }
      });
  });
}   

app.get('/',function(req,res) {
    info(28.656802,77.217861,res);
});
app.post('/city', function(req, res) {
    info((parseFloat(req.body.lati)).toFixed(5),(parseFloat(req.body.longi,res)).toFixed(5),res);
});
app.post('/city_code', function(req, res) {
  info_bycode(req.body.name,res);
});
app.listen(process.env.PORT || 5000)