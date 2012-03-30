(
function() {
	var READYSTATE_UNINITIALIZED = 0;
	var READYSTATE_LOADING = 1;
	var READYSTATE_LOADED = 2;
	var READYSTATE_INTERACTIVE = 3;
	var READYSTATE_COMPLETE = 4;

	// jquery object
	$castWrap = $('#cast_articles'),
	SEARCH_DOCUMENT_URL = 'http://news.naver.com/main/search/search.nhn?query=';

	function init() {
		overrideNewsClickEvent();
	}

	function overrideNewsClickEvent() {
		$castWrap.delegate('a', 'click', function(e) {
			moveToEditedPage($(this));
			e.preventDefault();

		});
	}

	function moveToEditedPage($a) {
		var title = getTitle($a);
		console.log(title);

		var xmlHttpObj = new XMLHttpRequest();

		if (xmlHttpObj) {
			// title EUC-KR 전환 필요.
			var url = SEARCH_DOCUMENT_URL
					+ title;
			console.log(url);

			xmlHttpObj.open("GET", url, true);
			xmlHttpObj.onreadystatechange = function() {
				if (xmlHttpObj.readyState == READYSTATE_COMPLETE) {
					// console.log(xmlHttpObj.responseText);
					var htmlTXT = xmlHttpObj.responseText;
					var el = $(htmlTXT).find(".in_naver");
					console.log(el);
					if(el.length>0 && el[0].href!=null){
						document.location.href = el[0].href;
					}else{
						alert("fail to search.");
					}
					return;
				}
			}
			xmlHttpObj.send(null);
		}

	}

	function getTitle($a) {
		var title = $a.text() || $a.find('img').attr('alt'); // ?대?吏??
																// ?ы븿??寃쎌슦 alt
																// ?띿꽦??媛?졇?⑤떎.
		// ?댁뒪 ?쒕퉬?ㅼ뿉?쒕뒗 怨듬갚??+濡???껜?쒕떎.
		title = title.replace(/\s/g, '+');
		return title;
	}

	init();

}());
