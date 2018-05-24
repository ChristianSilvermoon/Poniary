
/*
	The page class is never meant to be instanced.
	It's sole purpose is to make page modification quick and painless.
*/

//Local Constants that refer to omnipresent elements of the page
const body	= document.getElementsByTagName("body")[0];
const style	= document.getElementById('stylesheet');

export default class page {

	static get body() {
		return body;
	}

	static get title() {
		return document.getElementById('pageTitle').innerHTML;
	}

	static set title(title) {
		document.getElementById('pageTitle').innerHTML = title;
	}

	static clear() {
		this.body.innerHTML = "";
	}

	static set style(sheetname) {
		style.setAttribute("href", `stylesheets/${sheetname}.css`);
	}

	static get style() {
		return style.getAttribute("href").replace( /stylesheets\/(.+).css/g, "$1");
	}

	static init() {
		this.clear();
		body.innerHTML			= "<div id=Header></div><div id=ContentContainer></div><div id=StatusBar>";
		this.header				= document.getElementById("Header");
		this.contentcontainer	= document.getElementById("ContentContainer");
		this.statusBar			= document.getElementById("StatusBar");
		this.console			= document.createElement("code");
		this.console.setAttribute("id","StatusBarConsole");
		this.console.setAttribute("title", "JavaScript Console Mini Output");
		this.statusBar.appendChild(this.console);
	}
}
