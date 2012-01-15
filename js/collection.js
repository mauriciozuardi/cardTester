COLLECTION_VERSION = "30";

R_DB = [];
R_DB.push('R,7,3,3,Gigante, ,heavy,0');
R_DB.push('R,2,0,1,Succubus, ,enlist,0');
R_DB.push('R,5,3,3,ArchDemon, ,enlist,0');
R_DB.push('R,5,3,1,Bombeta, ,heavy,0');
R_DB.push('R,2,2,1,Traque, , ,0');
R_DB.push('R,4,3,2,Rojão, , ,0');
R_DB.push('R,4,2,2,RedMana, ,awake,0');

G_DB = [];
G_DB.push('G,2,0,1,Murinho, ,renew,2');
G_DB.push('G,4,2,2,Shaman, ,renew,2');
G_DB.push('G,4,4,1,Raptor, ,slash,0');
G_DB.push('G,6,6,5,Golias, ,slash,0');
G_DB.push('G,6,2,4,Ent, , ,0');
G_DB.push('G,4,2,3,Medio, , ,0');
G_DB.push('G,2,1,2,GreenMana, ,awake,0');

B_DB = [];
B_DB.push('B,2,1,2,Highlander, ,immortal,0');
B_DB.push('B,4,3,1,Nightmare, ,immortal,0');
B_DB.push('B,1,1,1,SlowGrow, ,harden,2');
B_DB.push('B,5,3,3,Monster, ,harden,1');
B_DB.push('B,1,0,5,Barreira, , ,0');
B_DB.push('B,3,1,5,Blob, , ,0');
B_DB.push('B,3,1,4,BlueMana, ,awake,0');

A_DB = [];
A_DB.push('A,4,0,5,Gabriel, ,purge,0');
A_DB.push('A,4,2,1,Arcanjo, ,purge,0');
A_DB.push('A,4,2,2,Theresa, ,martyr,2');
A_DB.push('A,3,2,1,Ghandi, ,martyr,1');
A_DB.push('A,7,5,5,Budah, , ,0');
A_DB.push('A,4,3,3,Miguel, , ,0');
A_DB.push('A,3,2,1,YellowMana, ,awake,0');

DECK_COLORS = ["R", "G", "B", "A"];
ALL_CARDS = [];

//monta o ALL_CARDS e coloca o id na última casa. [8] atualmente.
for (var i in DECK_COLORS){
	var arr = this[DECK_COLORS[i] + "_DB"];
	for (var j in arr){
		arr[j] += "," + ALL_CARDS.length;
		ALL_CARDS.push(arr[j]);
	}
}