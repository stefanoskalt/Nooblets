/*jslint browser: true */
/*global window */
/*global XMLHttpRequest*/

//Called once to load the XML file containing the objects description
function openXmlFile(file) {
    "use strict";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "resources/xml/" + file, false);
    xmlhttp.send();
    return xmlhttp.responseXML;
}

function isArrayIdentical(arr1, arr2) {
    "use strict";
    if (arr1.length !== arr2.length) {
        return false;
    }
    var flag = 0;
    var i;
    var j;
    for (i = 0; i < arr1.length; i += 1) {

        for (j = 0; j < arr2.length; j += 1) {
            if (arr1[i] === arr2[j]) {
                flag = 1;
            }
            if (j === arr2.length - 1 && flag === 0) {
                return false;
            }
            if (j === arr2.length - 1 && flag === 1) {
                flag = 0;
            }
        }
    }
    return true;
}

//called to get a description for a specific object
//e.g getDescription(xmlDoc, 'Sofa')
//where xmlDoc is the returned variable from the function openDescriptionsFile()
//where 'Sofa' is the name of the model we want the description of.
function getDescription(xml, name) {
    "use strict";
    var objects = xml.getElementsByTagName('object');
    var i;
    for (i = 0; i < objects.length; i += 1) {
        if (objects[i].children[0].childNodes[0].nodeValue === name) {
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
    "use strict";
    var objects = xml.getElementsByTagName("Person");
    var dialogues;
    var i;
    var j;
    for (i = 0; i < objects.length; i += 1) {
        if (objects[i].children[0].textContent === person) {
            dialogues = objects[i].children[1]; //dialogues is the "<conversations>...</conversation>" xml level
            for (j = 0; j < dialogues.childElementCount; j += 1) {
                if (dialogues.children[j].children[0].textContent === value) {
                    return dialogues.children[j].children[1].textContent;
                }
            }
        }
    }
    return "Error: Dialogue can not be retrieved";
}
function checkPerson(xml, person) {
    "use strict";
    var objects = xml.getElementsByTagName("Person");
    var i;
    for (i = 0; i < objects.length; i += 1) {
        if (objects[i].children[0].textContent === person) {
            return true;
        }
    }
    return false;
}
function checkDialogueIsRead(xml, person, value) {
    "use strict";
    var objects = xml.getElementsByTagName("Person");
    var dialogues;
    var i;
    var j;
    for (i = 0; i < objects.length; i += 1) {
        if (objects[i].children[0].textContent === person) {
            dialogues = objects[i].children[1]; //dialogues is the "<conversations>...</conversation>" xml level
            for (j = 0; j < dialogues.childElementCount; j += 1) {
                if (dialogues.children[j].children[0].textContent === value) {
                    if (dialogues.children[j].children[2].textContent === "true") {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    }
    return "Error: Dialogue";
}
function getListOfDialogueNames(xml, person) {
    "use strict";
    var objects = xml.getElementsByTagName("Person");
    var i;
    var dialogues;
    for (i = 0; i < objects.length; i += 1) {
        if (objects[i].children[0].textContent === person) {
            dialogues = objects[i].children[1]; //dialogues is the "<conversations>...</conversation>" xml level

            return dialogues.getElementsByTagName("name"); //list of all relevant conversation items
        }
    }
}

function getComplexModelsDialogue(xml, person, value) {
    "use strict";
    var objects = xml.getElementsByTagName("Person");
    var allNames;
    var names;
    var dialogues;
    var i;
    var k;
    var j;
    for (i = 0; i < objects.length; i += 1) {
        if (objects[i].children[0].textContent === person) {
            dialogues = objects[i].children[1]; //dialogues is the "<conversations>...</conversation>" xml level
            allNames = dialogues.getElementsByTagName("name"); //list of all relevant conversation items

            for (k = 0; k < value.length; k += 1) {
                for (j = 0; j < allNames.length; j += 1) {
                    names = allNames[j].textContent.split("+");

                    if (isArrayIdentical(names, value)) {
                        return allNames[j].nextElementSibling.textContent;
                    }

                }
            }
        }
    }
    return "Error";
}
