user = {blueTick:0,
	originalTickMax:1000,
	blueTickMax:1000,
	totPower:0,
	//blueMults: [1],
	//maxMult: 10,
	//buttonUpgradePrice: [10],
	//addBluePrice: 100,
	//addBlueMax: 10,
	//blueIndex: 1,
        upgrades: {addButton:{currentBonus:1,price:100,priceIncrease:10,maxButtons:10,id:"Add Blue Button"},
                   buttonUpgrades:{button1:{mult:1,price:10,priceIncrease:10,maxMult:10,id:"blueCircle1Upgrade"},
                                    button2:{mult:1,price:100,priceIncrease:10,maxMult:10,id:"blueCircle2Upgrade"},
                                    button3:{mult:1,price:1e3,priceIncrease:10,maxMult:10,id:"blueCircle3Upgrade"},
                                    button4:{mult:1,price:1e4,priceIncrease:10,maxMult:10,id:"blueCircle4Upgrade"},
                                    button5:{mult:1,price:1e5,priceIncrease:10,maxMult:10,id:"blueCircle5Upgrade"},
                                    button6:{mult:1,price:1e6,priceIncrease:10,maxMult:10,id:"blueCircle6Upgrade"},
                                    button7:{mult:1,price:1e7,priceIncrease:10,maxMult:10,id:"blueCircle7Upgrade"},
                                    button8:{mult:1,price:1e8,priceIncrease:10,maxMult:10,id:"blueCircle8Upgrade"},
                                    button9:{mult:1,price:1e9,priceIncrease:10,maxMult:10,id:"blueCircle9Upgrade"},
                                    button10:{mult:1,price:1e10,priceIncrease:10,maxMult:10,id:"blueCircle10Upgrade"}
                                   },
                   cycleUpgrade:{currentBonus:1000,increase:0.9,price:1e4,priceIncrease:10,id:"Cycle Upgrade"},
                   clickPowerUpgrade:{currentBonus:0,increase:1,price:1e5,priceIncrease:10,poweredButton:0,id:"Click Power Upgrade"},
                   autoButtonCountUpgrade:{currentBonus:1,increase:1,price:1e9,priceIncrease:100,id:"AutoButton Count Upgrade"},
                   autoMultUpgrade:{currentBonus:0.5,increase:0.1,price:1e8,priceIncrease:100,id:"AutoMult Upgrade"},
                   autoCycleUpgrade:{currentBonus:5,increase:-1,price:1e10,priceIncrease:1000,id:"AutoCycle Upgrade"}
                  },
	poweredButton: 0,
	upgradeDisplayed: false,
	autoclickerDisplayed: false,
	energyPrice: 1+"e"+12,
	energyGainOnNext: 0,
	lastTick: new Date().getTime(),
        autoclicker: {lastTick: new Date().getTime(),
                       numButtons: 1,
                       buttonMult: 0.5,
                       cycleCount: 5,
                       timeToNextClick: 5000,
                       active: false,
        },
};

function update(get, set) {
  document.getElementById(get).innerHTML=set;
}

function hide(get){
  document.getElementById(get).style.display="none";
}

function testStuff(){
  console.log(user);
}

function speedUp(){ 
  if(user.originalTickMax==10) user.originalTickMax=1000;
  else user.originalTickMax=user.originalTickMax/10;
}

function gameCycle(){
  updateTick();
  if(user.autoclicker.active) goAutoclicker();
  colorUpgrades();
  checkIfMaxBlueButtons();
  updateEnergyGain();
  updateAll();
}

function updateTick(){
  if(user.blueTick<user.blueTickMax){
    user.blueTick+=10;
    update("blueCycle", "Reset Cycle: "+user.blueTick+"/"+user.blueTickMax);
    changeButtonOpacity(Math.max(0.2,(user.blueTick/user.blueTickMax)));
  }
  user.blueTickMax=user.upgrades.cycleUpgrade.currentBonus;
}

function colorUpgrades(){
  for(var button in user.upgrades){
    if(!(button.hasOwnProperty("price")){
      for(var bbutton in button){
        if(bigBigger(user.totPower,bbutton.price)) document.getElementById(bbutton.id).style.opacity=1.0;
        else document.getElementById(bbutton.id).style.opacity=0.6;
      }
    }
    if(bigBigger(user.totPower,button.price)) document.getElementById(button.id).style.opacity=1.0;
    else document.getElementById(button.id).style.opacity=0.6;
  }
  updateAll();
}

function checkIfMaxBlueButtons(){
  if(user.upgrades.addButton.currentBonus==user.upgrades.addButton.maxButtons){
    hide("addBlueButton");
    if(bigBigger(user.totPower,user.energyPrice)){
      update("energyGainButton", "You've gone as far as you can go.<br/>Reset the game for "+user.energyGainOnNext+" Energy");
    }
    else update("energyGainButton", "You need to go a bit farther.")
    document.getElementById("energyGainButton").style.display="inline";
  }
  else{
    document.getElementById("addBlueButton").style.display="inline"; 
    hide("energyGainButton");
  }
}

function updateEnergyGain(){
  if(bigBigger(1e12, user.totPower)) user.energyGainOnNext = 0;
  else user.energyGainOnNext=bigMult(user.totPower,1e12,0);
}

function blueClick(num) {
  if(num!=user.upgrades.clickPowerUpgrade.poweredButton){
    var int=user.upgrades.clickPowerUpgrade.currentBonus;
    var place=user.upgrades.clickPowerUpgrade.poweredButton-1;
    user.upgrades.buttonUpgrades[place].mult=user.upgrades.buttonUpgrades[place].mult-int;
    user.upgrades.clickPowerUpgrade.poweredButton=num;
    place=user.upgrades.clickPowerUpgrade.poweredButton-1;
    user.upgrades.buttonUpgrades[place].mult=user.upgrades.buttonUpgrades[place]+int;
  }
  var mult=1;
  if(user.blueTick>=user.blueTickMax) {
    for(var button in user.upgrades.buttonUpgrades){
      mult=bigMult(mult,button.mult,1);
    }
    user.totPower=bigAdd(user.totPower,mult,1);
    update("powerAmount", "Total Power: "+display(user.totPower));
    user.blueTick=0;
    update("blueCycle", "Reset Cycle: 0/"+user.blueTickMax);
  }  
}

function changeButtonOpacity(num) {
  var buttons = document.getElementsByClassName("blueButton");
  for(i=0; i<buttons.length; i++) {
    buttons[i].style.opacity = num;
  }
  var buttons2 = document.getElementsByClassName("blueButtonSmall");
  for(i=0; i<buttons2.length; i++) {
    buttons2[i].style.opacity = num;
  }
}

function checkButtonUpgrade(num) {
  var button=user.upgrades.buttonUpgrades[num];
  var price=button.price;
  if(bigBigger(user.totPower,price)){
    user.totPower=bigAdd(user.totPower,price,0);
    update("powerAmount", "Total Power: "+display(user.totPower));
    button.mult=button.mult+1;
    update(button.id, "x"+button.mult);
    if(bigBigger(button.mult,button.maxMult)){
      hide(button.id);
      document.getElementById("maxUpgrade"+num).style.display="inline";
    }
    else{
      price=bigMult(price,2.5,1);
      //price=Math.floor(price*2.5);
      button.price=price;
      price=display(price);
      update(button.id, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
    }
    var mult = 1;
    for(var button in user.upgrades.buttonUpgrades){
      mult=bigMult(mult,button.mult,1);
    }
    var dispMult = display(mult);
    update("powerMultArea", "Button Mult: x"+dispMult);
  }
}

function checkUpgrade(id) {
  user.upgrades.buttonUpgrades[user.upgrades.clickPowerUpgrade.poweredButton].mult=
    user.upgrades.buttonUpgrades[user.upgrades.clickPowerUpgrade.poweredButton].mult-
    user.upgrades.clickPowerUpgrade.currentBonus;
  var upgrade;
  for(var upg in user.upgrades){
    if(upg.hasOwnProperty("id")) if(upg.id==id) upgrade=upg;
  }
  if(bigBigger(user.totPower,upgrade.price)){
    var next;
    if(upgrade.id=="cycleUpgrade"){
      upgrade.currentBonus=upgrade.currentBonus*upgrade.increase;
      next=upgrade.currentBonus*upgrade.increase;
    }
    else{
      upgrade.currentBonus=upgrade.currentBonus+upgrade.increase;
      next=upgrade.currentBonus+upgrade.increase;
    }
    user.totPower=bigAdd(user.totPower,upgrade.price,0);
    upgrade.price=upgrade.price*upgrade.priceIncrease;
  }
  if(upgrade.id=="addBlueButton"){
   update(upgrade.id,"Add another Blue Button<br/>Cost: "+upgrade.price+" Power");
   document.getElementById("buttonSet"+upgrade.currentBonus).style.display="block";
  }
  else update(upgrade.id,""+upgrade.id+"<br/>Current: "+upgrade.currentBonus+
         " -> Next: "+next+"<br/>Cost: "+upgrade.price+" Power");
}

function checkAutoclickPurchase(){
  if(bigBigger(user.totPower,1e5)){
    user.autoclicker.active=true;
    hide("autoclickerPurchaseButton");
    document.getElementById("autoButtonCountUpgrade").style.display="inline";
    document.getElementById("autoMultUpgrade").style.display="inline";
    document.getElementById("autoCycleUpgrade").style.display="inline";
  }
}

function goAutoclicker(){
  user.autoclicker.timeToNextClick=user.autoclicker.timeToNextClick-10;
  if(user.autoclicker.timeToNextClick<10){
    var x=user.upgrades.buttonUpgrades;
    var y=x;
    for(var i=0;i<user.autoclicker.numButtons;i++){
      var elem = 0;
      while(elem==0){
        var first=Math.floor((Math.random()*x.length)+1);
        elem=x[first];
        if(elem!=0) x[first]=0;
      }
      y[first].mult=y[first].mult+user.upgrades.clickPowerUpgrade.currentBonus;
      var mult=1;
      for(var button in y) mult=bigMult(mult,button.mult,1);
      user.totPower=bigAdd(user.totPower,mult,1);
      update("powerAmount", "Total Power: "+display(user.totPower));
      user.blueTick=0;
      update("blueCycle", "Reset Cycle: 0/"+user.blueTickMax);
    }
  }
}      

function updateAutoclicker(){
  user.autoclicker.numButtons=user.upgrades.autoButtonCountUpgrade.currentBonus;
  user.autoclicker.buttonMult=user.upgrades.autoMultUpgrade.currentBonus;
  user.autoclicker.cycleCount=user.upgrades.autoCycleUpgrade.currentBonus;
  user.autoclicker.timeToNextClick=user.autoclicker.cycleCount*user.blueTickMax;
}

function save(){
  localStorage.setItem("save",JSON.stringify(user));
  console.log(JSON.stringify(user));
  document.getElementById("savedInfo").style.display="inline";
  function foo() {document.getElementById("savedInfo").style.display="none"}
  setTimeout(foo, 2000);
}

function load(){
  if(localStorage.getItem("save") !== null) user = JSON.parse(localStorage.getItem("save"));
  return user;
}

function expo(){
  var tempInput = document.createElement("input");
  tempInput.style = "position: absolute; left: -1000px; top: -1000px";
  tempInput.value = JSON.stringify(user);
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  alert("Save copied");
}

function impo(){
  var imp = prompt("Paste your save file here");
  if(imp==null) alert("That save file doesn't work, sorry.");
  if(imp=="gottagofast") document.getElementById("speedy").style.display="inline"
  else user=JSON.parse(imp);
}

function updateAll(){
  if(bigBigger(user.totPower,1e4)) user.upgradeDisplayed = true;
  if(bigBigger(user.totPower,1e5)) user.autoclickerDisplayed = true;
  if(user.upgradeDisplayed) document.getElementById("upgradeSet1").style.display="inline-block";
  else hide("upgradeSet1");
  if(user.autoclickerDisplayed) document.getElementById("autoclickerPurchase").style.display="block";
  else hide("autoclickerPurchase");
  for(var i=user.upgrades.addButton.currentBonus+1;i<user.upgrades.addButton.maxButtons+1;i++){
    document.getElementById("buttonSet"+i).style.display="none";
  }
  checkIfMaxBlueButtons();
  updateAutoclicker();
}

function clearSave(){
  if(confirm("Do you really want to delete your save?\nThis cannot be undone.")){
    user = {blueTick:0,
	originalTickMax:1000,
	blueTickMax:1000,
	totPower:0,
	//blueMults: [1],
	//maxMult: 10,
	//buttonUpgradePrice: [10],
	//addBluePrice: 100,
	//addBlueMax: 10,
	//blueIndex: 1,
        upgrades: {addButton:{currentBonus:1,price:100,priceIncrease:10,maxButtons:10,id:"Add Blue Button"},
                   buttonUpgrades:{button1:{mult:1,price:10,priceIncrease:10,maxMult:10,id:"blueCircle1Upgrade"},
                                    button2:{mult:1,price:100,priceIncrease:10,maxMult:10,id:"blueCircle2Upgrade"},
                                    button3:{mult:1,price:1e3,priceIncrease:10,maxMult:10,id:"blueCircle3Upgrade"},
                                    button4:{mult:1,price:1e4,priceIncrease:10,maxMult:10,id:"blueCircle4Upgrade"},
                                    button5:{mult:1,price:1e5,priceIncrease:10,maxMult:10,id:"blueCircle5Upgrade"},
                                    button6:{mult:1,price:1e6,priceIncrease:10,maxMult:10,id:"blueCircle6Upgrade"},
                                    button7:{mult:1,price:1e7,priceIncrease:10,maxMult:10,id:"blueCircle7Upgrade"},
                                    button8:{mult:1,price:1e8,priceIncrease:10,maxMult:10,id:"blueCircle8Upgrade"},
                                    button9:{mult:1,price:1e9,priceIncrease:10,maxMult:10,id:"blueCircle9Upgrade"},
                                    button10:{mult:1,price:1e10,priceIncrease:10,maxMult:10,id:"blueCircle10Upgrade"}
                                   },
                   cycleUpgrade:{currentBonus:1000,increase:0.9,price:1e4,priceIncrease:10,id:"Cycle Upgrade"},
                   clickPowerUpgrade:{currentBonus:0,increase:1,price:1e5,priceIncrease:10,poweredButton:0,id:"Click Power Upgrade"},
                   autoButtonCountUpgrade:{currentBonus:1,increase:1,price:1e9,priceIncrease:100,id:"AutoButton Count Upgrade"},
                   autoMultUpgrade:{currentBonus:0.5,increase:0.1,price:1e8,priceIncrease:100,id:"AutoMult Upgrade"},
                   autoCycleUpgrade:{currentBonus:5,increase:-1,price:1e10,priceIncrease:1000,id:"AutoCycle Upgrade"}
                  },
	poweredButton: 0,
	upgradeDisplayed: false,
	autoclickerDisplayed: false,
	energyPrice: 1+"e"+12,
	energyGainOnNext: 0,
	lastTick: new Date().getTime(),
        autoclicker: {lastTick: new Date().getTime(),
                       numButtons: 1,
                       buttonMult: 0.5,
                       cycleCount: 5,
                       timeToNextClick: 5000,
                       active: false,
        },
};

    localStorage.clear();
    updateAll();
  }
}

function startCycle(){
  load();
  updateAll();
  setInterval(gameCycle, 10);
  setInterval(save, 30000);
}
