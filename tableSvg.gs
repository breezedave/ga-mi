var colors =[];
var colorI=0;

function createTableWithHtml(vals,title,width) {
  var html = "<!DOCTYPE>";
  html += "<html>";
  html += "<head>";
  html += "<title>" + title + "</title>";
  html += "</head>";
  html += "<body>";
  html += createTable(vals,title,width);
  html += "</body>";
  html += "</html>";
  return html;
}

function createTable(vals,title,width) {
  var rowHeight = 20;
  var rowWidth = 450;
  var tblHeight = ((vals.length * rowHeight) + 40);
  getColors();
  var valSum = 0;
  var maxVal = 0;
  for(var i = 0;i<vals.length;i++){
    valSum += parseFloat(vals[i].volume); 
    if(maxVal < parseFloat(vals[i].volume)) {maxVal = parseFloat(vals[i].volume)};
  }
  var pctSum = 0;
  for(var i = 0;i<vals.length;i++){
    vals[i].pct = parseFloat(vals[i].volume)/parseFloat(valSum)*100;
    pctSum += parseFloat(vals[i].pct); 
    vals[i].pctTot = pctSum
  }
   
  var svgPath = '';
  svgPath += '<rect width="' + (rowWidth + 10) + '" height="' + tblHeight + '" fill-opacity="0" stroke-width="0.5" stroke="#CBCBCB"></rect>';
  
  var titlePath = '<g transform="translate(10,8)">';
  titlePath += '<rect width="' + (rowWidth -10) + '" height="20" stroke-width="1" fill-opacity="1" fill="#FFFFFF" stroke="#CBCBCB"/>';
  titlePath += '<text width="' + (rowWidth -10) + '" x="' + (rowWidth -10)/2 + '" y="15" text-anchor="middle" ';
  titlePath += 'font-size="14" ';
  titlePath += 'fill="#333333">' + title + '</text>';
  titlePath += '</g>';
  
  var tblPath = '<g transform="translate(5 34)">'
  for(var i = 0;i<vals.length;i++) {
    var pct = Math.round(parseFloat(vals[i].pct)*100,1)/100 + "%";
    var color = colors[colorI%colors.length]; colorI++;
    var name = vals[i].name;
    var val = vals[i].volume;
    var img = vals[i].url;
    tblPath += tableEntry(color,name,val,img,pct,maxVal,vals.length,i*rowHeight,rowWidth,rowHeight);
  }
  
  tblPath += '</g>';
  
  svgPath += titlePath;
  svgPath += tblPath;
  html = '<svg width="' + width + '" height="' + width/rowWidth*tblHeight + '" viewBox="0 0 ' + (rowWidth + 10) + ' ' + tblHeight + '" >' + svgPath + '</svg>';  
  return html;
}

function tableEntry(color,name,val,img,pct,maxVal,valsLen,y,rowWidth,rowHeight) {
  var entry = "";
  var rectW = rowWidth - rowHeight -2;
  entry += '<g width="' + rowWidth + '" height ="' + rowHeight + '" transform="translate(0 ' + y + ')">';
  entry += '<rect x="' + (rowHeight + 1) + '" y="0" width="' +rectW + '" fill-opacity="0.5" fill="#DEDEDE" stroke-width="1" stroke="#ffffff" height="' + (rowHeight-0) + '" ';
  entry += 'onmouseover =\'this.parentNode.getElementsByTagName("text")[1].innerHTML="' + pct + '";\'';
  entry += 'onmouseout =\'this.parentNode.getElementsByTagName("text")[1].innerHTML="' + val + '";\'';
  entry += '/>';
  entry += '<rect x="' + (rowHeight + 1) + '" y="0" width="' +(rectW*(val/maxVal)) + '" fill-opacity="0.8" fill="' + color + '" stroke-width="1" stroke="#ffffff" height="' + (rowHeight-0) + '" ';
  entry += 'onmouseover =\'this.parentNode.getElementsByTagName("text")[1].innerHTML="' + pct + '";\'';
  entry += 'onmouseout =\'this.parentNode.getElementsByTagName("text")[1].innerHTML="' + val + '";\'';
  entry += '/>';
  if(img&&img!=""){
    entry += '<image x="0" y="0" width="' + (rowHeight-1) + '" height="' + (rowHeight-1) + '" xlink:href="' + img + '"/>';
  }
  entry += '<text x="' + (rowHeight*1.5) + '" y="' + (rowHeight*0.65) + '" font-size="' + (rowHeight/2) + '">' + name + '</text>';
  entry += '<text x="' + rectW + '" y="' + (rowHeight*0.65) + '" width = "' + rectW + '" text-anchor="end" font-size="' + (rowHeight/2) + '">' + val + '</text>';
  entry += '</g>';
  return entry;
}