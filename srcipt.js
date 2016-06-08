var app = angular.module('app', ['ngMaterial'])
.run(function($rootScope, $log) {
    $rootScope.$log = $log;
})
app.controller('MainCtrl', ['$scope', function($scope) {
    
    var p = "num"; // box number prefix
    var S = $scope;
    S.boxes = lp_initfillArray(-1, 9);
    S.box = new Array(9);
    
    // select first box    
    var sel = Math.floor(Math.random() * 9);
    l(p.concat(sel));
    l(S.box[sel] === undefined);
    if (S.box[sel] === undefined) {
        S.box[sel] = "O";
    }
    
}]);

$(document).ready(function() {

    var $boxes = $('.box');

    function checkWinners() {
        var allElements = [
            [boxes[0], boxes[1], boxes[2]],
            [boxes[3], boxes[4], boxes[5]],
            [boxes[6], boxes[7], boxes[8]],
            [boxes[0], boxes[3], boxes[6]],
            [boxes[1], boxes[4], boxes[7]],
            [boxes[2], boxes[5], boxes[8]],
            [boxes[0], boxes[4], boxes[8]],
            [boxes[2], boxes[4], boxes[6]]
        ];
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].lp_allEqualTo(1) || allElements[i].lp_allEqualTo(0)) {
                $('.box').unbind();
                setTimeout(function() {

                    // append a message after the table
                    // display 'o' if 0 won
                    // display 'x' if 1 won
                    $('main').append('<p id="result">{0}   won</p>'.lp_format(allElements[i][0] === 1 ? 'x' : 'o'));
                }, 500);
                return 1;
            }
        }
        return 0;
    }

    function selectFirstBox() {
    }
    selectFirstBox();

    $('#reset').bind('click', function() {
        boxes = boxes.map(function(e) {
            return -1;
        });
        $boxes.each(function(i, e) {
            $(e).text('');
        });
        selectFirstBox();

        $('#result').remove();

        $('.box').bind('click', clickbind);
    });

    function clickbind(e) {
        if (e.target.textContent === '') {
            var sel2 = $.map($('button'), function(e) {
                return [e];
            }).indexOf(e.target); // get javascript array
            boxes[sel2] = 1;
            $($boxes[sel2]).text('x');
            $($boxes[sel2]).css('color', 'black');

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

    $('.box').bind('click', clickbind);
});



function l(message) {
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