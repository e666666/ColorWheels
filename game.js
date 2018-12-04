var blueTick = 0;
var blueMax = 5;
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
  num = bigMult(nums[0],nums[1],0);
  update("testArea",num);
}

function blueClick() {
  blueTick++;
  update("blueCycle", ""+blueTick+"/"+blueMax);
  var mult=1;
  if(blueTick>=blueMax) {
    blueMults.forEach(getMult);
    function getMult(value){
      //mult=bigMult(mult,value,1);
      mult*=value;
    }
    //totPower=bigAdd(totPower,mult,1);
    totPower+=mult;
    blueTick=0;
    update("powerAmount", totPower);
    update("blueCycle", "0/"+blueMax);
  }
}

function checkUpgrade1(num) {
  var price=upgrade1Price[num-1];
  //if(bigBigger(totPower,price)){
  if(totPower>price){
    //bigAdd(totPower,price,0);
    totPower-=price;
    update("powerAmount", totPower);
    blueMults[num-1]=blueMults[num-1]+1;
    var name = "blueCircle" + num;
    update(name, "x"+blueMults[num-1]);
    //price=bigMult(price,2.5,1);
    price=Math.floor(price*2.5);
    upgrade1Price[num-1]=price;
    update("upgrade"+num, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
  }
}

function checkAddBlue() {
  //if(bigBigger(totPower,addBlueprice)){
  if(totPower>addBluePrice){
    //bigAdd(totPower,addBluePrice,0);
    totPower-=addBluePrice;
    blueIndex++;
    update("powerAmount", totPower);
    document.getElementById("buttonSet"+blueIndex).style.display="block";
    blueMults.push(1);
    //upgrade1Price.push("1e"+blueIndex);
    upgrade1Price.push(Math.pow(10,blueIndex));
    //bigMult(addBluePrice,10,1);
    addBluePrice*=10;
    update("addBlueButton", "Add another Blue Button<br/>Cost: "+addBluePrice+" Power");
  }
}
