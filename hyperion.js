function shorten(number) {
  alert(number);
  var numSplit = number.split("e");
  if(numSplit.length==1) return number;
  var first = numSplit[0];
  var second = numSplit[1];
  if(first>10){
    numSplit[0]=(first/10.0).toPrecision(3);
    numSplit[1]=numSplit[1]+1;
  }
  if(first<1.0){
    numSplit[0]=(first*10.0).toPrecision(3);
    numSplit[1]=numSplit[1]-1;
  }
  return ""+numSplit[0]+"e"+numSplit[1];
}

function sep(num){
  int[] answer = new int[2];
  var numSplit = num.split("e");
  answer[0] = numSplit[0];
  if(numSplit.length==1) answer[1] = 0;
  else{ answer[1] = numSplit[1];}
  return answer;
}

function bigAdd(num1, num2, sign){
  var first1 = sep(num1)[0];
  var second1 = sep(num1)[1];
  var first2 = sep(num2)[0];
  var second2 = sep(num2)[1];
  var answer1 = 0;
  var answer2 = 0;
  if(second1>second2){
    var diff = second1-second2;
    if(diff>3) return num1;
    else{
      if(sign==1) answer1 = first1*Math.pow(10,diff) + first2;
      else answer1 = first1*Math.pow(10,diff) - first2;
      answer2 = second1;
    }
  }
  else if(second2>second1){
    var diff = second2-second1;
    if(diff>3) return num2;
    else{
      if(sign==1) answer1 = first2*Math.pow(10,diff) + first1;
      else answer1 = first2*Math.pow(10,diff) - first1;
      answer2 = second2;
    }
  }
  else{
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
  var first1 = sep(num1)[0];
  var second1 = sep(num1)[1];
  var first2 = sep(num2)[0];
  var second2 = sep(num2)[1];
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
  return shorten(answer);
}

function bigBigger(num1,num2){
  var first1 = sep(num1)[0];
  var second1 = sep(num1)[1];
  var first2 = sep(num2)[0];
  var second2 = sep(num2)[1];
  if(second1>second2) return true;
  else if(second2>second1) return false;
  else if(second1==second2){
    if(first2>first1) return false;
    else return true;
  }
}
