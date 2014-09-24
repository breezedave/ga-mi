/*
Volumes by mobile device
Successful volumes by mobile device
Volumes by country
Successful volumes by country
Volumes by network domain
Successful volumes by network domain
Enquiry Reason event Volume
Enquiry Reason event Split
Successful device Category Split
Successful mobile OS Split
Volumes by Hour
Map of visitors
Map of Successful visitors
Map of Mobile visitors
Category "More Detail" Checks
Success Rate
Success Rate by DLN
Success Rate by Personal Details
Success Volume
Failure Volume
Success Volume by DLN
Failure Volume by DLN
Success Volume by Personal Details
Failure Volume by Personal Details
Session Volume
Daily Success (GDS)
Weekly Success (GDS)
Successful location by Device
Volumes by region
Successful volumes by region
Success Mobile Volume
Success Tablet Volume
Success Desktop Volume
Success by Hour
*/

function buildAllDashboards() {
  try {
    var datum = new Date();
    datum.setDate(datum.getDate()-1);
    var eDate = javaDateToStr(datum);
    datum.setDate(1);
    var sDate = javaDateToStr(datum);    
    /*testDashboard(sDate,eDate); 
    testDashboard(20140331,eDate); 
    testDashboard(eDate,eDate);*/
    infographicDashboard(20140331,eDate); 
  } catch (error) {Browser.msgBox(error);};
}


function infographicDashboard(sDate,eDate) {
  try {    
    sDate = convertDate(sDate);
    eDate = convertDate(eDate);
    
    var html = '<!DOCTYPE html>';
    html += '<html>';
    html += '<head>';
    html += '<body>';
    
    html += loadElement(sDate,eDate,40,'Successful mobile OS Split',400,236.4,404,964);   
    html += loadElement(sDate,eDate,15,'Success Tablet Volume',400,166.8,404,797);
    html += loadElement(sDate,eDate,15,'Success Mobile Volume',400,166.8,404,630);
    html += loadElement(sDate,eDate,4,'Successful device Category Split',400,236.4,404,396);   
    html += loadElement(sDate,eDate,15,'Success Volume',400,166.8,404,230);
    html += loadElement(sDate,eDate,10,'Successful volumes by region',400,0,404,22);    
    html += loadElement(sDate,eDate,100,'Successful volumes by country',400,0,5,5);   
    
    
    html += '</body>';
    html += '</html>';
    
    var fileName = "Infographic Dashboard " + sDate + " " + eDate + ".html";
    saveFile(fileName,html);
  } catch (error) {Browser.msgBox(error);};
}

function testDashboard(sDate,eDate) {
  try {    
    sDate = convertDate(sDate);
    eDate = convertDate(eDate);
    
    var html = '<!DOCTYPE html>';
    html += '<html>';
    html += '<head>';
    html += '<body>';
    
    html += loadElement(sDate,eDate,24,'Success by Hour',439,300,847,5);
    html += loadElement(sDate,eDate,15,'Session Volume',400,166.8,10,10);
    html += loadElement(sDate,eDate,15,'Success Rate',400,250,10,174.8);
    html += loadElement(sDate,eDate,15,'Success Volume',200,83.4,10,423.8);
    html += loadElement(sDate,eDate,15,'Failure Volume',200,83.4,210,423.8);
    html += loadElement(sDate,eDate,7,'Successful volumes by country',439,330,409,333);
    html += loadElement(sDate,eDate,10,'Map of Successful visitors',440,330,409,-8);
    
    html += '</body>';
    html += '</html>';
    
    var fileName = "Test Dashboard " + sDate + " " + eDate + ".html";
    saveFile(fileName,html);
  } catch (error) {Browser.msgBox(error);};
}

function saveFile(fileName,html) {
  var file = DriveApp.createFile(fileName, html); 
  var folders = DriveApp.getFolders();
  while(folders.hasNext()){
    var folder = folders.next();
    if(folder.getName()=="Reports"){
      var id = folder.addFile(file);
      DriveApp.removeFile(file);
    }
  }
}

function loadElement(sDate,eDate,rCount,selReport,width,height,left,top) {
  Utilities.sleep(1000);
  var html = '<div style="position:absolute;top:0;left:0;overflow:visible">';
  html += '<div style="margin-left:' + left + 'px; margin-top:' + top + 'px;">';  
  html += selectReport(sDate,eDate,rCount,selReport,false,width,height,"No");
  html += '</div>';
  html += '</div>';
  return html;
}

function javaDateToStr(datum) {
  str = datum.getFullYear();
  var mnth = "00" + (datum.getMonth()+1);
  str += mnth.substr(mnth.length-2,2);
  var dy = "00" + datum.getDate();
  str += dy.substr(dy.length-2,2);
  return str;
}
