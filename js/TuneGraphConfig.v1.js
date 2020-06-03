var LINK_TO_LOCAL_JSON_FILES = true;
var DIAGNOSTICS = false;

window.onload = init;

function init() {
    if (DIAGNOSTICS) {
        var diagnosticsDiv = document.getElementById('tuneGraphDiagnostics');
        diagnosticsDiv.innerHTML = '<p>' + window.location.hostname + window.location.pathname + '</p>';
        var canvasElements = document.getElementsByClassName('divTuneGraphCanvas');
        for (var i = 0; i < canvasElements.length; ++i) {
            var tuneCode = window.location.hostname + window.location.pathname + '/' + canvasElements[i].id;
            canvasElements[i].innerHTML = '<p> ' + tuneCode + '</p>';
        }
        var scoreElements = document.getElementsByClassName('divTuneGraphScore');
        for (var i = 0; i < scoreElements.length; ++i) {
            var tuneCode = window.location.hostname + window.location.pathname + '/' + scoreElements[i].id;
            scoreElements[i].innerHTML = '<p> ' + tuneCode + '</p>';
        }
    } else {
        var suffix = LINK_TO_LOCAL_JSON_FILES ? '_local' : '';
        var abcElements = document.getElementsByClassName('abc');
        for (var i = 0; i < abcElements.length; ++i) {
            var tuneId = abcElements[i].id;
            var tuneCode = window.location.hostname + window.location.pathname + '/' + tuneId;
            TuneGraph('http://abcnotation.com/getResource/resources/data_/title' + suffix + '.json?a=' + tuneCode, tuneId + '.canvas', tuneId + '.score', false);
        }
    }
}

function getTunegraphHostname() {
    return 'themorrisring.org';
}
