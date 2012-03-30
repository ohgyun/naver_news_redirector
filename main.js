(function() {
	var SEARCH_API_URL = 'http://news.naver.com/main/search/search.nhn',
		IFRAME_NAME = 'naver-news-redirector-ext-iframe';

	init();

	function init() {
		overrideNewsClickEvent();
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
		setIframeOnloadHandler($iframe);
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

	function setIframeOnloadHandler($iframe) {
		$iframe.load(function () {
			var $result = $(this).contents().find('.in_naver'),
				firstResult = $result[0];

			if (firstResult) {
				Message.found();
				parent.location.href = firstResult.href;
			} else {
				Message.notFound();
			}
			
			$(this).remove();
		});
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
				.css('margin-left', '20px')
				.css('color', 'red')
				.appendTo('#cast_action');
		}

		function print (msg) {
			clearTimeout(timer);

			var $msg = $('#' + MESSAGE_ELEMENT_ID);
			$msg.text(msg);

			timer = setTimeout(function () {
				$msg.empty();
			}, 5000);	
		}
			
		return {
			loading: function () {
				print('편집 기사를 찾는 중입니다...');
			},
			notFound: function () {
				print('뉴스에 해당하는 편집 기사가 없습니다.');
			},
			found: function () {
				print('해당 편집 기사로 이동합니다.');
			}
		};	

	}());
}());
