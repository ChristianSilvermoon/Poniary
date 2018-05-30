import BBCode from './bbcode.js';
import {AppData} from './app.js';
/*
	The page class is inteded to make modification of the page simple
	Especially for recurring actions
*/

//Local Constants that refer to omnipresent elements of the page
const body	= document.getElementsByTagName("body")[0];
const style	= document.getElementById('stylesheet');

export default class Page {
	constructor(refElements) {
		this.init();
		this.refElements = refElements;
	}

	get body() {
		return body;
	}

	get title() {
		return document.getElementById('pageTitle').innerHTML;
	}

	set title(title) {
		document.getElementById('pageTitle').innerHTML = title;
	}

	clear() {
		this.body.innerHTML = "";
	}

	set style(sheetname) {
		style.setAttribute("href", `stylesheets/${sheetname}.css`);
	}

	get style() {
		return style.getAttribute("href").replace( /stylesheets\/(.+).css/g, "$1");
	}

	showPony(id) {
		showPony(id, this);
	}

	showCharList() {
		const actionBar = document.createElement("div");
		actionBar.setAttribute("class", "actionbar smallwin");

		actionBar.innerHTML = ("<input type=text placeholder=\"RegEXP Filter\"></input><div style=\"float:right\">Sort: [ABC] [ZYX] [REV]</div>");

		const origContent = page.contentContainer.innerHTML;
		page.contentContainer.innerHTML = "";
		page.contentContainer.appendChild(actionBar);
		page.contentContainer.appendChild(page.displayArea);

		this.displayArea.innerHTML = "";

		saveData.forEachChar( pony => {
			let charHTML = "";
			charHTML += "<div class='charCard'>";
			charHTML += saveData.Characters.indexOf(pony).toString().padStart(3, "0") + " — "
			charHTML += `<span style="border-bottom: 4px solid; border-image: linear-gradient( to right, ${pony.bkg} 0%, 80%, #000 100% ) 1">`;
			charHTML += `${BBCode.decode( BBCode.strip(pony.name, ["code", "quote", "authoredQuote", "url", "namedURL"]) )}<br/>`;
			charHTML += `</span><br/><font size=1>`;
			charHTML += `<a href="javascript:void(0)" onclick="page.showPony(${saveData.Characters.indexOf(pony)})">View</a>` + " | Move Up | Move Down | Edit | Delete<br/>";
			charHTML += `Estimated Size: ${saveData.estimatedSize(true, saveData.Characters.indexOf(pony))}`;
			charHTML += "</font></div>"

			this.displayArea.innerHTML += charHTML;
		});

	}

	showWelcome() {
		//Clear Content Area
		this.contentContainer.innerHTML = "";
		this.contentContainer.appendChild(this.displayArea);

		const refPage = this.refElements.querySelector("#welcomeRef");

		this.displayArea.innerHTML = refPage.innerHTML;
		this.displayArea.querySelector(".appVer").innerHTML		= AppData.version;
		this.displayArea.querySelector(".appAuthor").innerHTML	= AppData.author;

	}

	showBBCodeRef() {
		//Clear Content Area
		this.contentContainer.innerHTML = "";
		this.contentContainer.appendChild(this.displayArea);

		const refPage = this.refElements.querySelector("#bbCodeRef").innerHTML;

		this.displayArea.innerHTML = refPage;
	}

	smoothScrollTop() {
		var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
		console.log("called", currentScroll);
		if (currentScroll > 0) {
			window.requestAnimationFrame(page.smoothScrollTop);
			window.scrollTo(0, currentScroll - (currentScroll/5));
		}
	}

	handleLoadFile(element, mode = "overwrite") {
		const fileReader = new FileReader();
		fileReader.onload = event => {
			if ( mode == "overwrite" ) {
				saveData.loadOverwrite(JSON.parse(event.target.result));
			}
		}

		fileReader.readAsText(element.files[0]);
	}

	init() {
		this.clear(); //Wipe current contents

		//Create Divs and Div properties
		body.innerHTML			= "<div id=Header></div><div id=ContentContainer></div><div id=StatusBar>";
		this.header				= document.getElementById("Header");
		this.contentContainer	= document.getElementById("ContentContainer");
		this.statusBar			= document.getElementById("StatusBar");
		this.console			= document.createElement("code");
		this.displayArea		= document.createElement("div");
		this.fileInfo			= document.createElement("div");
		this.fileSizeInfo		= document.createElement("span");
		this.charCountInfo		= document.createElement("span");
		this.lockStatus			= document.createElement("span");
		this.topButton			= document.createElement("div");

		//Set Attributes
		this.displayArea.setAttribute("id", "displayArea");
		this.displayArea.setAttribute("class", "bigwin");
		this.console.setAttribute("id","StatusBarConsole");
		this.console.setAttribute("title", "JavaScript Console Mini Output");
		this.fileInfo.setAttribute("id", "StatusBarFileInfo");
		this.fileSizeInfo.setAttribute("id", "StatusBarFileSize");
		this.charCountInfo.setAttribute("id", "StatusBarFileCharCount");
		this.lockStatus.setAttribute("id", "StatusBarFileLock");
		this.topButton.setAttribute("id","topButton");

		this.fileSizeInfo.setAttribute("title", "Estimated File Size");
		this.lockStatus.setAttribute("title", "Lock Status (Click to Toggle)");
		this.lockStatus.setAttribute("onclick", "saveData.MetaInf.lock = saveData.MetaInf.lock?false:true")
		this.topButton.setAttribute("onclick", "page.smoothScrollTop()");
		this.topButton.setAttribute("title", "Scroll Back To Top Of Page");

		this.topButton.innerHTML = "<img height=\"16px\" width=\"16px\" src=\"img/icon_arrowup_blue.png\"></img>";


		this.charCountInfo.setAttribute("title", "No. of Characters");

		this.statusBar.appendChild(this.console);
		this.statusBar.appendChild(this.topButton);
		this.statusBar.appendChild(this.fileInfo);

		this.fileInfo.appendChild(this.lockStatus);
		this.fileInfo.appendChild(this.fileSizeInfo);
		this.fileInfo.appendChild(this.charCountInfo);


		//Setup Titlebar
		this.header.innerHTML	= "<div id=titleBar>♥~Poniary~♥</div>";
	}
}

function showPony(id, page) {
	const pony = saveData.Characters[id];
	console.info("Displaying:", BBCode.strip(pony.name) );
	// viewing = pony;
	const actionBar = document.createElement("div");
	actionBar.setAttribute("class", "actionbar smallwin");

	actionBar.innerHTML = ("<a href=\"javascript:void(0)\" onclick=\"page.showCharList()\">◄ Back to Character List</a> <span style=\"float:right;\">Edit</span>");

	const origContent = page.contentContainer.innerHTML;
	page.contentContainer.innerHTML = "";
	page.contentContainer.appendChild(actionBar);
	page.contentContainer.appendChild(page.displayArea);

	//background: linear-gradient(135deg,  #003F8C 0%,#000000 100%);
	let table			= document.createElement("table");
	let tableContent	= table.innerHTML

	//Setup Background Color
	tableContent += "<tr><td style=\"background: linear-gradient(135deg, ";
	tableContent += pony.bkg;
	tableContent += " 0%, #000000 100%)!important;\">";

	// tableContent = tableContent.concat("<sup><font size=1 color=#26FF6A;>", (viewing + 1), "/", ponydata.TableOfContents.length, "</font></sup> " );

	//Name
	tableContent += BBCode.decode( BBCode.strip(pony.name, [ "quote", "code", "authoredQuote"]) );

	//Subtitle
	tableContent += "<div style=\"float: right;\">" + BBCode.decode( BBCode.strip(pony.subtitle, [ "quote", "code", "authoredQuote"])) + "</div><hr/>";

	//Pictures
	if ( typeof pony.img[0] != "undefined" ){
		tableContent += "<table style=\"border: none;\" border=\"1px\"><tr>";
		for(let i = 0; pony.img[i] != undefined; i++) {
			tableContent += "<td width=\"100px\" height=\"100px\"><img width=100px height=100px src=\"" + pony.img[i][1] + "\"></td>";
		}
		tableContent += "</tr><tr>";

		for(let i = 0; pony.img[i] != undefined; i++) {
			tableContent += "<td><center>" + BBCode.decode( BBCode.strip(pony.img[i][0], [ "quote", "code", "authoredQuote"])) + "</center></td>";
		}
		tableContent += "</table><br/>";
	}

	//Character's Creator/Owner
	if ( pony.creator.toLowerCase() != "unknown" && pony.creator.length != 0) {
		tableContent += "Creator: " + BBCode.decode(BBCode.strip(pony.creator, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.creator.toLowerCase() == "unknown" ) {
		tableContent += "Creator: <font color=gray><i>" + BBCode.decode( BBCode.strip(pony.creator, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//Character's Date of Birth
	if ( pony.dob.toLowerCase() != "unknown" && pony.dob.length != 0 ) {
		tableContent += "Birth Date: " + BBCode.decode(BBCode.strip(pony.dob, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.dob.toLowerCase() == "unknown" ) {
		tableContent += "Birth Date: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.dob, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//Character's Birth Place
	if ( pony.birthPlace.toLowerCase() != "unknown" && pony.birthPlace.length != 0 ) {
		tableContent += "Birth Place: " + BBCode.decode(BBCode.strip(pony.birthPlace, [ "quote", "code", "authoredQuote"])) + "<br/>";
	} else if ( pony.birthPlace.toLowerCase() == "unknown" ) {
		tableContent += "Birth Place: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.birthPlace, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//Character's Race
	if ( pony.race.toLowerCase() != "unknown" && pony.race.length != 0 ) {
		tableContent += "Race: " + BBCode.decode(BBCode.strip(pony.race, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.race.toLowerCase() == "unknown" ) {
		tableContent += "Race: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.race, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//Girl Pon? Boy Pon? ~ Professor Oak
	if ( pony.gender.toLowerCase() != "undefined" && pony.gender != "N/a" ) {
		tableContent += "Gender: " + BBCode.decode(BBCode.strip(pony.gender, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.gender.toLowerCase() == "undefined" ) {
		tableContent += "Gender: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.gender, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//Pon likes what pons?
	if ( pony.orientation.toLowerCase() != "unknown" && pony.orientation.length != 0 ) {
		tableContent += "Orientation: " + BBCode.decode(BBCode.strip(pony.orientation, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.orientation.toLowerCase() == "unknown" ) {
		tableContent += "Orientation: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.orientation, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//What does pon do?
	if ( pony.occupation.toLowerCase() != "unknown" && pony.occupation.length != 0 ) {
		tableContent += "Occupation: " + BBCode.decode(BBCode.strip(pony.occupation, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.occupation.toLowerCase() == "unknown" ) {
		tableContent += "Occupation: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.occupation, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	if ( pony.specialTalent.toLowerCase() != "unknown" && pony.specialTalent.length != 0 ) {
		tableContent += "Special Talent: " + BBCode.decode(BBCode.strip(pony.specialTalent, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.specialTalent.toLowerCase() == "unknown" ) {
		tableContent += "Special Talent: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.specialTalent, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//Magic Pon Mark
	if ( pony.cutieMark.toLowerCase() != "unknown" && pony.cutieMark != 0 ) {
		tableContent += "Cutie Mark: " + BBCode.decode(BBCode.strip(pony.cutieMark,[ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.cutieMark.toLowerCase() == "unknown" ) {
		tableContent += "Cutie Mark: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.cutieMark, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	//Pon Universe
	if ( pony.universe.toLowerCase() != "unknown" && pony.universe != 0 ) {
		tableContent += "Universe: " + BBCode.decode(BBCode.strip(pony.universe, [ "quote", "code", "authoredQuote"])) + "<br/>";

	} else if ( pony.universe.toLowerCase() == "unknown" ) {
		tableContent += "Universe: <font color=gray><i>" + BBCode.decode(BBCode.strip(pony.universe, [ "quote", "code", "authoredQuote"])) + "</i></font><br/>";
	}

	/*Custom Fields*/
	for(let i = 0; pony.customFields[i] != undefined; i++) {
		tableContent += BBCode.decode(pony.customFields[i][0]), ": ", BBCode.decode(pony.customFields[i][1]), "<br/>";
	}

	/*Pony Colors Table*/
	if ( pony.colors.length > 0 ) {
		tableContent = tableContent.concat("<br/>Coloration (Click Code to Copy):<br/><table class=\"list_table\"><tr><td>Color</td><td>Item(s)</td></tr>");
		for(let i = 0; pony.colors[i] != undefined; i++) {
			tableContent += "<tr><td style=\"background: " + pony.colors[i][0] + ";\" onclick=\"copyInnerText(this); msgBox('Copied Color Code to Clipboard','Text Copied')\" title=\"Click to Copy\">" + pony.colors[i][0] + "</td><td>" + BBCode.decode( BBCode.strip(pony.colors[i][1], [ "quote", "code", "authoredQuote"])) + "</td></tr>";
		}
		tableContent += "</table><br/>";
	}

	//Family Table
	if ( pony.family.length > 0 ) {
		tableContent = tableContent.concat("Family:<br/><table class=\"list_table\"><tr><td>Relation</td><td>Name</td></tr>");
		for(let i = 0; pony.family[i] != undefined; i++) {
			tableContent += "<tr><td>" + BBCode.decode(BBCode.strip(pony.family[i][0], [ "quote", "code", "authoredQuote"])) + "</td><td>" + BBCode.decode(BBCode.strip(pony.family[i][1], [ "quote", "code", "authoredQuote"])) + "</td></tr>";
		}
		tableContent += "</table><br/>";
	}

	//Bio
	if ( pony.bio.length > 0 ) {
		tableContent += "Description:<br/><div class=\"indent presize\">" + BBCode.decode(pony.bio) + "</div>";
	}

	//Abillity Table
	if ( pony.abilities.length > 0) {
		tableContent += "<br/>Abilities:<br/><table class=\"list_table max_width\"><tr><td>Type</td><td>Subtype</td><td>Name</td><td>Description</td></tr>";
		for(let i = 0; pony.abilities[i] != undefined; i++) {
			tableContent += "<tr><td>" + BBCode.decode(BBCode.strip(pony.abilities[i][0],[ "quote", "code", "authoredQuote"])) + "</td><td>" + BBCode.decode(BBCode.strip(pony.abilities[i][1], [ "quote", "code", "authoredQuote"])) + "</td><td>" + BBCode.decode(BBCode.strip(pony.abilities[i][2], [ "quote", "code", "authoredQuote"])) + "</td><td>" + BBCode.decode(pony.abilities[i][3]) + "</td></tr>";
		}
		tableContent += "</table><br/>";
	}


	tableContent += "</tr></td>"; //End Pon Deeets

	page.displayArea.innerHTML = tableContent;

}
