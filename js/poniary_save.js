import {AppData} from "./app.js";

/*
	Class handles manipulation, storage, loading, etc. of pony data
*/

class Pony {
	constructor() {
		this.name			= "New Character";
		this.subtitle		= "New Character";
		this.bkg			= "#003F8C";
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

	forEachChar( callback = (character) => {}) {
		this.Characters.forEach( character => {
			callback(character)
		});
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
		return getSizeEstimate(characterID? this.exportChar(characterID).toString() : this.toString(), doAbbreviation);
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

		if ( id ) {
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

					character.cutieMark = character.cutie_mark;
					delete character.cutie_mark;

					character.specialTalent = character.special_talent;
					delete character.special_talent;
				});
				console.info(`Save version updated<br/>18.2.2 <b><font color=#26FF6A>→</font></b> ${poniarySaveVersion}`, "Save Updater");
				break;

			case "18.4.27":
				save.Characters			= save.TableOfContents;
				delete save.tableOfContents;
				save.Characters.forEach(character => {
					character.birthPlace = character.birth_place;
					delete character.birth_place;

					character.cutieMark = character.cutie_mark;
					delete character.cutie_mark;

					character.specialTalent = character.special_talent;
					delete character.special_talent;
				});
				break;
			case AppData.saveVersion:
				console.info("Save Version is Up To Date");
				break;
			default:
				console.error("UNKNOWN SAVE VERSION!");
				error = true;
				errorDetails = "Unknown Save Version: " + save.MetaInf.version + "\nPlease ensure that Poniary is NOT out of date and that your save is not damaged or not a save."
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
