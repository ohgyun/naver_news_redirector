// Google Analytics Code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-30985671-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();


// Set option handler
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

  if (request.method === 'getOptions') {
    sendResponse({
      'options': {
        'newwin': localStorage['opt-newwin'],
        'automove': localStorage['opt-automove']
      }
    });

  } else if (request.method === 'trackFound') {
    _gaq.push(['_trackEvent', 'news-found', 'clicked']);

    sendResponse({});

  } else if (request.method === 'trackNotFound') {
    _gaq.push(['_trackEvent', 'news-not-found', 'clicked']);

  } else {
    sendResponse({}); 
  }
});

