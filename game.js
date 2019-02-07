function getDefaultUser() {
	return {
		totPower:0,
		blue: {
			tick:0,
			tickMax:1000,
			mults: [1],
			limits: [10],
			buttonPrice: [10],
			upgrades:     ["CR" ,"CU" ,"LB" ],
			upgradeCount: [0    ,0    ,0    ],
			upgradePrices:["1e6","1e7","1e10"],
			upgradeIncrease:[10 , 100 , 10  ],
			addButtonPrice: 100,
			index: 1,
		},
		green: {
			tick:0,
			tickMax:1000,
			mults: [1],
			buttonPrice: [10],
			addButtonPrice: 100,
			index: 1,
		},
		lastTick: new Date().getTime(),
	};
}

let user = getDefaultUser();

function update(get, set) {
	document.getElementById(get).innerHTML=set;
}

function gameCycle(){
	if(user.blue.tick<1000){
		user.blue.tick+=10;
		update("blueCycle", "Reset Cycle: "+user.blue.tick+"/"+user.blue.tickMax);
	}
	blueClick();
	updateAll();
}

function blueClick() {
	var mult=1;
	if(user.blue.tick>=user.blue.tickMax) {
		user.blue.mults.forEach(getMult);
		function getMult(value){
			mult=bigMult(mult,value,1);
		}
		user.totPower=bigAdd(user.totPower,mult,1);
		user.blue.tick=0;
	}
}

function checkButtonUpgrade(num) {
	var price=user.blue.buttonPrice[num-1];
	if(bigBigger(user.totPower,price)&&bigBigger(user.blue.limits[num-1],user.blue.mults[num-1])){
		user.totPower=bigAdd(user.totPower,price,0);
		user.blue.mults[num-1]=user.blue.mults[num-1]+1;
		price=bigMult(price,2.5,1);
		user.blue.buttonPrice[num-1]=price;
	}
	updateAll();
}

function checkUpgrade(color, dex) {
	let index = user[color].upgrades.indexOf(dex);
	if(canBuyUpgrade(color, index)){
		user.totPower = bigAdd(user.totPower, user[color].upgradePrices[index], 0);
		user[color].upgradeCount[index]++;
		user[color].upgradePrices[index] = bigMult(user[color].upgradePrices[index], user[color].upgradeIncrease[index], 1);
	}
	updateAll();
}

function canBuyUpgrade(color, index) {
	if(bigBigger(user.totPower, user[color].upgradePrice[index])) return true;
	else return false;
}

function checkAddBlue() {
	if(user.blue.index<10){
		if(bigBigger(user.totPower,user.blue.addButtonPrice)){
			user.totPower=bigAdd(user.totPower,user.blue.addButtonPrice,0);
			user.blue.index++;
			document.getElementById("buttonSet"+user.blue.index).style.display="block";
			user.blue.mults.push(1);
			user.blue.limits.push(10);
			user.blue.buttonPrice.push(display("1e"+user.blue.index));
			user.blue.addButtonPrice=bigMult(user.blue.addButtonPrice,10,1);
		}
	}
	updateAll();
}

function save(){
	localStorage.setItem("colorWheelsSave",JSON.stringify(user));
	console.log(JSON.stringify(user));
	document.getElementById("savedInfo").style.display="inline";
	function foo() {document.getElementById("savedInfo").style.display="none"}
	setTimeout(foo, 2000);
}

function load(){
	if(localStorage.getItem("colorWheelsSave") !== null) user = JSON.parse(localStorage.getItem("colorWheelsSave"));
	return user;
}

function updateAll(){
	update("powerAmount", "Total Power: "+display(user.totPower));
	var mult = 1;
	user.blue.mults.forEach(getMult);
	function getMult(value){
		mult=bigMult(mult,value,1);
	}
	var dispMult = display(mult);
	update("powerMultArea", "Button Mult: x"+dispMult);
	update("blueCycle", "Reset Cycle: "+user.blue.tick+"/"+user.blue.tickMax);
	for(var i=1;i<user.blue.mults.length+1;i++){
		var name = "blueCircle" + i;
		update(name, "x"+user.blue.mults[i-1]);
		var price=user.blue.buttonPrice[i-1];
		price=display(price);
		if (bigBigger(user.blue.limits[i-1],user.blue.mults[i-1])) {
			update("upgrade"+i, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
		} else {
			update("upgrade"+i, "Max Multiplier!");
		}
		document.getElementById("buttonSet"+i).style.display="block";	
	}
	for(var i=user.blue.mults.length+1;i<10;i++){
		document.getElementById("buttonSet"+i).style.display="none";
	}
	var dispAddBluePrice = display(user.blue.addButtonPrice);
	update("addBlueButton", "Add another Blue Button<br/>Cost: "+dispAddBluePrice+" Power");
	for(i=0;i<user.blue.buttonPrice.length;i++){
		if(bigBigger(user.totPower,user.blue.buttonPrice[i])){
			var j = i+1;
			document.getElementById("upgrade"+j).style.opacity = 1.0;
		}
		else{
			var j = i+1;
			document.getElementById("upgrade"+j).style.opacity = 0.6;
		}
	}
	if(bigBigger(user.totPower,user.blue.addButtonPrice)) document.getElementById("addBlueButton").style.opacity = 1.0;
	else document.getElementById("addBlueButton").style.opacity = 0.6;
}

function clearSave(){
	if(confirm("Do you really want to delete your save?\nThis cannot be undone.")){
		user = getDefaultUser();
		updateAll();
		localStorage.removeItem("colorWheelsSave");
	}
}

function startCycle(){
	load();
	updateAll();
	setInterval(gameCycle, 10);
	setInterval(save, 30000);
}
