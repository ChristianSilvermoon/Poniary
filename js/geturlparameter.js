
/*
	Simple function for getting URL Paramaters.
	'nough said.
*/

export default function getURLParameter(target, url = window.location.href) {
	let params = url.split("?");
	params.shift();
	params = params.toString().split("&");

	let result = null;
	params.forEach( param => {
		if ( param.split("=")[0] == target ) {
			result = param.split("=")[1];
		}
	});

	return result;
}
