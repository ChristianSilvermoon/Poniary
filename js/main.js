//import App from './app.js';
import Page from './page.js';
import MenuBar from './menubar.js';
import MenuBarPresets from './menubar_presets.js';
import PoniarySave from './poniary_save.js';
import './console_override.js'; //Override Console
import Cookie from './cookie.js';

window.MenuBarPresets = MenuBarPresets;

window.Cookie = Cookie;

//Initialize Globals
const refElements	= document.getElementById("refElements");
refElements.remove();
const page			= new Page(refElements);
const saveData		= new PoniarySave();

window.saveData		= saveData;
window.page			= page;

saveData.addChar(3);

//Initialization
const updateTimer	= setInterval(updateTimerFunction, 1000);

page.init();
{
	//Stylesheet Setup Scope. None of this is important later, so it's all scoped.
	let StyleCookie = Cookie.get("stylesheet");
	if ( StyleCookie !== null) {
		page.style = StyleCookie.value;
		console.info("Stylesheet selected from Cookie.")
	} else {
		page.style = "classic";
	}
}

//Init other variables

const menuBar			= new MenuBar();
menuBar.set( "default", MenuBarPresets.default );
menuBar.update();

window.poniaryMenuBar = menuBar;

page.header.appendChild(menuBar.element);
page.showWelcome();

function updateTimerFunction() {
	//Display Size and Character Count
	let lockIcon					= saveData.MetaInf.lock? "img/icon_locked.png" : "img/icon_unlocked.png"
	page.lockStatus.innerHTML		= `<img width="10px" height="10px" src="${lockIcon}"></img> |`;
	page.fileSizeInfo.innerHTML		= saveData.estimatedSize() + " |";
	page.charCountInfo.innerHTML	= saveData.length + " ";

}
