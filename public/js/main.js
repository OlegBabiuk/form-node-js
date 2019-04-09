let form = document.forms["singForm"];

//  Animation module
let animation = (function(){

  let input = form.querySelectorAll("input");
  let select = form.querySelector("select");

// Add events
  function addLisener(item) {
    item.addEventListener("keyup", (e) => addClass(e));
    item.addEventListener("focus", (e) => addClassSInput(e));
    item.addEventListener("blur", (e) => checkValue(e));
    item.addEventListener("change", (e) => checkOtherFielda(e));
  }

// Adding a class to a standard input (event keyup)
  function addClass(e) {
    if (e.target.getAttribute("type") === "radio") {
      e.target.closest("fieldset").querySelector("legend").classList.add("active");
      if (e.target.closest("fieldset").querySelector(".invalid")) {
        e.target.closest("fieldset").querySelector(".invalid").classList.remove("invalid");
      }
    } else if (e.target.value) {
        e.target.closest("div").querySelector("label").classList.add("active");
        e.target.classList.remove("invalid");
      } else {e.target.closest("div").querySelector("label").classList.remove("active")
        };
    if (e.target.dataset.validation === "birthday" && !e.target.value) {
      e.target.closest("div").querySelector("label").classList.add("active");
      e.target.style.color = "white";
    }
  }

// Adding a class to a non-standard input (event focus)
  function addClassSInput(e) {
    if (e.target.dataset.validation === "birthday" && !e.target.value) {
      e.target.closest("div").querySelector("label").classList.add("active");
      e.target.style.color = "white";
    }
    e.target.classList.remove("invalid");
  }

// Checks the value of fields to add/кemove class (event blur)
  function checkValue(e) {
    if(!e.target.value) {
      e.target.closest(".form__inputWrapp").querySelector("label").classList.remove("active");
      if (e.target.dataset.validation === "birthday") {
        e.target.style.color = "transparent";
      }
    } else if (e.target.value && e.target.closest(".form__inputWrapp")) {
      e.target.closest(".form__inputWrapp").querySelector("label").classList.add("active")
    }
  }

// Add class for radio button and select (event change)
  function checkOtherFielda(e) {
    if (e.target.getAttribute("type") === "radio") {
      e.target.closest("fieldset").querySelector("legend").classList.add("active");
      if (e.target.closest("fieldset").querySelector(".invalid")) {
        e.target.closest("fieldset").querySelector(".invalid").classList.remove("invalid");
      }
    }
    if (e.target.dataset.validation === "country") {
      e.target.closest(".form__inputWrapp").querySelector("label").classList.add("active");
    }
  }

// Add event for tag select
  addLisener(select);

  return {
    input,
    addLisener
  }

}());

//  Validation module
let validation = (function(){
  
  let arrFields = new Array;
  let mesages = new Object;
  let regExObj = new Object;
  let userInfo = new Object;
  let flag = 0;

  mesages = {
    success: "Validation passed",
    empty: "This field is required",
    email: "Email address is not valid",
    firstName: "Please fill in the field without symbols \" : \', and numbers",
    lastName: "Please fill in the field without symbols \" : \', and numbers",
    password: "Please fill in the field 6 characters or more without symbols \",\'.",
    address: "Please fill in the field without symbols \",\'",
    birthday: "Too young"
  };

// Start validation
  function start() {
    createArrFields(arrFields);
    checkValue(arrFields, regExObj, mesages);
  }

// Creates an array with fields for validation
  function createArrFields(arr) {
    arr.length = 0;
    for (let i = 0; i < form.length; i ++) {
      if (form[i].hasAttribute("data-validation")) {
        arr.push(form[i]);
      }
    }
  }

// Create tooltip element
  function createToltip(item, mesage) {
    let div = document.createElement("div");
    div.className = "tooltip";
    div.textContent = mesage;
    addTooltipItem(item, div);
  }

// add/delete element in page
  function addTooltipItem(targetItem, newItem ) {
    if (targetItem.dataset.validation === "gender") {
      targetItem.closest("fieldset").appendChild(newItem);
      targetItem.classList.add("invalid");
      deleteItem(targetItem.closest("fieldset"));
    } else {
      targetItem.closest("div").appendChild(newItem);
      targetItem.classList.add("invalid");
      deleteItem(targetItem.closest("div"));
    }
    function deleteItem (item) {
      setTimeout(() => {item.querySelector(".tooltip").remove()}, 3000)}
  }

// Checks the value of fields
  function checkValue(arr, regObj, mes) {
    arr.forEach((item) => {
      let nameElement = item.dataset.validation
      if (form.elements[nameElement].value) {
        checkRegEx(item, regObj, mes);
      } else {
        createToltip(item, mes.empty);
        flag = 0;
      }
    })
  }

// Validation value
  function checkRegEx(item, regObj, mes) {

    let dataKey = item.dataset.validation;
    let years = 157688000000;

    regObj = {
      firstName: /^(?:\D{1,}[^':"0-9,]+)$/,
      lastName: /^(?:\D{1,}[^':"0-9,]+)$/,
      email: /(?:\w{2,})@(?:\w{2,})\.(?:\w{1,})[^'":0-9]/,
      password: /^(?:\w{5,}[^'"]+)$/,
      address: /^(?:\D{4,}\s*\w*[^'"]+)$/, 
      birthday: Date.now(),
      country: new RegExp(form.elements[dataKey].value),
      gender: new RegExp(form.elements[dataKey].value)
    }

    if (dataKey === "birthday") {
        if((regObj[dataKey] - Date.parse(form.elements[dataKey].value) > years)) {
          flag++ 
          finish()
        } else {
          createToltip(item, mes[dataKey])
        }
    }
    else if (regObj[dataKey].test(form.elements[dataKey].value)) {
      flag++
      finish()
    } else {
      createToltip(item, mes[dataKey])
    }
  }

// Collect valid data
  function finish() {
    if(flag >= 9) {
      flag = 0
      for (let i = 0; i < form.length; i++) {
        if (form[i].value) {
          userInfo[form[i].name] = form[i].value
        }
      } 
      modalWindow();

      const BASE_URL = 'https://immense-harbor-13774.herokuapp.com/';
      (async () => {
        const rawResponse = await fetch(`${BASE_URL}users`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userInfo),
        });
        const content = await rawResponse.json();

        console.log(content)
      })();
      
      function modalWindow() {
        let div = document.createElement("div");
        div.className = "modalWindow";
        div.textContent = mesages.success;
        form.appendChild(div);
        setTimeout(() => div.remove(), 3000);
      }
    }
  }
  return {
    start,
    userInfo
  }
}());

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validation.start();
})

animation.input.forEach(item => animation.addLisener(item));
