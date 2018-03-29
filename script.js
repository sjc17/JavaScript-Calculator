var displayArray = []; //Limit of 8 digits
var memoryArray = []; //Limit of 22 digits
var twoNumbersInMemory = /(\-?\d+\.?\d*)([\%\*\-\+])(\d+\.?\d*)/;
var elementInMemory = /(\d+\.?\d*|[\%\*\-\+])/g;

function pressNumberButton(num) {
  console.log("pressNumberButton(num): "+num);
  // Replace single 0
  if (displayArray[0] === "0" && displayArray.length === 1) {
    console.log("Running code for display with a single zero");
    displayArray.pop();
    memoryArray.pop();
    if (num === ".") {
      displayArray.push("0");
      memoryArray.push("0");
    }
    displayArray.push(num);
    memoryArray.push(num);
  }
  // Append number
  else if (!isNaN(displayArray.join(''))) {
    console.log("Running code for display that is a number");
    if (num === "." && displayArray.includes(".")) {      
    } 
    else {
      displayArray.push(num);
      memoryArray.push(num);
    }
  }
  // Replace math operation
  else {
    console.log("Running code for display that is not a number");
    displayArray.pop();
    if (num === ".") {
      displayArray.push("0");
      memoryArray.push("0");
    }
    displayArray.push(num);
    memoryArray.push(num);
  }  
  checkLimits();
}

function pressOperationButton(op) {
  if (displayArray.length === 0) {  
  }
  else if (!isNaN(displayArray[0]) || (!isNaN(displayArray[1]) && displayArray[0] === '-')) {
    
    displayArray = [op];
    completeMemoryOperations(op);
  }
  else if (isNaN(displayArray.join(''))) {
    displayArray = [op];
    memoryArray.pop();
    memoryArray.push(op);
  }
  else {
    displayArray = ["What?"];
    memoryArray = [];
  }
  checkLimits();
}

function checkLimits() {
  console.log("checkLimits()");
  console.log("Display: "+displayArray);
  console.log("Memory: "+memoryArray);  
  //document.getElementById("lcd-display").innerHTML = displayArray.join('');
  //document.getElementById("memory-display").innerHTML = memoryArray.join('');
  if (displayArray.length > 8) {
    displayArray = [];
    memoryArray = [];
    document.getElementById("lcd-display").innerHTML = "";
    document.getElementById("memory-display").innerHTML = "Limit reached";
  }
  else if (memoryArray[0] === "DBZ") {
    console.log('div by zero');
    displayArray = [];
    memoryArray = [];
    document.getElementById("lcd-display").innerHTML = '';
    document.getElementById("memory-display").innerHTML = "Divide by zero";
  }
  else {
    document.getElementById("lcd-display").innerHTML = displayArray.join('');
    document.getElementById("memory-display").innerHTML = memoryArray.join('');
  }
}

function completeMemoryOperations(op) {  
  console.log("completeMemoryOperations(op): "+op);
  var memoryString = memoryArray.join('');
  if (twoNumbersInMemory.test(memoryString)) {
    var mathArgs = twoNumbersInMemory.exec(memoryString);
    if (mathArgs[2] === "%" && Number(mathArgs[3]) == 0) {
      document.getElementById("lcd-display").innerHTML = "Display: "+displayArray.join('');
      document.getElementById("memory-display").innerHTML = "Memory: "+memoryArray.join('');
      memoryArray = ['DBZ','DBZ'];
      displayArray = [];
    }
    else {
      var newNum;   
      mathArgs[1] = Number(mathArgs[1]);
      mathArgs[3] = Number(mathArgs[3]);
      switch (mathArgs[2]) {
        case "%":
          newNum = mathArgs[1]/mathArgs[3];
          break;
        case "*":
          newNum = mathArgs[1]*mathArgs[3];
          break;
        case "-":
          newNum = mathArgs[1]-mathArgs[3];
          break;
        case "+":                    
          newNum = mathArgs[1]+mathArgs[3];
          break;
      }
      newNum = Math.round(newNum * 100)/100;
      memoryArray = String(newNum).split('');
      memoryArray.push(op);
    }
  }
  else {
    memoryArray.push(op);
  }
}

function clearAll() {
  displayArray = [];
  memoryArray = [];
  checkLimits();
}

function clearEntry() {  
  var eachElementInMemory;
  var elementArray = [];
  var memString = memoryArray.join('');
  while ((eachElementInMemory = elementInMemory.exec(memString)) !== null) {
    elementArray.push(eachElementInMemory[0]);
  }
  elementArray.pop();
  memoryArray = [];
  elementArray.forEach(function(str) {
    var chars = str.split();
    chars.forEach(function(char) {
      memoryArray.push(char);
    });
  });
  displayArray = [];
  checkLimits();
}

function equals() {
  console.log("equals()");
  if (!isNaN(displayArray[0]) || (displayArray[0] === '-' && !isNaN(displayArray[1]))) {
    completeMemoryOperations();
    memoryArray.pop();
    displayArray = [];
    memoryArray.forEach(function(element) {
      displayArray.push(element);
    });
    checkLimits();
  }
}

//
// Adding functionality to HTML document
//

var numBtns = document.getElementsByClassName("btnNum");
for (i=0,len=numBtns.length;i<len;i++) {
  numBtns.item(i).addEventListener("click", function(event) {   
    pressNumberButton(this.innerHTML);
  });
}

var opBtns = document.getElementsByClassName("btnOp");
for (i=0,len=opBtns.length;i<len;i++) {  
  opBtns.item(i).addEventListener("click", function(event) {
    pressOperationButton(this.innerHTML);
  });
}

document.getElementById("btnAC").addEventListener("click", function(event) {
  clearAll();  
});

document.getElementById("btnCE").addEventListener("click", function(event) {
  clearEntry();
});

document.getElementById("btnEquals").addEventListener("click", function(event) {
  equals();
});

var numbers = ['0','1','2','3','4','5','6','7','8','9','.'];
var operations = ['+','-','*','%','/'];
window.addEventListener("keydown", function(event) {
  if (numbers.includes(event.key)) {    
    pressNumberButton(event.key);
  }
  else if (operations.includes(event.key)) {
    if (event.key === '/') {
      pressOperationButton('%')
    }
    else {
      pressOperationButton(event.key);
    }
  }
  else if (event.key === 'Enter') {
    equals();
  }
  else if (event.key === 'Backspace') {
    clearEntry();
  }
  else if (event.key === 'Escape') {
    clearAll();
  }
});