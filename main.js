(function () {
  
  var
    // jquery object
    $castWrap = $('#cast_articles'),
    
    SEARCH_DOCUMENT_URL = 'http://news.naver.com/main/search/search.nhn';
  
  function init() {
    overrideNewsClickEvent();
  }
 
  function overrideNewsClickEvent() {
    $castWrap.delegate('a', 'click', function (e) {
      moveToEditedPage($(this));
      e.preventDefault(); 
    });    
  }
  
  function moveToEditedPage($a) {
    var title = getTitle($a);
    console.log(title);
  }
  
  function getTitle($a) {
    var title = $a.text() || $a.find('img').attr('alt'); // 이미지가 포함된 경우 alt 속성을 가져온다.
    // 뉴스 서비스에서는 공백을 +로 대체한다.
    title = title.replace(/\s/g, '+');
    return title;
  }
  
  init();
  
}());