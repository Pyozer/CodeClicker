

const FPS = 30;
const LOOP_INTERVAL = 1000 / FPS;
const SAVE_INTERVAL = 10000; // 10 sec
const TITLE_INTERVAL = 3000; // 3 sec

// Variable qui contiendra toutes les valeurs du jeu
var Game = {};

// Pseudo du joueur
Game.Player = undefined;

// Contient le nombre d'unités
Game.Units = new Decimal(0); 

// Définition de tous les générateurs
Game.Objects = {};
Game.Objects['clavier']         = newGenerator(15, 0.1, "Clavier", "keyboard");
Game.Objects['bloc_note']       = newGenerator(100, 1, "Bloc-note", "bloc_note");
Game.Objects['sublime_text']    = newGenerator(1100, 10, "Sublime Text", "sublime_text");
Game.Objects['git']             = newGenerator(12000, 50, "Git", "git");
Game.Objects['dev_stagiaire']   = newGenerator(130000, 250, "Développeur Stagiaire", "dev_stage");
Game.Objects['dev_junior']      = newGenerator(1400000, 1500, "Développeur Junior", "dev_junior");
Game.Objects['dev_senior']      = newGenerator(20000000, 7500, "Développeur Sénior", "dev_senior");
Game.Objects['linux']           = newGenerator(330000000, 45000, "Linux", "linux");
Game.Objects['stackoverflow']   = newGenerator(5100000000, 250000, "Stackoverflow", "stackoverflow");
Game.Objects['i3']              = newGenerator(75000000000, 1500000, "i3", "i3");
Game.Objects['visual_code']     = newGenerator(1000000000000, 10000000, "Visual Code", "visual_code");
Game.Objects['librairie']       = newGenerator(14000000000000, 65000000, "Librairie", "library");
Game.Objects['vim']             = newGenerator(170000000000000, 450000000, "Vim", "vim");
Game.Objects['ia']              = newGenerator(2100000000000000, 3000000000, "Intelligence artificielle", "ia");
Game.Objects['ia_futur']        = newGenerator(26000000000000000, 25000000000, "Intelligence artificielle du futur", "ia_futur");

// Créer les valeurs d'un générateur
function createGenerator(number, base_cost, current_cost, unit_power, name_obj, img_obj) {
    return {
        name: name_obj,
        img: "/images/" + img_obj + "_icon.png",
        number: new Decimal(number), // Nombre de ce générateur total
        base_cost: new Decimal(base_cost), // Coût initial
        current_cost: new Decimal(current_cost), // Coût actuel
        unit_win: new Decimal(unit_power) // Nombre d'unité généré par secondes
    };
}
function newGenerator(base_cost, unit_power, name_obj, img_obj) {
    return createGenerator(0, base_cost, base_cost, unit_power, name_obj, img_obj);
}

/** 
 * AJOUT DES UNITS / GENERATOR / GENERATORCEPTION
*/

// Units
function addUnit(nbUnits) {
    Game.Units = Game.Units.plus(nbUnits);
    updateUnitDisplay();
}

// Generator
function buyGenerator(generator) {
    if(isClickEnoughFor(generator)) {
        addItem(generator);
        removeUnit(getCostItem(generator));
        updateItemCost(generator, 1.65); // On met à jour son nouveau prix
        updateNumberGeneratorDisplay(generator); // On update le nombre de générateur sur l'interface.
        updateCostGeneratorDisplay(generator); // On update le prix d'achat d'un générateur sur l'interface.
        updateClickPerSecDisplay(); // On update le click par seconde sur l'interface.
        updateTotalNumberGeneratorDisplay();
    }
}

function addItem(index) {
    Game.Objects[index].number = Game.Objects[index].number.plus(1);
}

/**
 * SUPPRESSION DE UNITS
*/
function removeUnit(nbUnits) {
    Game.Units = Game.Units.minus(nbUnits);
    updateUnitDisplay();
}

/**
 * GETTERS
*/
function getNumberUnit() {
    return Game.Units;
}
function getNumberUnitFloor() {
    return getNumberUnit().floor();
}
function getItemUnitsPerSec(index) {
    return Game.Objects[index].unit_win;
}
function getTotalNumberItem() {
    var total = new Decimal(0);
    for(var index in Game.Objects) {
        total = total.plus(getNumberItem(index));
    }
    return total;
}
function getNumberItem(index) {
    return Game.Objects[index].number;
}
function getNumberItemFloor(index) {
    return getNumberItem(index).floor();
}
function getCostItem(index) {
    return Game.Objects[index].current_cost;
}
function getCostItemCeil(index) {
    return getCostItem(index).ceil();
}
function getBaseCostItem(index) {
    return Game.Objects[index].base_cost;
}
function setCostItem(index, cost) {
    Game.Objects[index].current_cost = cost;
}

/**
 * MODIFICATION DE L'AFFICHAGE
*/
function displayAllGeneators() {
    var html = '';
    $("#generatorsList").html(html);
    for(var index in Game.Objects) {
        var obj = Game.Objects[index];

        var htmlGen = $("#template_generator").html();

        var actualNumber = formatNumber(obj.number);
        var currentCost = formatNumber(obj.current_cost);
        var winUnits = formatNumber(obj.unit_win);

        var values = {
            genId: 'generator_' + index,
            genPrice: 'generator_price_' + index,
            genNum: 'generator_number_' + index,
            genBuy: 'generator_buy_' + index,
            index: index,
            objNumber: actualNumber,
            objName: obj.name,
            objImg: obj.img,
            objCurrentCost: currentCost,
            objWin: winUnits
        };
        
        html = replaceAssoc(htmlGen, values);

        $("#generatorsList").append(html);

        tippy('#generator_' + index, {
            html: el => el.querySelector('#generator_tooltip_' + index),
            arrow: true,
            theme: 'darklight',
            dynamicTitle: true,
            placement: 'left',
            animation: 'scale'
        });
    }

}
function updateNumberGeneratorDisplay(generator) {
    $(".generator_number_" + generator).html(getNumberItemFloor(generator).toString());
}
function updateCostGeneratorDisplay(generator) {
    $(".generator_price_" + generator).html(formatNumber(getCostItemCeil(generator)));
}

function updateUnitDisplay() {
    $("#nbUnit").html(formatNumber(getNumberUnit()));
}

function updateTotalNumberGeneratorDisplay() {
    $("#nbGenerator").html(formatNumber(getTotalNumberItem()))
}

function updateClickPerSecDisplay() {
    var sum = new Decimal(0);
    for(var generator in Game.Objects) {
        sum = sum.plus(getTotalItemClickPerSec(generator));
    }
    $("#nbClickSec").html(formatNumber(sum, 1));
}

function updateAllUi() {
    updateUnitDisplay();
    for(var index in Game.Objects) {
        updateNumberGeneratorDisplay(index);
        updateCostGeneratorDisplay(index);
    }
    updateClickPerSecDisplay();
    updateTotalNumberGeneratorDisplay();
}

function updateBtnState(generator) {
    if(isClickEnoughFor(generator)) {
        $("#generator_buy_" + generator).addClass("btn-primary");
        $("#generator_buy_" + generator).removeClass("btn-danger");
        $("#generator_buy_" + generator).prop("disabled", false);
    } else {
        $("#generator_buy_" + generator).addClass("btn-danger");
        $("#generator_buy_" + generator).removeClass("btn-primary");
        $("#generator_buy_" + generator).prop("disabled", true);
    }
}

function displayGame() {
    $("#startContainer").hide();
    $("#gameContainer").show();
    $("body").removeClass("bg-dark");
}

function displayHomePage() {
    $("#startContainer").show();
    $("#gameContainer").hide();
    $("body").addClass("bg-dark");
}

/**
 * CALCULES
*/
function updateItemCost(index, pow) {
    var newCost = getBaseCostItem(index).plus(getNumberItem(index).toPower(pow));
    setCostItem(index, newCost);
}

function isClickEnoughFor(index) {
    return getNumberUnit().greaterThanOrEqualTo(getCostItem(index));
}

function getTotalItemClickPerSec(generator) {
    return getItemUnitsPerSec(generator).times(getNumberItem(generator));
}

/**
 * LOAD / SAVE GAME
 */
function save_game() {
    var data2Send = JSON.stringify(Object.assign({}, Game));
    
    // Update game save in JSON file
    $.ajax({
        type: "POST",
        url: "/game/save",
        data: {
            data: data2Send
        }
    }).done(function() {
        showSnackbar('Partie sauvegardée.');
    });
}

function load_game() {
    $.ajax({
        url: "/game/load?pseudo=" + Game.Player,
        type: "GET"
    }).done(function(data) {
        formatJSONToData(data);
        updateAllUi();
        showSnackbar('Sauvegarde chargée !');
    });
}

function formatJSONToData(json) {
    Game.Units = new Decimal(json.Units);
    Game.Player = json.Player;

    for(var index in json.Objects) {
        Game.Objects[index] = createGenerator(
            json.Objects[index].number,
            json.Objects[index].base_cost,
            json.Objects[index].current_cost,
            json.Objects[index].unit_win,
            json.Objects[index].name,
            json.Objects[index].img
        );
    }
}

function load_leaderboard() {
    var table = document.querySelector('#leaderboard tbody');
    
    // Update game save in JSON file
    $.ajax({
        url: "/game/leaderboard",
        type: "GET"
    }).done(function(scores) {
        while(table.hasChildNodes())
            table.removeChild(table.firstChild);
    
        for(var i = scores.length - 1;i >= 0;i--) {
            var score = scores[i];
            var row = table.insertRow(-1);
            cellPlayer = row.insertCell(-1);
            cellPlayer.innerHTML = score.pseudo;
            cellScore = row.insertCell(-1);
            cellScore.innerHTML = formatNumber(new Decimal(score.units), 1);
            if(score.pseudo == Game.Player) {
                row.className = "bg-info";
                cellPlayer.className = "text-white";
                cellScore.className = "text-white";
            }
        }
    });
}

/**
 * CLICKS LISTENERS
*/
// When click to add unit
$("body").on('click', '#btnClick', function() {
    addUnit(1);
});

// When click to load save
$("body").on('click', '#btnLoadSave', function() {
    load_game();
});

// When click to save game
$("body").on('click', '#btnSaveGame', function() {
    save_game();
});

// When click to save playername
$("#formPlayername").submit(function(event) {
    event.preventDefault();
    Game.Player = $("#inputPlayername").val();
    displayGame();
    load_leaderboard();
    load_game();
});

displayAllGeneators();

// GAME LOOP
setInterval(function() {
    for(var generator in Game.Objects) {
        addUnit(getTotalItemClickPerSec(generator).dividedBy(FPS));
        updateBtnState(generator);
    }
}, LOOP_INTERVAL);

// SAVING GAME EVERY 10 SEC
setInterval(function() {
    if(!getNumberUnit().isZero()) { // On ne sauvegarde pas si le nombre de clique est à 0
        save_game();
    }
}, SAVE_INTERVAL);

// UPDATE PAGE TITLE AND LEADERBOARD
setInterval(function() {
    document.title = formatNumber(getNumberUnitFloor()) + " - CodeClicker";
    load_leaderboard();
}, TITLE_INTERVAL);

// On vérifie que le pseudo a bien été saisie
if(Game.Player == undefined) { // Si pas de pseudo alors on affiche l'interface de saisie
    displayHomePage();
}

// Animation
var anim_interval = 1000;
var do_anim_matrix = function() {
    anim_interval = 1000 - $("#nbClickSec").html();
    if(anim_interval < 1000) { // Si il y a du coup au moins une unité
        if(anim_interval < 10) // On ne descend pas en dessous de 10ms
            anim_interval = 10;
        matrix_animation();
    }
    console.log(anim_interval);
    setTimeout(do_anim_matrix, anim_interval);
}
setTimeout(do_anim_matrix, anim_interval);