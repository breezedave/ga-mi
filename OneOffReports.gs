
function createReport(params) {  
  try {
    var account = getAccount("YourAccountName");
    var property = getProperty(account,"YourPropertyName");
    var profile = getProfile(account,property,0);
    
    var results;
    for(var i = 0 ;i < params.request.length ; i++) {
      if(!results||!results.rows) {
        results = makeOneOffRequest(profile, params.request[i], params.metric, params.title, params.sDate, params.eDate);  
      } else {
        var resultsNew = makeOneOffRequest(profile, params.request[i], params.metric, params.title, params.sDate, params.eDate);  
        for(var i2 = 0 ;i2< resultsNew.rows.length;i2++){
          results.rows.push(resultsNew.rows[i2]);
        }
      }
    }
    
    var title = params.title + ": " + params.sDate + " : " + params.eDate;
        
    if(params.dataDump){
     return dataDump(params,title,results); 
    }
    
    var json = resultsToJson(results,params.suffix,params.findStr,params.replaceStr,params.addImg);
    
    if(params.enquiryReason) {
      json = splitEnquiryReason(json); 
    }
    if(params.categoryExtract) {
      json = extractCategory(json); 
    }
    if(params.weekly){
     json = convertWeekDate(json); 
    }
        
    return buildHtml(params,title,json,results);
    
  } catch (error) {
    Browser.msgBox(error); 
  }
  
}

function dataDump(params,title,json) {
  var fileName = title + " " + Utilities.formatDate(new Date(), SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), "YYYY-MM-dd-HH-mm-ss") + "." + params.dataDump;
  if(params.dataDump=="HTML") {
    var html = "<table>";
    for(var i=0;i<json.rows.length;i++) {
      html+= '<tr>';
      for(var i2=0;i2<json.rows[i].length;i2++) {
        html+= '<td>' + json.rows[i][i2] + '</td>';
      }
      html+= '</tr>';
    }; 
    html+= '</table>';
    DriveApp.createFile(fileName, html); 
  } else {
    DriveApp.createFile(fileName, json); 
  }
  return;
}

function buildHtml(params,title,json,results) {
  try {
    if(!params.type) {
      var html = createTable(json,title,params.width);     
    } else {
      switch(params.type) {
        case "pie":
          var html = createPie(json,title,params.width,params.height);
          break;
        case "table":
          var html = createTable(json,title,params.width);
          break;
        case "speedo":
          var html = createSpeedo(json,title,params.width,params.height);
          break;
        case "map":
          var json = resultsToLatLng(results);      
          var html = createMap(json,title,params.width,params.height);
          break;
        case "value":
          var html = createValue(json,title,params.width,params.height);
          break;
        default:
          var html = createTable(json,title,params.width);     
      } 
    }
    if(params.buildHtml) {
      var fileName = title + " " + Utilities.formatDate(new Date(), SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), "YYYY-MM-dd-HH-mm-ss") + ".html";
      DriveApp.createFile(fileName, html); 
      return;
    } else {
      return html; 
    }
  } catch (error) {
    Browser.msgBox(error); 
  }
}

function splitEnquiryReason(json) {
  var newJson = [];
  var found = false;
  for(var i=0; i<json.length;i++) {
    var namen = json[i].name.substr(14,100);
    var enqList = namen.split(",")
    for(var i2=0;i2<enqList.length;i2++){
      var enq = String(enqList[i2]).trim();
      found = false;
      for (var i3=0;i3<newJson.length;i3++){
        if(enq && newJson[i3].name == enq) {
          newJson[i3].volume += parseFloat(json[i].volume); 
          found = true
        }
      }
      if(!found && enq.length>0) {
        newJson.push({"name":enq,"volume":parseFloat(json[i].volume),"url":json[i].url});
      }
    } 
  }
  newJson.sort(function(a, b){return b.volume-a.volume});
  return newJson;
}

function extractCategory(json) {
  var newJson = [];
  var found = false;
  for(var i=0; i<json.length;i++) {
    var namen = String(json[i].name.substr(11,100));
    if(namen.indexOf('Show information')>-1) {
       namen = namen.substr(0,namen.indexOf('Show information'));
    }
    if(namen.indexOf('Restrictions')>-1) {
       namen = namen.substr(0,namen.indexOf('Restrictions'));
    }
    if(namen.indexOf('Start')>-1) {
       namen = namen.substr(0,namen.indexOf('Start'));
    }
    if(namen.indexOf('Expired')>-1) {
       namen = namen.substr(0,namen.indexOf('Expired'));
    }
    if(namen.indexOf('Passed')>-1) {
       namen = namen.substr(0,namen.indexOf('Passed'));
    }
    namen = String(namen).trim();
    found = false;
    for (var i2=0;i2<newJson.length;i2++){
      if(newJson[i2].name == namen) {
        newJson[i2].volume += parseFloat(json[i].volume); 
        found = true
      }
    }
    if(!found) {
      newJson.push({"name":namen,"volume":parseFloat(json[i].volume),"url":json[i].url});
    }   
  }
  newJson.sort(function(a, b){return b.volume-a.volume});
  return newJson;
}

function resultsToLatLng(results) {
  var json=[];
  for(var i=0;i<results.getRows().length;i++){
    var lat = results.getRows()[i][0];
    var lng = results.getRows()[i][1];
    var cty = results.getRows()[i][2] + ", " + results.getRows()[i][3];
    cty = cty.replace("\'","\\\'");
    var vol = results.getRows()[i][4];
    json.push({"lat":lat,"lng":lng,"vol":vol,"city":cty});
  } 
  return json;
}

function convertWeekDate(json) {
  for (var i = 0 ; i < json.length ; i ++) {
    var yr = parseFloat(json[i].name.substr(0,4));
    var week= parseFloat(json[i].name.substr(4,100));
    var first= new Date(yr,0,1);
    first = new Date(first.setDate(first.getDate()-first.getDay()%7));
    var datum = new Date(first.setDate(first.getDate() + ((week-1)*7))); 
    json[i].name = "W/C " + String(datum).substr(4,11);
  }
  return json;
}


function resultsToJson(results,suffix,findStr,replaceStr,addImg) {
  var json=[];
  for(var i=0;i<results.getRows().length;i++){
    var thisName = results.getRows()[i][0];
    if(addImg) {
      var thisUrl = getUrl(thisName,suffix,findStr,replaceStr);
    }
    var thisVolume = results.getRows()[i][1];
    json.push({"name":thisName,"volume":thisVolume,"url":thisUrl});
  }
  return json;
}

function getUrl(name,suffix,findStr,replaceStr) {  
  var url = "";
  try{
    name = name.replace(" ","+");
    name = name.replace(findStr,replaceStr);
    name = name + suffix;
    var response = UrlFetchApp.fetch("https://www.google.com/search?q=" + name + "&tbm=isch").getContentText();
    var resTrim = response.substr(response.indexOf("<img"),1000);
    resTrim = resTrim.substr(resTrim.indexOf("src")+5,1000);
    url = resTrim.substr(0,resTrim.indexOf('"'));
  } catch (error) {
    url = "";
  }
  return url;
} 

function makeOneOffRequest(profile, request, metric, title, sDate, eDate) {
  var tableId = 'ga:' + profile;
  var startDate = sDate;
  var endDate = eDate;
  
  var results = Analytics.Data.Ga.get(
     tableId
    ,startDate
    ,endDate
    ,metric
    ,request
  );
  
  if (results.getRows()) {
    return results;
  }
  return null;
  
}

function buildOneOffRequests(rowCount) {
  var mobileDeviceInfo = {
    'dimensions': 'ga:mobileDeviceInfo'
    ,'sort':'-ga:sessions'
    ,'start-index':'1'
    ,'max-results':rowCount
  };
  
  var countryInfo = {
     'dimensions': 'ga:country'
    ,'sort':'-ga:sessions'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var regionInfo = {
     'dimensions': 'ga:region'
    ,'sort':'-ga:sessions'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var mobileDeviceSuccessInfo = {
    'dimensions': 'ga:mobileDeviceInfo'
    ,'sort':'-ga:pageViews'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'start-index':'1'
    ,'max-results':rowCount
  };
  
  var countrySuccessInfo = {
     'dimensions': 'ga:country'
    ,'sort':'-ga:pageViews'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var successfulDeviceCategory = {
    'dimensions': 'ga:deviceCategory'
    ,'sort':'-ga:pageViews'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var successfulMobileOSCategory = {
    'dimensions': 'ga:operatingSystem'
    ,'sort':'-ga:pageViews'
    ,'filters':'ga:pagePath=~(viewby);ga:deviceCategory=~(mobile|tablet)'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var regionSuccessInfo = {
     'dimensions': 'ga:region'
    ,'sort':'-ga:pageViews'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var networkDomainInfo = {
     'dimensions': 'ga:networkDomain'
    ,'sort':'-ga:sessions'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var networkDomainSuccessInfo = {
     'dimensions': 'ga:networkDomain'
    ,'sort':'-ga:pageViews'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var latlng = {
     'dimensions': 'ga:latitude,ga:longitude,ga:city,ga:country'
    ,'sort':'ga:sessions'
    ,'start-index':'1'
    ,'max-results':100000
  }
  
  var latlngSuccess = {
     'dimensions': 'ga:latitude,ga:longitude,ga:city,ga:country'
    ,'sort':'ga:pageViews'
    ,'start-index':'1'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'max-results':100000
  }
  
  var latlngMobile = {
     'dimensions': 'ga:latitude,ga:longitude,ga:city,ga:country'
    ,'sort':'ga:sessions'
    ,'start-index':'1'
    ,'filters':'ga:deviceCategory=~(mobile|tablet)'
    ,'max-results':100000
  }
  
  var enquiryReason = {
     'dimensions': 'ga:eventAction'
    ,'sort':'-ga:totalEvents'
    ,'start-index':'1'
    ,'filters':'ga:pagePath=~(ops);ga:eventAction=~(View Record -)'
    ,'max-results':rowCount
  }
  
  var categoryDetail = {
     'dimensions': 'ga:eventAction'
    ,'sort':'-ga:totalEvents'
    ,'start-index':'1'
    ,'filters':'ga:eventAction=~(Category.*Show information)'
    ,'max-results':rowCount
  }
  
  var volumesByHour = {
     'dimensions': 'ga:hour'
    ,'sort':'ga:hour'
    ,'start-index':'1'
    ,'max-results':24
  }

  var successByHour = {
     'dimensions': 'ga:hour'
    ,'sort':'ga:hour'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'start-index':'1'
    ,'max-results':24
  }
  
  var volumeSuccessMobile = {
    'filters':'ga:pagePath=~(viewby);ga:deviceCategory=~(mobile)'
    ,'start-index':'1'
    ,'max-results':'1'
  }
  var volumeSuccessTablet = {
    'filters':'ga:pagePath=~(viewby);ga:deviceCategory=~(tablet)'
    ,'start-index':'1'
    ,'max-results':'1'
  }
  var volumeSuccessDesktop = {
    'filters':'ga:pagePath=~(viewby);ga:deviceCategory=~(desktop)'
    ,'start-index':'1'
    ,'max-results':'1'
  }
  
  var volumeSuccess = {
    'filters':'ga:pagePath=~(\/driving-record\/viewbydln|\/driving-record\/viewbypersonaldetails)'
    ,'start-index':'1'
    ,'max-results':'1'
  }  

  var volumeFails = {
    'filters':'ga:pagePath=~(\/driving-record\/licence-number\/error|\/driving-record\/personal-details\/error)'
    ,'start-index':'1'
    ,'max-results':'1'
  }

  var volumeSuccessByDln = {
    'filters':'ga:pagePath=~(\/driving-record\/viewbydln)'
    ,'start-index':'1'
    ,'max-results':'1'
  }
  
  var volumeFailsByDln = {
    'filters':'ga:pagePath=~(\/driving-record\/licence-number\/error)'
    ,'start-index':'1'
    ,'max-results':'1'
  }
  
  var volumeSuccessByPersonal = {
    'filters':'ga:pagePath=~(\/driving-record\/viewbypersonaldetails)'
    ,'start-index':'1'
    ,'max-results':'1'
  }
  
  var volumeFailsByPersonal = {
    'filters':'ga:pagePath=~(\/driving-record\/personal-details\/error)'
    ,'start-index':'1'
    ,'max-results':'1'
  }
  
  var sessionVolume = {
    'start-index':'1'
    ,'max-results':'1'
  }
  
  var gdsSuccess = {
    'dimensions':'ga:date'
    ,'sort':'ga:date'
    ,'filters':'ga:pagePath=~(\/driving-record\/viewbydln|\/driving-record\/viewbypersonaldetails)'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var gdsWeeklySuccess = {
    'dimensions':'ga:yearWeek'
    ,'sort':'ga:yearWeek'
    ,'filters':'ga:pagePath=~(\/driving-record\/viewbydln|\/driving-record\/viewbypersonaldetails)'
    ,'start-index':'1'
    ,'max-results':rowCount
  }
  
  var successLocDevice = {
    'dimensions':'ga:latitude,ga:longitude,ga:city,ga:country,ga:mobileDeviceInfo'
    ,'sort':'ga:pageViews'
    ,'filters':'ga:pagePath=~(\/driving-record\/viewbydln|\/driving-record\/viewbypersonaldetails)'
    ,'start-index':'1'
    ,'max-results':100000
  }
  
  var successLocDesktop = {
    'dimensions':'ga:latitude,ga:longitude,ga:city,ga:country;ga:deviceCategory'
    ,'sort':'ga:pageViews'
    ,'filters':'ga:pagePath=~(\/driving-record\/viewbydln|\/driving-record\/viewbypersonaldetails),ga:deviceCategory=~(desktop)'
    ,'start-index':'1'
    ,'max-results':100000
  }
  
  var anomalySearch = {
    'dimensions' :'ga:date,ga:dayOfWeek,ga:hour'
    ,'sort':'-ga:date,-ga:hour'
    ,'filters':'ga:pagePath=~(viewby)'
    ,'start-index':'1'
    ,'max-results':10000
  }
  
  var requests = {
    "mobileDeviceInfo":mobileDeviceInfo
    ,"countryInfo":countryInfo
    ,"regionInfo":regionInfo
    ,"mobileDeviceSuccessInfo":mobileDeviceSuccessInfo
    ,"countrySuccessInfo":countrySuccessInfo
    ,"regionSuccessInfo":regionSuccessInfo
    ,"networkDomainInfo":networkDomainInfo
    ,"networkDomainSuccessInfo":networkDomainSuccessInfo
    ,"latlng":latlng
    ,"latlngSuccess":latlngSuccess
    ,"latlngMobile":latlngMobile
    ,"enquiryReason":enquiryReason
    ,"categoryDetail":categoryDetail
    ,"volumesByHour":volumesByHour
    ,"volumeSuccess":volumeSuccess
    ,"volumeFails":volumeFails
    ,"volumeSuccessByDln":volumeSuccessByDln
    ,"volumeFailsByDln":volumeFailsByDln
    ,"volumeSuccessByPersonal":volumeSuccessByPersonal
    ,"volumeFailsByPersonal":volumeFailsByPersonal
    ,"sessionVolume":sessionVolume
    ,"gdsSuccess":gdsSuccess
    ,"gdsWeeklySuccess":gdsWeeklySuccess
    ,"successByHour":successByHour
    ,"successLocDevice":successLocDevice
    ,"successLocDesktop":successLocDesktop
    ,"successfulDeviceCategory":successfulDeviceCategory
    ,"volumeSuccessMobile":volumeSuccessMobile
    ,"volumeSuccessTablet":volumeSuccessTablet
    ,"volumeSuccessDesktop":volumeSuccessDesktop
    ,"successfulMobileOSCategory":successfulMobileOSCategory
    ,"anomalySearch":anomalySearch
  }
  
  return requests;
}