
/*
	BBCode Handler
	This isn't meant to be instanced
*/


export default class BBCode {
	static decode(string) {
		//Decode BBCODE to HTML

		//Replace < and > with &lt; and &gt;
		string = string.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");

		//Italics
		string = string.replace(/\[i]((?:.|\t|\n|\r)*?)\[\/i\]/g, "<i>$1</i>");
		//Bold
		string = string.replace(/\[b]((?:.|\t|\n|\r)*?)\[\/b\]/g, "<b>$1</b>");
		//Underlined
		string = string.replace(/\[u]((?:.|\t|\n|\r)*?)\[\/u\]/g, "<u>$1</u>");
		//Strikethrough
		string = string.replace(/\[s]((?:.|\t|\n|\r)*?)\[\/s\]/g, "<s>$1</s>");
		//Subscript
		string = string.replace(/\[sub]((?:.|\t|\n|\r)*?)\[\/sub\]/g, "<sub>$1</sub>");
		//Superscript
		string = string.replace(/\[sup]((?:.|\t|\n|\r)*?)\[\/sup\]/g, "<sup>$1</sup>");
		//Colour
		string = string.replace(/\[colo(u|)r=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/colo(u|)r\]/g,"<font color=$2>$3</font>");
		//URLs
		string = string.replace(/\[url=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/url\]/g, "<a href=\"$1\" target=\"_blank\" title=\"Link to:&#10;$1\">$2</a>");
		string = string.replace(/\[url]((?:.|\t|\n|\r)*?)\[\/url\]/g, "<a href=\"$1\" target=\"_blank\" title=\"Link to:&#10;$1\">$1</a>");

		//Char
		string = string.replace(/\[char=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/char\]/g, "<a href=\"javascript:void(0)\" onclick=\"page.handleCharLink('$1')\" title=\"Click for Character Page\">$2</a>");
		string = string.replace(/\[char\]((?:.|\t|\n|\r)*?)\[\/char\]/g, "<a href=\"javascript:void(0)\" onclick=\"page.handleCharLink('$1')\" title=\"Click for Character Page\">$1</a>");

		//Code
		string = string.replace(/\[code]((?:.|\t|\n|\r)*?)\[\/code\]/g, "<br/><div class=\"codeblock\"><code>$1</code></div><br/>");

		//Quotes
		string = string.replace(/\[quote]((?:.|\t|\n|\r)*?)\[\/quote\]/g, "<div class=\"blockquote\">$1</div>")
		string = string.replace(/\[quote=((?:.|\t|\n|\r)*?)]((?:.|\t|\n|\r)*?)\[\/quote\]/g, "<div class=\"blockquote\"><div class=\"quoteAuthor\">$1</div>$2</div>")

		//Special
		string = string.replace(/\[prisma]((?:.|\t|\n|\r)*?)\[\/prisma\]/g, "<span class=\"prisma\">$1</span>");
		string = string.replace(/\[spoiler]((?:.|\t|\n|\r)*?)\[\/spoiler\]/g, "<span class=\"spoiler\">$1</span>");
		string = string.replace(/\[highlight=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/highlight\]/g,"<span style=\"background: $1; padding: 2px; border-radius 6px;\">$2</span>");

		//Newlines
		string = string.replace(/\n/g,"<br/>");

		//Return String
		return string;
	}

	static strip(string, toStrip = [ "i", "b", "u", "s", "url", "char", "namedURL", "sub", "sup", "spoiler", "quote", "authoredQuote", "color", "highlight", "prisma", "code"]) {
		//Strip BBCODE from text


		for ( var i = 0; i < toStrip.length; i++ ) {

			switch(toStrip[i]) {

				case "i":
					//Italics
					string = string.replace(/\[i]((?:.|\t|\n|\r)*?)\[\/i\]/g, "$1");
					break;
				case "b":
					//Bold
					string = string.replace(/\[b]((?:.|\t|\n|\r)*?)\[\/b\]/g, "$1");
					break;
				case "u":
					//Underlined
					string = string.replace(/\[u]((?:.|\t|\n|\r)*?)\[\/u\]/g, "$1");
					break;
				case "s":
					//Strikethrough
					string = string.replace(/\[s]((?:.|\t|\n|\r)*?)\[\/s\]/g, "$1");
					break;
				case "sub":
					//Subscript
					string = string.replace(/\[sub]((?:.|\t|\n|\r)*?)\[\/sub\]/g, "$1");
					break;
				case "sup":
					//Superscript
					string = string.replace(/\[sup]((?:.|\t|\n|\r)*?)\[\/sup\]/g, "$1");
					break;
				case "color":
					//Colour
					string = string.replace(/\[colo(u|)r=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/colo(u|)r\]/g,"$3");
					break;
				case "namedURL":
					//URLs
					string = string.replace(/\[url=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/url\]/g, "$2");
					break;
				case "url":
					string = string.replace(/\[url]((?:.|\t|\n|\r)*?)\[\/url\]/g, "$1");
					break;
				case "char":
					string = string.replace(/\[char=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/char\]/g, "$2");
					string = string.replace(/\[char\]((?:.|\t|\n|\r)*?)\[\/char\]/g, "$1");
					break;
				case "code":
					//Code
					string = string.replace(/\[code]((?:.|\t|\n|\r)*?)\[\/code\]/g, "$1");
					break;
				case "authoredQuote":
					//Quotes
					string = string.replace(/\[quote]((?:.|\t|\n|\r)*?)\[\/quote\]/g, "$1");
					break;
				case "quote":
					string = string.replace(/\[quote=((?:.|\t|\n|\r)*?)]((?:.|\t|\n|\r)*?)\[\/quote\]/g, "$2");
					break;
				case "prisma":
					//Special
					string = string.replace(/\[prisma]((?:.|\t|\n|\r)*?)\[\/prisma\]/g, "$1");
					break;
				case "spoiler":
					string = string.replace(/\[spoiler]((?:.|\t|\n|\r)*?)\[\/spoiler\]/g, "$1");
					break;
				case "highlight":
					string = string.replace(/\[highlight=((?:.|\t|\n|\r)*?)\]((?:.|\t|\n|\r)*?)\[\/highlight\]/g,"$2");
					break;
				default:
					console.warn("Invalid Parameters Given to BBCodeStrip!");
					break;
			}
		}

		//Return String
		return string;
	}
}
