var blueTick = 0;
var blueMax = 1000;
var totPower = 0;
var blueMults = [1];
var upgrade1Price = [10];
var addBluePrice = 100; 
var blueIndex = 1;

function update(get, set) {
  document.getElementById(get).innerHTML=set;
}

function testStuff(){
  var num = prompt("Please enter the numbers to work with. Comma separated.");
  var nums = num.split(",");
  num = bigMult(nums[0],nums[1],1);
  alert(num);
}

function gameCycle(){
  if(blueTick<1000){
    blueTick+=10;
    update("blueCycle", "Reset Cycle: "+blueTick+"/"+blueMax);
    changeButtonOpacity(blueTick/10);
  }
  for(i=0;i<upgrade1Price.length;i++){
    if(bigBigger(totPower,upgrade1Price[i])){
      var j = i+1;
      document.getElementById("upgrade"+j).style.opacity = 1.0;
    }
    else{
      var j = i+1;
      document.getElementById("upgrade"+j).style.opacity = 0.6;
    }
  }
  if(bigBigger(totPower,addBluePrice)) document.getElementById("addBlueButton").style.opacity = 1.0;
  else document.getElementById("addBlueButton").style.opacity = 0.6;
}

function blueClick() {
  var mult=1;
  if(blueTick>=blueMax) {
    blueMults.forEach(getMult);
    function getMult(value){
      mult=bigMult(mult,value,1);
      //mult*=value;
    }
    totPower=bigAdd(totPower,mult,1);
    //totPower+=mult;
    blueTick=0;
    update("powerAmount", "Total Power: "+display(totPower));
    blueTick=0;
    update("blueCycle", "Reset Cycle: 0/"+blueMax);
  }
}

function changeButtonOpacity(num) {
    var buttons = document.getElementsByClassName("blueButton");
    for(i=0; i<buttons.length; i++) {
      buttons[i].style.opacity = num;
    }
}

function checkUpgrade1(num) {
  var price=upgrade1Price[num-1];
  if(bigBigger(totPower,price)){
  //if(totPower>price){
    totPower=bigAdd(totPower,price,0);
    //totPower-=price;
    update("powerAmount", "Total Power: "+display(totPower));
    blueMults[num-1]=blueMults[num-1]+1;
    var name = "blueCircle" + num;
    update(name, "x"+blueMults[num-1]);
    price=bigMult(price,2.5,1);
    //price=Math.floor(price*2.5);
    upgrade1Price[num-1]=price;
    price=display(price);
    update("upgrade"+num, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
    var mult = 1;
    blueMults.forEach(getMult);
    function getMult(value){
      mult=bigMult(mult,value,1);
      //mult*=value;
    }
    var dispMult = display(mult);
    update("powerMultArea", "Button Mult: x"+dispMult);
  }
}

function checkAddBlue() {
  if(bigBigger(totPower,addBluePrice)){
  //if(totPower>addBluePrice){
    totPower=bigAdd(totPower,addBluePrice,0);
    //totPower-=addBluePrice;
    blueIndex++;
    update("powerAmount", "Total Power: "+display(totPower));
    document.getElementById("buttonSet"+blueIndex).style.display="block";
    blueMults.push(1);
    upgrade1Price.push("1e"+blueIndex);
    //upgrade1Price.push(Math.pow(10,blueIndex));
    addBluePrice=bigMult(addBluePrice,10,1);
    var dispAddBluePrice = display(addBluePrice);
    //addBluePrice*=10;
    update("addBlueButton", "Add another Blue Button<br/>Cost: "+dispAddBluePrice+" Power");
  }
}

function startCycle(){
  setInterval(gameCycle, 10);
}
