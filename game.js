function getDefaultUser() {
	return {
		totPower:new Decimal(0),
		blue: {
			tick:0,
			tickMax:new Decimal(1000),
			mults: [new Decimal(1)],
			limits: [new Decimal(10)],
			buttonPrice: [new Decimal(10)],
			clicked: 0,
			upgrades:       ["CR","CU","LB","BB"],
			upgradeCount:   [new Decimal(0)   ,new Decimal(0)   ,new Decimal(0)   ,new Decimal(0)   ],
			upgradePrices:  [new Decimal(1)   ,new Decimal(1)   ,new Decimal(10)  ,new Decimal(50)  ],
			upgradeIncrease:[new Decimal(10)  ,new Decimal(10)  ,new Decimal(0)   ,new Decimal(50)  ],
			bonuses:        [new Decimal(10)  ,new Decimal(1)   ,new Decimal(0)   ,new Decimal(0)   ],
			addButtonPrice: new Decimal(100),
			index: 1,
			indexLimit: new Decimal(10),
			energy: new Decimal(0),
		},
		green: {
			tick:new Decimal(0),
			tickMax:new Decimal(1000),
			mults: [new Decimal(1)],
			buttonPrice: [new Decimal(10)],
			addButtonPrice: new Decimal(100),
			index: new Decimal(1),
		},
		currentTab: "mainTab",
		lastTick: new Date().getTime(),
	};
}

let user = getDefaultUser();

function update(get, set) {
	document.getElementById(get).innerHTML=set;
}

function gameCycle(){
	let now = new Date().getTime();
	let diff = now - user.lastTick;
	let tickMax = user.blue.tickMax.times(Decimal.pow(user.blue.bonuses[0],user.blue.upgradeCount[0]));
	user.blue.tick = user.blue.tick.plus(diff);
	if(user.blue.tick.lt(user.blue.tickMax)) {
		update("blueCycle", `Reset Cycle: ${user.blue.tick}/${user.blue.tickMax}`);
	}
	else {
		process(Decimal.round(user.blue.tick.div(user.blue.tickMax)));
	}
	user.lastTick = now;
	updateAll();
}

function blueClick(num) {
	let mid=user.blue.bonuses[1].times(user.blue.upgradeCount[1]);
	if(mid.gt(new Decimal(0))){
		user.blue.mults[num-1]=new Decimal(""+mid+user.blue.mults[num-1]);
		if(user.blue.clicked.neq(new Decimal(0))) {
			user.blue.mults[user.blue.clicked-1]=new Decimal(user.blue.mults[user.blue.clicked-1].toString().substring(1));
		}
	}
	user.blue.clicked=num;
}

function process(num) {
	var mult=new Decimal(1);
	user.blue.mults.forEach(function(value) {
		mult = mult.times(value)
	});
	let tot = mult.times(num)
	user.totPower = user.totPower.plus(tot)
	user.blue.tick=0;
}

function checkButtonUpgrade(num) {
	var price=user.blue.buttonPrice[num-1];
	if(user.totPower.gte(price)&&user.blue.limits[num-1].gt(user.blue.mults[num-1])) {
		user.totPower = user.totPower.minus(prize);
		user.blue.mults[num-1] = user.blue.mults[num-1].plus(new Decimal(1));
		user.blue.buttonPrice[num-1] = price.times(new Decimal(2.5));
	}
	updateAll();
}

function checkUpgrade(color, dex) {
	let index = user[color].upgrades.indexOf(dex);
	if(canBuyUpgrade(color, index)){
		user[color].energy = user[color].energy.minus(user[color].upgradePrices[index]);
		user[color].upgradeCount[index] = user[color].upgradeCount[index].plus(1);
		user[color].upgradePrices[index] = user[color].upgradePrices[index].times(user[color].upgradeIncrease[index]);
	}
	updateAll();
}

function canBuyUpgrade(color, index) {
	return user[color].energy.gte(user[color].upgradePrice[index])
}

function checkAddBlue() {
	if(user.blue.index<10){
		if(user.totPower.gte(user.blue.addButtonPrice)){
			user.totPower = user.totPower.minus(user.blue.addButtonPrice)
			user.blue.index++;
			document.getElementById("buttonSet"+user.blue.index).style.display="block";
			user.blue.mults.push(new Decimal(2));
			user.blue.limits.push(new Decimal(10));
			user.blue.buttonPrice.push(display("1e"+user.blue.index));
			user.blue.addButtonPrice=bigMult(user.blue.addButtonPrice,10,1);
		}
	}
	updateAll();
}

function getBluePrestige() {
	if(bigBigger(user.totPower, 1e10)){
		let pow = ""+user.totPower;
		return bigAdd(pow.split("e")[1],9,0);
	}
	else return 0;
}

function blueReset() {
	if(bigBigger(getBluePrestige(),1)){
		let energy = user.blue.energy + getBluePrestige();
		let count = user.blue.upgradeCount;
		let prices = user.blue.upgradePrices;
		user.blue = getDefaultUser().blue;
		user.totPower = 0;
		user.blue.energy = energy;
		user.blue.upgradeCount = count;
		user.blue.upgradePrices = prices;
		updateAll();
	}
}

function showTab(tabName) { //Tab switching function
	var tabs = document.getElementsByClassName('tab');
	var tab;
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.id === tabName) {
			tab.style.display = 'block';
			user.currentTab = tabName;
		}
		else tab.style.display = 'none';
	}
}

function save(){
	localStorage.setItem("colorWheelsSave",JSON.stringify(user));
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
	if(bigBigger(user.blue.energy,1)){
		document.getElementById("blueEnergyArea").style.display = "";
		document.getElementById("blueEnergyAmount").innerHTML = display(user.blue.energy);
	}
	else { document.getElementById("blueEnergyArea").style.display = "none";}
	var mult = 1;
	user.blue.mults.forEach(getMult);
	function getMult(value){
		mult=bigMult(mult,value,1);
	}
	var dispMult = display(mult);
	update("powerMultArea", "Button Mult: x"+dispMult);
	update("blueCycle", "Reset Cycle: "+user.blue.tick+"/"+user.blue.tickMax);
	for(var i=1;i<user.blue.mults.length+1;i++){
		document.getElementById("buttonSet"+i).style.display="block";
		var name = "blueCircle" + i;
		update(name, "x"+user.blue.mults[i-1]);
		var price=user.blue.buttonPrice[i-1];
		update("upgrade"+i, "Upgrade your Blue Button<br/>Cost: "+user.blue.buttonPrice[i-1]+" Power");
		price=display(price);
		let bLButtons = document.getElementsByClassName("breakLimitButton");
		var bLButton;
		for (var j = 0; j < bLButtons.length; j++) {
			bLButton = bLButtons.item(j);
			if (user.blue.upgradeCount[2]>0) {
				bLButton.style.display = 'block';
			}
			else bLButton.style.display = 'none';
		}
		if (bigBigger(user.blue.limits[i-1]-1,user.blue.mults[i-1])) {
			update("upgrade"+i, "Upgrade your Blue Button<br/>Cost: "+price+" Power");
		} else {
			update("upgrade"+i, "Max Multiplier!");
		}	
	}
	for(var i=user.blue.mults.length+1;i<=user.blue.indexLimit;i++){
		document.getElementById("buttonSet"+i).style.display="none";
	}
	var dispAddBluePrice = display(user.blue.addButtonPrice);
	update("addBlueButton", "Add another Blue Button<br/>Cost: "+dispAddBluePrice+" Power");
	for(i=0;i<user.blue.buttonPrice.length;i++){
		if(bigBigger(user.totPower,user.blue.buttonPrice[i])||user.blue.mults[i]==user.blue.limits[1]){
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
	if(user.blue.index>=user.blue.indexLimit) {
		document.getElementById("addBlueButton").style.display = "none";
		document.getElementById("bluePrestigeButton").style.display = "";
	} else {
		document.getElementById("addBlueButton").style.display = "";
		document.getElementById("bluePrestigeButton").style.display = "none";
	}
	document.getElementById("bluePrestigeAmount").innerHTML = getBluePrestige() + " Energy";
	showTab(user.currentTab);
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
