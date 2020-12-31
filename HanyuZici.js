/*
  Author: Kingron
  Date: 2018-3-8
  从百度汉语字词，使用爬虫技术提取所有拼音和解释的js脚本。
  支持Windows 7，双击可以直接运行，需要在程序目录放置"text.txt"文件， 输出结果保存在"text_out.txt"，输入文件格式为每一行一个字词，必须为ASCII码格式
例如：
舀
揩
咳嗽
调羹
绞肉
*/

String.prototype.trim = function()
{
    // 用正则表达式将前后空格
    // 用空字符串替代。
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

function get_text(word) {
	var http = new ActiveXObject("Msxml2.ServerXMLHTTP")
	url = "http://hanyu.baidu.com/s?wd=" + word + '&ptype=zici';
	url = encodeURI(url);
	http.open("GET", url, false)
	http.send();
	var text = http.responseText

	var start = text.indexOf("<dd>");
	var end = text.indexOf("</dd>");	
	if (start >=0 && end >= 0)
	{
		var ps = text.indexOf('<dt class="pinyin">[');
		var pe = text.indexOf(']</dt>');
		var pinyin = '';
		if (ps >=0 && pe >=0)
		{
			pinyin = text.substring(ps + 19, pe + 1);
		}
		else
		{
			ps = text.indexOf('<div class="pronounce" id="pinyin">');
			if (ps >=0) {
				pe = text.indexOf('</b>', ps);
				if (pe >=0) {
					pinyin = text.substring(ps + 42, pe).trim().replace(/ /g, '').replace(/\n/g, '').replace(/<span><b>/g, '');
					if (pinyin != '') pinyin = ' [ ' + pinyin + ' ] ';
				}
			}
		}
		
		var result = text.substring(start + 5, end);
		result = result.trim();
		result = result.replace(/<span>/g, '');
		result = result.replace(/<\/span>/g, '');
		result = result.replace(/<p>/g, '');
		result = result.replace(/<\/p>/g, '');
		result = result.replace(/ /g, '');
		result = result.replace(/\n/g, '');
		
		return pinyin + ' ' + result;
		
	}
	else
	{
		return '';
	}
}

/* 
var args = WScript.Arguments;
if (args.length == 0) WScript.Quit(-1);
WScript.Echo(get_text(args(0)));
*/


var fso = new ActiveXObject("Scripting.FileSystemObject");
var infile = fso.OpenTextFile("text.txt", 1, false);
var outfile = fso.OpenTextFile("text_out.txt", 2, true);
while (!infile.AtEndOfStream) {
	word = infile.ReadLine();
	word2 = word.trim();
	if (word2 != '') { 
		result = get_text(word2);
		if (result != '') {
			outfile.WriteLine(word + ": " + result);
		}
		else {
			outfile.WriteLine(word);
		}
	}
	else{ 
		outfile.WriteLine(word);
	}
}
infile.Close();
outfile.Close();
