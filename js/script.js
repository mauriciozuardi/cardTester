GAME_LIMIT = 10000;
STORE_DECKS = true;
DBUG = false;

gamesRunned = 0;
startTime = 0;
endTime = 0;
cards_scores = [];
decks_scores = {};
sorted_decks = [];

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
		!DBUG && STORE_DECKS ? rankDecks() : null;
	}
}

function updateCardsScores(deck, points){
	for(var i in deck.cards){
		cards_scores[deck.cards[i].id].lutas ++;
		cards_scores[deck.cards[i].id].pontos += points;
	}
	STORE_DECKS ? upsertDeck(deck, points) : null;
}

function initCardScores(){
	for(var i in ALL_CARDS){
		cards_scores[i] = {};
		cards_scores[i].card = encapsulaCor(ALL_CARDS[i]);
		cards_scores[i].lutas = 0;
		cards_scores[i].pontos = 0;
	}
}

function rankCards(){
	var totalFights = 0;
	var outputCSV = "card\tppl\n";
	cards_scores.sort(comparePPL);
	for(var i in cards_scores){
		totalFights += cards_scores[i].lutas;
		// console.log(roundedPPL(cards_scores[i]) + '\t:  ' + cards_scores[i].card);
		outputCSV += cards_scores[i].card + "\t" + roundedPPL(cards_scores[i]) + "\n";
	}
	console.log(pontuaInt(gamesRunned) + ' games runned. Aprox.: ' + Math.round(totalFights/i) + ' fights/card.');
	console.log(outputCSV);
}

function upsertDeck(deck, points){
	var d = deck.stringify();	
	if(decks_scores[d]){
		decks_scores[d].lutas ++;
		decks_scores[d].pontos += points;
	} else {
		decks_scores[d] = {};
		decks_scores[d].lutas = 1;
		decks_scores[d].pontos = points;
	}
}

function rankDecks(){
	startTime = new Date();
	//coloca re-empacota os decks dentro de um array
	for(var i in decks_scores){
		var newObj = {}
		newObj.deck = i;
		newObj.lutas = decks_scores[i].lutas;
		newObj.pontos = decks_scores[i].pontos;
		sorted_decks.push(newObj);
	}
	
	//ordena
	sorted_decks.sort(comparePPL);
	
	//mostra
	var SHOW_MAX = 100;
	var n = (sorted_decks.length > SHOW_MAX) ? SHOW_MAX : sorted_decks.length;
	var shown = 0;
	console.log('-');
	console.log(pontuaInt(sorted_decks.length) + ' decks armazenados');
	for(var i in sorted_decks){
		if(sorted_decks[i].lutas > 1){
			console.log(sorted_decks[i]);
			// console.log(sorted_decks[i].deck + '\t: ' + roundedPPL(sorted_decks[i])/100);
			shown ++;
			if(shown > SHOW_MAX) { break }
		}
	}
	
	//fala qto demorou
	endTime = new Date();
	var elapsedTime = endTime.getTime() - startTime.getTime();
	var strTime = "";
	if(elapsedTime > 1000){
		strTime = Math.round(elapsedTime/10)/100 + 's';
	} else {
		strTime = elapsedTime + 'ms';
	}
	console.log('SORTED in ' + strTime);
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

function encapsulaCor(str){
	//assume que cor tem sempre uma letra
	var newstr = str.substr(0,1) + "|" + str.substr(2,str.length - 1);
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

initCardScores();
$(init);