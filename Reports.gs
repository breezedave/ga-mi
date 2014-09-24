function getReportFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Manual Reports");
  var sDate =  convertDate(sheet.getRange(5, 5).getValue());
  var eDate = convertDate(sheet.getRange(7, 5).getValue());
  var rCount = sheet.getRange(9,5).getValue();
  var dataDump = sheet.getRange(11,5).getValue();
  var selReport=sheet.getRange(13,5).getValue();
  selectReport(sDate,eDate,rCount,selReport,true,null,null,dataDump);
}

function selectReport(sDate, eDate, rCount, selReport,buildHtml,width,height,dataDump) {
  try {    
    var params = {};
    var html;
    params.sDate = sDate;
    params.eDate = eDate;
    params.rowCount = rCount;
    params.buildHtml = buildHtml;
    if(width) {params.width = width} else {params.width = 600};
    if(height) {params.height = height} else {params.height = 600};
    if(!(!dataDump||dataDump=="No")) {params.dataDump=dataDump};
       
    switch(selReport) {
      case 'Volumes by mobile device':
        html = getMobileDeviceReport(params);
        break;
      case 'Successful volumes by mobile device':
        html = getMobileDeviceSuccessReport(params);
        break;
      case 'Volumes by country':
        html = getCountryReport(params);
        break;
      case 'Successful volumes by country':
        html = getCountrySuccessReport(params);
        break;
      case 'Volumes by region':
        html = getRegionReport(params);
        break;
      case 'Successful volumes by region':
        html = getRegionSuccessReport(params);
        break;  
      case 'Volumes by network domain':
        html = getNetworkDomainInfo(params);
        break;
      case 'Successful volumes by network domain':
        html = getNetworkDomainSuccessInfo(params);
        break;
      case 'Enquiry Reason event Volume':
        html = getEnquiryReasonInfo(params);
        break;
      case 'Enquiry Reason event Split':
        html = getEnquiryReasonSplitInfo(params);
        break;
      case 'Successful device Category Split':
        html = getSuccessfulDeviceSplit(params);
        break;
      case 'Successful mobile OS Split':
        html = getSuccessfulMobileOSSplit(params);
        break;
      case 'Volumes by Hour':
        html = getVolumesByHour(params);
        break;
      case 'Success by Hour':
        html = getSuccessByHour(params);
        break;
      case 'Map of visitors':
        html = getLatlng(params);
        break;
      case 'Map of Successful visitors':
        html = getLatlngSuccess(params);
        break;
      case 'Map of Mobile visitors':
        html = getLatlngMobile(params);
        break;   
      case 'Category "More Detail" Checks':
        html = getCategoryDetail(params);
        break;
      case 'Success Rate':
        html = getSuccessRate(params,'all');
        break;
      case 'Success Rate by DLN':
        html = getSuccessRate(params,'dln');
        break;
      case 'Success Rate by Personal Details':
        html = getSuccessRate(params,'personal');
        break;
      case 'Success Mobile Volume':
        html = getVolume(params,'successMobile');
        break;
      case 'Success Tablet Volume':
        html = getVolume(params,'successTablet');
        break;
      case 'Success Desktop Volume':
        html = getVolume(params,'successDesktop');
        break;
      case 'Success Volume':
        html = getVolume(params,'successAll');
        break;
      case 'Failure Volume':
        html = getVolume(params,'failureAll');
        break;
      case 'Success Volume by DLN':
        html = getVolume(params,'successDln');
        break;
      case 'Failure Volume by DLN':
        html = getVolume(params,'failureDln');
        break;
      case 'Success Volume by Personal Details':
        html = getVolume(params,'successPersonal');
        break;
      case 'Failure Volume by Personal Details':
        html = getVolume(params,'failurePersonal');
        break;  
      case 'Session Volume':
        html = getVolume(params,'sessionVolume');
        break;
      case 'Daily Success (GDS)':
        html = getDailySuccessGDS(params);
        break;
      case 'Weekly Success (GDS)':
        html = getWeeklySuccessGDS(params);
        break;
      case 'Successful location by Device':
        html = getSuccessfulLocDevice(params);
        break;
    } 
    if(buildHtml) {
      Browser.msgBox("The report has been saved to your Google Drive"); 
    } else {
      return html;
    }
    
  } catch (error) {Browser.msgBox(error);};
}


//********************************
//**** Start of report setups ****
//********************************

function getMobileDeviceReport(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Volumes by Mobile Device"
      ,rowCount:rows
      ,request:[requests.mobileDeviceInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:sessions"
      ,suffix:" phone"
      ,findStr:"(not Set)"
      ,replaceStr:"mobile"
      ,addImg:true
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getCountryReport(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Volumes by Country"
      ,rowCount:rows
      ,request:[requests.countryInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:sessions"
      ,suffix:" flag  site:http://flagpedia.net/"
      ,findStr:"(not Set)"
      ,replaceStr:"mobile"
      ,addImg:true
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    } 
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getRegionReport(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Volumes by Region"
      ,rowCount:rows
      ,request:[requests.regionInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:sessions"
      ,suffix:" map"
      ,findStr:"(not Set)"
      ,replaceStr:"mobile"
      ,addImg:true
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    } 
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getVolumesByHour(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Volumes by Hour"
      ,rowCount:rows
      ,request:[requests.volumesByHour]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:sessions"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,addImg:false
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    } 
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getSuccessByHour(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Successful Volumes by Hour"
      ,rowCount:rows
      ,request:[requests.successByHour]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,addImg:false
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    } 
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getCountrySuccessReport(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Successful Volumes by Country"
      ,rowCount:rows
      ,request:[requests.countrySuccessInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,suffix:" flag  site:http://flagpedia.net/"
      ,findStr:"(not Set)"
      ,replaceStr:"mobile"
      ,addImg:true
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    } 
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getRegionSuccessReport(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Successful Volumes by Region"
      ,rowCount:rows
      ,request:[requests.regionSuccessInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,suffix:" map"
      ,findStr:"(not Set)"
      ,replaceStr:"mobile"
      ,addImg:true
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    } 
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}


function getMobileDeviceSuccessReport(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Successful Volumes by Mobile Device"
      ,rowCount:rows
      ,request:[requests.mobileDeviceSuccessInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,suffix:" phone"
      ,findStr:"(not Set)"
      ,replaceStr:"mobile"
      ,addImg:true
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getNetworkDomainInfo(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Volumes by Network Domain"
      ,rowCount:rows
      ,request:[requests.networkDomainInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:sessions"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,addImg:false
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getNetworkDomainSuccessInfo(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Volumes by Successful Network Domain"
      ,rowCount:rows
      ,request:[requests.networkDomainSuccessInfo]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,addImg:false
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getEnquiryReasonInfo(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"DVLA Portal Volumes by Enquiry Reason"
      ,rowCount:rows
      ,request:[requests.enquiryReason]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:totalEvents"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,enquiryReason:true
      ,addImg:false
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getEnquiryReasonSplitInfo(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"DVLA Portal Split by Enquiry Reason"
      ,rowCount:rows
      ,request:[requests.enquiryReason]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:totalEvents"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,enquiryReason:true
      ,addImg:false
      ,type:"pie"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getSuccessfulDeviceSplit(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"DVLA Successful Device Type"
      ,rowCount:rows
      ,request:[requests.successfulDeviceCategory]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,addImg:false
      ,type:"pie"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getSuccessfulMobileOSSplit(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Successful Mobile OS"
      ,rowCount:rows
      ,request:[requests.successfulMobileOSCategory]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,addImg:false
      ,type:"pie"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getCategoryDetail(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:'"Show More Details" Check by Category'
      ,rowCount:rows
      ,request:[requests.categoryDetail]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:totalEvents"
      ,suffix:""
      ,findStr:""
      ,replaceStr:""
      ,addImg:false
      ,categoryExtract:true
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}



function getLatlng(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Map of Visitors"
      ,request:[requests.latlng]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:sessions"
      ,type:"map"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getLatlngSuccess(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Map of Successful Visitors"
      ,request:[requests.latlngSuccess]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,type:"map"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getLatlngMobile(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Map of Mobile Visitors"
      ,request:[requests.latlngMobile]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:sessions"
      ,type:"map"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}


function getVolume(param,type) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    var account = getAccount("YourAccountName");
    var property = getProperty(account,"YourPropertyName");
    var profile = getProfile(account,property,0);
    
    var params = {
      title:"Success Rate"
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,type:"value"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    
    switch (type) {
      case 'successMobile':
        var title = "Mobile Success Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccessMobile];  
        break;
      case 'successTablet':
        var title = "Tablet Success Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccessTablet];  
        break;
      case 'successDesktop':
        var title = "Desktop Success Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccessDesktop];  
        break;
      case 'successAll':
        var title = "Success Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccess];  
        break;
      case 'failureAll':
        var title = "Failure Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeFails];  
        break;
      case 'successDln':
        var title = "Success by DLN Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccessByDln];  
        break;
      case 'failureDln':
        var title = "Failure by DLN Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeFailsByDln];  
        break;
      case 'successPersonal':
        var title = "Success by Personal Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccessByPersonal];  
        break;
      case 'failurePersonal':
        var title = "Failure by Personal Page Views: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeFailsByPersonal];  
        break;
      case 'sessionVolume':
        var title = "Site Visits: " + param.sDate + " : " + param.eDate;
        params.metric = "ga:sessions";
        params.request = [requests.sessionVolume];  
        break;
    }
    
    var result;
    for(var i = 0 ;i < params.request.length ; i++) {
      if(!result||!result.rows) {
        result = makeOneOffRequest(profile, params.request[i], params.metric, params.title, params.sDate, params.eDate);  
      } else {
        var resultsNew = makeOneOffRequest(profile, params.request[i], params.metric, params.title, params.sDate, params.eDate);  
        for(var i2 = 0 ;i2< resultsNew.rows.length;i2++){
          result.rows.push(resultsNew.rows[i2]);
        }
      }
    }
    
    var res = resultsToJson(result,"","","",false);
    
    var json = [];
    json.push({"name":"Value","volume":parseFloat(res[0].name),"url":""});
    return  buildHtml(params,title,json);
    
  } catch (error) {Browser.msgBox(error);};
}


function getSuccessRate(param,type) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    var account = getAccount("DVLA");
    var property = getProperty(account,"DVLA-IEP Beta");
    var profile = getProfile(account,property,0);
    
    var params = {
      title:"Success Rate"
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,type:"speedo"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    
    var params2 = {
      title:"Fail Rate"
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,type:"speedo"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    
    switch (type) {
      case 'all':
        var title = "VDL Success Rate: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccess];
        params2.request = [requests.volumeFails];  
        break;
      case 'dln':
        var title = "VDL Success by DLN Rate: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccessByDln];
        params2.request = [requests.volumeFailsByDln];
        break;
      case 'personal':
        var title = "VDL Success by Personal Details Rate: " + param.sDate + " : " + param.eDate;
        params.request = [requests.volumeSuccessByPersonal];
        params2.request = [requests.volumeFailsByPersonal];
        break;
        /*
        ### TBA ###
        case 'pid':
        var title = "VDL Success by PID Rate: " + param.sDate + " : " + param.eDate;
        params.request = requests.volumeSuccessByPid;
        params2.request = requests.volumeFailsByPid;
        break;
        */
    }
    
    
    var result;
    for(var i = 0 ;i < params.request.length ; i++) {
      if(!result||!result.rows) {
        result = makeOneOffRequest(profile, params.request[i], params.metric, params.title, params.sDate, params.eDate);  
      } else {
        var resultsNew = makeOneOffRequest(profile, params.request[i], params.metric, params.title, params.sDate, params.eDate);  
        for(var i2 = 0 ;i2< resultsNew.rows.length;i2++){
          result.rows.push(resultsNew.rows[i2]);
        }
      }
    }
    
    var success = resultsToJson(result,"","","",false);
    
    var results2;
    for(var i = 0 ;i < params2.request.length ; i++) {
      if(!results2||!results2.rows) {
        results2 = makeOneOffRequest(profile, params2.request[i], params2.metric, params2.title, params2.sDate, params2.eDate);  
      } else {
        var resultsNew = makeOneOffRequest(profile, params2.request[i], params2.metric, params2.title, params2.sDate, params2.eDate);  
        for(var i2 = 0 ;i2< resultsNew.rows.length;i2++){
          results2.rows.push(resultsNew.rows[i2]);
        }
      }
    }
    
    var fails = resultsToJson(results2,"","","",false);
    
    var json = [];
    json.push({"name":"Success Rate","volume":(Math.round(parseFloat(success[0].name)/(parseFloat(success[0].name)+parseFloat(fails[0].name))*10000,2)/100),"url":""});
    return buildHtml(params,title,json);
    
  } catch (error) {Browser.msgBox(error);};
}

function getDailySuccessGDS(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Daily Successful Volumes"
      ,rowCount:rows
      ,request:[requests.gdsSuccess]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getWeeklySuccessGDS(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Weekly Successful Volumes"
      ,rowCount:rows
      ,request:[requests.gdsWeeklySuccess]
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:param.dataDump
      ,width:param.width
      ,height:param.height
      ,weekly:true
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function getSuccessfulLocDevice(param) {
  try {
    var rows = param.rowCount;
    var requests = buildOneOffRequests(rows);
    
    var params = {
      title:"Successful Location by Device"
      ,rowCount:rows
      ,request:[requests.successLocDevice,requests.successLocDesktop] 
      ,sDate:param.sDate
      ,eDate:param.eDate
      ,metric:"ga:pageViews"
      ,type:"table"
      ,buildHtml:param.buildHtml
      ,dataDump:"HTML"
      ,width:param.width
      ,height:param.height
    }
    return createReport(params);
  } catch (error) {Browser.msgBox(error);};
}

function convertDate(datum) {
  var y = String(datum).substr(0,4);
  var m = String(datum).substr(4,2);
  var d = String(datum).substr(6,2);
  return y+"-"+m+"-"+d;
}
