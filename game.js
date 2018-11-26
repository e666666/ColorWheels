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
  update("blueCircle", ""+blueTick+"/"+blueMax);
  var mult=1;
  for(var i=0;i<blueMults.length();i++){
    mult*=blueMults[i];
  }
  if(blueTick>=blueMax) {
    totPower+=mult;
    blueTick=0;
    update("powerAmount", totPower);
    update("blueCircle", "0/"+blueMax);
  }
}

function checkUpgrade1(num) {
  var price=upgrade1Price[num-1];
  if(totPower>price){
    totPower-=price;
    update("powerAmount", totPower);
    blueMults[num-1]=blueMults[num-1]+1;
    price*=2.5
    upgrade1Price[num-1]=price;
    update("upgrade1", "Upgrade your Blue Button<br/>Cost: "+price+" Power");
  }
}

function checkAddBlue() {
  if(totPower>addBluePrice){
    totPower-=price;
    update("powerAmount", totPower);
    if(blueIndex<9){
      blueIndex++;
      document.getElementById("blueButton"+blueIndex).style.visibility="visible";
    }
    blueMults.push(1);
    upgrade1Price.push(100*blueIndex*blueIndex);
  }
}
