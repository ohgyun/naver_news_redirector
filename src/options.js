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
  $chkNewwin.attr('checked', localStorage[getStorageKey($chkNewwin)] === 'true');
  $chkAutomove.attr('checked', localStorage[getStorageKey($chkAutomove)] === 'true');
}

function getStorageKey($el) {
  return $el.attr('id');
}

function save() {
  localStorage[getStorageKey($chkNewwin)] = ($chkNewwin.attr('checked') === 'checked');
  localStorage[getStorageKey($chkAutomove)] = ($chkAutomove.attr('checked') === 'checked');
  markClean();
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