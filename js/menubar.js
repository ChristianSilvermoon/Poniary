/*
	Menubar Class
	-Needs to support adding/removal of entires, etc.
*/

class menuEntry {
	constructor(name = "untitled item", type = "entry", func = false, enabled = true, tooltip = false ) {
		this.name		= name; //Entry's name
		this.type		= type; //entry, topmenu, submenu, or seperator
		this.tooltip	= tooltip; //Tool tip if present;
		this.enabled	= enabled; //Disabled or not;
		this.func		= func; //JS Click Function;
		this.entries	= {}; //Menu Entries, if applicable;
	}

	addEntry(name = "untitled item", type = "entry", func = false, enabled = true, tooltip = false ) {
		this.entries[name] = new menuEntry(name, type, func, enabled, tooltip);
	}

	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}

	toString() {
		//Return the complete HTML of this entry as a string
		var string;
		if ( this.type == "seperator" ) {
			//Seperator entries are just lines, they have nothing else.
			string = "<hr/>";
			return string;
		}

		if ( this.type == "entry" ) {
			//Simple clickable entry
			if ( this.enabled ) {
				//Entry is enabled
				string = "<a href=\"javascript:void(0);\" ";

				//Add tooltip if set
				if ( this.tooltip ) {
					string += `title="${this.tooltip}" `
				}

				//Add clickEvent if set
				if ( this.func ) {
					string += `onclick=\"${this.func}\"`
				}

				string += `>${this.name}</a>`;

			} else {
				//Return grayed out, non-interactive text
				string = "<span ";
				if ( this.tooltip ) {
					string += `title="${this.tooltip}" `;
				}
				string += `class=disabled>${this.title}</span>`;
			}
			return string;
		}

		//Top/Sub menu
		if ( this.enabled ) {
			string = "<div class=dropdown><span";

			if ( this.tooltip ) {
				string += `title=\"${this.tooltip}\"`
			}
			string += `>${this.name}`;

			if ( this.type == "submenu" ) {
				string += " ►</span><div class=\"dropdown-content-right\">";

			} else {
				string += "</span><div class=\"dropdown-content\">";
			}

			for ( var entry in this.entries ) {
				let thisEntry = this.entries[entry].toString();
				string += thisEntry;
				if ( thisEntry != "<hr/>") {
					string += "<br/>";
				}
			}

			string += "</div></div>";

			return string;
		} else {
			string = `<span class=disabled>${this.name}`
			if ( this.type == "submenu" ) {
				string += "<span class=floatRight>►</span>"
			}
		}

	}

}

export default class MenuBar {
	constructor() {
		this.element = document.createElement("div");
		this.element.setAttribute("id", "menuBar");
		this.menuSets	= {}
		this.setName	= "default";
	}

	addEntry(name = "untitled item", set = "default", type = "entry", func = false, enabled = true, tooltip = false) {
		if ( !this.menuSets[set] ) {
			this.menuSets[set] = {};
		}
		this.menuSets[set][name] = new menuEntry(name, type, func, enabled, tooltip);
	}

	update() {
		var string = "";
		for (var entry in this.menuSets[this.setName] ) {
			string += this.menuSets[this.setName][entry].toString();
		}
		this.element.innerHTML = string;
	}
}
