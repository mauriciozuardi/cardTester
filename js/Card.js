function Card(colorOrDBIndex, i, player, game){
	if(isNaN(parseInt(colorOrDBIndex))){
		var options = window[colorOrDBIndex + '_DB'];
		var index = i ? i : Math.floor(Math.random()*options.length);
	} else {
		var options = ALL_CARDS;
		var index = parseInt(colorOrDBIndex);
	}
	
	var string = options[index];
	var property = string.split(',');
	this.color = property[0];
	this.inicialWait = parseInt(property[1]);
	this.inicialPow = parseInt(property[2]);
	this.inicialSta = parseInt(property[3]);
	this.name = property[4];
	this.hability = (property[6] != ' ') ? property[6] : null;
	this.n = parseInt(property[7]);
	this.id = parseInt(property[8]);
	this.wait = this.inicialWait;
	this.pow  = this.inicialPow;
	this.sta  = this.inicialSta;
	this.dmgToTake = 0;
	this.player = player;
	this.game = game;
	this.isDummy = false;
}

Card.prototype.isAlive = function(){
	return (this.sta > 0) ? true : false;
}

Card.prototype.isAwake = function(){
	return (this.wait <= 0) ? true : false;
}

Card.prototype.stringify = function(){
	var str = "";
	str += this.color + ',';
	str += this.inicialWait + ',';
	str += this.inicialPow + ',';
	str += this.inicialSta + ',';
	str += this.name + ',';
	str += ' ,'; //slot para imgName
	str += this.hability + ',';
	str += this.n + ',';
	str += this.id;
	return str;
}

Card.prototype.addDmg = function(dmg){
	this.dmgToTake += dmg;
	!DBUG ? null : console.log(this.name + ' got ' + dmg + ' dmgToTake. Total:' + this.dmgToTake);
}

Card.prototype.takeDmg = function(){
	this.sta -= this.dmgToTake;
	!DBUG ? null : console.log(this.name + ' took ' + this.dmgToTake + ' dmg. Actual sta:' + this.sta);
	(this.sta <= 0) ? this.player.game.onKill(this.player, this) : this.player.game.onNoKill(this.player, this);
}

function CardDummy(player,game){
	this.color = "¥";
	this.inicialWait = 0;
	this.inicialPow = 0;
	this.inicialSta = 0;
	this.name = "–DUMMY–" + player.name;
	this.hability = null;
	this.n = 0;
	this.id = null;
	this.wait = this.inicialWait;
	this.pow  = this.inicialPow;
	this.sta  = this.inicialSta;
	this.dmgToTake = 0;
	this.player = player;
	this.game = game;
	this.isDummy = true;
}

CardDummy.prototype.addDmg = function(dmg){
	this.dmgToTake += dmg;
	!DBUG ? null : console.log(this.name + ' got ' + dmg + ' dmgToTake. Total:' + this.dmgToTake);
}

CardDummy.prototype.takeDmg = function(){
	this.player.life -= this.dmgToTake;
	!DBUG ? null : console.log(this.player.name + ' took ' + this.dmgToTake + ' dmg. Actual life:' + this.player.life);
}