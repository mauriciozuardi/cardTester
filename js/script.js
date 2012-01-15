GAME_LIMIT = 1;
DEBUGGING = true;

gamesRunned = 0;
startTime = 0;
endTime = 0;
cards_scores = [];

function init(){
	if(gamesRunned == 0){
		startTime = new Date();
	}
	game = new Game();
}

function restart(){
	gamesRunned ++;
	if(gamesRunned < GAME_LIMIT){
		game = null;
		init();
	} else {
		endTime = new Date();
		var elapsedTime = endTime.getTime() - startTime.getTime();
		console.log('+ + + DONE in ' + elapsedTime + 'ms + + +');
		rankCards();
	}
}

function updateCardsScores(deck, points){
	for(var i in deck.cards){
		cards_scores[deck.cards[i].id].lutas ++;
		cards_scores[deck.cards[i].id].pontos += points;
	}
}

function initScores(){
	for(var i in ALL_CARDS){
		cards_scores[i] = {};
		cards_scores[i].card = ALL_CARDS[i];
		cards_scores[i].lutas = 0;
		cards_scores[i].pontos = 0;
	}
}

function rankCards(){
	var totalFights = 0;
	cards_scores.sort(comparePPL);
	for(var i in cards_scores){
		totalFights += cards_scores[i].lutas;
		console.log(roundedPPL(cards_scores[i]) + '\t:  ' + cards_scores[i].card);
	}
	console.log('\t>  ' + gamesRunned + ' games runned. Aprox.: ' + Math.round(totalFights/i) + ' fights/card.');
}

function roundedPPL(cardScore){
	var ppl = cardScore.pontos/cardScore.lutas;
	ppl = isNaN(ppl) ? 0 : ppl;
	ppl = Math.round(ppl*10000)/100;
	return ppl;
}

function comparePPL(a,b){
	var pplA = a.pontos/a.lutas;
	var pplB = b.pontos/b.lutas;
	pplA = isNaN(pplA) ? 0 : pplA;
	pplB = isNaN(pplB) ? 0 : pplB;
	return pplB - pplA;
}

initScores();
$(init);