function Game(){//cria o player
	this.players = {};
	this.players.p1 = new Player('Player1');
	this.players.p2 = new Player('Player2');
	this.players.p1.opponent = this.players.p2;
	this.players.p2.opponent = this.players.p1;
	this.players.p1.game = this;
	this.players.p2.game = this;
	this.turnCount = 0;
	this.turn = this.newTurn();
	// this.currentPlayer = null;
}

Game.prototype.newTurn = function(){
	this.turnCount ++;
	//roda a roleta e define quem vai atacar
	for(var i in this.players){
		var p = this.players[i];
		p.newHand();
		p.setAttacker();
	}
	!DEBUGGING ? null : console.log('– – GAME ' + (gamesRunned + 1) + ' – TURNO ' + this.turnCount + ' (' + this.players.p1.life + '/' + this.players.p1.livingCards() + ' : ' + this.players.p2.life + '/' + this.players.p2.livingCards() + ') – –');
	
	//avalia o combate
	for(var i in this.players){
		var p = this.players[i];
		!DEBUGGING ? null : console.log([p.name + ' attacker:',p.attacker]);
		this.beforeCombat(p);
		this.onCombat(p);
		this.afterCombat(p);
	}
	
	//aplica o resultado do combate
	this.applyDmg();
	
	//roda o afterCombat
	for(var i in this.players){
		var p = this.players[i];
		this.afterCombat(p);
	}
	
	//avalia como o jogo deve progredir
	!DEBUGGING ? null : console.log('.');
	this.defineNextStep(p);
}

Game.prototype.onAwake = function(player, card){
	switch(card.hability){
		case 'enlist':
			!DEBUGGING ? null : console.log('> > > ENLIST');
			!DEBUGGING ? null : console.log(player);	
			for(var i in player.hand){
				player.hand[i].color = player.attacker.color;
				!DEBUGGING ? null : console.log(player.opponent.hand[i]);
			}
		break;
		default:
			//nada
		break;	
	}
}

Game.prototype.beforeCombat = function(player){
	
}

Game.prototype.onCombat = function(player){
	switch(player.attacker.hability){
		case 'heavy':
			// !DEBUGGING ? null : console.log('> > > HEAVY');
			var pow = player.attacker.pow;
			var oppSta = player.opponent.attacker.sta;			// 
						// !DEBUGGING ? null : console.log('pow:' + pow);
						// !DEBUGGING ? null : console.log('oppSta:' + oppSta);
			if(player.opponent.attacker.player || oppSta > pow){
				//dano normal
				player.opponent.attacker.addDmg(player.attacker.pow)
			} else {
				//parte na carta, parte no player
				player.opponent.life -= pow - oppSta;
				player.opponent.attacker.addDmg(oppSta);
			}
		break;
		default:
			player.opponent.attacker.addDmg(player.attacker.pow);
		break;	
	}
}

Game.prototype.afterCombat = function(player){
	switch(player.attacker.hability){
		case 'awake':
			!DEBUGGING ? null : console.log('> > > AWAKE');	
			// !DEBUGGING ? null : console.log([player.name, player.hand]);
			for(var i in player.hand){
				player.hand[i].wait --;
				!DEBUGGING ? null : console.log(player.hand[i].name + ' was afeccted.');
				if(player.hand[i].wait <= 0){
					!DEBUGGING ? null : console.log(player.hand[i].name + ' has awaken.');
					this.onAwake(player, player.hand[i]);
				}
			}
		break;
		default:
			//nada
		break;	
	}
}

Game.prototype.applyDmg = function(){
	this.players.p1.attacker.takeDmg();
	this.players.p2.attacker.takeDmg();
	
	this.players.p1.attacker.dmgToTake = 0;
	this.players.p2.attacker.dmgToTake = 0;
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