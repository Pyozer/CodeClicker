/**
 * Remplace dans une chaine de caractères les variables de type {{name}}
 * par les valeurs transmises dans le tableau
 * @param {String} string Chaine de caractère
 * @param {Array} replace Valeurs de remplacement
 */
function replaceAssoc(string, replace = {}) {
    return string.replace(/{{(\w+)}}/g, function(s, key) {
        return replace[key] || s;
    });
}

function roundTo(num, precision = 0) {    
    return +(Math.round(num + "e+" + precision) + "e-" + precision);
}

/**
 * Transforme un (grand) nombre composé que de chiffre en par exemple 12 millards
 * @param {String} number Nombre formater avec un nom (ex: 1 million)
 */
function formatNumber(number, precision = 1) {
    var numberLongFormat = [
        '',
        ' million',
        ' milliard',
        ' billion',
        ' billiard',
        ' trillion',
        ' trilliard',
        ' quadrillion',
        ' quadrilliard',
        ' quintillion',
        ' quintilliard',
        ' sextillion',
        ' sextilliard',
        ' septillion',
        ' septilliard',
        ' octillion',
        ' octilliard',
        ' nonillion',
        ' nonilliard',
        ' decillion',
        ' decilliard'
    ];

    var index, divided;

    if(number.lessThan(1000000)) { // Si inférieur à 1 million
        index = 0;
        divided = 1;
    } else if(number.lessThan(1000000000)) { // Si inférieur à 1 milliard
        index = 1;
        divided = 1000000;
    } else if(number.lessThan(1000000000000)) { // Si inférieur à 1 billion
        index = 2;
        divided = 1000000000;
    } else if(number.lessThan(1000000000000000)) { // Si inférieur à 1 billiard
        index = 3;
        divided = 1000000000000;
    } else if(number.lessThan(1000000000000000000)) { // Si inférieur à 1 trillion
        index = 4;
        divided = 1000000000000000;
    } else if(number.lessThan(1000000000000000000000)) { // Si inférieur à 1 trilliard
        index = 5;
        divided = 1000000000000000000;
    } else if(number.lessThan(1000000000000000000000000)) { // Si inférieur à 1 quadrillion
        index = 6;
        divided = 1000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000)) { // Si inférieur à 1 quadrilliard
        index = 7;
        divided = 1000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000)) { // Si inférieur à 1 quintillion
        index = 8;
        divided = 1000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000)) { // Si inférieur à 1 quintilliard
        index = 9;
        divided = 1000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000)) { // Si inférieur à 1 sextillion
        index = 10;
        divided = 1000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000)) { // Si inférieur à 1 sextilliard
        index = 11;
        divided = 1000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000)) { // Si inférieur à 1 septillion
        index = 12;
        divided = 1000000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000000)) { // Si inférieur à 1 septilliard
        index = 13;
        divided = 1000000000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000000000)) { // Si inférieur à 1 octillion
        index = 14;
        divided = 1000000000000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000000000000)) { // Si inférieur à 1 octilliard
        index = 15;
        divided = 1000000000000000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000000000000000)) { // Si inférieur à 1 nonillion
        index = 16;
        divided = 1000000000000000000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000000000000000000)) { // Si inférieur à 1 nonilliard
        index = 17;
        divided = 1000000000000000000000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000000000000000000000)) { // Si inférieur à 1 decillion
        index = 18;
        divided = 1000000000000000000000000000000000000000000000000000000000000;
    } else if(number.lessThan(1000000000000000000000000000000000000000000000000000000000000000)) { // Si inférieur à 1 decilliard
        index = 19;
        divided = 1000000000000000000000000000000000000000000000000000000000000;
    } else {
        index = 20;
        divided = 1000000000000000000000000000000000000000000000000000000000000000;
    }

    return roundTo(number.dividedBy(divided), precision) + numberLongFormat[index];
}

function showSnackbar(message, duration = 3000) {
    // Get the snackbar DIV
    var snackbar = document.getElementById("snackbar");
    document.getElementById("snackbar_text").innerHTML = message;

    // Add the "show" class to DIV
    snackbar.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){
        snackbar.className = "";
    }, duration);
}


// ANIMATION
var c = document.getElementById("anim_matrix");
var ctx = c.getContext("2d");

//making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

// characters - taken from the unicode charset
var chars = "function anim(){ console.log('une bonne note svp'); } anim();";
//converting the string into an array of single characters
chars = chars.split("");

var font_size = 10;
var columns = c.width / font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for(var x = 0; x < columns; x++)
	drops[x] = 1; 

//drawing the characters
function matrix_animation() {
	//Black BG for the canvas
	//translucent BG to show trail
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, c.width, c.height);
	
	ctx.fillStyle = "#0F0"; //green text
	ctx.font = font_size + "px arial";
	//looping over drops
	for(var i = 0; i < drops.length; i++) {
		//a random character to print
		var text = chars[Math.floor(Math.random()*chars.length)];
		//x = i*font_size, y = value of drops[i]*font_size
		ctx.fillText(text, i * font_size, drops[i] * font_size);
		
		//sending the drop back to the top randomly after it has crossed the screen
		//adding a randomness to the reset to make the drops scattered on the Y axis
		if(drops[i] * font_size > c.height && Math.random() > 0.975)
			drops[i] = 0;
		
		//incrementing Y coordinate
		drops[i]++;
	}
}