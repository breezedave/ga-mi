var colors =[];
var colorI=0;

function createPieWithHtml(vals,title,width,height) {
  var html = "<!DOCTYPE>";
  html += "<html>";
  html += "<head>";
  html += "<title>" + title + "</title>";
  html += "</head>";
  html += "<body>";
  html += createPie(vals,title,width,height)
  html += "</body>";
  html += "</html>";
  return html;
}

function createPie(vals,title,width,height) {
	var r = 50;
	getColors();
	var valSum = 0;
	for(var i = 0;i<vals.length;i++){
		valSum += parseFloat(vals[i].volume); 
	}
	var pctSum = 0;
	for(var i = 0;i<vals.length;i++){
		vals[i].pct = parseFloat(vals[i].volume)/parseFloat(valSum)*100;
		pctSum += parseFloat(vals[i].pct); 
		vals[i].pctTot = pctSum
	}
	
	
    var defPath = '';
    defPath += '<defs>';
    defPath += '<clipPath id="cut-off">';
    defPath += '  <rect width="219" height="129" fill-opacity="0" stroke-width="0.5" stroke="#CBCBCB"></rect>';
    defPath += '</clipPath>';
    defPath += '<clipPath id="pie-cut-legend">';
    defPath += '  <rect width="110" height="20" y="-10" x="-10"></rect>';
    defPath += '</clipPath>';
    defPath += '<clipPath id="clipNone">';
    defPath += '  <rect width="0" height="0"></rect>';
    defPath += '</clipPath>';
  
    var svgPath = '';
	svgPath += '<rect width="219" height="129" fill-opacity="0" stroke-width="0.5" stroke="#CBCBCB"></rect>';
	
	var titlePath = '<g transform="translate(10,5)">';
	titlePath += '<rect width="200" height="15" stroke-width="0.5" fill-opacity="1" fill="#FFFFFF" stroke="#CBCBCB"/>';
	if(title.length<35) {
		titlePath += '<text width="180" x="100" y="10" text-anchor="middle" ';
		titlePath += 'font-size="8" ';
	} else { 
		titlePath += '<text width="180" x="100" y="10" text-anchor="middle" ';
		titlePath += 'font-size="6" ';
	}
	titlePath += 'fill="#333333">' + title + '</text>';
	titlePath += '</g>';
	
	var tblPath = '<g transform="translate(115 25)">'
	
	
	var piePath= '<g transform="translate(5 25)">';
	var point1 = ({"x":r,"y":0});
	var point2 = getVal(r,vals[0].pctTot);
	var midPoint = getVal(r,vals[0].pctTot/2)
	var pct = parseFloat(vals[0].pct);
	var txt = Math.round(parseFloat(pct),2) + "%";
	var name = vals[0].name + ' - ' + vals[0].volume;
	var color = colors[colorI%colors.length]; colorI++;
	piePath += getSlice(point1,point2,midPoint,pct,color,txt,r,0);
	tblPath += tblEntry(color,name,vals.length,0);
    defPath += sliceDef(point1,point2,pct,r,i);
	
	for(var i = 1;i<vals.length;i++) {
		var point1 = getVal(r,vals[i-1].pctTot);
		var point2 = getVal(r,vals[i].pctTot);
		var midPoint = getVal(r,(vals[i-1].pctTot+vals[i].pctTot)/2);
		var pct = vals[i].pct;
		var color = colors[colorI%colors.length]; colorI++;
		var txt = Math.round(parseFloat(pct)*100,1)/100 + "%";
		var name = vals[i].name + ' - ' + vals[i].volume;
		piePath += getSlice(point1,point2,midPoint,pct,color,txt,r,i);
        defPath += sliceDef(point1,point2,pct,r,i);
		tblPath += tblEntry(color,name,vals.length,i*8);
	}
	piePath += '<circle fill="#ffffff" fill-opacity="1" cx="' + r + '" cy="' + r + '" r="' + 8 + '"/>';
    piePath += '<text id="centreText" x="' + r + '" y="' + (r + 1.5) + '" text-anchor="middle" font-size="4" font-family="verdana"></text>';
	piePath += '</g>';
	
	tblPath += '</g>';
	
    defPath += '</defs>';
  
    svgPath += defPath;
	svgPath += titlePath;
	svgPath += piePath;
	svgPath += tblPath;
	html = '<svg width="' + width + '" height="' + height + '" viewBox="0 0 220 130" ><g clip-path="url(#cut-off)">' + svgPath + '</g></svg>';  
	return html;
}

function tblEntry(color,name,valsLen,y) {
	var entry = "";
	entry += '<g clip-path="url(#pie-cut-legend)" transform="translate(0 ' + ((110-(8*valsLen))/2 + y) + ')">';
	entry += '<circle x="5" y="5" r="3" fill="' + color + '"/>';
	entry += '<text x="8" y="1.5" font-size="5">' + name + '</text>';
	entry += '</g>';
	return entry;
}

function sliceDef(point1,point2,pct,r,i) {
  
    var slice = '<clipPath id="clip' + i + '">';
    slice += '<path ';
	slice += 'd="M' + point1.x + ' ' + point1.y;
	slice += 'A ' + r + " " + r + " 0 ";
	if(pct <=50) {
		slice += "0,1 ";
	} else {
		slice += "1,1 ";
	}
	slice += point2.x + ' ' + point2.y + ' ';
	slice += 'L' + r + ' ' + r + ' ';
	slice += 'Z"/>';
    slice += '</clipPath>';
    return slice;
}
function getSlice(point1,point2,midPoint,pct,color,txt,r,i) {
	var slice = "";
	slice += '<g>';
	slice += '<path stroke-width="1" stroke="#FFFFFF" '; 
    slice += 'onmouseover =\'var thisPct = this.parentNode.getElementsByTagName("text")[0].innerHTML;this.parentNode.parentNode.parentNode.parentNode.getElementById("centreText").innerHTML=thisPct;\'';
    slice += 'onmouseout =\'this.parentNode.parentNode.parentNode.parentNode.getElementById("centreText").innerHTML="";\'';
	slice += 'fill="' + color + '" '; 
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
	
	slice += '<text clip-path="url(#clipNone)" x="' + (r + midPoint.x*3)/4 ;
	slice += '" y="' + (r + midPoint.y*3)/4;
	slice += '" font-size="' + 6 + '" ';
    slice += 'fill="#333333" text-anchor="middle">';
	slice += txt;
	slice += '</text>';
	
	slice += '</g>';
	return slice;
}

function getVal(r,pct) {
	deg = pct*3.6;
	radX = deg * (Math.PI/180);
	radY = (90-deg) * (Math.PI/180);
	var x = (Math.sin(radX) * r);
	var y = (Math.sin(radY) * r);
	var point = {};
	point.x = parseFloat(x)+parseFloat(r);
	point.y = parseFloat(r) - parseFloat(y);
	return point;
}

function getColors() {
colors.push("#ABCDEF");
colors.push("#ABEFCD");
colors.push("#CDABEF");
colors.push("#CDEFAB");
colors.push("#EFABCD");
colors.push("#EFCDAB");
colors.push("#90C0F0");
colors.push("#90F0C0");
colors.push("#C090F0");
colors.push("#C0F090");
colors.push("#F090C0");
colors.push("#F0C090");
}
