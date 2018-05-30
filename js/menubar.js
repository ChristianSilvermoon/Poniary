/*
	Menubar Class

	Handles the menubar and it's entries.

	See: menubar_presets.js
	For: preset reference, and to define presets.
*/

class MenuEntry {
	constructor( menuJSON = { name: "untitled item", type: "entry", func: false, enabled: true, tooltip: false, iconURL: false, menuEntries: [] }) {
		this.name			= menuJSON.name? menuJSON.name : "Untitled Entry"; //Entry's name
		this.type			= menuJSON.type? menuJSON.type : "entry"; //entry, topmenu, submenu, or seperator
		this.tooltip		= menuJSON.tooltip? menuJSON.tooltip : false; //Tool tip if present;
		this.iconURL		= menuJSON.iconURL? menuJSON.iconURL : false;
		this.enabled		= menuJSON.enabled == false ? false : true; //Disabled or not;
		this.func			= menuJSON.func? menuJSON.func : false; //JS Click Function;
		this.menuEntries	= [];

		if ( menuJSON.menuEntries ) {
			menuJSON.menuEntries.forEach( entry => {
				this.menuEntries.push(new MenuEntry(entry));
			});
		}

		return this;
	}

	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}

	toString() {
		//Return the complete HTML of this entry as a string
		var string = "";

		switch( this.type ) {
			case "seperator":
				string = "<hr/>";
				break;

			case "entry":
				if ( this.enabled ) {
					string += `<a href=\"javascript:void(0)\" class=\"highlightable\" ${this.func? " onclick=\"" + this.func + "\"" : ""}${this.tooltip? " title=\"" + this.tooltip + "\"" : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name}</a><br/>`;
				} else {
					string += `<span style="color: gray"${this.tooltip? " title=" + this.tooltip : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name}</span><br/>`;
				}
				break;

			case "topEntry":
				if ( this.enabled ) {
					string += `<a href=\"javascript:void(0)\" class=\"highlightable\" ${this.func? " onclick=\"" + this.func + "\"" : ""}${this.tooltip? " title=\"" + this.tooltip + "\"" : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name}</a>`;
				} else {
					string += `<span  style="color: gray"${this.tooltip? " title=" + this.tooltip : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name}</span>`;
				}
				break;
			case "subMenu":
				if ( this.enabled ) {
					string += `<div class=dropdown><span${this.func? " onclick=\"" + this.func + "\"": ""}${this.tooltip? " title=\"" + this.tooltip + "\"" : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name} ►</span><div class="dropdown-content-right">`;
					this.menuEntries.forEach( entry => {
						string += entry.toString();
					});
					string += "</div></div><br/>";
				} else {
					string += `<span style="color: gray"${this.tooltip? " title=\"" + this.tooltip + "\"" : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name} ►</span><br/>`;
				}
				break;

			case "topMenu":
				if ( this.enabled ) {
					string += `<div class=dropdown><span${this.func? " onclick=\"" + this.func + "\"": ""}${this.tooltip? " title=\"" + this.tooltip + "\"" : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name}</span><div class="dropdown-content">`;
					this.menuEntries.forEach( entry => {
						string += entry.toString();
					});
					string += "</div></div>";
				} else {
					string += `<span style="color: gray"${this.tooltip? " title=\"" + this.tooltip + "\"" : ""}>${this.iconURL? "<img height=\"16px\" width=\"16px\" src=\"" + this.iconURL + "\"></img> " : ""}${this.name}</span>`;
				}
				break;
		}

		return string;

	}

}

export default class MenuBar {
	constructor() {
		this.element = document.createElement("div");
		this.element.setAttribute("id", "menuBar");
		this.menuSets	= {};
		this.setName	= "default";
		this.menuSets["default"] = [];
	}

	set(setName = "default", menuJSON ) {
		this.menuSets[setName] = [];
		menuJSON.forEach( menu => {
			this.menuSets[setName].push(new MenuEntry(menu));
		});
	}

	update() {
		var string = "";
		this.menuSets[this.setName].forEach( menu => {
			string += menu.toString();
		});

		this.element.innerHTML = string;
	}
}
