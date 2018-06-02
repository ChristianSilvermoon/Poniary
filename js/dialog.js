
/*
	Creates Dialog Boxes, for use in lots of places
	Can be used to create simpler alert()-esque things

	Essentially a reimplementation of the MsgBox function from
	the original Poniary
*/

class Dialog {
	constructor(WinObj = {}, exitFunc = false) {
		//Takes an object
		this.title					= WinObj.title? WinObj.title : "Notice";
		this.text					= WinObj.text? WinObj.text : "<span onclick=\"this.parentElement.parentObject.callExitFunc()\">Test Message</span>";
		this.exitFunc				= exitFunc? exitFunc : (dialog, option) => {dialog.manager.close()};

		this.element				= document.createElement("div");
		this.element.innerHTML		= this.title + "<hr/>" + this.text;

		this.element.parentObject	= this; //Emebed Reference to this object into HTML Element
	}

	callExitFunc(option) {
		this.exitFunc(this, option);
	}

	open() {
		document.body.appendChild(this.manager.blackout);
		this.manager.msgWin.appendChild(this.element);
	}

	close(option = false) {
		//Exit function. What to do to close window?
		this.exitFunc(this, option); //Pass self into exit Function;
	}

	updateElement() {
		let html = ""
	}
}

export default class DialogManager {
	constructor(page) {
		this.queue		= [];
		this.blackout	= page.refElements.querySelector("#DialogBlackout");
		this.msgWin		= this.blackout.querySelector("#dialogBox");
	}

	get isWinOpen() {
		if ( document.getElementById("DialogBlackout") ) {
			return true;
		} else {
			return false;
		}
	}

	createDialogLink(text = "okay", type = "exit", value = 0) {
		switch(type) {
			case "exit":
				return `<a href="javascript:void(0)" onclick="this.parentElement.parentObject.callExitFunc(${value})">${text}</a>`;
		}
	}

	create( winJSON = { title: "-Notice-", content: "Test Message"}, exitFunc ) {
		let dialog		= new Dialog(winJSON, exitFunc);
		dialog.manager	= this;
		this.queue.push( dialog );
		this.open();

	}

	open() {
		if ( (this.queue.length > 0) && (this.isWinOpen == false) ) {
			this.queue[0].open();
			this.queue.shift();
		}
	}

	close() {
		this.blackout.remove();
		this.msgWin.innerHTML = "";
		this.open();
	}
}
