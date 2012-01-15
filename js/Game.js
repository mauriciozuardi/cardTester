function Game(){//cria o player
	this.players = {};
	this.players.p1 = new Player('Player1');
	this.players.p2 = new Player('Player2');
	this.players.p1.opponent = this.players.p2;
	this.players.p2.opponent = this.players.p1;
	this.turnCount = 0;
	this.turn = this.newTurn();
	// this.currentPlayer = null;
}

Game.prototype.newTurn = function(){
	this.turnCount ++;
	!DEBUGGING ? null : console.log('– – GAME ' + (gamesRunned + 1) + ' – TURNO ' + this.turnCount + '– –');
	//roda a roleta e define quem vai atacar
	for(var i in this.players){
		var p = this.players[i];
		p.newHand();
		p.setAttacker();
	}
	//avalia o combate
	for(var i in this.players){
		var p = this.players[i];
		!DEBUGGING ? null : console.log([p.name, p.life, p.livingCards(), p.attacker, p.attacker.pow]);
		this.beforeCombat(p);
		this.onCombat(p);
		this.afterCombat(p);
	}
	//aplica o resultado do combate e avalia como o jogo deve progredir
	!DEBUGGING ? null : console.log('.');
	this.defineCombatOutcome(p);
	this.defineNextStep(p);
}

Game.prototype.beforeCombat = function(player){
	
}

Game.prototype.onCombat = function(player){
	switch(player.attacker.hability){
		// case 'heavy':
		// 	console.log('nothing casted beforeCombat');
		// break;
		default:
			player.opponent.attacker.takeDmg(player.attacker.pow);
		break;	
	}
}

Game.prototype.afterCombat = function(player){
	
}

Game.prototype.defineCombatOutcome = function(player){
	
}

Game.prototype.defineNextStep = function(){
	//outro turno ou outro jogo
	if(this.players.p1.isAlive() && this.players.p2.isAlive()){
		this.newTurn();
	} else if(this.players.p1.isAlive() && !this.players.p2.isAlive()){
		!DEBUGGING ? null : console.log('player1 wins');
		updateCardsScores(this.players.p1.deck, 1);
		updateCardsScores(this.players.p2.deck, -1);
		restart();
	} else if(!this.players.p1.isAlive() && this.players.p2.isAlive()){
		!DEBUGGING ? null : console.log('player2 wins');
		updateCardsScores(this.players.p1.deck, -1);
		updateCardsScores(this.players.p2.deck, 1);
		restart();
	} else {
		!DEBUGGING ? null : console.log('draw');
		updateCardsScores(this.players.p1.deck, 0);
		updateCardsScores(this.players.p2.deck, 0);
		restart();
	}
}

Game.prototype.onGameOver = function(player){
	
}