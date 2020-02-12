$(document).ready(function() {
    /*__________________GENERAL__________________*/
    var feedback = "";
    /*__________________TOTAL RESOURCES__________________*/
    var total_wood = 20;
    var total_gold = 200;
    var total_stone = 10;
    var total_iron = 5;
    var total_food = 100;
    var total_population = 5;
    var total_faith = 2;
    /*__________________RESOURCES PRICE__________________*/
    var woodPrice = 10;
    var foodPrice = 10;
    var stonePrice = 20;
    /*__________________RESORCES QUANTITY__________________*/
    var woodGoods = 20;
    var foodGoods = 15;
    var stoneGoods = 10;
    /*__________________GENERAL CONSUMATIONS__________________*/
    var pop_food_consumation = 2; //consumo X * cittadino
    
    /*__________________ACTIONS AND DAYS__________________*/
    var actions = 4;
    var day = 0;
    /*__________________BUILDING UPDATE PRICE__________________*/
    var houses_update_price = 50;
    var farms_update_price = 150;
    var woodcutter_update_food_price = 150;
    var woodcutter_update_stone_price = 50;
    var stone_mine_update_price = 300;
    var iron_mine_update_price = 350;
    var castle_update_price = 500;
    /*__________________BUILDING LEVELS__________________*/
    var houses_level = 1;
    var farms_level = 1;
    var woodcutter_level = 1;
    var stone_mine_level = 1;
    var iron_mine_level = 1;
    var castle_level = 1;
    /*__________________BUILDING MAX LEVELS__________________*/
    var max_houses_level = 10;
    var max_farms_level = 10;
    var max_woodcutter_level = 10;
    var max_stone_mine_level = 10;
    var max_iron_mine_level = 10;
    var max_castle_level = 10;
    /*__________________UPDATES FROM CARDS__________________*/
    var dailyPopolationIncome = 1;
    var dailyFoodIncome = 15;
    var dailyWoodIncome = 100;
    var dailyStoneIncome = 20;
    var dailyIronIncome = 10;
    var dailyGoldIncome = total_population * 1;

    //alert('Wood: ' + total_wood + ' | ' + 'Gold: ' + total_gold + ' | ' + 'Stone: ' + total_stone + ' | ' + 'Food: ' + total_food);

    function goldFeedback(guadagnoPerdita, gold, action){
        var temp_feedback = " ";
				var action_time = "Day: " + day + " | "  +
													"Action: " + actions + " | " ;
        if(guadagnoPerdita == 1 ){
            temp_feedback = action_time + "You spent " + gold + " " + action + "<br>";
            feedback += temp_feedback;
            $('.feedback').html(feedback);
        } else if(guadagnoPerdita == 2) {
            temp_feedback = action_time + "You earned " + gold + " from" + action + "<br>";
            feedback += temp_feedback;
            $('.feedback').html(feedback);
        }
    };

    function isGoldEnough(cost){
			if(total_gold >= cost) {
				var possibleCost = total_gold - cost; //gold dopo l'acquisto
					if(possibleCost < woodPrice) {
						$('#buy_Wood').attr("disabled", "disabled");
					} else {
						$('#buy_Wood').removeAttr("disabled");
					}
					if(possibleCost < foodPrice) {
						$('#buy_Food').attr("disabled", "disabled");
					} else {
						$('#buy_Food').removeAttr("disabled");
					}
					if(possibleCost < stonePrice) {
						$('#buy_Stone').attr("disabled", "disabled");
					} else {
						$('#buy_Stone').removeAttr("disabled");
					}
		        return true;
			} else {
		        return false;
			}
		};

    function useGold(resource) {
        switch(resource) {
            case 'wood':
                if(isGoldEnough(woodPrice)){
                    total_wood += woodGoods;
                    total_gold -= woodPrice;
                    $('#wood_Res').html(total_wood);
                    $('#gold_Res').html(total_gold);
                    goldFeedback(1, woodPrice, 'buying wood');
                }
                break;

            case 'food':
                if(isGoldEnough(foodPrice)){
                    total_food += foodGoods;
                    total_gold -= foodPrice;
                    $('#food_Res').html(total_food);
                    $('#gold_Res').html(total_gold);
                    goldFeedback(1, foodPrice, 'buying wood');
                }
                break;

            case 'stone':
                if(isGoldEnough(stonePrice)){
                    total_stone += stoneGoods;
                    total_gold -= stonePrice;
                    $('#stone_Res').html(total_stone);
                    $('#gold_Res').html(total_gold);
                    goldFeedback(1, stonePrice, 'buying stone');
                }
                break;
        }
    };

    function doAnAction(action_number){
        if(actions >= action_number){
            actions -= action_number;
            if(actions == 0){ //finito un giorno
                dailyEvents();
                actions = 4;
                day += 1;
                $('.actions').html('<b>Actions: </b> ' + actions);
                $('.day').html('<b>Days:</b> ' + day);
            }
        }
        $('.actions').html(' <b>Actions: </b> ' + actions);

    };

    function dailyEvents() {
        victory();
        var income = total_population *= dailyPopolationIncome;
        total_gold += income;
        total_gold += dailyGoldIncome;
        $('#gold_Res').html(total_gold);
        total_food += dailyFoodIncome;
        var FoodEatenFromPopulation = total_food -= pop_food_consumation * total_population;
        total_wood += dailyWoodIncome;
        total_stone += dailyStoneIncome;
        total_iron += dailyIronIncome;
        $('#food_Res').html(total_food);
        $('#wood_Res').html(total_wood);
        $('#stone_Res').html(total_stone);
        $('#iron_Res').html(total_iron);
        isGoldEnough(0);
        goldFeedback(2, income, " villagers' taxes");
        if((day!=0) && (day!=1) && (day%2 == 0)) {
            feedback = "";
        }
    };

    function update_population() {
        total_population += 15;
        $('#pop_Res').html(total_population);
    };

    function update_houses() { //TODO: feedback spesa altre risorse
        if(total_wood >= houses_update_price) {
            if(houses_level < max_houses_level){
                total_wood -= houses_update_price;
                $('#wood_Res').html(total_wood);
                doAnAction(1);
                houses_level += 1;
                update_population();
                if(houses_level == max_houses_level) {
                    $('#update_house').attr("disabled", "disabled");
                }
                houses_update_price *= 2;
                $('#house_level').html('<b>Level: ' + houses_level + '</b>');
                $('#update_house').html('Update Houses: ' + houses_update_price + ' Wood');
            }
        } else {
            alert('Not enough wood my Lord!');
        }
    };
    
    function update_woodcutter() {
           if((total_food >= woodcutter_update_food_price) && (total_stone >= woodcutter_update_stone_price)) {
            if(woodcutter_level < max_woodcutter_level){
                total_food -= woodcutter_update_food_price;
                total_stone -= woodcutter_update_stone_price;
                $('#food_Res').html(total_food);
                $('#stone_Res').html(total_stone);
                doAnAction(1);
                woodcutter_level += 1;
                dailyWoodIncome += 100;
                if(woodcutter_level == max_woodcutter_level) {
                    $('#update_woodcutter').attr("disabled", "disabled");
                }
                woodcutter_update_food_price *= 2;
                woodcutter_update_stone_price *= 2;
                $('#woodcutter_level').html('<b>Level: ' + woodcutter_level + '</b>');
                $('#update_woodcutter').html('UPDATE - '+ woodcutter_update_food_price  + '<img class="resources_imgs" src="imgs/resources/food.jpg" alt="food">' + woodcutter_update_stone_price +  '<img class="resources_imgs" src="imgs/resources/stone.jpg" alt="stone">');
            }
        } else {
            alert('Not enough resources (wood or stone) my Lord!');
        }
        
    }

    function update_farms() { //TODO: feedback spesa altre risorse
        if(total_wood >= farms_update_price) {
            if(farms_level < max_farms_level){
                total_wood -= farms_update_price;
                $('#wood_Res').html(total_wood);
                doAnAction(1);
                farms_level += 1;
                dailyFoodIncome += 50;
                if(farms_level == max_farms_level) {
                    $('#update_farms').attr("disabled", "disabled");
                }
                farms_update_price *= 2;
                $('#farms_level').html('<b>Level: ' + farms_level + '</b>');
                $('#update_farms').html('Update Farms: ' + farms_update_price + ' Wood');
            }
        } else {
            alert('Not enough wood my Lord!');
        }
    };   
    
    function update_stone_mine() { //TODO: feedback spesa altre risorse
        if(total_wood >= stone_mine_update_price) {
            if(stone_mine_level < max_stone_mine_level){
                total_wood -= stone_mine_update_price;
                $('#wood_Res').html(total_wood);
                doAnAction(1);
                stone_mine_level += 1;
                dailyStoneIncome += 20;
                if(stone_mine_level == max_stone_mine_level) {
                    $('#update_stone_mine').attr("disabled", "disabled");
                }
                stone_mine_update_price *= 2;
                $('#stone_mine_level').html('<b>Level: ' + stone_mine_level + '</b>');
                $('#update_stone_mine').html('Update : ' + stone_mine_update_price + ' Wood');
            }
        } else {
            alert('Not enough wood my Lord!');
        }
    };

    function update_iron_mine() { //TODO: feedback spesa altre risorse
        if(total_wood >= iron_mine_update_price) {
            if(iron_mine_level < max_iron_mine_level){
                total_wood -= iron_mine_update_price;
                $('#wood_Res').html(total_wood);
                doAnAction(1);
                iron_mine_level += 1;
                dailyIronIncome += 20;
                if(iron_mine_level == max_iron_mine_level) {
                    $('#update_iron_mine').attr("disabled", "disabled");
                }
                iron_mine_update_price *= 2;
                $('#iron_mine_level').html('<b>Level: ' + iron_mine_level + '</b>');
                $('#update_iron_mine').html('Update : ' + iron_mine_update_price + ' Wood');
            }
        } else {
            alert('Not enough wood my Lord!');
        }
    };  
    
    function update_castle() { //TODO: feedback spesa altre risorse
        if(total_wood >= castle_update_price) {
            if(castle_level < max_castle_level){
                total_wood -= castle_update_price;
                $('#wood_Res').html(total_wood);
                doAnAction(1);
                castle_level += 1;
                dailyGoldIncome += 100;
                if(castle_level == max_castle_level) {
                    $('#update_castle').attr("disabled", "disabled");
                }
                castle_update_price *= 2;
                $('#castle_level').html('<b>Level: ' + castle_level + '</b>');
                $('#update_castle').html('Update : ' + castle_update_price + ' Wood');
            }
        } else {
            alert('Not enough wood my Lord!');
        }
    };
    
    function victory() {
        if((houses_level == 10) && (farms_level == 10) && (woodcutter_level == 10) && (stone_mine_level == 10) && (iron_mine_level == 10) && (castle_level == 10)) {
            alert("VITTORIA IMPERIALE! COMPLIMENTI, LA TUA CITTA' HA PASSATO LA PROVA DEL TEMPO ED È ORA UN IMPERO!");
        }     
    };
    
    $('#update_house').on('click', function(){
        update_houses();
    });
    
    $('#update_farms').on('click', function(){
        update_farms();
    });
    
    $('#update_woodcutter').on('click', function(){
        update_woodcutter();
    });
    
    $('#update_stone_mine').on('click', function(){
        update_stone_mine();
    });
    
    $('#update_iron_mine').on('click', function(){
        update_iron_mine();
    });
    
    $('#update_castle').on('click', function(){
        update_castle();
    });
    
    $('#buy_Wood').on('click', function(){
        useGold('wood');
        doAnAction(1);
    });

    $('#buy_Food').on('click', function(){
        useGold('food');
        doAnAction(1);
    });

    $('#buy_Stone').on('click', function(){
        useGold('stone');
        doAnAction(1);
    });

    $('#free_gold').on('click', function() {
        total_gold += 1000;
        $('#gold_Res').html(total_gold);
        isGoldEnough(0);
        goldFeedback(2, 1000, " cheating");
    });
});
