function getData() {
  try {
    var account = getAccount("YourAccountName");
    var property = getProperty(account,"YourPropertyName");
    var profile = getProfile(account,property,0);
    var requests = buildRequests();
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
    var sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reports");
    var sheet3 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
    
    sheet.activate();
    sheet.clearContents();
    
    makeRequest(sheet, profile, requests.dailyVolumes, 'ga:sessions', "Daily Volumes", 1);
    makeRequest(sheet, profile, requests.dailyVolumesByDeviceCat, 'ga:sessions', "Daily Volumes by Device Type", 8);
    makeRequest(sheet, profile, requests.totVolumesByMobDevice, 'ga:sessions', "Total Volumes by Mobile Device", 12);
    makeRequest(sheet, profile, requests.busiestHour, 'ga:sessions', "Busiest Time", 16);
    makeRequest(sheet, profile, requests.volumesByLocation, 'ga:sessions', "Volumes by Location", 19);
    makeRequest(sheet, profile, requests.dailySuccesses, 'ga:pageViews', "Daily Success Volumes", 24);
    
    sheet.hideSheet();
    sheet2.getRange(8,10).setValue(sheet3.getRange(3,3).getValue());
    
  } catch (error) {
    Browser.msgBox(error); 
  }
}

function getAccount(accName) {
  var accounts = Analytics.Management.Accounts.list();
  if (accounts.getItems()) {
    var accountList = accounts.getItems();
    var accountId;
    for(var i = 0; i< accountList.length; i++) {
      if(accountList[i].getName() == accName) {
        accountId = accountList[i].getId();
      }
    }
    return accountId;
  }
}

function getProperty(accId,propertyName) {
  
  var webProperties = Analytics.Management.Webproperties.list(accId);
  
  if (webProperties.getItems()) {
    var propList = webProperties.getItems();
    var property;
    for(var i = 0; i< propList.length;i++) {
      if(propList[i].getName() == propertyName) {
        property = propList[i];
      }
    }
    return property.getId();
  } 
}

function getProfile(accountId,propertyId,profileOrderNum) {
  var profiles = Analytics.Management.Profiles.list(accountId, propertyId);
  if (profiles.getItems()) {
    profile = profiles.getItems()[profileOrderNum];
    return profile.getId();
  }
}

function makeRequest(sheet, profile, request, metric, title, colStart) {
  var tableId = 'ga:' + profile;
  //var startDate = getLastNdays(14);
  var startDate = Utilities.formatDate(new Date(2014,2,32),'GMT','yyyy-MM-dd');
  var endDate = getLastNdays(1);
    
  var results = Analytics.Data.Ga.get(
     tableId
    ,startDate
    ,endDate
    ,metric
    ,request
  );

  if (results.getRows()) {
    outputToSpreadsheet(sheet, title, results, colStart);
  } 
  return;
}

function outputToSpreadsheet(sheet, title, results,colStart) {
  // Print the headers.
  var headerNames = [];
  for (var i = 0, header; header = results.getColumnHeaders()[i]; ++i) {
    headerNames.push(header.getName());
  }
  
  sheet.getRange(1, colStart, 1, 1)
      .setValue(title);
  sheet.getRange(2, colStart, 1, headerNames.length)
      .setValues([headerNames]);

  // Print the rows of data.
  //Browser.msgBox("x:" + headerNames.length + " y: " + results.getRows().length);
  sheet.getRange(3, colStart, results.getRows().length, headerNames.length)
      .setValues(results.getRows());
}


function getLastNdays(nDaysAgo) {
  var today = new Date();
  var before = new Date();
  before.setDate(today.getDate() - nDaysAgo);
  return Utilities.formatDate(before, 'GMT', 'yyyy-MM-dd');
}


function buildRequests() {
  var dailyVolumes = {
     'dimensions': 'ga:date'
    ,'sort':'ga:date'
    ,'start-index':'1'
    ,'max-results':'10000'
  };

  var dailySuccesses = {
    'dimensions': 'ga:date,ga:pagePath'
    ,'sort':'ga:date'
    ,'filters':'ga:pagePath=~(viewby|error)'
    ,'start-index':'1'
    ,'max-results':'10000'
  };
  
  var dailyVolumesByDeviceCat = {
     'dimensions': 'ga:date,ga:deviceCategory'
    ,'sort':'ga:date'
    ,'start-index':'1'
    ,'max-results':'10000'
  };
  
  var totVolumesByMobDevice = {
     'dimensions': 'ga:mobileDeviceBranding,ga:mobileDeviceMarketingName'
    ,'sort':'-ga:sessions'
    ,'start-index':'1'
    ,'max-results':'10000'
  };

  var busiestHour = {
    'dimensions': 'ga:hour,ga:minute'
    ,'sort':'ga:hour,ga:minute'
    ,'start-index':'1'
    ,'max-results':'10000'
  };
  
  var volumesByLocation = {
    'dimensions': 'ga:country,ga:region,ga:city'
    ,'sort':'-ga:sessions'
    ,'start-index':'1'
    ,'max-results':'10000'
  };
  
  var requests = {
     "dailyVolumes": dailyVolumes
    ,"dailyVolumesByDeviceCat":dailyVolumesByDeviceCat
    ,"totVolumesByMobDevice":totVolumesByMobDevice
    ,"busiestHour":busiestHour
    ,"dailySuccesses":dailySuccesses
    ,"volumesByLocation":volumesByLocation
  }
  
  return requests;
}
