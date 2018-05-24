//import App from './app.js';
import page from './page.js';
import MenuBar from './menubar.js';
import PoniarySave from './poniary_save.js';


//Overwride Console to output to Status Bar
{
	const origInfo	= console.info;
	console.info	= (message, ...optionalParams) => {
		origInfo(message, ...optionalParams);
		const output = `${message} ${optionalParams.join(' ')}`;
		page.console.innerHTML = output.replace(/(^.{50})(.+)/g, "$1...").replace(/\n.*/g, "");
	}

	const origError	= console.error;
	console.error	= (message, ...optionalParams) => {
		origError(message, ...optionalParams);
		const output = `<font color='#F44E4E'>${message} ${optionalParams.join(' ')}</font>`;
		page.console.innerHTML = output.replace(/(^.{50})(.+)/g, "$1...").replace(/\n.*/g, "");
	}
}

const saveData		= new PoniarySave();
saveData.addChar();
window.saveData		= saveData;

//Debug Stuff;
window.page = page;

//Initialization
page.init();
page.style = "dark";

//Init variables
const hyperlinks		= {
	"github": "https://github.com/ChristianSilvermoon/Poniary",
	"bugReport": "https://github.com/ChristianSilvermoon/Poniary/issues/new?labels=bug&title=New+bug+report&template=bug_report.md",
	"featureRequest": "https://github.com/ChristianSilvermoon/Poniary/issues/new?labels=Feature+Request&title=New+Feature+Request&template=feature_request.md"
}

const menuBar			= new MenuBar();
page.header.innerHTML	= "<div id=titleBar>♥~Poniary~♥</div>";

//File
menuBar.addEntry("File", "default", "topmenu", false);
{
	const Menu 			= menuBar.menuSets["default"]["File"];
	Menu.addEntry("Import", "submenu", false, true);
	Menu.addEntry("Export", "entry", `saveData.exportAll()`, true, "Export Save to JSON file.");

	const importMenu	= Menu.entries["Import"];
	importMenu.addEntry("Discard Current", "entry", "console.error('Not yet implemented')", true, "Discard current file and import.");
	importMenu.addEntry("Append Characters", "entry", "console.log('Not yet implemented')", true, "Add characters from imported file to current");
}

//View
menuBar.addEntry("View", "default", "topmenu", false);

{
	//Menu Setup
	const Menu 		= menuBar.menuSets["default"]["View"];
	Menu.addEntry("Welcome Page", "entry", "console.log('A')", true, "Show Welcome Page.");
	Menu.addEntry("Stylesheet", "submenu", false, true);
	const styleMenu = Menu.entries["Stylesheet"];
	styleMenu.addEntry("Classic", "entry", "page.style = 'classic'", true, "Poniary's Classic Scheme");
	styleMenu.addEntry("Dark", "entry", "page.style = 'dark'", true, "Cool and easy on the eyes");
	styleMenu.addEntry("Parchment", "entry", "page.style = 'parchment'", true, "Old Parchment Look");


}

menuBar.addEntry("Help", "default", "topmenu", false);
{
	const Menu 		= menuBar.menuSets["default"]["Help"];
	Menu.addEntry("Github Repository", "entry", `window.open('${hyperlinks.github}', '_blank').focus();`, true, `Go to&#10;${hyperlinks.github}`);
	Menu.addEntry("Report a Bug", "entry", `window.open('${hyperlinks.bugReport}', '_blank').focus();`, true, `Go to&#10;${hyperlinks.bugReport}`);
	Menu.addEntry("Request a Feature", "entry", `window.open('${hyperlinks.featureRequest}', '_blank').focus();`, true, `Go to&#10;${hyperlinks.featureRequest}`);
}

menuBar.addEntry("Debug", "default", "topmenu", false);
{
	const Menu			= menuBar.menuSets["default"]["Debug"];
	Menu.addEntry("Console Tests", "submenu");
	const consoleMenu	= Menu.entries["Console Tests"];

	consoleMenu.addEntry("console.info(\"Test\")", "entry", "console.info('Test')", true, "Send Command");
	consoleMenu.addEntry("console.error(\"Test\")", "entry", "console.error('Test')", true, "Send Command");
}

menuBar.update();

//menuBar.element.innerHTML = "<div class=dropdown><span>File</span><div class=dropdown-content>New<br/><div class=dropdown><span>Load ►</span><div class=dropdown-content-right>Prepend<br/>Overwrite<br/>Append<br/></div><br/>Save</div></div> Edit Tools Help";
page.header.appendChild(menuBar.element);


const displayArea = document.createElement("div");
displayArea.setAttribute("id", "displayArea");
displayArea.setAttribute("style", "height: 700px;");
displayArea.setAttribute("class", "bigwin");

displayArea.innerHTML = "This is a test page.";
page.contentcontainer.appendChild(displayArea);


page.style = "classic";
