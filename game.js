user = {blueTick:0,
	originalTickMax:1000,
	blueTickMax:1000,
	totPower:0,
	blueMults: [1],
	maxMult: 10,
	buttonUpgradePrice: [10],
	addBluePrice: 100,
	addBlueMax: 10,
	blueIndex: 1,
	upgradeCount: [[0,0]],
	upgradePrice: [["1e4","1e6"]],
	poweredButton: 0,
	upgradeDisplayed: false,
	energyPrice: 1+"e"+12,
	energyGainOnNext: 0,
	lastTick: new Date().getTime(),
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
  colorUpgrades();
  checkIfMaxBlueButtons();
  updateEnergyGain();
  updateAll();
}

function updateTick(){
  if(user.blueTick<user.blueTickMax){
    user.blueTick+=10;
    update("blueCycle", "Reset Cycle: "+user.blueTick+"/"+user.blueTickMax);
    changeButtonOpacity(Math.max(200,user.blueTick)/10);
  }
  var perUp = 1;
  for(var i=user.upgradeCount[0][0];i>0;i--) perUp=perUp*0.9;
  user.blueTickMax=bigMult(user.originalTickMax,perUp,1);
}

function colorUpgrades(){
  for(i=0;i<user.buttonUpgradePrice.length;i++){
    if(bigBigger(user.totPower,user.buttonUpgradePrice[i])){
      var j = i+1;
      document.getElementById("upgrade"+j).style.opacity = 1.0;
    }
    else{
      var j = i+1;
      document.getElementById("upgrade"+j).style.opacity = 0.6;
    }
  }
  if(bigBigger(user.totPower,user.addBluePrice)) document.getElementById("addBlueButton").style.opacity = 1.0;
  else document.getElementById("addBlueButton").style.opacity = 0.6;
  if(bigBigger(user.totPower,user.energyPrice)) document.getElementById("energyGainButton").style.opacity = 1.0;
  else document.getElementById("energyGainButton").style.opacity = 0.6;
  if(bigBigger(user.totPower,user.upgradePrice[0][0])) document.getElementById("11upgrade").style.opacity = 1.0;
  else document.getElementById("11upgrade").style.opacity = 0.6;
  if(bigBigger(user.totPower,user.upgradePrice[0][1])) document.getElementById("12upgrade").style.opacity = 1.0;
  else document.getElementById("12upgrade").style.opacity = 0.6;
  updateAll();
}

function checkIfMaxBlueButtons(){
  if(user.blueIndex==user.addBlueMax){
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
  var mult=1;
  if(user.blueTick>=user.blueTickMax) {
    for(var i=0;i<user.blueMults.length;i++){
      var value=0;
      var int=user.upgradeCount[0][1];
      if(i==num-1){
        value=user.blueMults[i]+int;
        update("blueCircle"+num,"x"+value);
      }
      else value=user.blueMults[i];
      mult=bigMult(mult,value,1);
    }
    user.totPower=bigAdd(user.totPower,mult,1);
    //totPower+=mult;
    update("powerAmount", "Total Power: "+display(user.totPower));
    user.blueTick=0;
    update("blueCycle", "Reset Cycle: 0/"+user.blueTickMax);
  }
}

function changeButtonOpacity(num) {
  var buttons = document.getElementsByClassName("blueButton");
  for(i=0; i<buttons.length; i++) {
    buttons[i].style.opacity = num/100;
  }
  var buttons2 = document.getElementsByClassName("blueButtonSmall");
  for(i=0; i<buttons2.length; i++) {
    buttons2[i].style.opacity = num/100;
  }
}

function checkButtonUpgrade(num) {
  var price=user.buttonUpgradePrice[num-1];
  if(bigBigger(user.totPower,price)){
    //if(totPower>price){
    user.totPower=bigAdd(user.totPower,price,0);
    //totPower-=price;
    update("powerAmount", "Total Power: "+display(user.totPower));
    user.blueMults[num-1]=user.blueMults[num-1]+1;
    var name = "blueCircle" + num;
    update(name, "x"+user.blueMults[num-1]);
    if(bigBigger(user.blueMults[num-1],user.maxMult)){
      hide("upgrade"+num);
      document.getElementById("maxUpgrade"+num).style.display="inline";
    }
    else{
      price=bigMult(price,2.5,1);
      //price=Math.floor(price*2.5);
      user.buttonUpgradePrice[num-1]=price;
      price=display(price);
      update("upgrade"+num, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
    }
    var mult = 1;
    user.blueMults.forEach(getMult);
    function getMult(value){
      mult=bigMult(mult,value,1);
      //mult*=value;
    }
    var dispMult = display(mult);
    update("powerMultArea", "Button Mult: x"+dispMult);
  }
}

function checkUpgrade(num1,num2) {
  if(bigBigger(user.totPower,user.upgradePrice[num1-1][num2-1])){
    user.totPower=bigAdd(user.totPower,user.upgradePrice[num1-1][num2-1],0);
    user.upgradeCount[num1-1][num2-1]=user.upgradeCount[num1-1][num2-1]+1;
    user.upgradePrice[num1-1][num2-1]=bigMult(user.upgradePrice[num1-1][num2-1],10,1);
  }
}

function checkAddBlue() {
  if(bigBigger(user.totPower,user.addBluePrice)&&(user.blueIndex<user.addBlueMax)){
  //if(totPower>addBluePrice){
    user.totPower=bigAdd(user.totPower,user.addBluePrice,0);
    //totPower-=addBluePrice;
    user.blueIndex++;
    update("powerAmount", "Total Power: "+display(user.totPower));
    document.getElementById("buttonSet"+user.blueIndex).style.display="block";
    user.blueMults.push(1);
    user.buttonUpgradePrice.push(display("1e"+user.blueIndex));
    //buttonUpgradePrice.push(Math.pow(10,blueIndex));
    user.addBluePrice=bigMult(user.addBluePrice,10,1);
    var dispAddBluePrice = display(user.addBluePrice);
    update("addBlueButton", "Add another Blue Button<br/>Cost: "+dispAddBluePrice+" Power");
  }
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
	if(imp==null) alert("That save doesn't work, sorry.");
	if(imp=="gottagofast") document.getElementById("speedy").style.display="inline";
  else user=JSON.parse(imp);
}

function updateAll(){
  update("powerAmount", "Total Power: "+display(user.totPower));
  var mult = 1;
  user.blueMults.forEach(getMult);
  function getMult(value){
    mult=bigMult(mult,value,1);
  }
  var dispMult = display(mult);
  update("powerMultArea", "Button Mult: x"+dispMult);
  update("blueCycle", "Reset Cycle: "+user.blueTick+"/"+user.blueTickMax);
  if(bigBigger(user.totPower,1e5)) user.upgradeDisplayed = true;
  if(user.upgradeDisplayed) document.getElementById("upgradeSet1").style.display="inline";
  else hide("upgradeSet1");
  var bTM = display(user.blueTickMax);
  if(user.blueTick>user.blueTickMax) user.blueTick=user.blueTickMax;
  var bTM1 = bTM*0.9;
  update("11upgrade", "Decrease Reset Cycle Max<br/>"+bTM+" ms -> "+bTM1+"ms<br/>Cost: "+user.upgradePrice[0][0]+" Power");
  var uCH = display(user.upgradeCount[0][1]);
  var uCH1 = uCH++;
  update("12upgrade", "Increase Click Power<br/>+"+uCH+" Button Mult -> +"+uCH1+" ButtonMult<br/>Cost: "+user.upgradePrice[0][1]+" Power");
  for(var i=1;i<user.blueMults.length+1;i++){
    var name = "blueCircle" + i;
    update(name, "x"+user.blueMults[i-1]);
    var price=user.buttonUpgradePrice[i-1];
    price=display(price);
    update("upgrade"+i, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
    document.getElementById("buttonSet"+i).style.display="block";	
  }
  for(var i=user.blueMults.length+1;i<11;i++){
    document.getElementById("buttonSet"+i).style.display="none";
  }
  for(var i=0;i<user.blueMults.length;i++){
    if(user.blueMults[i]<user.maxMult){
      var j=i+1;
      hide("maxUpgrade"+j);
      document.getElementById("upgrade"+j).style.display="inline";
    }
    else{
      var j=i+1;
      hide("upgrade"+j);
      user.blueMults[i]=user.maxMult;
      update("blueCircle"+j, "x"+user.blueMults[i]);
      document.getElementById("maxUpgrade"+j).style.display="inline";
    }
  }
  var dispAddBluePrice = display(user.addBluePrice);
  update("addBlueButton", "Add another Blue Button<br/>Cost: "+dispAddBluePrice+" Power");
  checkIfMaxBlueButtons();
}

function clearSave(){
  if(confirm("Do you really want to delete your save?\nThis cannot be undone.")){
    user = {blueTick:0,
	originalTickMax:1000,
	blueTickMax:1000,
	totPower:0,
	blueMults: [1],
	maxMult: 10,
	buttonUpgradePrice: [10],
	addBluePrice: 100,
	addBlueMax: 10,
	blueIndex: 1,
	upgradeCount: [[0,0]],
	upgradePrice: [["1e4","1e6"]],
	poweredButton: 0,
	upgradeDisplayed: false,
	energyPrice: 1+"e"+12,
	energyGainOnNext: 0,
	lastTick: new Date().getTime(),
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
