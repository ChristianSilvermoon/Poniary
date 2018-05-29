import {AppData} from './app.js'; //Import for hyperlinks, etc.

/*
	An Object containing preset menus for the MenuBar object
	Menu bar details should really be defined here.

	Syntax is

	presetName: [
		{ menuEntry Constructor Argument },
		{ menuEntry Constructor Argument }
	]

	See menubar.js for menuEntry Constructor Details.
*/

//Menu References: for things shared among multiple Presets
const universalHelpMenu = {
	name: "Help",
	type: "topMenu",
	menuEntries: [
		{
			name: "BBCode Reference Guide",
			func: "page.showBBCodeRef()",
			tooltip: "Show Poniary's BBCode Reference"
		},
		{
			name: "seperator",
			type: "seperator"
		},
		{
			name: "Github Repository",
			func: `window.open('${AppData.hyperlinks.github}', '_blank').focus();`,
			tooltip: `Go to&#10;${AppData.hyperlinks.github}`
		},
		{
			name: "Report a Bug",
			func: `window.open('${AppData.hyperlinks.bugReport}', '_blank').focus();`,
			tooltip: `Go to&#10;${AppData.hyperlinks.bugReport}`
		},
		{
			name: "Request a Feature",
			func: `window.open('${AppData.hyperlinks.featureRequest}', '_blank').focus();`,
			tooltip: `Go to&#10;${AppData.hyperlinks.featureRequest}`
		}
	]
}

//Presets Object
const menuBarPresets = {
	other: [
		{
			name: "Test Preset",
			type: "topMenu",
			menuEntries: [
				{
					name: "Test",
					func: "alert('Test! :D')"
				}
			]
		}
	],
	default: [
		{
			name: "File",
			type: "topMenu",
			menuEntries: [
				{
					name: "Import",
					type: "subMenu",
					menuEntries: [
						{
							name: "Discard Current",
							func: "console.error('not yet implemented')",
							tooltip: "Discard current file and import."
						},
						{
							name: "Append Characters",
							func: "console.log('Not yet implemented')",
							tooltip: "Add characters from imported file to current"
						}
					]
				},
				{
					name: "Export",
					func: `saveData.offerDownload()`,
					tooltip: "Export Save to JSON file."
				}
			]
		},
		{
			name: "view",
			type: "topMenu",
			menuEntries: [
				{
					name: "Welcome Page",
					func: "page.showWelcome()",
					tooltip: "Show The Welcome Page"
				},
				{
					name: "Stylesheet",
					type: "subMenu",
					menuEntries: [
						{
							name: "Save/Update Cookie",
							func: "let cookie = new Cookie('stylesheet', page.style); cookie.store(); console.info(`Saved Cookie: ${cookie.name} = ${cookie.value}`)",
							tooltip: "Saves a Cookie for 365 Days&#10;Stores currently selected Stylesheet"
						},
						{
							name: "Remove Cookie",
							func: "let cookie = Cookie.get('stylesheet'); cookie.destroy(); console.info(`Removed Cookie: ${cookie.name} = ${cookie.value}`)",
							tooltip: "Delete the Stylesheet Cookie from this computer if present"
						},
						{
							name: "Seperator",
							type: "seperator"
						},
						{
							name: "Classic",
							func: "page.style = 'classic'",
							tooltip: "Poniary's Classic Look"
						},
						{
							name: "Classic Dark",
							func: "page.style = 'dark'",
							tooltip: "A dark version of Poniary's Classic Theme"
						},
						{
							name: "Parchment",
							func: "page.style = 'parchment'",
							tooltip: "A brand new theme... with an Old Parchment Look"
						}
					]
				},
			]
		},
		universalHelpMenu

	]
}


export default menuBarPresets;
