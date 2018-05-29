
/*
	Creates Dialog Boxes, for use in lots of places
	Can be used to create simpler alert()-esque things

	Essentially a reimplementation of the MsgBox function from
	the original Poniary
*/

class Dialog {
	constructor(WinObj = {}) {
		//Takes an object
		this.title					= WinObj.title? WinObj.title : "Notice";
		this.text					= WinObj.text? WinObj.text : "Test Message";
		this.exitFunc				= WinObj.exitFunc? WinObj.exitFunc : () => {return false};

		this.blackoutElement		= document.createElement("div");
		this.blackoutElement.setAttribute("class", "blackout");
		this.element				= document.createElement("div");
		this.element.setAttribute("class", "smallwin dialog");

		this.blackoutElement.appendChild(this.element);

		this.element.parentObject	= this; //Emebed Reference to this object into HTML Element
	}

	open() {

	}

	close() {
		this.exitFunc(this); //Pass self into exit Function;
		this.element.remove(); //Remove this object from the document;
	}

	updateElement() {
		let html = ""
	}
}
