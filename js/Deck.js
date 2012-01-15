function Deck(){
	this.pickColors();
	this.cards = [];
	this.pickCards();
	this.matrix = [
		[this.cards[0], this.cards[1], this.cards[2]],
		[this.cards[3], this.cards[4], this.cards[5]],
		[this.cards[6], this.cards[7], this.cards[8]]
	];
}

Deck.prototype.pickColors = function(){
	this.colors = DECK_COLORS.slice();
	while(this.colors.length > 3){
		this.colors.splice(Math.floor(Math.random()*this.colors.length), 1);
	}
}

Deck.prototype.pickCards = function(){
	for(var l=0; l<3; l++){
		for(var c=0; c<3; c++){
			this.cards.push(new Card(this.colors[c]));		
		}
	}
}