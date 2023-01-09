function initialize(){
    lastCompAct = null;
    gameOver = false;
    playerStats = [];
    compStats = [];
    increaseOrDecrease(playerStats);
    increaseOrDecrease(compStats);
    maxPF = playerStats[3];
    maxCF = compStats[3];
    displayPStat = document.getElementById("playerStats");
    displayPStat.innerHTML = "Strength: " + playerStats[0] + " Cunning: " + 
                              playerStats[1] + " Speed: " + playerStats[2] + " Fatigue: " 
                              + playerStats[3];
    displayCStat = document.getElementById("compStats");
    displayCStat.innerHTML = "Strength: " + compStats[0] + " Cunning: " + 
                              compStats[1] + " Speed: " + compStats[2] + " Fatigue: " 
                              + compStats[3];
}

function increaseOrDecrease(array){
    increaseCounter = 0; 
    for(let i = 0; i < 4; i++){
        if(Math.floor(Math.random()) == 1 && increaseCounter != 2 ){
            increaseCounter++;
            if(i == 3){
                array[i] = 30 + randomNum(6,0);
            }
            else{
                array[i] = 6 + randomNum(1,0);
            }
        }
        else{
            if(i == 3){
                array[i] = 30 - randomNum(6,0)
            }
            else{
                array[i] = 6 + randomNum(1,0);
            }
        }
    }
}

function randomNum(max, min){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function updateStats(){
    if(!gameOver){
        displayPStat = document.getElementById("playerStats");
        displayPStat.innerHTML = "Strength: " + playerStats[0] + " Cunning: " + 
                                playerStats[1] + " Speed: " + playerStats[2] + " Fatigue: " 
                                + playerStats[3];
        displayCStat = document.getElementById("compStats");
        displayCStat.innerHTML = "Strength: " + compStats[0] + " Cunning: " + 
                                compStats[1] + " Speed: " + compStats[2] + " Fatigue: " 
                                + compStats[3];
        if(compStats[3] < 0 || playerStats[3] >= (2 * compStats[3])){
            document.getElementById("finish").style.visibility = "visible";
        }
        else{
            document.getElementById("finish").style.visibility = "hidden";
        }
    }
}

function updateLogs(val1, val2, whichPAct){
    if(!gameOver){
        playerLog = document.getElementById("logOne");
        compLog = document.getElementById("logTwo");
        if(lastCompAct === "defend"){
            compLog.innerHTML = "The enemy blocks for " + val1;
        }
        if(lastCompAct === "attack"){
            compLog.innerHTML = "The enemy attacks for " + val1;
        }
        if(lastCompAct === "coup"){
            compLog.innerHTML = "The enemy tries to finish you for " + val1;
        }
        if(whichPAct === 1){
            playerLog.innerHTML = "The player attacks for " + val2;
        }
        if(whichPAct === 2){
            playerLog.innerHTML = "The player blocks for " + val2;
        }
        if(whichPAct === 3){
            if(!val2){
                playerLog.innerHTML = "The player tries to finish the enemy but fails";
            }
            if(val2){
                playerLog.innerHTML = "The player tries to finish the enemy and succeeds";
            }
        }
    }
}

function playerAction(a){
    if(a == 1){
        compVal = enemyAction(false);
        attackVal = calcAttackVal(playerStats[0], playerStats[1], playerStats[2]);
        if(lastCompAct === "defend"){
            dmgTaken = calcDefendVal(playerStats[2], playerStats[1], false) - compVal
            if(calcDefendVal(playerStats[2], playerStats[1], false) - compVal > 0){
                dmgTaken = 0;
            }
            compStats[3] -= dmgTaken;
        }
        else if (lastCompAct === "attack"){
            dmgTaken = calcDefendVal(playerStats[2], playerStats[1], false) - compVal
            if(calcDefendVal(playerStats[2], playerStats[1], false) - compVal > 0){
                dmgTaken = 0;
            }
            playerStats[3] += dmgTaken;
            compStats[3] -= attackVal;
        }
        else{
            compStats[3] -= attackVal;
        }
        updateLogs(compVal, attackVal, 1);
    }
    else if (a == 2){
        compVal = enemyAction(true);
        defVal = calcDefendVal(playerStats[2], playerStats[1], true);
        if(lastCompAct === "defend"){
            compStats[3] += randomNum(6, 1);
            if(compStats[3] > maxCF){
                compStats[3] = maxCF;
            }
            playerStats[3] += randomNum(6, 1);
            if(playerStats[3] > maxPF){
                playerStats[3] = maxPF;
            }
        }
        else if (lastCompAct === "attack" || lastCompAct === "coup"){
            dmgTaken = defVal - compVal;
            if(defVal > 0){
                dmgTaken = 0;
            }
            playerStats[3] += dmgTaken;
        }
        updateLogs(compVal, defVal, 2);
    }
    else{
        compVal = enemyAction(false);
        isCDefend = false;
        if(lastCompAct === "defend"){
            isCDefend = true;
        }
        if(compStats[3] < 0 || playerStats[3] >= (2 * compStats[3])){
            lethalDMG = playerStats[0] + playerStats[2] - calcDefendVal(compStats[2], compStats[1], isCDefend);
            if(lethalDMG > 1){
                gameOver = true;
            }
        }
        else if (lastCompAct === "attack"){
            playerStats[3] = calcDefendVal(playerStats[2], playerStats[1], false) - compVal;
        }
        updateLogs(compVal, gameOver, 3);
    }
    updateStats();
}

function enemyAction(isPDefend){
    console.log(gameOver);
    if(playerStats[3] < 0 || compStats[3] >= (2 * playerStats[3])){
        lastCompAct = "coup";
        lethalDMG = compStats[0] + compStats[2] - calcDefendVal(playerStats[2], playerStats[1], isPDefend);
        if(lethalDMG > 1){
            gameOver = true;
        }
    }
    randAction = randomNum(2, 1);
    if(randAction == 1){
        lastCompAct = "attack"
        return calcAttackVal(compStats[0], compStats[1], compStats[2]);
    } 
    else{
        lastCompAct = "defend";
        return calcDefendVal(compStats[2], compStats[1], true)
    }
}

function calcDefendVal(Speed, Cunning, isDefend){
    if(isDefend){
        return Speed + Cunning;
    }
    return Speed + randomNum(6, 1);
}

function calcAttackVal(str, spe, cun){
    return (str + spe + cun) / randomNum(3, 1);
}