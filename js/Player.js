function Player(name){
	this.deck = new Deck();
	this.life = 20;
	this.name = name;
	this.dummy = new CardDummy(this);
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
	for(var i in this.hand){
		var nIguais = contaCores[this.hand[i].color];
		//ajusta wait
		this.hand[i].wait -= nIguais;
		//ajusta pow/sta
		if(nIguais == 2){
			this.hand[i].pow += 1;
			this.hand[i].sta += 1;
		}
		if(nIguais == 3){
			this.hand[i].pow += 2;
			this.hand[i].sta += 1;
		}
		//dispara awake se necessário
		(this.hand[i].wait <= 0) ? this.game.onAwake(this, this.hand[i]) : null;
	}
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

// Player.prototype.takeDmg = function(dmg){
// 	this.life -= dmg;
// 	!DEBUGGING ? null : console.log(this.name + ' took ' + dmg + ' dmg. Actual life:' + this.life);
// }