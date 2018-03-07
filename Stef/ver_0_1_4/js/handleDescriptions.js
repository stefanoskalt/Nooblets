//Called once to load the XML file containing the objects description
function openDescriptionsFile(){
	xmlhttp = new XMLHttpRequest();

	xmlhttp.open("GET","resources/xml/descriptions.xml",false);
	xmlhttp.send();
	return xmlhttp.responseXML;
}

//called to get a description for a specific object
//e.g getDescription(xmlDoc, 'Sofa')
//where xmlDoc is the returned variable from the function openDescriptionsFile()
//where 'Sofa' is the name of the model we want the description of.
function getDescription(xml, name) {
	var objects = xml.getElementsByTagName('object');
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].children[0].childNodes[0].nodeValue == name) {
			return objects[i].children[1].childNodes[0].nodeValue;
		}
	}
	return "Error: Description not found";
}