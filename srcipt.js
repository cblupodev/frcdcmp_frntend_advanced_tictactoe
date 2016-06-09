var app = angular.module('app', ['ngMaterial', 'ngAnimate'])
    .run(function($rootScope, $log) {
        $rootScope.$log = $log;
    })
app.controller('MainCtrl', ['$scope', function($scope) {

    var p = "num"; // box number prefix
    var S = $scope;
    S.box = new Array(9);
    S.thisPersonWon;
    S.sideSymbol;
    S.userClicks = 0; // use this to guard against infinite loop on a tie
    
    function selectThePlayerSymbol(yes) {
        if (yes) return S.sideSymbol === "X" ? "X" : "O";
        else     return S.sideSymbol === "X" ? "O" : "X";
    }

    // select first box
    S.selectFirstBox = function(symbol) {
        var sel = Math.floor(Math.random() * 9);
        if (S.box[sel] === undefined) {
            S.sideSymbol = symbol;
            S.box[sel] = selectThePlayerSymbol(false);
        }
    }

    S.checkWinners = function() {
        if (S.thisPersonWon === undefined || S.thisPersonWon === '') {
            var allCombos = [
                [S.box[0], S.box[1], S.box[2]],
                [S.box[3], S.box[4], S.box[5]],
                [S.box[6], S.box[7], S.box[8]],
                [S.box[0], S.box[3], S.box[6]],
                [S.box[1], S.box[4], S.box[7]],
                [S.box[2], S.box[5], S.box[8]],
                [S.box[0], S.box[4], S.box[8]],
                [S.box[2], S.box[4], S.box[6]]
            ];

            for (var i = 0; i < allCombos.length; i++) {
                var won = null;
                if (allCombos[i].lp_allEqualTo(selectThePlayerSymbol(true)))  {
                    won = selectThePlayerSymbol(true); 
                    S.color = 'green';
                }
                else if (allCombos[i].lp_allEqualTo(selectThePlayerSymbol(false))) { 
                    won = selectThePlayerSymbol(false);
                    S.color = 'red';
                }
                if (won) {
                    S.thisPersonWon = won;
                    S.userClicks = 0;
                    return true;
                }
            }
            return false;
        }
        else {
            // someone already won
            return true;
        }
    }

    S.boxClick = function(e) {
        e = e.srcElement;
        S.userClicks++;
        if (!S.checkWinners()) { // don't do anything if someone won
            if (e.textContent === '') {
                S.box[Number(e.name)] = selectThePlayerSymbol(true);
            }

            if (!S.checkWinners() && S.userClicks < 5) { // if someone has't won, then let the computer choose, randomly
                while (true) {
                    var sel = Math.floor(Math.random() * 9);
                    if (S.box[sel] === '' || S.box[sel] === undefined) {
                        S.box[sel] = selectThePlayerSymbol(false);
                        break;
                    }
                }
                S.checkWinners();
            } else if (S.userClicks >= 4) {
                S.thisPersonWon = 'Nobody';
                S.userClicks = 0;
            }
        }
    }

    S.reset = function() {
        S.box = new Array(9);
        S.thisPersonWon = '';
        S.userClicks = 0
        S.selectFirstBox(selectThePlayerSymbol(true));
    }

}]);

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