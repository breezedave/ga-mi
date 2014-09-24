function createSpeedoWithHtml(vals,title,width,height) {
  var html = "<!DOCTYPE>";
  html += "<html>";
  html += "<head>";
  html += "<title>" + title + "</title>";
  html += "</head>";
  html += "<body>";
  html += createSpeedo(vals,title,width,height)
  html += "</body>";
  html += "</html>";
  return html;
}

function createSpeedo(vals,title,width,height) {
  var r = 30;
  var speedoVal = parseFloat(vals[0].volume);
  if(speedoVal > 100) {
    Browser.msgBox(speedoVal + " must be less that 100");
    return '<svg>Error</svg>';
  }
  getColors();
   
  var svgPath = '';
  
  var defPath = '<defs>';
  defPath += '  <radialGradient id="grad1" cx="20%" cy="50%" r="100%">';
  defPath += '      <stop offset="45%" style="stop-color:rgb(225,225,225);stop-opacity:1" />';
  defPath += '      <stop offset="100%" style="stop-color:rgb(200,200,200);stop-opacity:1" />';
  defPath += '  </radialGradient>';
  defPath += '</defs>';
  
  svgPath += '<rect width="80" height="50" fill-opacity="0" stroke-width="0.5" stroke="#CBCBCB"></rect>';
  
  var titlePath = '<g transform="translate(5,35)">';
  titlePath += '<rect width="70" height="14" stroke-width="0" fill-opacity="1" fill="#FFFFFF"/>';
  
  var splitTitle = titleSplitter(title);
  
  titlePath += '<text width="70" fill="#333333" x="35" y="6" text-anchor="middle" ';
  titlePath += 'font-size="3" ';
  titlePath += 'fill="#FFFFFF">' + splitTitle[0]  + '</text>';
  titlePath += '<text width="70" fill="#333333" x="35" y="10" text-anchor="middle" ';
  titlePath += 'font-size="3" ';
  titlePath += 'fill="#FFFFFF">' + splitTitle[1]  + '</text>';
  titlePath += '</g>';
  
  var piePath= '<g transform="translate(5 25)">';
  var point1 = getVal(r,0);
  var point2 = getVal(r,50);
  var pct = 50;
  var colorFill = "url(#grad1)";
  var colorLine = "#0000FF";
  piePath += getSpeedoSlice(point1,point2,colorFill,colorLine,r,pct,0.5);

  
  colorFill = "#888888";
  colorLine = "#888888";
  var r2=28;
  for(var i = 0; i<=50;i++){
    var point1 = getVal(r2,(i-0.1));
    var point2 = getVal(r2,(i+0.1));
    var midPoint = getVal(r2,i);
    piePath += '<g transform="translate(' + (r-r2) + ' ' + (r-r2) + ')">' + getSpeedoSlice(point1,point2,colorFill,colorLine,r2,pct,0.1) + '</g>';
  }
  
  colorFill = "#FF0FFF";
  colorLine = "#FFFFFF";
  var r2=31;
  for(var i = 0; i<=10;i++){
    var point1 = getVal(r2,(i*5-0.3));
    var point2 = getVal(r2,(i*5+0.3));
    var midPoint = getVal(r2,(i*5));
    piePath += '<g transform="translate(' + (r-r2) + ' ' + (r-r2) + ')">' + getSpeedoSlice(point1,point2,colorFill,colorLine,r2,pct,0.5) + '</g>';
  }
   
  var r2 = (r*0.80);
  var point1 = getVal(r2,0);
  var point2 = getVal(r2,50);
  colorFill= "#FFFFFF";
  colorLine= "#FFFFFF";
  piePath += '<g transform="translate(' + (r-r2) + ' ' + (r-r2) + ')">' + getSpeedoSlice(point1,point2,colorFill,colorLine,r2,pct) + '</g>';

  
  colorFill = "#FFFFFF";
  colorLine = "#D61A1A";
  var r2=31;
  var point1 = getVal(r2,((speedoVal/2)-0.08));
  var point2 = getVal(r2,((speedoVal/2)+0.08));
  var midpoint = {};
  midpoint.x = (point1.x + point2.x)/2;
  midpoint.y = (point1.y + point2.y)/2;
  piePath += '<g transform="translate(' + (r-r2) + ' ' + (r-r2) + ')">';
  piePath += getSpeedoSlice(point1,point2,colorFill,colorLine,r2,pct,0.4);
  piePath += '</g>';
  
  piePath += '</g>'; 
  
  colorFill = "#FFFFFF";
  colorLine = "#D61A1A";
  var r2=31;
  piePath += '<g transform="translate(' + (r+2.5) + ' ' + (r-6) + ')">';
  for(var i = 0; i<=10;i++){
    var midPoint = getVal(r2,(i*5));
    piePath += '<g transform="rotate(' + (i*18) + ' 2.5 ' + r2 + ')">';
    piePath += '<text width="5" x="2.5" height="10" font-size="4" text-anchor="middle">' + (i*10) + '</text>';
    piePath += '<rect width="5" height="' + (r2 - 4) + '" fill-opacity="0"/>';
    piePath += '</g>'; 
  }
  piePath += '</g>';
    
  
  var r2=6
  var point1 = getVal(r2,0);
  var point2 = getVal(r2,50);
  var pct = 50;
  var colorFill = "#FFFFFF";
  var colorLine = "#FFFFFF";
  var scorePath = '<g transform="translate(27.5 47.5)">';
  scorePath += getSpeedoSlice(point1,point2,colorFill,colorLine,r2,pct,0.5);
  scorePath += '</g>';
  scorePath += '<g transform="translate(26.5 22.5) rotate (90 20 12.5)">';
  scorePath += '<text width="5" x="40" y="25" height="10" font-size="4" text-anchor="middle">' + speedoVal + '%</text>';
  scorePath += '</g>'
  scorePath += '</g>';
  
  svgPath += defPath;
  svgPath += titlePath;
  svgPath += '<g transform="translate(-60 -105) rotate(270 110 65)">';  
  svgPath += piePath;
  svgPath += scorePath;
  svgPath += '</g>';
  html = '<svg width="' + width + '" height="' + height + '" viewBox="0 0 80 50" >' + svgPath + '</svg>';  
  return html;
  
}

function getSpeedoSlice(point1,point2,colorFill,colorLine,r,pct,lineWidth) {
  if(!lineWidth) {lineWidth=1}
  var slice = "";
  slice += '<g>';
  slice += '<path stroke-width="' + lineWidth + '" '; 
  slice += 'stroke="' + colorLine + '" ';   
  slice += 'fill="' + colorFill + '" '; 
  slice += 'd="M' + point1.x + ' ' + point1.y
  slice += 'A ' + r + " " + r + " 0 ";
  if(pct <=50) {
    slice += "0,1 ";
  } else {
    slice += "1,1 ";
  }
  slice += point2.x + ' ' + point2.y + ' ';
  slice += 'L' + r + ' ' + r + ' ';
  slice += 'Z"/>';
  
  slice += '</g>';
  return slice;
}

function titleSplitter(title) {
  var splitDiv = 3;
  var splitTitle = [];
  splitTitle.push(title.substr(0,parseInt(title.length/splitDiv)+title.substr(parseInt(title.length/splitDiv),100).indexOf(" ")));
  splitTitle.push(title.substr(parseInt(title.length/splitDiv)+title.substr(parseInt(title.length/splitDiv),100).indexOf(" "),100));
  return splitTitle;
}
