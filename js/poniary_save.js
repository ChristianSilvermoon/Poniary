import {AppData} from "./app.js";
import BBCode from './bbcode.js';

/*
	Class handles manipulation, storage, loading, etc. of pony data
*/

class Pony {
	constructor() {
		this.name			= "New Character";
		this.subtitle		= "New Character";
		this.ribbonColor	= "#003F8C";
		this.creator		= "unknown";
		this.dob			= "unknown";
		this.birthPlace 	= "unknown";
		this.race			= "unknown";
		this.gender			= "Undefined";
		this.orientation	= "unknown";
		this.occupation		= "unknown";
		this.specialTalent	= "unknown";
		this.cutieMark		= "unknown";
		this.universe		= "unknown";
		this.img			= [];
		this.colors			= [];
		this.customFields	= [];
		this.family			= [];
		this.bio			= "New Character";
		this.abilities		= [];
	}
}

export default class PoniarySave {
	constructor() {
		this.Characters		= [];
		this.MetaInf		= {
			app: AppData.name,
			author: "unknown",
			displayOrder: [],
			lock: false,
			version: AppData.saveVersion,
			pretty: false,
		};
	}

	addChar(count = 1) {
		//Add a new character to the the list
		for (; count > 0; count--) {
			this.Characters.push(new Pony());
		}
	}

	loadPrepend(loadedSave) {
		saveUpdater(loadedSave, (updatedSave, error) => {
			if ( !error.error ) {
				loadedSave.Characters.forEach( pony => {
					this.Characters.unshift(pony);
				});
			} else {
				console.log(error);
				alert("Unable to load Save!\n" + error.details);
			}
		});
	}

	loadOverwrite(loadedSave) {
		saveUpdater(loadedSave, (updatedSave, error) => {
			if ( !error.error ) {
				this.Characters = JSON.parse(JSON.stringify(updatedSave.Characters));
				this.MetaInf	= JSON.parse(JSON.stringify(updatedSave.MetaInf));
			} else {
				console.log(error);
				alert("Unable to load Save!\n" + error.details);
			}
		});
	}

	loadAppend(loadedSave) {
		saveUpdater(loadedSave, (updatedSave, error) => {
			if ( !error.error ) {
				loadedSave.Characters.forEach( pony => {
					this.Characters.push(pony);
				});
			} else {
				console.log(error);
				alert("Unable to load Save!\n" + error.details);
			}
		});
	}

	forEachChar( callback = (character) => {}) {
		this.Characters.forEach( character => {
			callback(character)
		});
	}

	removeChar(id) {
		if ( this.Characters[id] ) {
			var oldponyname = this.Characters[id].name
			this.Characters.splice(id,1);
			//msgBox("Looks like <b>" + oldponyname + "</b> may be gone forever...<br/>");
		}
	}

	sortChars(method) {
		if ( method == "ABC" || method == "ZYX" ) {
			var ponlist = JSON.parse( JSON.stringify(this.Characters) );
			var sortinglist = [];
			for ( let i = 0; i < ponlist.length; i++ ) {
				sortinglist[i] = [ BBCode.strip(ponlist[i].name), i ];
			}
			sortinglist = sortinglist.sort();

			for ( let i = 0; i != ponlist.length; i++ ) {
				this.Characters[i] = ponlist[sortinglist[i][1]];
			}

			if ( method == "ZYX" ) {
				this.Characters.reverse();
			}
		} else if ( method == "REV" ) {
			this.Characters.reverse();
		}
	}

	toString() {
		//Convert this object to a string, following it's pretty print prefrence
		return this.MetaInf.pretty ? JSON.stringify(this, null, 3): JSON.stringify(this);
	}

	toDataURI() {
		//Get Data URI of JSON for this object
		return "data:text/json;charset=utf-8," + encodeURIComponent(this.toString());
	}

	get length() {
		//Return length of Characters Property
		return this.Characters.length;
	}

	set length(length) {
		//Sets the length of Characters Property
		this.Characters.length = length;
	}

	estimatedSize(doAbbreviation = true, characterID = false) {
		return getSizeEstimate(characterID !== false? this.exportChar(characterID).toString() : this.toString(), doAbbreviation);
	}

	swapChars(oldPos, newPos) {
		//Switches characters positions from old position to new position
		if ( newPos < 0 || newPos > this.length - 1 ) {
			console.error("Cannot move character to that position!");
			return;
		}

		const oldChar = this.Characters[oldPos];
		const newChar = this.Characters[newPos];
		this.Characters[newPos] = oldChar;
		this.Characters[oldPos] = newChar;
	}

	queryName(regExp_query, result_cap = 5) {
		//Accepts a REGEXP query,
		//result_cap can be a number or false to disable it.
		var results = [];

		this.forEachChar( char => {
			try {
				if ( BBCode.strip(char.name.toLowerCase()).match(regExp_query.toLowerCase()) ) {
					results.push( this.Characters.indexOf(char) );
				}
			} catch (error) {
				//IGNORE
				//console.warn("Ignoring Error in poniarySave.queryName()", error.message);
			}
		});

		if ( (result_cap != false) && (results.length > result_cap)) {
			results.length = result_cap;
		}

		return results;
	}

	exportChar(id) {
		//Create new PoniarySave containing requested character and return it;
		const exportSave			= new PoniarySave(); //Create new save object
		exportSave.MetaInf			= this.MetaInf;
		exportSave.Characters[0]	= this.Characters[id];
		return exportSave;
	}

	offerDownload(id = false) {
		//Offer file for Download
		let element = document.createElement("a");

		if ( id !== false) {
			//Export requested Character
			console.info(`Offered Character ${id} Download...`)
			element.href = this.exportChar(id).toDataURI();
		} else {
			//Export everything
			console.info("Offered Complete Download...");
			element.href = this.toDataURI();
		}

		element.download = "PoniarySave.json";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
}

function saveUpdater(save, callback) {
	var error			= false;
	var errorDetails	= "";

	if ( save.MetaInf.app != AppData.name ) {
		error			= true;
		errorDetails	= "Not a valid Poniary Save";
	} else {
		switch( save.MetaInf.version ) {
			case "18.2.2":
				save.MetaInf.pretty		= false;
				save.MetaInf.version	= AppData.saveVersion;
				save.Characters			= save.TableOfContents;
				delete save.tableOfContents;
				save.Characters.forEach(character => {
					character.birthPlace = character.birth_place;
					delete character.birth_place;

					character.ribbonColor = character.bkg;
					delete character.bkg;

					character.cutieMark = character.cutie_mark;
					delete character.cutie_mark;

					character.specialTalent = character.special_talent;
					delete character.special_talent;
				});
				alert(`Save version updated!\n18.2.2 → ${AppData.saveVersion}`);
				break;

			case "18.4.27":
				save.Characters			= save.TableOfContents;
				delete save.tableOfContents;
				save.Characters.forEach(character => {
					character.birthPlace = character.birth_place;
					delete character.birth_place;

					character.ribbonColor = character.bkg;
					delete character.bkg;

					character.cutieMark = character.cutie_mark;
					delete character.cutie_mark;

					character.specialTalent = character.special_talent;
					delete character.special_talent;
				});;
				alert(`Save version updated!\n18.2.2 → ${AppData.saveVersion}`);
				break;
			case AppData.saveVersion:
				// console.info("Save Version is Up To Date");
				break;
			default:
				console.error("UNKNOWN SAVE VERSION!");
				error = true;
				errorDetails = "Unknown Save Version: " + save.MetaInf.version + "\n\nPlease ensure that:\n - Poniary is NOT out of date\n - That your save is not damaged or corrupted\n - That your JSON file is definately a Poniary Save\n\nIf you're CERTAIN this message is in error, please use:\nHelp → Report a Bug"
				break;
		}
	}

	callback(save, { error: error, details: errorDetails });
}

function getSizeEstimate(stringifedObject, doAbbreviation = true) {
	var size = stringifedObject.length;
	var suffix = doAbbreviation? "B" : "Bytes";

	if ( size > 1023) {
		//Divide to Kilobytes
		size = (size / 1024);
		suffix = doAbbreviation? "KB" : "Kilobytes";
	}

	if  ( size > 1023) {
		//Divide to Megabytes
		size = (size / 1024);
		suffix = doAbbreviation? "MB" : "Megabytes";
	}

	if  ( size > 1023) {
		//Divide to Gigabytes
		size = (size / 1024);
		suffix = doAbbreviation? "GB" : "Gigabytes";
	}

	if ( size.toString().includes(".") ) {
		//Remove Decimal if present
		size = size.toString().substring(0, (size.toString().indexOf(".") + 2));
	}

	return size + " " + suffix; //Return output
}
