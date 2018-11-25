var blueTick = 0;
var blueMax = 25;
var totPower = 0;
var blueMult = 1;
var upgrade1Price = 10;

function update(get, set) {
  document.getElementById(get).innerHTML=set;
}

function blueClick() {
  blueTick++;
  update("blueCircle1", ""+blueTick+"/"+blueMax);
  if(blueTick>=blueMax) {
    totPower+=blueMult;
    blueTick=0;
    update("powerAmount", totPower);
    update("blueCircle1", "0/"+blueMax);
  }
}

function checkUpgrade1() {
  if(totPower>upgrade1Price){
    blueMult++;
    upgrade1Price*=2.5;
    update("upgrade1", "Cost: "+upgrade1Price+" Power");
  }
}
