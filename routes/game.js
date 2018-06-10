var fs = require("fs");

const SAVE_FILE = 'save.json';

function isJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * Permet de lire un fichier et de renvoyer directement le contenu au format JSON
 * @param {String} file 
 * @param {function} callback 
 */
function readFileToJSON(file, callback) {
	fs.readFile(file, 'utf8', function (err, data) {
	    if (err) {
	    	console.log("Fail during get " + file);
			callback(err);
		}
		if(!isJSONString(data)) {
			data = "{}";
		}
		var allSave = JSON.parse(data);
		callback(null, allSave);
	});
}

/**
 * Permet de sauvegarder le score d'un joueur dans le fichier save.json
 * @param {*} req 
 * @param {*} res 
 */
exports.save = function(req, res) {

	var dataSave = JSON.parse(req.body.data);

	// Sauvegarde le score du joueur dans le fichier
    readFileToJSON(SAVE_FILE, function (err, data) {
	    if (err) {
	       	res.writeHead(500);
    		res.end();
		}

		data[dataSave.Player] = dataSave;
		
		fs.writeFile(SAVE_FILE, JSON.stringify(data), function (err) {
			if (err) {
				console.log("Fail during saving " + SAVE_FILE);
				res.writeHead(500);
				res.end();
			}
	
			res.writeHead(200);
			res.end();
		});
	});
}

exports.load_save = function(req, res) {

	readFileToJSON(SAVE_FILE, function (err, data) {
	    if (err) {
	       	res.writeHead(500);
    		res.end();
		}
		
		var userSave = data[req.query.pseudo];
		if(userSave == undefined) {
			userSave = {};
		}

	    res.writeHead(200, {"Content-Type": "application/json"});
    	res.write(JSON.stringify(userSave));
    	res.end();
	});
}

exports.leaderboard = function(req, res) {
	//TODO: Read file leaderboard.js
	readFileToJSON(SAVE_FILE, function (err, data) {
	    if (err) {
	       	res.writeHead(500);
    		res.end();
		}
		
		var leaderboard = [];
		for(i in data) {
			leaderboard.push({
				pseudo: data[i].Player,
				units: data[i].Units
			});
		}

		// Tri
		leaderboard.sort(function(a, b){
			return a.units - b.units;
		});

	    res.writeHead(200, {"Content-Type": "application/json"});
    	res.write(JSON.stringify(leaderboard));
    	res.end();
	});
}
