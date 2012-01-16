GAME_LIMIT = 1234;
DBUG = false;

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
		//descansa a cada 100 runs
		if (gamesRunned % 100 == 0){
			setTimeout(init, 0);
		}else{
			init();
		}
	} else {
		endTime = new Date();
		var elapsedTime = endTime.getTime() - startTime.getTime();
		var strTime = "";
		if(elapsedTime > 1000){
			strTime = Math.round(elapsedTime/10)/100 + 's';
		} else {
			strTime = elapsedTime + 'ms';
		}
		console.log('+ + + DONE in ' + strTime + ' + + +');
		!DBUG ? rankCards() : null;
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
	console.log('\t>  ' + pontuaInt(gamesRunned) + ' games runned. Aprox.: ' + Math.round(totalFights/i) + ' fights/card.');
}

function pontuaInt(n){
	var str = n.toString();
	var newstr = "";
	for(var i in str){
		var j = str.length -1 - i;
		newstr += str.substr(i,1);
		if(j % 3 == 0){
			newstr += '.';
		}
	}
	newstr = newstr.substr(0,newstr.length-1); //capa o último '.'
	return newstr;
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