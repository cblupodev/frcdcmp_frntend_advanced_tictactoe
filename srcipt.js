function l (message) {
  console.log(message);
}

// '{0}{1}'.lp_format('asdf', 1 + 2);
if (!String.prototype.lp_format) {
    String.prototype.lp_format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function lp_initfillArray(obj, length) {
    var rtn = new Array(length);
    for (var i = 0; i < length; i++) {
        rtn[i] = obj;
    }
    return rtn;
}

if (!Array.lp_allEqualTo) {
    Array.prototype.lp_allEqualTo = function(elem, comparator) {
        var rtn = true;
        this.forEach(function(e) {
           if (e !== elem) {
               rtn = false;
           } 
        });
        return rtn;
    }
}



$(document).ready(function() {

    var boxes = lp_initfillArray(-1, 9);
    var $boxes = $('table button');
    
    function checkWinners() {
        var allElements = [[boxes[0], boxes[1], boxes[2]],
                           [boxes[3], boxes[4], boxes[5]],
                           [boxes[6], boxes[7], boxes[8]],
                           [boxes[0], boxes[3], boxes[6]],
                           [boxes[1], boxes[4], boxes[7]],
                           [boxes[2], boxes[5], boxes[8]],
                           [boxes[0], boxes[4], boxes[8]],
                           [boxes[2], boxes[4], boxes[6]]];
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].lp_allEqualTo(1) || allElements[i].lp_allEqualTo(0)) {
                $('table button').unbind();
                setTimeout(function() { 
                    
                    // append a message after the table
                    // display 'o' if 0 won
                    // display 'x' if 1 won
                    $($('div')).append('<span id="result">{0}   won</span>'.lp_format(allElements[i][0] === 1 ? 'x' : 'o'));
                }, 500);
                return 1;
            }
        }
        return 0;
    }
    
    function selectFirstBox() {
        var sel = Math.floor(Math.random() * 9);
        if (boxes[sel] === -1) {
            boxes[sel] = 0        
            $($boxes[sel]).text('o');
        }
    }
    selectFirstBox();
    
    $('#reset').bind('click', function() {
        boxes = boxes.map(function(e) {
            return -1;
        });
        $boxes.each(function(i,e) {
           $(e).text('');
        });
        selectFirstBox();
        
        $('#result').remove();
    
        $('table button').bind('click', clickbind);
    });
    
    function clickbind(e) {
        if (e.target.textContent === '') {
            var sel2 = $.map($('button'), function(e) { return [e]; }).indexOf(e.target); // get javascript array
            boxes[sel2] = 1;
            $($boxes[sel2]).text('x');
            
            if (!checkWinners()) { // if someone has't won, then let the computer choose
                while (true) {
                    var sel3 = Math.floor(Math.random() * 9); // select random slot
                    if (boxes[sel3] === -1) { // if the slot is blank
                        boxes[sel3] = 0; // mark the slot zero
                        $($boxes[sel3]).text('o'); // update the view
                        break;
                    }
                }
                checkWinners();
            }
        }
    }
    
    $('table button').bind('click', clickbind);
});