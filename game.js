user = {blueTick:0,
            blueMax:10,
            totPower:0,
            blueMults: [1],
            upgrade1Price: [10],
            addBluePrice: 100,
            blueIndex: 1,
            lastTick: new Date().getTime()
};

function update(get, set) {
  document.getElementById(get).innerHTML=set;
  }

function testStuff(){
  console.log(user.lastTick);
}

function gameCycle(){
  if(user.blueTick<1000){
    user.blueTick+=10;
    update("blueCycle", "Reset Cycle: "+user.blueTick+"/"+user.blueMax);
    changeButtonOpacity(Math.max(200,user.blueTick)/10);
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
    updateAll();
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
      buttons[i].style.opacity = num/100;
    }
    var buttons2 = document.getElementsByClassName("blueButtonSmall");
    for(i=0; i<buttons2.length; i++) {
      buttons2[i].style.opacity = num/100;
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
    user.upgrade1Price.push(display("1e"+user.blueIndex));
    //upgrade1Price.push(Math.pow(10,blueIndex));
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
function updateAll(){
	update("powerAmount", "Total Power: "+display(user.totPower));
	var mult = 1;
    	user.blueMults.forEach(getMult);
    	function getMult(value){
      		mult=bigMult(mult,value,1);
    	}
    	var dispMult = display(mult);
	update("powerMultArea", "Button Mult: x"+dispMult);
	update("blueCycle", "Reset Cycle: "+user.blueTick+"/"+user.blueMax);
	for(var i=1;i<user.blueMults.length+1;i++){
	  var name = "blueCircle" + i;
    update(name, "x"+user.blueMults[i-1]);
		var price=user.upgrade1Price[i-1];
    price=display(price);
    update("upgrade"+i, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
    document.getElementById("buttonSet"+i).style.display="block";	
	}
	for(var i=user.blueMults.length+1;i<10;i++){
    		document.getElementById("buttonSet"+i).style.display="none";
	}
	var dispAddBluePrice = display(user.addBluePrice);
    	update("addBlueButton", "Add another Blue Button<br/>Cost: "+dispAddBluePrice+" Power");
}
function clearSave(){
	if(confirm("Do you really want to delete your save?\nThis cannot be undone.")){
		user = {blueTick:0,
            	blueMax:1000,
            	totPower:0,
            	blueMults: [1],
            	upgrade1Price: [10],
            	addBluePrice: 100,
            	blueIndex: 1,
            	lastTick: new Date().getTime()
		};
		updateAll();
		localStorage.clear();
	}
}

function startCycle(){
  load();
  updateAll();
  setInterval(gameCycle, 10);
  setInterval(save, 30000);
}
