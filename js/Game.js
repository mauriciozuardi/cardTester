function Game(){//cria o player
	this.players = {};
	this.players.p1 = new Player('P1',this);
	this.players.p2 = new Player('P2',this);
	this.players.p1.opponent = this.players.p2;
	this.players.p2.opponent = this.players.p1;
	this.turnCount = 0;
	this.turn = this.newTurn();
	// this.currentPlayer = null;
}

Game.prototype.newTurn = function(){
	this.turnCount ++;
		!DBUG ? null : console.log('– – GAME ' + (gamesRunned + 1) + ' – TURNO ' + this.turnCount + ' – P1:' + this.players.p1.life + '[' + this.players.p1.livingCards() + '] | P2:' + this.players.p2.life + '[' + this.players.p2.livingCards() + '] – –');
		
	//roda a roleta e define quem vai atacar
	for(var i in this.players){
		var p = this.players[i];
		p.newHand();
		p.setAttacker();
		p.whoJustAwoke();
	}
	
	//avalia o combate
	for(var i in this.players){
		var p = this.players[i];
		!DBUG ? null : console.log([p.name + ' attacker:' + p.attacker.name + ' ' + p.attacker.pow + '/' + p.attacker.sta + ' (' + p.attacker.wait + ')']);
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
	!DBUG ? null : console.log('.');
	this.defineNextStep(p);
}

Game.prototype.onAwake = function(player, card){
	switch(card.hability){
		case 'enlist':
			!DBUG ? null : console.log('> > > ENLIST ('+card.name+' - '+player.name+')');
			// !DBUG ? null : console.log(player);
			for(var i in player.hand){
				!DBUG ? null : console.log(player.hand[i].name + ' [' + player.hand[i].color + ' > ' + card.color +']' );
				player.hand[i].color = card.color;
			}
		break;
		default:
			//nada
		break;	
	}
}

Game.prototype.beforeCombat = function(player){
	switch(player.attacker.hability){
		case 'renew':
			!DBUG ? null : console.log('> > > RENEW ('+player.attacker.name+' - '+player.name+')');
			!DBUG ? null : console.log(player.name + ' recovered ' + player.attacker.n + ' life points.');
			player.life += player.attacker.n;
		break;
		case 'harden':
			!DBUG ? null : console.log('> > > HARDEN ('+player.attacker.name+' - '+player.name+')');
			player.attacker.sta += player.attacker.n;
			!DBUG ? null : console.log(player.attacker.name + ' is now ' + player.attacker.pow + '/' + player.attacker.sta);
		break;
		default:
			//nada
		break;	
	}
}

Game.prototype.onCombat = function(player){
	//check se foi bloqueada ou não
	player.opponent.attacker.isDummy ? this.onNoBlock(player) : this.onBlock(player);
	
	//confere as outras habilidades
	switch(player.attacker.hability){
		case 'heavy':
			!DBUG ? null : console.log('> > > HEAVY ('+player.attacker.name+' - '+player.name+')');
			var pow = player.attacker.pow;
			var oppSta = player.opponent.attacker.sta;
			if(player.opponent.attacker.player || oppSta > pow){
				//dano normal
				player.opponent.attacker.addDmg(player.attacker.pow)
			} else {
				//parte na carta, parte no player
				!DBUG ? null : console.log(player.opponent.name + ' took ' + (pow - oppSta) + ' dmg.');
				player.opponent.life -= pow - oppSta;
				player.opponent.attacker.addDmg(oppSta);
			}
		break;
		default:
			player.opponent.attacker.addDmg(player.attacker.pow);
		break;	
	}
}

Game.prototype.onBlock = function(player){
	switch(player.attacker.hability){
		case 'slash':
			!DBUG ? null : console.log('> > > SLASH ('+player.attacker.name+' - '+player.name+')');
			var targets = player.opponent.ableCards();
			if(targets.length > 0){
				var individualDmg = Math.floor(player.attacker.pow/targets.length);
				individualDmg = (individualDmg >= 1) ? individualDmg : 1;
				if(DBUG){
					console.log('Alvos:');
					for(var i in targets){
						console.log('> ' + targets[i].name + ' ' + targets[i].pow + '/' + targets[i].sta + '['+targets[i].wait+']');
					}
					console.log(individualDmg + ' dmg em cada.');
				}
				//causa o dano
				for(var i in targets){
					targets[i].addDmg(individualDmg);
				}
				//compensa o dano que o combate normal causaria
				player.opponent.attacker.addDmg(-player.attacker.pow);
			}
		break;
		default:
			//nada
		break;	
	}
}

Game.prototype.onNoBlock = function(player){
	
}

Game.prototype.onKill = function(player, card){
	!DBUG ? null : console.log(card.name + ' (' + player.name + ') died.');
	switch(card.hability){
		case 'immortal':
			!DBUG ? null : console.log('> > > IMMORTAL ('+card.name+' - '+player.name+')');
			card.wait = card.inicialWait;
			card.pow = card.inicialPow;
			card.sta = card.inicialSta;
			!DBUG ? null : console.log(card.name + ' is BACK! ' + card.pow + '/' + card.sta + '['+card.wait+']');
		break;
		default:
			//nada
		break;	
	}
}

Game.prototype.onNoKill = function(player,card){
	!DBUG ? null : console.log(card.name + ' (' + player.name + ') survived.');
}

Game.prototype.afterCombat = function(player){
	switch(player.attacker.hability){
		case 'awake':
			!DBUG ? null : console.log('> > > AWAKE ('+player.attacker.name+' - '+player.name+')');
			for(var i in player.hand){
				player.hand[i].wait --;
				!DBUG ? null : console.log(player.hand[i].name + ' was afeccted.');
				if(player.hand[i].wait <= 0){
					!DBUG ? null : console.log(player.hand[i].name + ' has awaken.');
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
		!DBUG ? null : console.log('player1 wins');
		updateCardsScores(this.players.p1.deck, 1);
		updateCardsScores(this.players.p2.deck, -1);
		restart();
	} else if(!this.players.p1.isAlive() && this.players.p2.isAlive()){
		!DBUG ? null : console.log('player2 wins');
		updateCardsScores(this.players.p1.deck, -1);
		updateCardsScores(this.players.p2.deck, 1);
		restart();
	} else {
		!DBUG ? null : console.log('draw');
		updateCardsScores(this.players.p1.deck, 0);
		updateCardsScores(this.players.p2.deck, 0);
		restart();
	}
}

Game.prototype.onGameOver = function(player){
	
}