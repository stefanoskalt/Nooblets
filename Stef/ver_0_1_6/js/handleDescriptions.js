//Called once to load the XML file containing the objects description
function openXmlFile(file){
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","resources/xml/"+file,false);
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

/**
 * called to get dialogue when talking to a person about an object
 * @param  {xml file} xml  xml file containing the conversation database
 * @param  {string} person the person who we want to talk with
 * @param  {string} value  the name of the object we want to talk about
 * @return {string}        what we want to say about the object
 */
function getDialogue(xml, person, value) {
	var objects = xml.getElementsByTagName("Person");
	var dialogues;
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].children[0].textContent == person){
			dialogues = objects[i].children[1];	//dialogues is the "<conversations>...</conversation>" xml level
			for (var j = 0; j < dialogues.childElementCount; j++){
				if (dialogues.children[j].children[0].textContent == value){
					return dialogues.children[j].children[1].textContent;
				}
			}
		}
	}
	return "Error: Description not found";
}
function checkPerson(xml, person){
	var objects = xml.getElementsByTagName("Person");
	var dialogues;
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].children[0].textContent == person){
			return true;
		}
	}
	return false;
}
function checkDialogueIsRead(xml, person, value){
	var objects = xml.getElementsByTagName("Person");
	var dialogues;
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].children[0].textContent == person){
			dialogues = objects[i].children[1];	//dialogues is the "<conversations>...</conversation>" xml level
			for (var j = 0; j < dialogues.childElementCount; j++){
				if (dialogues.children[j].children[0].textContent == value){
					if (dialogues.children[j].children[2].textContent == "true"){
						return true;
					}else {
						return false;
					}
				}
			}
		}
	}
	return "Error: Description not found";
}
function getListOfDialogueNames(xml, person){
	var objects = xml.getElementsByTagName("Person");
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].children[0].textContent == person){
			dialogues = objects[i].children[1];	//dialogues is the "<conversations>...</conversation>" xml level

			return dialogues.getElementsByTagName("name"); //list of all relevant conversation items
		}
	}
}

function getComplexModelsDialogue(xml, person, value) {
	var objects = xml.getElementsByTagName("Person");
	var allNames;
	var count = 0;
	var names;
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].children[0].textContent == person){
			dialogues = objects[i].children[1];	//dialogues is the "<conversations>...</conversation>" xml level
			allNames = dialogues.getElementsByTagName("name"); //list of all relevant conversation items

			for (var k = 0; k < value.length; k++){
				for (var j = 0; j < allNames.length; j++){
					names = allNames[j].textContent.split("+");

					if (isArrayIdentical(names, value)){
						console.log(allNames)
						return allNames[j].nextElementSibling.textContent;
					}

				}
			}
		}
	}
	return "Error";
}
function isArrayIdentical(arr1, arr2){
	if (arr1.length !== arr2.length){
		return false;
	}
	var flag = 0;
	for (var i = 0; i < arr1.length; i++) {

		for (var j = 0; j < arr2.length; j++) {
			if (arr1[i] == arr2[j]){
				flag = 1;
			}
			if (j === arr2.length - 1 && flag === 0){
				return false;
			}else if (j === arr2.length - 1 && flag === 1) {
				flag = 0;
			}
		}
	}
	return true;
}
