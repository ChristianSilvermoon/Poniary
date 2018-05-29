
/*
	Overrides a few methods of the Console Object
	in order to preform additional actions when they are called

	Mainly used to update the Status Bar Console in the bottom left
*/

//Store Original Methods
const origInfo	= console.info;
const origError	= console.error;


//Overide Methods
console.info	= (message, ...optionalParams) => {
	origInfo(message, ...optionalParams);
	const output = `${message} ${optionalParams.join(' ')}`;
	page.console.innerHTML = output.replace(/(^.{50})(.+)/g, "$1...").replace(/\n.*/g, "");
}

console.error	= (message, ...optionalParams) => {
	origError(message, ...optionalParams);
	const output = `<font color='#F44E4E'>${message} ${optionalParams.join(' ')}</font>`;
	page.console.innerHTML = output.replace(/(^.{50})(.+)/g, "$1...").replace(/\n.*/g, "");
}
