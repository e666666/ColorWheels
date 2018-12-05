function shorten(number) {
  if(number==0) return number;
  number = ""+number;
  var numSplit = number.split("e");
  if(numSplit.length==1){
    if(number<1000) return Math.round(number*100)/100;
    else{
      numSplit[0]=Math.round(number)/1000;
      numSplit[1]=3;
    }
  }
  var first = numSplit[0];
  var second = numSplit[1];
  while(first>10){
    numSplit[0]=(first/10.0);
    numSplit[1]=numSplit[1]/1.0+1;
    first/=10.0;
  }
  while(first<1){
    numSplit[0]=(first*10.0);
    numSplit[1]=numSplit[1]/1.0-1;
    first*=10.0;
  };
  if(numSplit[1]<3) return numSplit[0]*Math.pow(10,numSplit[1]);
  return ""+numSplit[0]+"e"+numSplit[1];
}

function display(number){
  if(number==0) return number;
  number = ""+number;
  var numSplit = number.split("e");
  if(numSplit.length==1){
    if(number<1000) return (Math.round(number*100))/100;
    else{
      numSplit[0]=Math.round(number)/1000.0;
      numSplit[1]=3;
    }
  }
  numSplit[0]=numSplit[0].slice(0,3);
  return ""+numSplit[0]+"e"+numSplit[1];
}

function sep(num){
  num=""+num;
  var answer = new Array(2);
  var numSplit = num.split("e");
  answer[0] = numSplit[0];
  if(numSplit.length==1) answer[1] = 0;
  else{ answer[1] = numSplit[1];}
  return answer;
}

function bigAdd(num1, num2, sign){
  num1=shorten(num1);
  num2=shorten(num2);
  var first1 = parseFloat(sep(num1)[0]);
  var second1 = parseFloat(sep(num1)[1]);
  var first2 = parseFloat(sep(num2)[0]);
  var second2 = parseFloat(sep(num2)[1]);
  var answer1 = 0.0;
  var answer2 = 0.0;
  if(second1>second2){
    var diff = second1-second2;
    if(diff>9) return num1;
    else{
      if(sign==1) answer1 = first1*Math.pow(10,diff) + first2;
      else answer1 = first1*Math.pow(10,diff) - first2;
      answer2 = second2;
    }
  }
  else if(second2>second1){
    var diff = second2-second1;
    if(diff>9) return num2;
    else{
      if(sign==1) answer1 = first2*Math.pow(10,diff) + first1;
      else answer1 = first2*Math.pow(10,diff) - first1;
      answer2 = second1;
    }
  }
  else if(second1==second2){
    if(sign==1) answer1 = first1+first2;
    else{
      if(first1>first2) answer1 = first1 - first2;
      else answer1 = first2 - first1;
    }
    answer2 = second1;
  }
  var answer = ""+answer1+"e"+answer2;
  return shorten(answer);
}

function bigMult(num1, num2, sign){
  num1=shorten(num1);
  num2=shorten(num2);
  var first1 = parseFloat(sep(num1)[0]);
  var second1 = parseFloat(sep(num1)[1]);
  var first2 = parseFloat(sep(num2)[0]);
  var second2 = parseFloat(sep(num2)[1]);
  var answer1 = 0;
  var answer2 = 0;
  if(sign==1){
    answer1 = first1*first2;
    answer2 = second1+second2;
  }
  else{
    answer1 = first1/first2;
    answer2 = second1-second2;
  }
  var answer = ""+answer1+"e"+answer2;
  return shorten(answer);
}

function bigBigger(num1,num2){
  num1=shorten(num1);
  num2=shorten(num2);
  var first1 = parseFloat(sep(num1)[0]);
  var second1 = parseFloat(sep(num1)[1]);
  var first2 = parseFloat(sep(num2)[0]);
  var second2 = parseFloat(sep(num2)[1]);
  if(second1>second2) return true;
  else if(second2>second1) return false;
  else if(second1==second2){
    if(first2>first1) return false;
    else return true;
  }
}
