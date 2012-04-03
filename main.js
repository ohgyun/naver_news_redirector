(function() {
	var SEARCH_API_URL = 'http://news.naver.com/main/search/search.nhn',
		IFRAME_NAME = 'naver-news-redirector-ext-iframe',
		gOptAutomove, gOptNewwin;
				
	init();

	function init() {
	  initOptionInformation();
		overrideNewsClickEvent();
	}
	
	function initOptionInformation() {
	  chrome.extension.sendRequest({
	    method: 'getOptions'
	  }, function (response) {
	    var options = response.options || {};
	    gOptAutomove = options.automove === 'true';
	    gOptNewwin = options.newwin === 'true'; 
	  });
	}

	function overrideNewsClickEvent() {
		$('#cast_articles').delegate('a', 'click', function(e) {
			moveToEditedPage($(this));
			e.preventDefault();
		});
	}

	function moveToEditedPage($a) {
		Message.loading();
		var title = getTitle($a);
		var $iframe = createTemporaryIframe();
		setIframeOnloadHandler($iframe, $a);
		createFormAndSubmitToIframe(title);
	}

	function getTitle($a) {
		var title = $a.text() ||
				$a.find('img').attr('alt'); // 이미지를 클릭한 경우 alt를 가져온다.
		title = title.replace(/\s/g, '+'); // 뉴스 서비스는 공백을 +로 대체한다.
		return title;
	}
	
	function createTemporaryIframe() {
		var $iframe = $('<iframe>')
			.attr('name', IFRAME_NAME)
			.appendTo(document.body);
		return $iframe;
	}	

	function setIframeOnloadHandler($iframe, $a) {
		$iframe.load(function () {
			var $result = $(this).contents().find('.in_naver'),
				firstResult = $result[0];

			if (firstResult) {
			  onResultFound(firstResult.href);
			} else {
			  onResultNotFound($a.attr('href'));				
			}
			
			$(this).remove();
		});
	}			
	
	function onResultFound(resultUrl) {
	  Message.found();
	  openPage(resultUrl);
	}
	
	function openPage(url) {
	  if (gOptNewwin) {
	    window.open(url); 
	  } else {
	    location.href = url; 
	  }
	}
	
	function onResultNotFound(originalUrl) {
	  if (gOptAutomove) {
	    openPage(originalUrl); 
	  } else {
	    Message.notFound(originalUrl, gOptNewwin);
	  }
	}

	function createFormAndSubmitToIframe(title) {
		$('<form>')
			.attr('action', SEARCH_API_URL) 
			.attr('target', IFRAME_NAME)
			.attr('method', 'post')
			.attr('accept-charset', 'euc-kr')
			.append(createSearchQuery(title))
			.submit();
	}

	function createSearchQuery(title) {
		return $('<input>')
			.attr('type', 'hidden')
			.attr('name', 'query')
			.attr('value', title);
	}


	var Message = (function () {

		var timer = null,
			MESSAGE_ELEMENT_ID = 'naver-news-redirector-ext-message'

		createMessageElement();

		function createMessageElement() {
			$('<span>')
				.attr('id', MESSAGE_ELEMENT_ID)
				.css('margin-left', '10px')
				.css('color', 'red')
				.appendTo('#cast_action');
		}

		function print (msg) {
			clearTimeout(timer);

			var $msg = $('#' + MESSAGE_ELEMENT_ID);
			$msg.html(msg);

			timer = setTimeout(function () {
				$msg.empty();
			}, 5000);	
		}
			
		return {
			loading: function () {
				print('네이버 뉴스에서 기사를 찾는 중입니다...');
			},
			notFound: function (originalUrl, isNewwin) {
			  var target = isNewwin ? '_blank' : '_self';
				print('기사를 찾지 못했습니다. (<a href="' + originalUrl + '" target="' + target + '">원본기사보기</a>)');
			},
			found: function () {
				print('해당 기사로 이동합니다.');
			}
		};	

	}());
}());
