var blueTick = 0;
var blueMax = 25;
var totPower = 0;
var blueMult = 1;

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
  }
}
