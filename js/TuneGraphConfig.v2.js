var LINK_TO_LOCAL_JSON_FILES = true;
var DIAGNOSTICS = true;

window.onload = init;

function init() {
	var suffix = LINK_TO_LOCAL_JSON_FILES ? '_local' : '';
	var abcElements = document.getElementsByClassName('divAbcTuneGraphContainer');
	var nAbcCanvasElements = document.getElementsByClassName('divAbcTuneGraphCanvas').length;
	var nAbcScoreElements = document.getElementsByClassName('divAbcTuneGraphScore').length;
	var nTablesCreated = 0;
	for (var i = 0; i < abcElements.length; ++i) {
		var abcElement = abcElements[i];
		var tuneId = abcElement.id;
		if (nAbcCanvasElements === 0 && nAbcScoreElements === 0) {
			abcElement.innerHTML = '<table><tr><td>' + abcElement.innerHTML + '</td><td><div id="' + tuneId + '.canvas" class="divAbcTuneGraphCanvas"></div></td><td><div id="' + tuneId + '.score" class="divAbcTuneGraphScore"></div></td></table>';
			nTablesCreated += 1;
		}
		if (!DIAGNOSTICS) {
			var tuneCode = window.location.hostname + window.location.pathname + '/' + tuneId;
			TuneGraph('http://abcnotation.com/getResource/resources/data_/title' + suffix + '.json?a=' + tuneCode, tuneId + '.canvas', tuneId + '.score', false, LINK_TO_LOCAL_JSON_FILES, DIAGNOSTICS);
		}
	}
    if (DIAGNOSTICS) {
        var diagnosticsDiv = document.getElementById('tuneGraphDiagnostics');
        diagnosticsDiv.innerHTML = '<p>' + window.location.hostname + window.location.pathname + ' (' + nTablesCreated + ' tables created)</p>';
        //var containerElements = document.getElementsByClassName('divAbcTuneGraphContainer');
        //for (var i = 0; i < containerElements.length; ++i) {
        //    var tuneCode = window.location.hostname + window.location.pathname + '/' + containerElements[i].id;
        //    containerElements[i].innerHTML = '<p> ' + tuneCode + '</p>';
        //}
        var canvasElements = document.getElementsByClassName('divAbcTuneGraphCanvas');
        for (var i = 0; i < canvasElements.length; ++i) {
            var tuneCode = window.location.hostname + window.location.pathname + '/' + canvasElements[i].id;
            canvasElements[i].innerHTML = '<p> ' + tuneCode + '</p>';
        }
        var scoreElements = document.getElementsByClassName('divAbcTuneGraphScore');
        for (var i = 0; i < scoreElements.length; ++i) {
            var tuneCode = window.location.hostname + window.location.pathname + '/' + scoreElements[i].id;
            scoreElements[i].innerHTML = '<p> ' + tuneCode + '</p>';
        }
    }
}
