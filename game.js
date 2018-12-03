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

function testShorten(){
  var num = prompt("Please enter the number to shorten.");
  num = shorten(num);
  update("testArea",num);
}

function shorten(number) {
  var numSplit = number.split("e");
  if(numSplit.length==1){
    if(number<1000) return number;
    else{
      numSplit[0]=(number/1000.0).toPrecision(3);
      numSplit[1]=3;
    }
  }
  var first = numSplit[0];
  var second = numSplit[1];
  while(first>10){
    numSplit[0]=(first/10.0).toPrecision(3);
    numSplit[1]=numSplit[1]/1.0+1;
  }
  while(first<1.0){
    numSplit[0]=(first*10.0).toPrecision(3);
    numSplit[1]=numSplit[1]/1.0-1;
  }
  return ""+numSplit[0]+"e"+numSplit[1];
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
