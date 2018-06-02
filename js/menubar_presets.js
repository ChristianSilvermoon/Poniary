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
			tooltip: "Show Poniary's BBCode Reference",
			iconURL: "img/icon_bbcode.png"
		},
		{
			name: "Regular Expressions (RegEXP) Guide",
			func: "page.showRegEXPHelp()",
			tooltip: "Show Poniary's RegExp Reference",
			iconURL: "img/icon_regexp.png"
		},
		{
			name: "seperator",
			type: "seperator"
		},
		{
			name: "Github Repository",
			func: `window.open('${AppData.hyperlinks.github}', '_blank').focus();`,
			tooltip: `Go to&#10;${AppData.hyperlinks.github}`,
			iconURL: "img/icon_repository.png"
		},
		{
			name: "Report a Bug",
			func: `window.open('${AppData.hyperlinks.bugReport}', '_blank').focus();`,
			tooltip: `Go to&#10;${AppData.hyperlinks.bugReport}`,
			iconURL: "img/icon_bugreport.png"
		},
		{
			name: "Request a Feature",
			func: `window.open('${AppData.hyperlinks.featureRequest}', '_blank').focus();`,
			tooltip: `Go to&#10;${AppData.hyperlinks.featureRequest}`,
			iconURL: "img/icon_plus.png"
		}
	]
}

const universalViewMenu = {
	name: "View",
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
					tooltip: "Saves a Cookie for 365 Days&#10;Stores currently selected Stylesheet",
					iconURL: "img/icon_cookie.png"

				},
				{
					name: "Remove Cookie",
					func: "let cookie = Cookie.get('stylesheet'); cookie.destroy(); console.info(`Removed Cookie: ${cookie.name} = ${cookie.value}`)",
					tooltip: "Delete the Stylesheet Cookie from this computer if present",
					iconURL: "img/icon_x.png"
				},
				{
					name: "Seperator",
					type: "seperator"
				},
				{
					name: "Classic",
					func: "page.style = 'classic'",
					tooltip: "Poniary's Classic Look",
					iconURL: "img/icon_theme_classic.png"
				},
				{
					name: "Classic (Dark)",
					func: "page.style = 'dark'",
					tooltip: "A dark version of Poniary's Classic Theme",
					iconURL: "img/icon_theme_classic_dark.png"
				},
				{
					name: "Parchment",
					func: "page.style = 'parchment'",
					tooltip: "A brand new theme... with an Old Parchment Look",
					iconURL: "img/icon_theme_parchment.png"
				}
			]
		},
	]
}

//Presets Object
const menuBarPresets = {
	default: [
		{
			name: "File",
			type: "topMenu",
			menuEntries: [
				{
					name: "New Tab",
					func: "window.open(window.location.href, '_blank')",
					tooltip: "Open Poniary in another tab.\nGood for multitasking"
				},
				{
					name: "Import",
					type: "subMenu",
					menuEntries: [
						{
							name: "Prepend Characters",
							func: "page.refElements.querySelector('#LoadFilePrependRef').click()",
							tooltip: "Add characters from imported file to start of current list"
						},
						{
							name: "Discard Current",
							func: "page.refElements.querySelector('#LoadFileRef').click()",
							tooltip: "Discard current file and import."
						},
						{
							name: "Append Characters",
							func: "page.refElements.querySelector('#LoadFileAppendRef').click()",
							tooltip: "Add characters from imported file to end of current list"
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
		universalViewMenu,
		universalHelpMenu

	],
	locked: [
		{
			name: "File",
			type: "topMenu",
			menuEntries: [
				{
					name: "Import",
					type: "subMenu",
					menuEntries: [
						{
							name: "Prepend Characters",
							enabled: false,
							tooltip: "Add characters from imported file to start of current list"
						},
						{
							name: "Discard Current",
							func: "page.refElements.querySelector('#LoadFileRef').click()",
							tooltip: "Discard current file and import."
						},
						{
							name: "Append Characters",
							enabled: false,
							tooltip: "Add characters from imported file to end of current list"
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
		universalViewMenu,
		universalHelpMenu
	],
	editor: [
		{
			name: "File",
			type: "topMenu",
			menuEntries: [
				{
					name: "Import",
					type: "subMenu",
					menuEntries: [
						{
							name: "Prepend Characters",
							func: "console.log('Not yet implemented')",
							enabled: false,
							tooltip: "Add characters from imported file to start of current list"
						},
						{
							name: "Discard Current",
							func: "page.refElements.querySelector('#LoadFileRef').click()",
							tooltip: "Discard current file and import."
						},
						{
							name: "Append Characters",
							func: "console.log('Not yet implemented')",
							enabled: false,
							tooltip: "Add characters from imported file to end of current list"
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
			name: "View",
			type: "topMenu",
			menuEntries: [
				{
					name: "Welcome Page",
					enabled: false,
					tooltip: "Show The Welcome Page"
				},
				{
					name: "Stylesheet",
					type: "subMenu",
					menuEntries: [
						{
							name: "Save/Update Cookie",
							func: "let cookie = new Cookie('stylesheet', page.style); cookie.store(); console.info(`Saved Cookie: ${cookie.name} = ${cookie.value}`)",
							tooltip: "Saves a Cookie for 365 Days&#10;Stores currently selected Stylesheet",
							iconURL: "img/icon_cookie.png"

						},
						{
							name: "Remove Cookie",
							func: "let cookie = Cookie.get('stylesheet'); cookie.destroy(); console.info(`Removed Cookie: ${cookie.name} = ${cookie.value}`)",
							tooltip: "Delete the Stylesheet Cookie from this computer if present",
							iconURL: "img/icon_x.png"
						},
						{
							name: "Seperator",
							type: "seperator"
						},
						{
							name: "Classic",
							func: "page.style = 'classic'",
							tooltip: "Poniary's Classic Look",
							iconURL: "img/icon_theme_classic.png"
						},
						{
							name: "Classic (Dark)",
							func: "page.style = 'dark'",
							tooltip: "A dark version of Poniary's Classic Theme",
							iconURL: "img/icon_theme_classic_dark.png"
						},
						{
							name: "Parchment",
							func: "page.style = 'parchment'",
							tooltip: "A brand new theme... with an Old Parchment Look",
							iconURL: "img/icon_theme_parchment.png"
						}
					]
				},
			]
		},
		universalHelpMenu
	]
}


export default menuBarPresets;
