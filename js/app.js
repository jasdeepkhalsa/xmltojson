// Get file
var upload = document.getElementById('upload');
var xmldoc = document.getElementById('xmldoc');
upload.addEventListener('click', doTheMagic, false);

// Get the XML from the file and convert it to JSON
function doTheMagic() {
    var file = xmldoc.files[0];
    var reader = new FileReader();
    reader.onload = function(evt) {
        var parsed = new DOMParser().parseFromString(evt.target.result, "text/xml");
        var jsonText = JSON.stringify([xmlToJson(parsed)]);
        document.write(jsonText);
    }
    reader.readAsText(file);
}

// Changes XML to JSON
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        //obj["attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                //obj["attributes"][attribute.nodeName] = attribute.nodeValue;
                obj[attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue.trim(); // add trim here
    }

    // do children
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    } else if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                var tmp = xmlToJson(item);
                if(tmp != "") // if not empty string
                    obj[nodeName] = tmp;
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                var tmp = xmlToJson(item);
                if(tmp != "") // if not empty string
                    obj[nodeName].push(tmp);
            }
        }
    }
    return obj;
};