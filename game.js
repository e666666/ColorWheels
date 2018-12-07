var blueTick: 0,
var blueMax: 1000,
var totPower: 0,
var blueMults: [1],
var upgrade1Price: [10],
var addBluePrice: 100,
var blueIndex: 1,
var lastTick: new Date.getTime()

function getDefaultSave(){
  return{ 
    blueTick: 0,
    blueMax: 1000,
    totPower: 0,
    blueMults: [1],
    upgrade1Price: [10],
    addBluePrice: 100,
    blueIndex: 1,
    lastTick: new Date.getTime()};
}

var user = getDefaultSave();

function update(get, set) {
  document.getElementById(get).innerHTML=set;
}

function testStuff(){
  //var num = prompt("Please enter the numbers to work with. Comma separated.");
  alert(user);
  var nums = num.split(",");
  num = bigMult(nums[0],nums[1],1);
  alert(num);
}

function gameCycle(){
  if(user.blueTick<1000){
    user.blueTick+=10;
    update("blueCycle", "Reset Cycle: "+user.blueTick+"/"+user.blueMax);
    changeButtonOpacity(user.blueTick/10);
  }
  for(i=0;i<user.upgrade1Price.length;i++){
    if(bigBigger(user.totPower,user.upgrade1Price[i])){
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
}

function blueClick() {
  var mult=1;
  if(user.blueTick>=user.blueMax) {
    user.blueMults.forEach(getMult);
    function getMult(value){
      mult=bigMult(mult,value,1);
      //mult*=value;
    }
    user.totPower=bigAdd(user.totPower,mult,1);
    //totPower+=mult;
    user.blueTick=0;
    update("powerAmount", "Total Power: "+display(user.totPower));
    user.blueTick=0;
    update("blueCycle", "Reset Cycle: 0/"+user.blueMax);
  }
}

function changeButtonOpacity(num) {
    var buttons = document.getElementsByClassName("blueButton");
    for(i=0; i<buttons.length; i++) {
      buttons[i].style.opacity = num;
    }
}

function checkUpgrade1(num) {
  var price=user.upgrade1Price[num-1];
  if(bigBigger(user.totPower,price)){
  //if(totPower>price){
    user.totPower=bigAdd(user.totPower,price,0);
    //totPower-=price;
    update("powerAmount", "Total Power: "+display(user.totPower));
    user.blueMults[num-1]=user.blueMults[num-1]+1;
    var name = "blueCircle" + num;
    update(name, "x"+user.blueMults[num-1]);
    price=bigMult(price,2.5,1);
    //price=Math.floor(price*2.5);
    user.upgrade1Price[num-1]=price;
    price=display(price);
    update("upgrade"+num, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
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

function checkAddBlue() {
  if(bigBigger(user.totPower,user.addBluePrice)){
  //if(totPower>addBluePrice){
    user.totPower=bigAdd(user.totPower,user.addBluePrice,0);
    //totPower-=addBluePrice;
    user.blueIndex++;
    update("powerAmount", "Total Power: "+display(user.totPower));
    document.getElementById("buttonSet"+user.blueIndex).style.display="block";
    user.blueMults.push(1);
    user.upgrade1Price.push("1e"+user.blueIndex);
    //upgrade1Price.push(Math.pow(10,blueIndex));
    user.addBluePrice=bigMult(user.addBluePrice,10,1);
    var dispAddBluePrice = display(user.addBluePrice);
    //addBluePrice*=10;
    update("addBlueButton", "Add another Blue Button<br/>Cost: "+dispAddBluePrice+" Power");
  }
}

function save(){
	localStorage.setItem("save",JSON.stringify(user));
}

function load(){
	var save = JSON.parse(localStorage.getItem("save"));
	if(localStorage.getItem("save") !== null) {
		user = convertSave(save,getDefaultSave());
		updateSave()
	}
	return user;
}

function convertSave(obj,obj2) {
	if(typeof obj === "object" && obj !== null && typeof obj2 === "object" && obj2 !== null) {
		for(var i in obj)	obj2[i] = convertSave(obj[i],obj2[i]);
		return obj2;
	} 
  else return obj;
}

function startCycle(){
  setInterval(gameCycle, 10);
}
