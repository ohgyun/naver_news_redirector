(function() {
	var SEARCH_API_URL = 'http://news.naver.com/main/search/search.nhn',
	  NEWS_WRAPPER_SELECTOR = [
	    '#cast_articles', // 메인 뉴스캐스트
	    'div.news ul', // 검색 결과
	    'div.article_body', // 뉴스 기사 내
	    'div.article' // 스포츠 기사 내
	  ].join(','),
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
		$(NEWS_WRAPPER_SELECTOR).delegate('a', 'click', function(e) {
		  var $a = $(this);
		  Message.setPosition($a);
			moveToEditedPage($a);
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
			MESSAGE_ELEMENT_ID = 'naver-news-redirector-ext-message',
			$layer = null,
			timeLayerOpened = 0;

		createMessageElement();
		bindHideEvent();

		function createMessageElement() {
			$layer = $('<div>')
				.attr('id', MESSAGE_ELEMENT_ID)
				.css('display', 'none')
				.css('position', 'absolute')
				.css('padding', '3px 8px')
				.css('border', '1px solid #acacac')
				.css('border-top', '1px solid #999')
				.css('-webkit-border-radius', '0px 0px 6px 6px')
				.css('-webkit-box-shadow', 'inset 1px 1px 0px 0px #e4e4e4, 1px 1px rgba(0,0,0,0.1)')
				.css('color', '#333')
				.css('background', '#fafafa')
				.css('z-index', '100000')
				.appendTo(document.body);
		}

		function print (msg) {
			clearTimeout(timer);

      show(msg);
			
			timer = setTimeout(hide, 3000);
		}
		
		function show(msg) {
		  $layer.html(msg).show();
		  timeLayerOpened = new Date().getTime();
		}
		
		function hide() {
		  $layer.hide().empty();
		}
		
		function bindHideEvent() {
		  $(document.body).click(function () {
		    // 클릭할 경우, 열려진 레이어를 닫는다.
		    // 기사 제목을 클릭했을 때 이벤트가 버블링 되어 올라오기 때문에 딜레이를 둔다.
		    var diff = new Date().getTime() - timeLayerOpened;
		    if (diff > 100) {
		      hide(); 
		    }
		  }); 
		}
			
		return {
		  setPosition: function ($a) {
		    var offset = $a.offset();
		    
		    $layer
		      .css('top', offset.top + 15)
		      .css('left', offset.left);
		      // jquery의 offset(value)을 사용하는 경우, 위치를 제대로 찾지 못하는 버그가 있다.
		  },
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
