import Page from './page.js';
import getURLParameter from './geturlparameter.js';
import PoniarySave from './poniary_save.js';
import './console_override.js'; //Override Console

/*
	The big, main script that kicks everything off.
*/

//Initialize Globals
const refElements	= document.getElementById("refElements");
refElements.remove();
const page			= new Page(refElements);
const saveData		= new PoniarySave();

window.saveData		= saveData; //expose saveData globally
window.page			= page; //expose page globally

//Initialization
let styleParameter = getURLParameter("style");

switch(styleParameter) {
	case "classic":
		page.style = "classic";
		console.info("Stylesheet selected from URL.");
		break;

	case "dark":
		page.style = "dark";
		console.info("Stylesheet selected from URL.");
		break;

	case "parchment":
		page.style = "parchment";
		console.info("Stylesheet selected from URL.");
		break;

	case "pb3000":
		page.style = "pb3000";
		console.info("Stylesheet selected from URL.");
		break;

	case "pbST99":
		page.style = "pbST99";
		console.info("Stylesheet selected from URL.");
		break;

	case "pbDelta":
		page.style = "pbDelta";
		console.info("Stylesheet selected from URL.");
		break;

	default:
		//Stylesheet Setup Scope. None of this is important later, so it's all scoped.
		let StyleCookie = page.styleCookie;
		console.log(StyleCookie);
		if ( StyleCookie !== null) {
			page.style = StyleCookie.value;
			console.info("Stylesheet selected from Cookie.")
		} else {
			page.style = "classic";
		}
		break;
}


//Init other variables
page.showWelcome();
page.updateStatusBar();
