import {AppData} from "./app.js";

class Pony {
	constructor() {
		this.name			= "New Character";
		this.subtitle		= "";
		this.bkg			= "#003F8C";
		this.creator		= "unknown";
		this.dob			= "unknown";
		this.birthPlace 	= "unknown";
		this.race			= "unknown";
		this.gender			= "unknown";
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

	addChar() {
		const pone = new Pony();
		this.Characters.push(pone);
	}

	toString() {
		return this.MetaInf.pretty ? JSON.stringify(this, null, 3): JSON.stringify(this);
	}

	toDataURI() {
		return "data:text/json;charset=utf-8," + encodeURIComponent(this.toString());
	}

	exportAll() {
		let element = document.createElement("a");
		element.href = this.toDataURI();
		element.download = "PoniarySave.json";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
}
