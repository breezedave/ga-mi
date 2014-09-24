function createValueWithHtml(vals,title,width,height) {
  var html = "<!DOCTYPE>";
  html += "<html>";
  html += "<head>";
  html += "<title>" + title + "</title>";
  html += "</head>";
  html += "<body>";
  html += createValue(vals,title,width,height)
  html += "</body>";
  html += "</html>";
  return html;
}

function createValue(vals,title,width,height) {
  var value = parseFloat(vals[0].volume);
  getColors();
   
  var svgPath = '';
  
  svgPath += '<rect width="60" height="25" fill-opacity="0" stroke-width="0.5" stroke="#CBCBCB"></rect>';
  
  var titlePath = '<g transform="translate(5,12.5)">';
  titlePath += '<rect width="50" height="12" stroke-width="0" fill-opacity="1" fill="#FFFFFF"/>';
  var splitTitle = titleSplitter(title);
  titlePath += '<text width="50" fill="#333333" x="25" y="6" text-anchor="middle" ';
  titlePath += 'font-size="3" ';
  titlePath += 'fill="#FFFFFF">' + splitTitle[0]  + '</text>';
  titlePath += '<text width="50" fill="#333333" x="25" y="10" text-anchor="middle" ';
  titlePath += 'font-size="3" ';
  titlePath += 'fill="#FFFFFF">' + splitTitle[1]  + '</text>';
  titlePath += '</g>';
  
  var valuePath = '<g transform="translate(5,2.5)">';
  valuePath += '<text width="50" fill="#333333" x="25" y="10" text-anchor="middle" ';
  valuePath += 'font-size="15" ';
  valuePath += 'fill="#FFFFFF">' + commaToNum(parseInt(value))  + '</text>';
  valuePath += '</g>';
    
  svgPath += titlePath;
  svgPath += valuePath;
  
  html = '<svg width="' + width + '" height="' + height + '" viewBox="0 0 60 25" >' + svgPath + '</svg>';  
  return html;
  
}

function commaToNum(val) {
  var strVal = String(val);
  var len = strVal.length; 
  var str = "";
  var i2=0;
  for (var i= len-1;i>0;i--) {
    if(i2%3==2){
      str = ("," + strVal[i]) + str;
    } else {
      str = "" + strVal[i] + str; 
    }
    i2++;
  }
  str = strVal[0] + str;
  return str;
}