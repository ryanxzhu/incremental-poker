// Variable declaration
var cardDealtPosition = [ '52%', '46%', '24%', '19%', '25%', '49%', '52%', '48%', '22%', '19%', '26%', '46%' ]; // The vertical position of the cards from the top
var theirChipsTop = [ '52%', '33%', '20%', '21%', '37%' ];
var theirChipsLeft = [ '29%', '21%', '38%', '64%', '73%' ];
var opponentsArray = [ '#senior-happy-face', '#boy-1-face', '#female-face', '#senior-angry-face', '#boy-2-face' ];
var avatarTop = [ '51%', '6%', '0%', '5%', '52%' ];

var dealSpeed = 125; // Sets the speed of dealing the cards in milliseconds
var howMuchToBet = 0;
var betSize = 0;
var totalBet = 0;
var headBobCount = 0;
var gameProgressCount = 0;
var stakes = 10;
var cycleReady = true;
var handsPlayed = 0;
var mouseX = 0;
var mouseY = 0;
var upgrade2Level = 0;
var upgrade3Level = 0;
var dealCardsCount = 0;
var oneCard = $('.cards')[dealCardsCount];
var $oneCard = $(oneCard);
var uniqueID = 7817;
var uniqueIDString = '';
var pauseGame = false;
var opponent = 0;

var dealCardSound = new Audio();
var slideChipsSound = new Audio();
var loseSound = new Audio();
var winSound = new Audio();
var smashPiggySound = new Audio();
var brokeSound = new Audio();
var billionaireMusic = new Audio();
dealCardSound.src = 'deal-card.wav';
slideChipsSound.src = 'slide-chips.mp3';
loseSound.src = 'lose-sound.mp3';
winSound.src = 'win-sound.mp3';
smashPiggySound.src = 'smash-piggy-bank.mp3';
brokeSound.src = 'broke.mp3';
billionaireMusic.src = 'billionaire.mp3';

var soundCount = 0;
/*------------------------------------------------------------------------*/

// make all upgrades visible for game tweaking

/*
$("#higher-stakes").css("visibility", "visible");
$("#lower-stakes").css("visibility", "visible");
$("#upgrade-1").css("visibility", "visible");
$("#upgrade-2").css("visibility", "visible");
var uniqueID = 5717;
var uniqueID = 3413;
var uniqueID = 7717;
$("#upgrade-3").css("visibility", "visible");
$("#upgrade-4").css("visibility", "visible");
$("#upgrade-heading").css("visibility", "visible");  
$("#winrate").css("visibility", "visible"); 
$("#hands-played").css("visibility", "visible"); 
*/

/*--variables to tweak for game balance------------*/

// upgrade starting costs
var autoplayCost = 50;
var winrateCost = 150;
var handsCost = 999;
var upgrade2Cost = 100;
var upgrade3Cost = 100;
var upgrade4Cost = 1000;

var winrate = 15;
var bankroll = 200;
var variance = 20;
var winratePerStake = 1.2;
var winratePerHandReadingLevel = 0.7;
var winratePerPokerFaceLevel = 0.6;

var averageBetSize = calcAveBetSize(variance, stakes);
var winPercent = calcWinPercent(winrate, stakes, averageBetSize);

/*------------------------------------------------------------------------*/

// Game set up
$('#money').text('$' + bankroll.toLocaleString('en'));
$('#upgrade-1-cost').text('$' + autoplayCost.toLocaleString('en'));
$('#upgrade-2-cost').text('$' + upgrade2Cost.toLocaleString('en'));
$('#upgrade-3-cost').text('$' + upgrade3Cost.toLocaleString('en'));
$('#upgrade-4-cost').text('$' + upgrade4Cost.toLocaleString('en'));
$('#upgrade-2-level').text('Level ' + upgrade2Level);
$('#upgrade-3-level').text('Level ' + upgrade3Level);
$('#upgrade-4-level').text(variance + ' Variance');

$('#stakes').text('$' + stakes.toLocaleString('en'));
$('#winrate').html(winrate + ' max bets per<br>100 hands');

$('#action').fadeOut(0).css('opacity', '1');
$('#hands-played').text(handsPlayed + ' hands played');

/*------------------------------------------------------------------------*/

// Buttons
$('#play-button').mousedown(function() {
	playAHand();
	if (gameProgressCount === 5) {
		// change how many play throughs are required before the first upgrade is visible
		$('#upgrade-heading').css('visibility', 'visible');
		$('#upgrade-1').css('visibility', 'visible');
	}
});

$('#higher-stakes').mousedown(function() {
	if (stakes < 99000000) {
		if (stakes % 9 === 4) {
			// this will always return a remainder of 4 if the stake is a $400, $4000, etc. Then we multiply the stake by 2.5x to get to $1000 etc
			stakes = stakes * 2.5;
		} else {
			stakes = stakes * 2;
		}
		$('#stakes').text('$' + stakes.toLocaleString('en'));

		winrate = Math.round((winrate - winratePerStake) * 10) / 10; // the math.round prevents 10.000000002 output
		averageBetSize = calcAveBetSize(variance, stakes);
		winPercent = calcWinPercent(winrate, stakes, averageBetSize);
		$('#winrate').html(winrate + ' max bets per<br>100 hands');
	}
});

$('#lower-stakes').mousedown(function() {
	if (stakes > 19) {
		if (stakes % 9 === 1) {
			// this will always return a remainder of 1 if the stake is a $100, $1000, etc. Then we divide the stake by 2.5x to get to $400 etc
			stakes = stakes / 2.5;
		} else {
			stakes = stakes / 2;
		}
		$('#stakes').text('$' + stakes.toLocaleString('en'));

		winrate = Math.round((winrate + winratePerStake) * 10) / 10; // the math.round prevents 10.000000002 output
		averageBetSize = calcAveBetSize(variance, stakes);
		winPercent = calcWinPercent(winrate, stakes, averageBetSize);
		$('#winrate').html(winrate + ' max bets per<br>100 hands');
	}
});

$('#auto-play-box').mousedown(function() {
	if ($('#auto-play-checked').css('visibility') === 'hidden') {
		$('#auto-play-checked').css('visibility', 'visible');
		$('#play-button').css('opacity', '0.5').prop('disabled', true).addClass('nohover');
	} else if ($('#auto-play-checked').css('visibility') === 'visible') {
		$('#auto-play-checked').css('visibility', 'hidden');
		$('#play-button').css('opacity', '1');
	}
});

$('#upgrade-1-button').mousedown(function() {
	if (bankroll > autoplayCost && $('#upgrade-1-button').text() === 'Autoplay') {
		bankroll = bankroll - autoplayCost;
		$('#money').text('$' + bankroll.toLocaleString('en'));
		$('#upgrade-1-button').text('Show expected win rate');
		$('#upgrade-1-cost').text('$' + winrateCost);
		$('#auto-play').css('visibility', 'visible');
		$('#auto-play-box').css('visibility', 'visible');
		return;
	}

	if (bankroll > winrateCost && $('#upgrade-1-button').text() === 'Show expected win rate') {
		bankroll = bankroll - winrateCost;
		$('#money').text('$' + bankroll.toLocaleString('en'));
		$('#upgrade-1-button').text('Show hands played');
		$('#upgrade-1-cost').text('$' + handsCost);
		$('#winrate').css('visibility', 'visible');
		return;
	}

	if (bankroll > handsCost && $('#upgrade-1-button').text() === 'Show hands played') {
		bankroll = bankroll - handsCost;
		$('#money').text('$' + bankroll.toLocaleString('en'));
		$('#hands-played').css('visibility', 'visible');
		$('#upgrade-1').css('visibility', 'hidden');
	}
});

$('#upgrade-2-button').mousedown(function() {
	if (bankroll > upgrade2Cost) {
		bankroll = bankroll - upgrade2Cost;
		$('#money').text('$' + bankroll.toLocaleString('en'));
		upgrade2Level++;
		upgrade2Cost = Math.floor(upgrade2Cost * 2.1258);
		winrate = Math.round((winrate + winratePerHandReadingLevel) * 10) / 10;
		averageBetSize = calcAveBetSize(variance, stakes);
		winPercent = calcWinPercent(winrate, stakes, averageBetSize);
		$('#upgrade-2-level').text('Level ' + upgrade2Level);
		$('#upgrade-2-cost').text('$' + upgrade2Cost.toLocaleString('en'));
		$('#winrate').html(winrate + ' max bets per<br>100 hands');
	}
});

$('#upgrade-3-button').mousedown(function() {
	if (bankroll > upgrade3Cost) {
		bankroll = bankroll - upgrade3Cost;
		$('#money').text('$' + bankroll.toLocaleString('en'));
		upgrade3Level++;
		upgrade3Cost = Math.floor(upgrade3Cost * 1.9786);
		winrate = Math.round((winrate + winratePerPokerFaceLevel) * 10) / 10;
		averageBetSize = calcAveBetSize(variance, stakes);
		winPercent = calcWinPercent(winrate, stakes, averageBetSize);
		$('#upgrade-3-level').text('Level ' + upgrade3Level);
		$('#upgrade-3-cost').text('$' + upgrade3Cost.toLocaleString('en'));
		$('#winrate').html(winrate + ' max bets per<br>100 hands');
	}
});

$('#upgrade-4-button').mousedown(function() {
	if (bankroll > upgrade4Cost && variance > 0) {
		bankroll = bankroll - upgrade4Cost;
		$('#money').text('$' + bankroll.toLocaleString('en'));
		variance--;
		upgrade4Cost = Math.floor(upgrade4Cost * 2.04542);
		averageBetSize = calcAveBetSize(variance, stakes);
		winPercent = calcWinPercent(winrate, stakes, averageBetSize);
		$('#upgrade-4-level').text(variance + ' Variance');
		$('#upgrade-4-cost').text('$' + upgrade4Cost.toLocaleString('en'));
	}
});

$('#audio-symbol').mousedown(function() {
	$('#no-symbol').css('visibility', 'visible');
});

$('#no-symbol').mousedown(function() {
	$('#no-symbol').css('visibility', 'hidden');
});

/*------------------------------------------------------------------------*/

// Functions

function calcAveBetSize(varianceInput, stakesInput) {
	return (
		(varianceInput / 100 +
			0.5 * varianceInput / 100 +
			0.1 * varianceInput / 100 +
			0.2 * (1 - 4 * varianceInput / 100)) *
		stakesInput
	);
}

function calcWinPercent(winrateInput, stakesInput, averageBetSizeInput) {
	return winrateInput * stakesInput / (200 * averageBetSizeInput) + 0.5;
}

function playAHand() {
	if (bankroll === 0 || pauseGame === true) {
		return;
	}

	//$("#debug").text(Math.round(winPercent*1000) / 1000);
	gameProgressCount++;

	if (gameProgressCount > 20) {
		// change how many play throughs are required before the upgrade is visible
		$('#higher-stakes').css('visibility', 'visible');
	}

	if (gameProgressCount > 20) {
		// change how many play throughs are required before the upgrade is visible
		$('#lower-stakes').css('visibility', 'visible');
	}

	if (gameProgressCount > 35) {
		// change how many play throughs are required before the upgrade is visible
		$('#upgrade-2').css('visibility', 'visible');
		$('#upgrade-3').css('visibility', 'visible');
	}

	if (gameProgressCount > 100) {
		// change how many play throughs are required before the upgrade is visible
		$('#upgrade-4').css('visibility', 'visible');
	}

	$('#play-button').prop('disabled', true).addClass('nohover');
	handsPlayed++;
	$('#hands-played').text(handsPlayed + ' hands played');
	cycleReady = false; // controls when to execute the autoplayfunction. cycleReady is false until the hand has been fully played out
	howMuchToBet = Math.random();
	dealCardsCount = 0;
	dealCards();
	if (howMuchToBet < variance / 100) {
		$('#action').text('Fold').delay(2500).fadeIn(200, fold);
	} else if (howMuchToBet >= variance / 100 && howMuchToBet < 2 * (variance / 100)) {
		betSize = 0.1 * stakes;
		remainingBettingAction();
	} else if (howMuchToBet >= 2 * (variance / 100) && howMuchToBet < 3 * (variance / 100)) {
		betSize = stakes;
		remainingBettingAction();
	} else if (howMuchToBet >= 3 * (variance / 100) && howMuchToBet < 4 * (variance / 100)) {
		betSize = 0.5 * stakes;
		remainingBettingAction();
	} else if (howMuchToBet >= 4 * (variance / 100)) {
		betSize = 0.2 * stakes;
		remainingBettingAction();
	}
}

function remainingBettingAction() {
	if (betSize >= bankroll) {
		betSize = bankroll;
		$('#action').text('All in');
	} else {
		if (howMuchToBet >= 2 * (variance / 100) && howMuchToBet < 3 * (variance / 100)) {
			$('#action').text('All in');
		} else {
			var flipACoin = Math.random();
			if (flipACoin < 0.5) {
				$('#action').text('Call');
			} else {
				$('#action').text('Bet');
			}
		}
	}
	totalBet = 2 * betSize;
	$('#action').delay(2500).fadeIn(200, call);
}

function autoPlayFunction() {
	if ($('#auto-play-checked').css('visibility') === 'visible' && cycleReady === true) {
		$('#play-button').prop('disabled', true).addClass('nohover');
		playAHand();
	}
}

var continuousRunning = setInterval(autoPlayFunction, 1500);

/* the main reason I'm doing this dealCards recursively rather than using a for loop is because the animate method 
callback function only executes once the previous animation is completed. So it's cool that it deals the cards one at a time. 
I believe a for loop would deal all the cards at the same time which doesn't look nearly as good. */
function dealCards() {
	$('.cards').fadeIn();
	oneCard = $('.cards')[dealCardsCount];
	$oneCard = $(oneCard); // convert from DOM node to jQuery object
	$oneCard.animate(
		{
			// animate this card to fall down into its dealt position
			top: cardDealtPosition[dealCardsCount]
		},
		dealSpeed,
		dealCards // a recursive function using the callback function which continues until dealCardsCount exceeds the number of cards
	);
	if (dealCardsCount < 13 && dealCardsCount > 0) {
		if ($('#no-symbol').css('visibility') === 'hidden') {
			dealCardSound.play();
		}
	}
	dealCardsCount++;
	if (dealCardsCount >= $('.cards').length) {
		return; // ends the recursive function once dealCardsCount equals or exceeds the number of items in the .cards array
	}
}

function fold() {
	$('.player-card').delay(500).animate(
		{
			top: '40%'
		},
		300,
		fadeCards
	);
}

function call() {
	// pick an opposing player (random number between 0-4)
	opponent = Math.floor(Math.random() * 5);

	// set the opposing player's initial chips and bet text position
	$('#poker-chips-theirs').css('top', theirChipsTop[opponent]);
	$('#poker-chips-theirs').css('left', theirChipsLeft[opponent]);
	$('#their-bet').css('top', theirChipsTop[opponent]); // top position of the text is the same as the chips
	$('#their-bet').css('left', parseFloat(theirChipsLeft[opponent]) - 21 + '%'); // the position of their bet is their chips position shifted left by 21%

	// animate my poker chips to the center
	$('#poker-chips-mine').css('visibility', 'visible').animate({
		top: '37%',
		left: '49%'
	});

	// animate their poker chips to the center
	$('#poker-chips-theirs').css('visibility', 'visible').animate({
		top: '37%',
		left: '43%'
	});
	if ($('#no-symbol').css('visibility') === 'hidden') {
		slideChipsSound.play();
	}

	// animate my bet to the center
	$('#my-bet').css('visibility', 'visible').text('$' + betSize.toLocaleString('en')).animate({
		top: '38%',
		left: '57%'
	}, function() {
		// update bankroll
		bankroll = bankroll - betSize;
		$('#money').text('$' + bankroll.toLocaleString('en'));
		$('#my-bet').delay(700).animate({
			// animate my bet to move up and disappear
			top: '30%',
			left: '48%',
			opacity: '0'
		});
	});

	// animate their bet to the middle
	$('#their-bet').css('visibility', 'visible').text('$' + betSize.toLocaleString('en')).animate({
		top: '38%',
		left: '22%'
	}, function() {
		$('#their-bet').delay(700).animate({
			// animate their bet to move up and disappear
			top: '30%',
			left: '30%',
			opacity: '0'
		}, function() {
			$('#total-bet')
				.css('visibility', 'visible')
				.text('$' + totalBet.toLocaleString('en'))
				.delay(2000, function() {
					var winOrLoss = Math.random();
					if (winOrLoss < winPercent) {
						winAnimation();
					} else {
						lossAnimation();
					}
				});
		});
	});
}

function fadeCards() {
	$('.cards').delay(500).fadeOut(function() {
		for (var i = 0; i < $('.cards').length; i++) {
			oneCard = $('.cards')[i];
			$oneCard = $(oneCard); // convert from DOM node to jQuery object
			$oneCard.css('top', '-20%'); // move cards out of sight by making their top position -20%
		}
		if ($('#auto-play-checked').css('visibility') === 'hidden') {
			$('#play-button').prop('disabled', false).removeClass('nohover');
		}
	});
	$('#action').fadeOut(100);
	$('#poker-chips-mine').css('visibility', 'hidden').fadeIn(0).css('top', '52%').css('left', '55%');
	$('#poker-chips-theirs').css('visibility', 'hidden').fadeIn(0);
	$('#total-bet').css('visibility', 'hidden').fadeIn(0).css('top', '30%').css('left', '35%');
	$('#my-bet').css('opacity', '1').css('visibility', 'hidden').fadeIn(0).css('top', '53%').css('left', '63%');
	$('#their-bet').css('opacity', '1').css('visibility', 'hidden').fadeIn(0);
	$('#win-or-loss').css('opacity', '1').css('visibility', 'hidden').fadeIn(0);
	cycleReady = true;
	if (bankroll <= 0) {
		$('#play-button').delay(2400).fadeIn(endGame); // Just using fadeIn of 'play-button' as a random action to get 2400ms of delay. Play button not actually fading in, it's already visible
	}
	if (bankroll > 1000000000) {
		$('#play-button').delay(2400).fadeIn(win); // Just using fadeIn of 'play-button' as a random action to get 2400ms of delay. Play button not actually fading in, it's already visible
		pauseGame = true;
	}
}

function winAnimation() {
	if ($('#no-symbol').css('visibility') === 'hidden') {
		winSound.play();
	}
	// show WIN text result and run winHeadAnimation
	$('#win-or-loss')
		.text('WIN')
		.css('visibility', 'visible')
		.fadeOut(0)
		.delay(700)
		.fadeIn(winHeadAnimation)
		.delay(700)
		.fadeOut(function() {
			if ($('#no-symbol').css('visibility') === 'hidden') {
				slideChipsSound.play();
			}
			// move my poker chips to me
			$('#poker-chips-mine').animate({
				top: '52%',
				left: '55%'
			});

			// move their poker chips to me
			$('#poker-chips-theirs').animate({
				top: '52%',
				left: '55%'
			});

			// the total bet follows the chips to me
			$('#total-bet').clearQueue().animate({
				top: '45%',
				left: '44%'
			}, function() {
				bankroll = bankroll + totalBet; // update bankroll with winnings
				$('#money').text('$' + bankroll.toLocaleString('en'));
				$('#total-bet').fadeOut();
				$('#poker-chips-mine').fadeOut();
				$('#poker-chips-theirs').fadeOut(fadeCards);
			});
		});
}

function lossAnimation() {
	if ($('#no-symbol').css('visibility') === 'hidden') {
		loseSound.play();
	}
	// display LOSS text result and run loseHeadAnimation
	$('#win-or-loss')
		.text('LOSS')
		.css('visibility', 'visible')
		.fadeOut(0)
		.delay(700)
		.fadeIn(loseHeadAnimation)
		.delay(700)
		.fadeOut(function() {
			if ($('#no-symbol').css('visibility') === 'hidden') {
				slideChipsSound.play();
			}
			// animating both mine and their poker chips to the opponent's chips position
			$('#poker-chips-mine').animate({
				top: theirChipsTop[opponent],
				left: theirChipsLeft[opponent]
			});
			$('#poker-chips-theirs').animate({
				top: theirChipsTop[opponent],
				left: theirChipsLeft[opponent]
			});

			// animating the total bet text to follow and stay above opponent's chips position
			$('#total-bet').clearQueue().animate({
				top: parseFloat(theirChipsTop[opponent]) - 7 + '%',
				left: parseFloat(theirChipsLeft[opponent]) - 12 + '%'
			}, function() {
				// fade out the total bet, the chips and fadeout the cards after the total bet and chips have faded out
				$('#total-bet').fadeOut();
				$('#poker-chips-mine').fadeOut();
				$('#poker-chips-theirs').fadeOut(fadeCards);
			});
		});
}

function winHeadAnimation() {
	// recursive function to make a bobblehead
	if (headBobCount < 14) {
		$('#male-face').animate(
			{
				top: '61.5%'
			},
			100,
			function() {
				headBobCount++;
				$('#male-face').animate(
					{
						top: '60.5%'
					},
					10 * headBobCount,
					winHeadAnimation
				);
			}
		);
	} else {
		headBobCount = 0;
		return;
	}
}

function loseHeadAnimation() {
	// recursive function to make a bobblehead
	if (headBobCount < 14) {
		$(opponentsArray[opponent]).animate(
			{
				top: parseFloat(avatarTop[opponent]) + 1.5 + '%'
			},
			100,
			function() {
				headBobCount++;
				$(opponentsArray[opponent]).animate(
					{
						top: avatarTop[opponent]
					},
					10 * headBobCount,
					loseHeadAnimation
				);
			}
		);
	} else {
		headBobCount = 0;
		return;
	}
}

function endGame() {
	if ($('#no-symbol').css('visibility') === 'hidden') {
		brokeSound.play();
	}
	$('#grey-background').css('visibility', 'visible');
	$('#broke').css('visibility', 'visible');
	// allows the hammer image to follow the mouse
	$('#hammer').css('left', mouseX - parseFloat($('#hammer').css('width')) / 10 + 'px');
	$('#hammer').css('top', mouseY - parseFloat($('#hammer').css('height')) * 1.09 + 'px');
	$('body').css('cursor', 'none');
	$(document).mousemove(function(event) {
		$('#hammer').css('left', event.pageX - parseFloat($('#hammer').css('width')) / 10 + 'px');
		$('#hammer').css('top', event.pageY - parseFloat($('#hammer').css('height')) * 1.09 + 'px');
	});

	// slams the hammer down
	$(document).mousedown(function() {
		$('#hammer').css('transform', 'rotate(0deg)');
	});

	$(document).mouseup(function() {
		$('#hammer').css('transform', 'rotate(30deg)');
	});

	$('#piggy-bank').click(function() {
		$('body').css('cursor', 'auto');
		$('#grey-background').css('visibility', 'hidden');
		$('#broke').css('visibility', 'hidden');
		if ($('#no-symbol').css('visibility') === 'hidden') {
			smashPiggySound.play();
		}
		resetGame();
	});
}

function toggleFunction() {
	$('#money-cash').toggleClass('twist-right');
}

function win() {
	// I'm creating a unique ID using my own cool high level cryptographic code so that people can post the ID
	// to reddit and I'll know they indeed won the game (assuming they didn't crack my code)
	var randomOneToThousand = Math.ceil(Math.random() * 1000);
	var uniqueVar1 = uniqueID * randomOneToThousand;
	var uniqueVar2 = handsPlayed * randomOneToThousand;
	uniqueIDString = uniqueVar1.toString() + uniqueVar2.toString();
	$('#billionaire-ID').text(uniqueIDString);
	$('#billionaire-hands').text(handsPlayed.toLocaleString('en'));
	$('#grey-background').css('visibility', 'visible');
	$('#billionaire').css('visibility', 'visible');
	billionaireMusic.play();
	var toggleForever = setInterval(toggleFunction, 150);
}

function resetGame() {
	bankroll = 200;
	averageBetSize = calcAveBetSize(variance, stakes);
	winPercent = calcWinPercent(winrate, stakes, averageBetSize);
	cycleReady = true;
	pauseGame = false;

	$('#auto-play-checked').css('visibility', 'hidden');
	$('#stakes').text('$' + stakes.toLocaleString('en'));
	$('#hands-played').text(handsPlayed + ' hands played');
	$('#money').text('$' + bankroll.toLocaleString('en'));
	$('#play-button').css('opacity', '1');
	$('#play-button').prop('disabled', false).removeClass('nohover');
}
