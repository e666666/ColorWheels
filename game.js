var blueTick = 0;
var blueMax = 25;
var totPower = 0;
var blueMults = [1];
var upgrade1Price = [10];
var addBluePrice = 100; 
var blueIndex = 0;

function update(get, set) {
  document.getElementById(get).innerHTML=set;
}

function blueClick() {
  blueTick++;
  update("blueCycle", ""+blueTick+"/"+blueMax);
  var mult=1;
  if(blueTick>=blueMax) {
    blueMults.forEach(getMult);
    function getMult(value){
      mult*=value;
    }
    totPower+=mult;
    blueTick=0;
    update("powerAmount", totPower);
    update("blueCycle", "0/"+blueMax);
  }
}

function checkUpgrade1(num) {
  var price=upgrade1Price[num-1];
  if(totPower>=price){
    totPower-=price;
    update("powerAmount", totPower);
    blueMults[num-1]=blueMults[num-1]+1;
    var name = "blueCircle" + num;
    update(name, "x"+blueMults[num-1]);
    price=Math.floor(price*2.5);
    upgrade1Price[num-1]=price;
    update("upgrade"+num, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
  }
}

function checkAddBlue() {
  if(totPower>=addBluePrice){
    totPower-=addBluePrice;
    update("powerAmount", totPower);
    document.getElementById("secondButtonSet").style.display="block";
    blueMults.push(1);
    upgrade1Price.push(100*blueIndex*blueIndex);
    addBluePrice*=10
    update("addBlueButton", "Add another Blue Button<br/>Cost: "+addBluePrice+" Power");
  }
}
