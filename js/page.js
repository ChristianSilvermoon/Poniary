import BBCode from './bbcode.js';
import DialogManager from './dialog.js';
import MenuBar from './menubar.js';
import menuBarPresets from './menubar_presets.js';
import Cookie from './cookie.js';
import {AppData} from './app.js';

/*
	The page class is inteded to make modification of the page simple
	Especially for recurring actions and other major app functions

	It can also be used to query the page state.
	for this reason, the Page should probably be a global object.
	or alternatively passed into other modules that need it in someway.

	For Poniary, it will be a global.
*/

//Local Constants that refer to omnipresent elements of the page
const body	= document.getElementsByTagName("body")[0];
const style	= document.getElementById('stylesheet');

export default class Page {
	constructor(refElements) {
		this.refElements	= refElements;
		this.dialogManager	= new DialogManager(this);
		this.BBCode			= BBCode;
		this.menuBar		= new MenuBar();
		this.state			= "Loading"
		this.init();
	}

	get styleCookie() {
		console.log(Cookie.get("stylesheet"));
		return Cookie.get("stylesheet");
	}

	set styleCookie(style) {
		let cookie = new Cookie('stylesheet', style);
		cookie.store();
		console.info(`Saved Cookie: ${cookie.name} = ${cookie.value}`)
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
		this.state = "char_" + id;

		if (saveData.MetaInf.lock === true) {
			this.setMenuBar("locked");
		} else {
			this.setMenuBar("default");
		}

		showPony(id, this);
		this.updateStatusBar();
	}

	showCharList(query = "", refreshCharsOnly = false) {
		this.state = "charList";

		if (saveData.MetaInf.lock === true) {
			this.setMenuBar("locked");
		} else {
			this.setMenuBar("default");
		}

		if ( !refreshCharsOnly) {
			const actionBar = document.createElement("div");
			actionBar.setAttribute("class", "actionbar smallwin");

			actionBar.innerHTML = `<input title="Start typing for instant search results." id="charListFilterBar" type=text placeholder="RegEXP Filter" onkeyup="page.showCharList(this.value, true)" value="${query}"></input><img height=24px width=24px src="./img/icon_help.png" onclick="page.showRegEXPHelp();" title="Help with RegExp" style="transform: translateY(25%)"></img>`;

			if ( saveData.MetaInf.lock == false ){
				let tmpActionBarString = "";
				tmpActionBarString += "<div style=\"float:right; text-align: right;\">";
				tmpActionBarString += "<a href=\"javascript:void(0)\" onclick=\"saveData.addChar(); page.showEditor(saveData.length - 1)\">+New Character</a><br/>Sort: ";
				tmpActionBarString += `<a href="javascript:void(0)" onclick="saveData.sortChars('ABC'); page.showCharList('${query}', true)" title="Sort Characters Alphabetically">[ABC]</a>`;
				tmpActionBarString += `<a href="javascript:void(0)" onclick="saveData.sortChars('ZYX'); page.showCharList('${query}', true)" title="Sort Characters Inverse Alphabetically">[ZYX]</a>`;
				tmpActionBarString += `<a href="javascript:void(0)" onclick="saveData.sortChars('REV'); page.showCharList('${query}', true)" title="Reverse Characters">[REV]</a>`;
				tmpActionBarString += "</div>";
				actionBar.innerHTML += tmpActionBarString;
			}

			const origContent = page.contentContainer.innerHTML;
			page.contentContainer.innerHTML = "";
			page.contentContainer.appendChild(actionBar);
			page.contentContainer.appendChild(page.displayArea);
		}

		this.displayArea.innerHTML = "";

		saveData.queryName(query, false).forEach( pony_id => {
			let pony = saveData.Characters[pony_id];
			saveData.estimatedSize(true, saveData.Characters.indexOf(pony)).then( estimatedSize => {
				let charHTML = "";
				charHTML += "<div class='charCard'>";
				charHTML += saveData.Characters.indexOf(pony).toString().padStart(3, "0") + " — "
				charHTML += `<span style="border-bottom: 4px solid; border-image: linear-gradient( to right, ${pony.ribbonColor} 0%, 80%, #000 100% ) 1">`;
				charHTML += `${BBCode.decode( BBCode.strip(pony.name, ["code", "quote", "authoredQuote", "url", "namedURL"]) )}<br/>`;
				charHTML += `</span><br/><font size=1>`;
				charHTML += `<a href="javascript:void(0)" onclick="page.showPony(${saveData.Characters.indexOf(pony)})">View</a>`
				if ( saveData.MetaInf.lock == false ) {
					charHTML += ` | <a href="javascript:void(0)" onclick="saveData.swapChars(${pony_id}, ${pony_id} - 1); page.showCharList('${query}', true);">Move Up</a>`;
					charHTML += ` | <a href="javascript:void(0)" onclick="saveData.swapChars(${pony_id}, ${pony_id} + 1); page.showCharList('${query}', true);">Move Down</a>`;
					charHTML += ` | <a href="javascript:void(0)" onclick="page.showEditor(${pony_id});">Edit</a>`;

					charHTML += ` | <a href="javascript:void(0)" onclick="saveData.offerDownload(${pony_id})\">Export</a>`;

					charHTML += ` | <a href="javascript:void(0)" onclick="page.promptDeleteChar(${pony_id})">Delete</a>`;
				}
				charHTML += `<br/>Estimated Size: ${estimatedSize}`;
				charHTML += "</font></div>"

				this.displayArea.innerHTML += charHTML;
			});
		});
		this.updateStatusBar();
	}

	showWelcome() {
		this.state = "welcome";
		if (saveData.MetaInf.lock === true) {
			this.setMenuBar("locked");
		} else {
			this.setMenuBar("default");
		}

		//Clear Content Area
		this.contentContainer.innerHTML = "";
		this.contentContainer.appendChild(this.displayArea);

		const refPage = this.refElements.querySelector("#welcomeRef");

		this.displayArea.innerHTML = refPage.innerHTML;
		this.displayArea.querySelector(".appVer").innerHTML		= AppData.version;
		this.displayArea.querySelector(".appAuthor").innerHTML	= AppData.author;

	}

	showBBCodeRef() {
		const refPage = this.refElements.querySelector("#bbCodeRef").innerHTML;

		this.dialogManager.create({
			title: "Information",
			text: refPage + "<br/><br/>" + this.dialogManager.createDialogLink("Got It")
		});
	}

	showRegEXPHelp() {
		const refPage = this.refElements.querySelector("#RegEXPRef").innerHTML;

		this.dialogManager.create({
			title: "Information",
			text: refPage + "<br/><br/>" + this.dialogManager.createDialogLink("Got It")
		});
	}

	showEditor(charID = 0) {
		this.state = "editor";
		this.setMenuBar("editor") //Set menubar to editor mode.
		this.contentContainer.innerHTML = "";
		this.contentContainer.appendChild(this.displayArea);
		this.displayArea.innerHTML 		= this.refElements.querySelector("#EditorRef").outerHTML;

		const pony = saveData.Characters[charID];
		this.displayArea.querySelector("#Editor_ID").innerHTML		= charID;
		this.displayArea.querySelector("#Editor_Name").value		= pony.name;
		this.displayArea.querySelector("#Editor_Subtitle").value	= pony.subtitle;
		this.displayArea.querySelector("#Editor_RibbonColor").value	= pony.ribbonColor;


		//Old code

		//Images
		var imgTb = this.displayArea.querySelector('#Editor_Images');
		imgTb.innerHTML = ""; //Clear Table
		for(let i = 0; i < pony.img.length; i++) {
			imgTb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><img width=50px height=50px src=\"" + pony.img[i][1] + "\"></td><td><input type=\"text\"  placeholder=\"Image Name\" value=\"" + pony.img[i][0] + "\"></input></td>"
		}


		this.displayArea.querySelector("#Editor_RibbonColor").value	= pony.ribbonColor;
		this.displayArea.querySelector("#Editor_Creator").value		= pony.creator;
		this.displayArea.querySelector("#Editor_DOB").value			= pony.dob;
		this.displayArea.querySelector("#Editor_BirthPlace").value	= pony.birthPlace;
		this.displayArea.querySelector("#Editor_Race").value		= pony.race;
		this.displayArea.querySelector("#Editor_Gender").value		= pony.gender;
		this.displayArea.querySelector("#Editor_Orientation").value	= pony.orientation;
		this.displayArea.querySelector("#Editor_Occupation").value	= pony.occupation;
		this.displayArea.querySelector("#Editor_Talent").value		= pony.specialTalent;
		this.displayArea.querySelector("#Editor_CutieMark").value	= pony.cutieMark;
		this.displayArea.querySelector("#Editor_Universe").value	= pony.universe;

		//Custom Fields
		var customFtb = this.displayArea.querySelector('#Editor_CustomFields');
		customFtb.innerHTML = ""; //Clear Table
		for(let i = 0; i < pony.customFields.length; i++) {
			customFtb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"text\"  placeholder=\"Field\" value=\"" + pony.customFields[i][0] + "\"></input></td><td><input type=\"text\"  placeholder=\"Value\" value=\"" + pony.customFields[i][1] + "\"></input></td>"
		}

		//Coloration
		var colorTb = this.displayArea.querySelector('#Editor_Colors');
		colorTb.innerHTML = ""; //Clear Table
		for (let i = 0; i < pony.colors.length; i++) {
			colorTb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"color\" value=\"" + pony.colors[i][0] + "\"></input></td><td><input type=\"text\"  placeholder=\"What holds this color?\" value=\"" + pony.colors[i][1] + "\"></input></td>"
		}

		//Family
		var familyTb = this.displayArea.querySelector('#Editor_Family');
		familyTb.innerHTML = ""; //Clear Table
		for (let i = 0; i < pony.family.length; i++) {
			familyTb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"text\"  placeholder=\"Relation\" value=\"" + pony.family[i][0] + "\"></input></td><td><input type=\"text\"  placeholder=\"Family Member Name\" value=\"" + pony.family[i][1] + "\"></input></td>"
		}

		//BIO
		this.displayArea.querySelector("#Editor_Description").value = pony.bio;

		//Abilities (This is the hard part :D)
		var abilityTb = this.displayArea.querySelector('#Editor_Abilities');
		abilityTb.innerHTML = ""; //Clear Table
		for (let i = 0; i < pony.abilities.length; i++) {
			abilityTb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"text\"  placeholder=\"Type\" value=\"" + pony.abilities[i][0] + "\"></input></td><td><input type=\"text\"  placeholder=\"Subtype\" value=\"" + pony.abilities[i][1] + "\"></input></td><td><input type=\"text\"  placeholder=\"Name\" value=\"" + pony.abilities[i][2] + "\"></input></td><td style=\"min-width: 400px;\"><textarea rows=3  placeholder=\"Description\">" + pony.abilities[i][3] + "</textarea></td>"
		}

	}

	editorFunc(arg) {
		if(arg == "newCustField") {
			var tb = this.displayArea.querySelector('#Editor_CustomFields');
			tb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"text\"  placeholder=\"Field\"></input></td><td><input type=\"text\"  placeholder=\"Value\"></input></td>"
		} else if (arg == "newColor") {
			var tb = this.displayArea.querySelector('#Editor_Colors');
			tb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"color\"></input></td><td><input type=\"text\"  placeholder=\"What holds this color?\"></input></td>"
		} else if (arg == "newFamily") {
			var tb = this.displayArea.querySelector('#Editor_Family');
			tb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"text\"  placeholder=\"Relation\"></input></td><td><input type=\"text\"  placeholder=\"Family Member Name\"></input></td>"
		} else if (arg == "newAbility") {
			var abilityTb = this.displayArea.querySelector('#Editor_Abilities');
			abilityTb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><input type=\"text\"  placeholder=\"Type\"></input></td><td><input type=\"text\"  placeholder=\"Subtype\"></input></td><td><input type=\"text\"  placeholder=\"Name\"></input></td><td style=\"min-width: 400px;\"><textarea rows=3  placeholder=\"Description\"></textarea></td>";

		} else if (arg == "save") {
			const id			= this.displayArea.querySelector("#Editor_ID").innerHTML;
			const pony			= saveData.Characters[id];
			const ponyName		= BBCode.decode(BBCode.strip(pony.name, ["code", "quote", "authoredQuote"]));
			let dialogContent	= "";
			dialogContent += `Save Changes to ${ponyName} ?<br/><br/>`;
			dialogContent += `<a href="javascript:void(0)" onclick="this.parentElement.parentObject.callExitFunc(true)">Save</a><br/>`;
			dialogContent += `<a href="javascript:void(0)" onclick="this.parentElement.parentObject.callExitFunc(false)">Cancel</a><br/>`;


			this.dialogManager.create({
				title: "Save Changes?",
				text: dialogContent
			}, (dialog, option) => {
				const Editor = this.displayArea.querySelector(".EditorContainer");
				if ( option === true) {
					//Save was confirmed.
					pony.name = this.displayArea.querySelector("#Editor_Name").value;
					pony.subtitle = this.displayArea.querySelector("#Editor_Subtitle").value;

					//imgTb.firstChild.children[0].children[1].firstChild.attributes.src.nodeValue
					var imgFinal = []; //New Array
					var imgTb = this.displayArea.querySelector("#Editor_Images");
					if (imgTb.firstChild != null) {
						for (let i = 0; i < imgTb.firstChild.children.length; i++) {
							imgFinal[i] = [ imgTb.firstChild.children[i].children[2].firstChild.value, imgTb.firstChild.children[i].children[1].firstChild.attributes.src.nodeValue ];
						}
					}
					pony.img = imgFinal;

					pony.ribbonColor = this.displayArea.querySelector("#Editor_RibbonColor").value;
					pony.creator = this.displayArea.querySelector("#Editor_Creator").value;
					pony.dob = this.displayArea.querySelector("#Editor_DOB").value;
					pony.birthPlace = this.displayArea.querySelector("#Editor_BirthPlace").value;
					pony.race = this.displayArea.querySelector("#Editor_Race").value;
					pony.gender = this.displayArea.querySelector("#Editor_Gender").value;
					pony.orientation = this.displayArea.querySelector("#Editor_Orientation").value;
					pony.occupation = this.displayArea.querySelector("#Editor_Occupation").value;
					pony.specialTalent = this.displayArea.querySelector("#Editor_Talent").value;
					pony.cutieMark = this.displayArea.querySelector("#Editor_CutieMark").value;
					pony.universe = this.displayArea.querySelector("#Editor_Universe").value;

					//Custom Fields
					var custFields = []; //New Array
					var cftb = this.displayArea.querySelector("#Editor_CustomFields");
					if (cftb.firstChild != null) {
						for (let i = 0; i < cftb.firstChild.children.length; i++) {
							if ( cftb.firstChild.children[i].children[1].firstChild.value.length > 0) {
								//Ensure first field has a name
								custFields[i] = [cftb.firstChild.children[i].children[1].firstChild.value, cftb.firstChild.children[i].children[2].firstChild.value ];
							}
						}
					}
					pony.customFields = custFields;
					//Colors
					var epColorsFinal = []; //New Array
					var epcolors = this.displayArea.querySelector("#Editor_Colors");
					if (epcolors.firstChild != null) {
						for (let i = 0; i < epcolors.firstChild.children.length; i++) {
								epColorsFinal[i] = [epcolors.firstChild.children[i].children[1].firstChild.value.toUpperCase(), epcolors.firstChild.children[i].children[2].firstChild.value ];
						}
					}
					pony.colors = epColorsFinal;

					//Family
					var famFinal = []; //New Array
					var familyTb = this.displayArea.querySelector('#Editor_Family');
					if (familyTb.firstChild != null) {
						for (let i = 0; i < familyTb.firstChild.children.length; i++) {
							if ( familyTb.firstChild.children[i].children[1].firstChild.value.length > 0) {
								//Ensure first field has a name
								famFinal[i] = [familyTb.firstChild.children[i].children[1].firstChild.value, familyTb.firstChild.children[i].children[2].firstChild.value ];
							}
						}
					}
					pony.family = famFinal;

					pony.bio = this.displayArea.querySelector("#Editor_Description").value;

					//Abilities
					var abFinal = []; //New Array
					var abTb = this.displayArea.querySelector('#Editor_Abilities');
					if ( abTb.firstChild != null) {
						for (let i = 0; i < abTb.firstChild.children.length; i++) {
							abFinal[i] = [ abTb.firstChild.children[i].children[1].firstChild.value, abTb.firstChild.children[i].children[2].firstChild.value, abTb.firstChild.children[i].children[3].firstChild.value, abTb.firstChild.children[i].children[4].firstChild.value ];
						}
					}
					pony.abilities = abFinal;
					page.showPony(id);

				}

				dialog.manager.close();
			});

		} else if ( arg == "discard" ) {
			const id			= this.displayArea.querySelector("#Editor_ID").innerHTML;
			const pony			= saveData.Characters[id];
			const ponyName		= BBCode.decode(BBCode.strip(pony.name, ["code", "quote", "authoredQuote"]));
			let dialogContent	= "";
			dialogContent += `Discard Changes to ${ponyName} ?<br/><br/>`;
			dialogContent += `<a href="javascript:void(0)" onclick="this.parentElement.parentObject.callExitFunc(true)">Discard Changes</a><br/>`;
			dialogContent += `<a href="javascript:void(0)" onclick="this.parentElement.parentObject.callExitFunc(false)">Cancel</a><br/>`;

			this.dialogManager.create({
				title: "Discard Changes?",
				text: dialogContent
			}, (dialog, option) => {
				if ( option === true ) {
					this.showPony(id);
				}

				dialog.manager.close();
			});

		} else if (arg == "newImg") {
			var reader = new FileReader();
			var file = this.displayArea.querySelector('#Editor_ImageSubmitter').files[0];
			var imgTb = this.displayArea.querySelector('#Editor_Images');

			reader.onload = function(event) {
				imgTb.insertRow().innerHTML = "<td><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.remove()\">X</a></td><td><img width=50px height=50px src=\"" + event.target.result + "\"></td><td><input type=\"text\" placeholder=\"Image Name\" value=\"" + file.name + "\"></input></td>"
			}

			reader.readAsDataURL(file);
		}
	}

	promptDeleteChar(id) {
		const pony			= saveData.Characters[id];
		const ponyName		= BBCode.decode(BBCode.strip(pony.name, ["code", "quote", "authoredQuote"]));

		let dialogContent = "";
		dialogContent += `You'd delete ${ponyName}?!<br/>`;
		dialogContent += `${ponyName} looks scared.<br/>`;
		dialogContent += `${ponyName} feels betrayed.<br/>`;
		dialogContent += `${ponyName} trusted you.<br/>`;;
		dialogContent += `${ponyName} LOVED you!<br/>`;
		dialogContent += `You Monster.<br/><br/>`;

		dialogContent += "<a href=\"javascript:void(0)\" onclick=\"this.parentElement.parentObject.callExitFunc(true)\">I'm heartless. Do it.</a><br/>";
		dialogContent += "<a href=\"javascript:void(0)\" onclick=\"this.parentElement.parentObject.callExitFunc(false)\">I'm sorry! I didn't mean it!</a><br/>";


		dialogContent += `<span class="ponyID" style="display: none;">${id}</span>`; //Hide Reference to ID
		this.dialogManager.create({
			title: "Delete Character",
			text: dialogContent
		}, (dialog, option) => {
			if ( option === true ) {
				const id			= dialog.element.querySelector(".ponyID").innerHTML;
				const pony			= saveData.Characters[id];
				const ponyName		= BBCode.decode(BBCode.strip(pony.name, ["code", "quote", "authoredQuote"]));


				saveData.removeChar(id);
				this.dialogManager.create({
					title: "Character Deleted",
					text: `Looks like ${ponyName} may be gone forever...<br/><br/><a href="javascript:void(0)" onclick="this.parentElement.parentObject.callExitFunc(0)">Dismiss</a>`
				});

				this.showCharList();
			}

			this.dialogManager.close();
		});
	}

	smoothScrollTop() {
		var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
		if (currentScroll > 0) {
			window.requestAnimationFrame(page.smoothScrollTop);
			window.scrollTo(0, currentScroll - (currentScroll/5));
		}
	}

	handleCharLink(query) {
		const results = saveData.queryName(query);
		if ( results.length == 0 ) {
			this.dialogManager.create({
				title: "These aren't the characters you're looking for",
				text: "Looks like NO characters match that link.<br/>Sorry 'bout that.<br/><br/>" + page.dialogManager.createDialogLink()
			})

		} else if ( results.length == 1 ) {
			this.showPony(results[0]);

			this.smoothScrollTop();
		} else {
			this.showCharList(query);
			page.dialogManager.create({
				title: "Changelings Maybe?",
				text: "There's more than one character matching that link.<br/>Here they are.<br/><br/>" + page.dialogManager.createDialogLink()
			})
			this.smoothScrollTop();

		}
	}

	handleLoadFile(element, mode = "overwrite") {
		const fileReader = new FileReader();
		fileReader.onload = event => {
			if ( mode == "prepend" ) {
				saveData.loadPrepend(JSON.parse(event.target.result));
			} else if ( mode == "overwrite" ) {
				saveData.loadOverwrite(JSON.parse(event.target.result));
			} else if ( mode == "append" ) {
				saveData.loadAppend(JSON.parse(event.target.result));
			}

			page.showCharList();
		}

		fileReader.readAsText(element.files[0]);
		this.updateStatusBar();
	}

	handleLockButton() {
		if ( this.state == "charList" ) {
			saveData.MetaInf.lock = saveData.MetaInf.lock?false:true;
			this.showCharList();
		} else if ( this.state == "welcome" ) {
			saveData.MetaInf.lock = saveData.MetaInf.lock?false:true;
			this.showWelcome();
		} else if ( this.state.match(/^char_/g) ) {
			saveData.MetaInf.lock = saveData.MetaInf.lock?false:true;
			this.showPony(this.state.split("_")[1]);
		} else if ( this.state == "editor" ) {
			page.dialogManager.create({
				title: "Sorry!",
				text: "You can't enable the lock here, try exiting the editor first!<br/><br/>" + page.dialogManager.createDialogLink()
			})
		}

		this.updateStatusBar();
	}

	handlePrettyButton() {
		if ( saveData.MetaInf.lock == false ) {
			saveData.MetaInf.pretty = saveData.MetaInf.pretty? false : true;
		} else {
			console.error("Can't toggle pretty while locked.");
		}

		this.updateStatusBar();
	}

	handleAuthorButton() {
		let dialogContents = "";

		let authorName = BBCode.strip( saveData.MetaInf.author, [ "quote", "authoredQuote", "code", "char" ] );

		dialogContents += "<span class=\"authorNameDisplay\">" + BBCode.decode(authorName) + "</span>";
		dialogContents += "<br/>";
		let editElement = document.createElement("input");
		editElement.setAttribute("type", "text");
		editElement.setAttribute("class", "authorNameInput");
		editElement.setAttribute("placeholder", "Author Name Here");
		editElement.setAttribute("onkeyup", "this.parentElement.querySelector('.authorNameDisplay').innerHTML = page.BBCode.decode( page.BBCode.strip( this.value, [ 'quote', 'authoredQuote', 'code', 'char' ] ))");
		editElement.setAttribute("title", "All BBCode is supported EXCEPT quotes, code, and char");
		editElement.setAttribute("value", authorName);


		editElement.value = BBCode.strip( saveData.MetaInf.author, [ "quote", "authoredQuote", "code", "char" ] );

		if ( saveData.MetaInf.lock === false ) {

			dialogContents += editElement.outerHTML + "<br/><br/>";
			dialogContents += "<a href=\"javascript:void(0)\" onclick=\"this.parentElement.parentObject.callExitFunc(true)\">Apply</a><br/>";
			dialogContents += "<a href=\"javascript:void(0)\" onclick=\"this.parentElement.parentObject.callExitFunc(false)\">Cancel</a><br/>";
		} else {

			editElement.setAttribute("disabled","true");

			dialogContents += editElement.outerHTML + "<br/><br/>";
			dialogContents += "<br/>Your save is locked and this setting cannot be changed. Please unlock first.<br/>"
			dialogContents += "<a href=\"javascript:void(0)\" onclick=\"this.parentElement.parentObject.callExitFunc(false)\">Okay</a>";
		}

		this.dialogManager.create({
			title: "Save Author",
			text: dialogContents
		}, (dialog, option) => {
			if ( option === true ) {
				let result = dialog.element.querySelector(".authorNameInput");
				saveData.MetaInf.author = result.value;
				page.updateStatusBar();
			}
			dialog.manager.close();
		});
	}

	updateStatusBar() {
		let lockIcon					= saveData.MetaInf.lock? "img/icon_locked.png" : "img/icon_unlocked.png";
		let prettyIcon					= saveData.MetaInf.pretty? "img/icon_pretty_true.png" : "img/icon_pretty_false.png";
		let authorName					= BBCode.strip(saveData.MetaInf.author);

		let authorElement				= document.createElement("img");
		authorElement.setAttribute("height", "16px");
		authorElement.setAttribute("width", "16px");
		authorElement.setAttribute("title", `Save Author (click to edit)\n${authorName}`);
		authorElement.setAttribute("src", "img/icon_author.png");

		this.saveAuthor.innerHTML		= authorElement.outerHTML + " |";
		this.prettyStatus.innerHTML		= `<img width="10px" height="10px" src="${prettyIcon}"></img> |`;
		this.lockStatus.innerHTML		= `<img width="10px" height="10px" src="${lockIcon}"></img> |`;

		saveData.estimatedSize().then( estimatedSize => {
			this.fileSizeInfo.innerHTML		= estimatedSize + " |";
			this.charCountInfo.innerHTML	= saveData.length + " ";
		});
	}

	setMenuBar(preset = "default") {
		this.menuBar.setName = preset;
		this.menuBar.update();
	}

	copyInnerText(element) {
		window.getSelection().selectAllChildren(element);
		document.execCommand("copy");

		this.dialogManager.create({
			title: "Color Code Copied",
			text: "The color code \"" + element.innerHTML + "\" has been copied to your clipboard" + "<br/><br/>" + this.dialogManager.createDialogLink("Okay")
		});
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
		this.prettyStatus		= document.createElement("span")
		this.saveAuthor			= document.createElement("span");
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
		this.prettyStatus.setAttribute("id", "StatusBarFilePretty");
		this.saveAuthor.setAttribute("id","StatusBarAuthor");

		this.fileSizeInfo.setAttribute("title", "Estimated File Size");
		this.lockStatus.setAttribute("title", "Lock Status (Click to Toggle)");
		this.lockStatus.setAttribute("onclick", "page.handleLockButton();")
		this.topButton.setAttribute("onclick", "page.smoothScrollTop()");
		this.topButton.setAttribute("title", "Scroll Back To Top Of Page");

		this.prettyStatus.setAttribute("title", "Pretty JSON (Click to Toggle)");
		this.prettyStatus.setAttribute("onclick", "page.handlePrettyButton();")

		this.saveAuthor.setAttribute("title", "Save Author (Click to Edit)");
		this.saveAuthor.setAttribute("onclick", "page.handleAuthorButton();")

		this.topButton.innerHTML = "<img height=\"16px\" width=\"16px\" src=\"img/icon_arrowup_blue.png\"></img>";

		this.charCountInfo.setAttribute("title", "No. of Characters");

		this.statusBar.appendChild(this.console);
		this.statusBar.appendChild(this.topButton);
		this.statusBar.appendChild(this.fileInfo);

		this.fileInfo.appendChild(this.saveAuthor);
		this.fileInfo.appendChild(this.prettyStatus);
		this.fileInfo.appendChild(this.lockStatus);
		this.fileInfo.appendChild(this.fileSizeInfo);
		this.fileInfo.appendChild(this.charCountInfo);


		//Setup Titlebar
		this.header.innerHTML	= "<div id=titleBar>♥~Poniary~♥</div>";

		this.menuBar.set( "default", menuBarPresets.default );
		this.menuBar.set( "locked", menuBarPresets.locked );
		this.menuBar.set( "editor", menuBarPresets.editor );

		this.header.appendChild(this.menuBar.element);
		this.menuBar.update();

	}
}

function showPony(id, page) {
	const pony = saveData.Characters[id];

	console.info("Displaying:", BBCode.strip(pony.name) );

	const actionBar = document.createElement("div");
	actionBar.setAttribute("class", "actionbar smallwin");

	actionBar.innerHTML = ("<a href=\"javascript:void(0)\" onclick=\"page.showCharList()\">◄ Back to Character List</a>");

	//Action Bar Controls
	var controlSpan = "<span style=\"float:right;\">";
	controlSpan += `<a href=\"javascript:void(0)\" onclick=\"saveData.offerDownload(${id})\">Export</a>`;
	if ( saveData.MetaInf.lock == false ) {
		//Controls when unlocked only
		controlSpan += ` | <a href=\"javascript:void(0)\" onclick=\"page.showEditor(${id})\">Edit</a>`;
		controlSpan += ` | <a href="javascript:void(0)" onclick="page.promptDeleteChar(${id})">Delete</a>`;

	}
	controlSpan += "</span>";
	actionBar.innerHTML += controlSpan;

	const origContent = page.contentContainer.innerHTML;
	page.contentContainer.innerHTML = "";
	page.contentContainer.appendChild(actionBar);
	page.contentContainer.appendChild(page.displayArea);

	//background: linear-gradient(135deg,  #003F8C 0%,#000000 100%);
	let table			= document.createElement("table");
	let tableContent	= table.innerHTML

	//Name
	let ponyName = BBCode.decode( BBCode.strip(pony.name, [ "quote", "code", "authoredQuote"]) );
	tableContent += `${ponyName}`;

	//Subtitle
	tableContent += "<div style=\"float: right;\">" + BBCode.decode( BBCode.strip(pony.subtitle, [ "quote", "code", "authoredQuote"])) + "</div>";

	//Ribbon
	let ribbonStyle = "height: 16px;";
	ribbonStyle += `background: radial-gradient( circle at center, ${pony.ribbonColor} 0%, 80%, #000 100% );`
	ribbonStyle += "border-radius: 6px;"
	ribbonStyle += "border: 1px solid black;"
	tableContent += `<hr style="${ribbonStyle}"/>`;

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
		tableContent += BBCode.decode(pony.customFields[i][0]) + ": " + BBCode.decode(pony.customFields[i][1]) + "<br/>";
	}

	/*Pony Colors Table*/
	if ( pony.colors.length > 0 ) {
		tableContent = tableContent.concat("<br/>Coloration (Click Code to Copy):<br/><table class=\"list_table\"><tr><td>Color</td><td>Item(s)</td></tr>");
		for(let i = 0; pony.colors[i] != undefined; i++) {
			let ponyColorHex	= pony.colors[i][0];
			let ponyColor		= {
				"r": parseInt("0x" + ponyColorHex.substring(1,3)),
				"g": parseInt("0x" + ponyColorHex.substring(3,5)),
				"b": parseInt("0x" + ponyColorHex.substring(5,7)),
			}

			let ponyColorString = `\nRed: ${ponyColor.r}\nGreen: ${ponyColor.g}\nBlue: ${ponyColor.b}`

			tableContent += "<tr><td style=\"background: " + pony.colors[i][0] + ";\" onclick=\"page.copyInnerText(this); msgBox('Copied Color Code to Clipboard','Text Copied')\" title=\"Click to Copy" + ponyColorString + "\">" + pony.colors[i][0] + "</td><td>" + BBCode.decode( BBCode.strip(pony.colors[i][1], [ "quote", "code", "authoredQuote"])) + "</td></tr>";
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
