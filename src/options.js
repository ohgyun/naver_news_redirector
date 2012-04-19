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


var $saveButton, $cancelButton, $chkNewwin, $chkAutomove;

init();

function init() {
  assignElements();
  attachEvents();
  reset();
}

function assignElements() {
  $saveButton = $("#save-button");
  $cancelButton = $("#cancel-button");
  $chkNewwin = $("#opt-newwin");
  $chkAutomove = $("#opt-automove");
}

function attachEvents() {
  $saveButton.click(save);
  $cancelButton.click(reset);
  $chkNewwin.click(markDirty);
  $chkAutomove.click(markDirty);
}

function reset() {
  updateCheckboxStatus();
  markClean();  
}

function updateCheckboxStatus() {
  var bNewwin = localStorage[getStorageKey($chkNewwin)] === 'true';
  var bAutomove = localStorage[getStorageKey($chkAutomove)] === 'true';
    
  $chkNewwin.attr('checked', bNewwin);
  $chkAutomove.attr('checked', bAutomove);
}

function getStorageKey($el) {
  return $el.attr('id');
}

function save() {
  saveNewwin();
  saveAutomove();
  markClean();
}

function saveNewwin() {
  var bNewwin = $chkNewwin.attr('checked') === 'checked';
  localStorage[getStorageKey($chkNewwin)] = bNewwin;
  
  if (bNewwin) {
    _gaq.push(['_trackEvent', 'newwin-option-on', 'clicked']);
  } else {
     _gaq.push(['_trackEvent', 'newwin-option-off', 'clicked']);
  }
}

function saveAutomove() {
  var bAutomove = $chkAutomove.attr('checked') === 'checked';
  localStorage[getStorageKey($chkAutomove)] = bAutomove; 
  
  if (bAutomove) {
    _gaq.push(['_trackEvent', 'automove-option-on', 'clicked']);
  } else {
    _gaq.push(['_trackEvent', 'automove-option-off', 'clicked']);
  }
}

function getCheckValue($el) {
  // jquery는 checked 속성을 true/false가 아닌 'checked'/undefined로 리턴한다.
  return $el.attr('checked') === 'checked'; 
}

function markDirty() {
  $saveButton.attr('disabled', false);
}

function markClean() {
  $saveButton.attr('disabled', true);
}