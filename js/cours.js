
class Doigt{
	constructor(main, position){
		this.main = main;
		this.position = position;
	}


	equals(d){
		return this.main == d.main && this.position == d.position;
	}

	toString(){
		var res = '';
		switch(this.position){
			case 'au': res+='auriculaire'; break;
			case 'an': res+='annulaire'; break;
			case 'm': res+= 'majeur';break;
			case 'ind': res+= 'index';break;
			case 'm': res+= 'majeur';break;
			case 'p': res+= 'pouce';break;


		}

		res+= ' ';

		switch(this.main){
			case 'g': res+='gauche'; break;
			case 'd': res+='droit'; break;

		}
		return res;

	}
}

class Touche{
	constructor(lettre){
		this.lettre = lettre;

	}

	calculerDoigt(){
		var d = false;
		switch(this.lettre){
			case "a":
			case "q":
			case "w":d = new Doigt("g", "au"); break;
			case "z":
			case "s":
			case "x":d = new Doigt("g", "an"); break;
			case "e":
			case "d":
			case "c":d = new Doigt("g", "m"); break;
			case "r":
			case "f":
			case "v":
			case "t":
			case "g":
			case "b":d = new Doigt("g", "ind"); break;
			case "y":
			case "h":
			case "n":
			case "u":
			case "j":d = new Doigt("d", "ind"); break;
			case "i":
			case "k":d = new Doigt("d", "maj"); break;
			case "o":
			case "l":d = new Doigt("d", "an"); break;
			case "p":
			case "m":d = new Doigt("d", "au"); break;
		}

		this.doigt = d;
		return this.doigt;
	}

}

class Clavier{

	constructor(){

		this.ligneMilieu = "qsdfghjklm";
		this.ligneHaute = "azertyuiop";
		this.ligneBasse = "wxcvbn";
	}

	creerDOM(){
		var clavierDiv = document.getElementById('clavier');
		var hauteDiv = document.getElementById('haute');
		var milieuDiv = document.getElementById('milieu');
		var basseDiv = document.getElementById('basse');

		for(var i=0; i<this.ligneMilieu.length; i++){
			var toucheElt = document.createElement("div");
			toucheElt.setAttribute("data-lettre", this.ligneMilieu.charAt(i));
			toucheElt.innerHTML = this.ligneMilieu.charAt(i);
			milieuDiv.appendChild(toucheElt);
		}

		for(var i=0; i<this.ligneHaute.length; i++){
			var toucheElt = document.createElement("div");
			toucheElt.setAttribute("data-lettre", this.ligneHaute.charAt(i));
			toucheElt.innerHTML = this.ligneHaute.charAt(i);
			hauteDiv.appendChild(toucheElt);
		}

		for(var i=0; i<this.ligneBasse.length; i++){
			var toucheElt = document.createElement("div");
			toucheElt.setAttribute("data-lettre", this.ligneBasse.charAt(i));
			toucheElt.innerHTML = this.ligneBasse.charAt(i);
			basseDiv.appendChild(toucheElt);
		}


	}
}

class Lecon{
	constructor(texte){
		this.texte = texte;
		this.aide = '';
		// s c'est l'ensemble des lettres dans le texte
		var s = new Set();

		for(var i=0; i<this.texte.length; i++){
			var c = this.texte.charAt(i);
			s.add(c); 
		}
		for(var c of s){
			var t = new Touche(c);
			var d = t.calculerDoigt();
			this.aide+= 'Pour taper ' + c + ' faites ' + d.toString() + '<br>';
		}
		this.correcte = 0;
		this.debut = 0;
		this.fin = 0;
		this.position = 0;
	}

	creerDOM(){
		var modeleDiv = document.getElementById("modele");
		modeleDiv.innerHTML = '';
		for(var i=0; i<this.texte.length; i++){
			var c = this.texte.charAt(i);
			var s = document.createElement("span");
			s.setAttribute("data-texte-lettre", c);
			s.setAttribute("data-texte-position", i);
			s.innerHTML = c;
			modele.appendChild(s);
		}
		var  aideDiv = document.getElementById("aide");
		aideDiv.innerHTML = this.aide;

	}

	getSpanCourant(){
		var res = document.querySelector("[data-texte-position='"+this.position+"']");
		return res;
	}

}

class Cours{

	constructor(){

		this.tabLecons = [];
		var tabTextes = ['fjfjfjjjffjfjfj', 'dkdkkkdddkdkdkd', 'ssslllslslslsls', 'qmqmqmqmqmqqqmm','apapappppaaaapa', 'adljprdnsldoijdlqmsle'];
		for(var i=0; i<tabTextes.length; i++){
			var t = tabTextes[i];
			var lecon = new Lecon(t);
			this.tabLecons.push(lecon);

		}

		this.position = 0;

	}

	leconCourante(){

		return this.tabLecons[this.position];
	}

	afficherLeconCourante() {
		this.leconCourante().creerDOM();
		new Audio("sons/debut.wav").play();

	}

	precedent() {
		if(this.position>0){
		--this.position;
		   this.afficherLeconCourante();
		
		}
			
	}

	prochain(){
		if(this.position<this.tabLecons.length){
			this.position++;
			this.afficherLeconCourante();
		}
	}

}


window.addEventListener("load", function(e){
	var clavier = new Clavier();
	clavier.creerDOM();
	var cours = new Cours();
	cours.afficherLeconCourante();
	window.addEventListener("keydown", function(evt){
		if(evt.key>='a' && evt.key<='z' && ! evt.altKey && ! evt.ctrlKey){

			var toucheElt = document.querySelector('[data-lettre='+ evt.key + ']');
			toucheElt.style.backgroundColor = "blue";
		}
	});

	window.addEventListener("keyup", function(evt){
		var lecon = cours.leconCourante();
		if(evt.key>='a' && evt.key<='z' && ! evt.altKey && ! evt.ctrlKey){


			var toucheElt = document.querySelector('[data-lettre='+ evt.key + ']');
			toucheElt.style.backgroundColor = "white";
			if(lecon.position == 0){
				var now = new Date();
				lecon.debut = now.getTime();
			}

			var s = lecon.getSpanCourant();
			var lettreAttendu = s.innerHTML;
			if(evt.key == lettreAttendu){
				lecon.correcte++;
				s.style.backgroundColor ="green";
				new Audio("sons/bon.wav").play();
			}else{
				s.style.backgroundColor ="red";
				new Audio("sons/mauvais.wav").play();

			}
			lecon.position++;

			if(lecon.position == lecon.texte.length){
				var now = new Date();
				lecon.fin = now.getTime();
				var tempEcouler = lecon.fin - lecon.debut;
			}
		}
	});

	var precedent = document.getElementById('precedent');
	precedent.addEventListener('click', function(evt){
		cours.precedent();
	});

	var prochain = document.getElementById('prochain');
	prochain.addEventListener('click', function(evt){
		cours.prochain();

	}); 

	var Bienvenu = document.getElementById("Bienvenu");
	if(localStorage.nom){
		Bienvenu.innerHTML = "Bienvenu " +localStorage.nom;
	}

	var nomInput = document.getElementById("nom");
	var sauvegarderInput = document.getElementById('saveNom');
	sauvegarderInput.addEventListener('click',function(evt) {

		if(nomInput.value){
			localStorage.nom = nomInput.value;
			Bienvenu.innerHTML = "Bienvenu " +localStorage.nom;

		}
	});



});

