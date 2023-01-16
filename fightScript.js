function initialize(){
    killSuc = null;
    playerNaturalArmor = 0;
    computerNaturalArmor = 0;
    lastCompAct = null;
    gameOver = false;
    playerStats = [];
    compStats = [];
    
    increaseOrDecrease(playerStats);
    increaseOrDecrease(compStats);

    maxPF = playerStats[3];
    maxCF = compStats[3];

    pSTR = playerStats[0];
    pCUN = playerStats[1];
    pSPE = playerStats[2];
    cSTR = compStats[0];
    cCUN = compStats[1];
    cSPE = compStats[2];

    displayPStat = document.getElementById("playerStats");
    displayPStat.innerHTML = "Strength: " + pSTR + " Cunning: " + 
                              pCUN + " Speed: " + pSPE + " Fatigue: " 
                              + playerStats[3];
    displayCStat = document.getElementById("compStats");
    displayCStat.innerHTML = "Strength: " + cSTR + " Cunning: " + 
                              cCUN + " Speed: " + cCUN + " Fatigue: " 
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
        displayPStat.innerHTML = "Strength: " + pSTR + " Cunning: " + 
                                pCUN + " Speed: " + pSPE + " Fatigue: " 
                                + playerStats[3];
        displayCStat = document.getElementById("compStats");
        displayCStat.innerHTML = "Strength: " + cSTR + " Cunning: " + 
                                cCUN + " Speed: " + cSPE + " Fatigue: " 
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
        }
    }
    if(lastCompAct === "coup" && killSuc){
        compLog.innerHTML = "The enemy lands a finishing blow and kills you";
    }
    else if(lastCompAct === "coup" && !killSuc){
        compLog.innerHTML = "The enemy misses the finishing blow and fails";
    }
    if(whichPAct === 3){
        if(val2){
            playerLog.innerHTML = "The player tries to finish the enemy and succeeds";
        }
    }
}

function playerAction(a){
    playerNaturalArmor = calcDefendVal(pSPE, pCUN, false);
    computerNaturalArmor = calcDefendVal(cSPE, cCUN, false);
    if(a == 1){
        compVal = enemyAction(false);
        attackVal = calcAttackVal(pSTR, pCUN, pSPE);
        if(lastCompAct === "defend"){
            compDmgTaken = attackVal - compVal;
            if(compDmgTaken < 0){
                compDmgTaken = 0;
            }
            compStats[3] -= compDmgTaken;
        }
        else if (lastCompAct === "attack"){
            compVal = compVal - playerNaturalArmor;
            attackVal -= computerNaturalArmor
            if(compVal < 0){
                compVal = 0;
            }
            if(attackVal < 0){
                attackVal = 0;
            }
            console.log(attackVal);
            console.log(compVal);
            playerStats[3] -= compVal;
            compStats[3] -= attackVal;
        }
        else{
            compStats[3] -= attackVal;
        }
        updateLogs(compVal, attackVal, 1);
    }
    else if (a == 2){
        compVal = enemyAction(true);
        defVal = calcDefendVal(pSPE, pCUN, true);
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
            lethalDMG = pSTR + pSPE - calcDefendVal(cSPE, cCUN, isCDefend);
            if(lethalDMG > 1){
                gameOver = true;
            }
        }
        else if (lastCompAct === "attack"){
            playerStats[3] -= calcDefendVal(pSPE, pCUN, false) - compVal;
        }
        console.log(compVal);
        updateLogs(compVal, gameOver, 3);
    }
    updateStats();
}

function enemyAction(isPDefend){
    if(playerStats[3] < 0 || compStats[3] >= (2 * playerStats[3])){
        lastCompAct = "coup";
        lethalDMG = cSTR + cSPE - calcDefendVal(pSPE, pCUN, isPDefend);
        if(lethalDMG > 1){
            gameOver = true;
            killSuc = true;
            return gameOver;
        }
        killsuc = false;
        return false;
    }
    randAction = randomNum(2, 1);
    if(randAction == 1){
        lastCompAct = "attack"
        return calcAttackVal(cSTR, cCUN, cSPE);
    } 
    else{
        lastCompAct = "defend";
        return calcDefendVal(cSPE, cCUN, true)
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