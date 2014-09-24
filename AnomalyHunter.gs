function setThresholds() {
  // An email is sent when the volumes increase or drop 
  // by a certain percentage of the difference between
  // the highest and lowest volumes we expect for that
  // period (that hour & weekday over the last 8 weeks
  // and that hour the previous day).
  var params = {}
  params.pctOfUnder = 50;  
  params.pctOfOver = 200; //200 would be double the difference between highest & lowest
  return params;
}


//Finds hourly volumes that seem high/low
function anomalyHunt() {
  Logger.clear();
  var currDate = convertDate(javaDateToStr(new Date()));  
  var sDate = convertDate(javaDateToStr(new Date(new Date().setMonth(new Date().getMonth()-2))));
  var results = getAnomalyResults(sDate,currDate); //Results are returned newest first
  var grid = resultsToGrid(results);
  var anomalies = getAnomalies(grid);
  
  sendAnomalies(anomalies)
  
}

function getAnomalyResults(sDate,eDate){
  var requests = buildOneOffRequests(10000);
  var account = getAccount("Your Account Name");
  var property = getProperty(account,"Your Property Name");
  var profile = getProfile(account,property,0);
  var results = makeOneOffRequest(profile, requests.anomalySearch, "ga:pageviews", "", sDate, eDate);      
  return results;
}

function resultsToGrid(results) {
  var grid = []
  for(var dy=0;dy<7;dy++) {
    var dayHold = [];
    for(var i=0;i<24;i++) {
      var hourHold = [];  
      dayHold.push(hourHold);
    }
    grid.push(dayHold)
  }
  
  for(var i=0;i<results.rows.length;i++){
    var datum = results.rows[i][0];
    var wkDay = parseInt(results.rows[i][1],10);
    var hr = parseInt(results.rows[i][2],10);
    var val = parseInt(results.rows[i][3]);
    var rec = {"date":datum,"value":val};
    grid[wkDay][hr].push(rec);
  }
  return grid;
}

function getAnomalies(grid) {
  var anomalies = [];
 
  for(var dy=0;dy<grid.length;dy++){
    for(var hr=0;hr<grid[dy].length;hr++){
      //add yesterday's value to weekday values
      if(dy>0) {
        grid[dy][hr].push(grid[dy-1][hr][0]);
      } else {
        grid[dy][hr].push(grid[6][hr][0]); 
      }
      var anom = findAnomaly(grid[dy][hr],dy,hr);
      if(anom&&anom.value) {
        anomalies.push(anom)
      }
    }
  }
  anomalies.sort(function(a,b){return b.hour-a.hour})
  anomalies.sort(function(a,b){return b.date-a.date})
  if(anomalies[0].date == javaDateToStr(new Date()) && parseInt(anomalies[0].hour) == new Date().getHours()) {
   anomalies = anomalies.slice(1,anomalies.length); 
  }
  
  return anomalies;
}

function findAnomaly(vols,dy,hr) {
  var toCheck = vols[0]; 
  var sliceEnd = Math.min(12,vols.length);
  var lastBatch = vols.slice(1,sliceEnd);
  lastBatch.sort(function(a,b){return parseInt(a.value,10)-parseInt(b.value,10)});
  var minMaxDiff = lastBatch[sliceEnd-2].value - lastBatch[0].value;
  var params = setThresholds()
  if(
    toCheck.value < (parseInt(lastBatch[0].value,10) - parseInt((minMaxDiff*(params.pctOfUnder/100),10))) 
  || 
    toCheck.value > (parseInt(lastBatch[sliceEnd-2].value,10) + parseInt(minMaxDiff*(params.pctOfOver/100),10))
  &&
    parseInt(toCheck.value)>0
  ) {
    toCheck.prevMin = lastBatch[0].value;
    toCheck.prevMax = lastBatch[sliceEnd-2].value;
    toCheck.day = dy;
    toCheck.hour = hr;
    return toCheck;
  } else {
    return null;
  }
}

function sendAnomalies(anomalies) {  
  var recipient = "your@email.com";    
  
  var todaysAnomalies = [];
  for(var i = 0 ;i<anomalies.length ; i++) {
    if(anomalies[i].date == javaDateToStr(new Date()) || ( new Date().getHours() == 0 && anomalies[i].date == javaDateToStr(new Date(new Date().setDate(new Date().getDate()-1))))) {
     todaysAnomalies.push(anomalies[i]) 
    }
  }
    
  //for testing
  //todaysAnomalies = anomalies;
  
  if(todaysAnomalies.length>0) {
    var subject = "Unusual VDL successful volumes - " + todaysAnomalies[0].date + " at " + todaysAnomalies[0].hour + ":00";
    var body = "";
    body += "<div>The following unusual volumes have been seen today - </div>";
    body += "<table>"
    body += "<tr>";
    body += "<th>Date</th>";
    body += "<th>Hour</th>";
    body += "<th>Volume</th>";
    body += "<th>Typical Min</td>";
    body += "<th>Typical Max</th>";
    body += "</tr>";
    for(var i=0;i<todaysAnomalies.length;i++) {
      body += "<tr>";
      body += "<td style='textalign:center'>" + todaysAnomalies[i].date + "</td>";
      body += "<td style='textalign:center'>" + todaysAnomalies[i].hour + "</td>";
      body += "<td style='textalign:center'>" + todaysAnomalies[i].value + "</td>";
      body += "<td style='textalign:center'>" + todaysAnomalies[i].prevMin + "</td>";
      body += "<td style='textalign:center'>" + todaysAnomalies[i].prevMax + "</td>";
      body += "</tr>";
    }
    body += "</table>";
    
    var noHtmlBody = "Date: " + todaysAnomalies[0].date + " Volume: " + todaysAnomalies[0].value;
  
    GmailApp.sendEmail(recipient, subject ,noHtmlBody,{htmlBody:body});
  } 
}
