function Player(name, game){
	this.deck = new Deck(this, game);
	this.deck.player = this;
	this.game = game;
	this.life = 20;
	this.name = name;
	this.dummy = new CardDummy(this,game);
	
	this.manaR = 0;
	this.manaG = 0;
	this.manaB = 0;
	this.manaA = 0;
	this.mana_ = 0;
}

Player.prototype.newHand = function(){
	this.hand = [];
	for(var l=0; l<3; l++){
		var c = Math.floor(Math.random()*this.deck.matrix[l].length);
		this.hand[l] = this.deck.matrix[l][c];	
	}
	this.applyBonus();
}

Player.prototype.setAttacker = function(definedAttacker){
	if(definedAttacker){
		this.attacker = definedAttacker;
	} else {
		var options = [];
		for(var i in this.hand){
			var card = this.hand[i];
			if(card.isAwake() && card.isAlive()){
				options.push(card);
			}
		}
		options.push(this.dummy); //inclui a carta genérica q faz o papel do player no combate
		this.attacker = options[Math.floor(Math.random()*options.length)]; //sorteia entre as opções
	}
}

Player.prototype.applyBonus = function(){
	//prepara
	var contaCores = {};
	for(var i in this.deck.colors){
		contaCores[this.deck.colors[i]] = 0;
	}
	//conta
	for(var i in this.hand){
		contaCores[this.hand[i].color] ++;
	}
	//aplica bonus
	!DBUG ? null : console.log(this.name + ' bonus phase:');
	for(var i in this.hand){
		if(this.hand[i].isAlive()){
			var nIguais = contaCores[this.hand[i].color] ? contaCores[this.hand[i].color] : 0; //para o caso de cor ¥
			//ajusta pow/sta
			if(nIguais == 2){
				var bP = 1;
				var bS = 1;
				var bW = nIguais;
				!DBUG ? null : console.log(this.hand[i].name + '(' + this.hand[i].color + ')\t' + this.hand[i].pow + '/' + this.hand[i].sta + '[' + this.hand[i].wait + '] > ' + (this.hand[i].pow + bP) + '/' + (this.hand[i].sta + bS) + '[' + (this.hand[i].wait - bW) + ']');
				this.hand[i].pow += bP;
				this.hand[i].sta += bS;
				this.hand[i].wait -= bW;
			} else if(nIguais == 3){
				var bP = 2;
				var bS = 1;
				var bW = nIguais;
				!DBUG ? null : console.log(this.hand[i].name + '(' + this.hand[i].color + ')\t' + this.hand[i].pow + '/' + this.hand[i].sta + '[' + this.hand[i].wait + '] > ' + (this.hand[i].pow + bP) + '/' + (this.hand[i].sta + bS) + '[' + (this.hand[i].wait - bW) + ']');
				this.hand[i].pow += bP;
				this.hand[i].sta += bS;
				this.hand[i].wait -= bW;
			} else {
				var bP = 0;
				var bS = 0;
				var bW = nIguais;
				!DBUG ? null : console.log(this.hand[i].name + '(' + this.hand[i].color + ')\t' + this.hand[i].pow + '/' + this.hand[i].sta + '[' + this.hand[i].wait + '] > ' + (this.hand[i].pow + bP) + '/' + (this.hand[i].sta + bS) + '[' + (this.hand[i].wait - bW) + ']');
				this.hand[i].pow += bP;
				this.hand[i].sta += bS;
				this.hand[i].wait -= bW;
			}			
		}
	}
	!DBUG ? null : console.log('.');
}

Player.prototype.livingCards = function(){
	var living = 0;
	for(var i in this.deck.cards){
		if(this.deck.cards[i].sta > 0){
			living ++;
		};
	}
	return living;
}

Player.prototype.isAlive = function(){
	return (this.life > 0 && this.livingCards() > 0) ? true : false;
}

Player.prototype.whoJustAwoke = function(){
	for(var i in this.hand){
		//dispara awake se necessário
		(this.hand[i].wait <= 0) ? this.game.onAwake(this, this.hand[i]) : null;
	}
}

Player.prototype.ableCards = function(){
	var able = [];
	for(var i in this.hand){
		if(this.hand[i].sta > 0 && this.hand[i].wait <= 0){
			able.push(this.hand[i]);
		};
	}
	return able;
}