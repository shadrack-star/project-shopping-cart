//define the prices for each item
let price = {
  egg: 30,
  muffin: 100,
  pancake: 40,
  biscuit: 20,
  oj: 150,
  pbj: 200,
  bologna: 200,
  taco: 200,
  soup: 50,
  water: 40,
  burger: 120,
  pizza: 250,
  chicken: 350,
  salad: 60,
  soda: 70,
  icecream: 100,
  flan: 120,
  cookie: 60,
  cupcake: 150,
  milkshake: 300
};

// define categories for each item
let drink = ["oj", "water", "soda", "milkshake"];
let breakfast = ["egg", "muffin", "pancake", "biscuit"];
let lunch = ["pbj", "bologna", "taco", "soup"];
let dinner = ["burger", "pizza", "chicken", "salad"];
let sweet = ["icecream", "flan", "cookie", "cupcake"];


// add each category to an object (used for match individual items to their categories)
 let cats = { drink, breakfast, lunch, dinner, sweet };

/* indicies for items added to category divs
 * e.g. if muffin is added after pancake, muffin will have an index of 1
 */

let drinkIdx = 0;
let breakfastIdx = 0;
let lunchIdx = 0;
let dinnerIdx = 0;
let sweetIdx = 0;


/* sets image attribtes that apply to all images
 * this also saves some clutter in the HTML
 */
function setAttributes() {
  let unassigned = document.getElementsByTagName("img");
  for (i = 0; i < unassigned.length; i++) {
    unassigned[i].onclick = function () { addItem(this); };
    unassigned[i].style.width = "150px";
  }
} setAttributes();

// returns the price of an item based on the image id
function getPrice(obj) {
  let id = obj.id;
  for (i in price) {
    if (i == id) {
      return price[i];
    }
  }
};

// returns the category of an item based on the image id
function getCategory(obj) {
  let id = obj.id;
  for (i in cats) {
    for (j = 0; j < cats[i].length; j++) {
      if (id == cats[i][j]) {
        return i;
      }
    }
  }
};

// calculates the total price for all items in each category div
function calculatePrice() {
  let total = 0;
  for (i in cats) {
    let div = document.getElementById(i);
    let nodes = div.childNodes;
    for (j = 0; j < nodes.length; j++) {
      total += parseFloat(nodes[j].getAttribute("price"));
    }
  }
  let parseTotal = total.toFixed(2);
  let totalDiv = document.getElementById("total");
  totalDiv.innerHTML = "Total: ksh" + parseTotal;
}

// clears the output of calculatePrice() and replaced it with a non-breaking space
function clearTotal() {
  let div = document.getElementById("total");
  if (div.innerHTML != "") {
    div.innerHTML = "&nbsp";
  }
}

// clears each category div, and resets each category index to 0
function clearList() {
  for (i in cats) {
    let div = document.getElementById(i)
    while (div.hasChildNodes()) {
      let nodes = div.childNodes;
      div.removeChild(nodes[0]);
    }
  }
  drinkIdx = 0;
  breakfastIdx = 0;
  lunchIdx = 0;
  dinnerIdx = 0;
  sweetIdx = 0;
  clearTotal();
}

// clears a categories column, resets that index to 0, and clears the total price (if present)
function clearColumn(obj) {
  let cat = obj.nextElementSibling.id;
  let div = document.getElementById(cat);
  while (div.hasChildNodes()) {
    div.removeChild(div.childNodes[0]);
  }
  switch (cat) {
    case "drink":
      if (drinkIdx > 0) {
        clearTotal();
      }
      drinkIdx = 0;
      break;
    case "breakfast":
      if (breakfastIdx > 0) {
        clearTotal();
      }
      breakfastIdx = 0;
      break;
    case "lunch":
      if (lunchIdx > 0) {
        clearTotal();
      }
      lunchIdx = 0;
      break;
    case "dinner":
      if (dinnerIdx > 0) {
        clearTotal();
      }
      dinnerIdx = 0;
      break;
    case "sweet":
      if (sweetIdx > 0) {
        clearTotal();
      }
      sweetIdx = 0;
      break;
  }
}

/* clears the contents of a single cell.
 * because the clear button is overlayed on top of the item's image
 * clicking the button results in two calls
 * 1) clearCell(...) which removes the "stack" of images (really it reduces the price attribute)
 * 2) deleteItem(...) which removes the actual image from the column
 */
function clearCell(obj, category, price) {
  let idx = obj.tabIndex;
  let div = document.getElementById(category);
  let nodes = div.childNodes;
  let itemP = nodes[idx].getAttribute("price");
  let n = itemP / price;
  for (i = 0; i < n - 1; i++) {
    deleteItem(obj, category, price);
  }
}

// adds an item's image into a category div based on the image's id
function addItem(obj) {
  let idx; //used to idicate what position an item is in a column
  let category = getCategory(obj);
  let div = document.getElementById(category);

  switch (category) {
    case "drink":
      idx = drinkIdx;
      break;
    case "breakfast":
      idx = breakfastIdx;
      break;
    case "lunch":
      idx = lunchIdx;
      break;
    case "dinner":
      idx = dinnerIdx;
      break;
    case "sweet":
      idx = sweetIdx;
      break;
  }

  // determines whether next image input is a copy of a previous image
  let stack = false;
  if (idx > 0) {
    let srcImg = 'url("' + obj.src + '")';
    let nodes = document.getElementById(category).childNodes;
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].style.backgroundImage == srcImg) {
        stack = true;
      }
    }
  }

  /* if there are no stacks
   * the image is added to a new div as its background image
   * using backgroun image allows for text overlay
   * new div attributes are set, as well as overlay information
   *
   * if the image is a stack
   * first the images index is retrieved
   * then the overlay information is updated
   */
  if (!stack) {
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "fix");
    newDiv.style.backgroundImage = "url(" + obj.src + ")";
    newDiv.style.backgroundSize = "150px 150px";
    newDiv.style.backgroundRepeat = "no-repeat";
    newDiv.setAttribute("price", getPrice(obj));
    newDiv.tabIndex = idx;
    newDiv.onclick = function () { deleteItem(this, category, getPrice(obj)); };

    let text = document.createElement("div");
    text.innerHTML = "x1";
    text.setAttribute("class", "fixed")

    let dollar = document.createElement("div");
    dollar.innerHTML = "ksh" + getPrice(obj).toFixed(2);
    dollar.setAttribute("class", "fixed")

    let inputDiv = document.createElement("div");
    let input = document.createElement("input");
    input.value = "clear"
    input.type = "button"
    input.onclick = function () { clearCell(newDiv, category, getPrice(obj)); };
    inputDiv.setAttribute("class", "fixer")
    inputDiv.appendChild(input)
    newDiv.appendChild(text);
    newDiv.appendChild(dollar);
    newDiv.appendChild(inputDiv);
    div.appendChild(newDiv);

    switch (category) {
      case "drink":
        drinkIdx++;
        break;
      case "breakfast":
        breakfastIdx++;
        break;
      case "lunch":
        lunchIdx++;
        break;
      case "dinner":
        dinnerIdx++;
        break;
      case "sweet":
        sweetIdx++;
        break;
    }
  } else {
    let index;
    for (i = 0; i < div.childNodes.length; i++) {
      if (div.childNodes[i].style.backgroundImage == srcImg) {
        index = i;
      }
    }
    let node = div.childNodes[index];
    let itemP = parseFloat(node.getAttribute("price"));
    let count = node.firstElementChild;
    let num = parseInt(count.innerHTML.substr(1, count.innerHTML.length)) + 1;

    let dollar = count.nextElementSibling;
    let amount = parseFloat(dollar.innerHTML.substr(1, dollar.innerHTML.length));
    amount += getPrice(obj);

    count.innerHTML = "x" + num;
    dollar.innerHTML = "ksh" + amount.toFixed(2);
    node.setAttribute("price", itemP + getPrice(obj));
  }
  clearTotal();
};


/* detets an item from the column
 * if the item is stacked (i.e. its price attribute is greater than the item price)
 * then the function decrements the price by the item price until the base price remains
 * 
 * if the image is not stacked
 * the function removes the image, decrements the category index,
 * and updates the tabIndex for each image
 */
function deleteItem(obj, category, price) {
  let idx = obj.tabIndex;
  let div = document.getElementById(category);
  let nodes = div.childNodes;
  let itemP = parseFloat(nodes[idx].getAttribute("price")).toFixed(2);

  if (itemP > price) {
    nodes[idx].setAttribute("price", itemP - price);
    let count = nodes[idx].firstElementChild;
    let dollar = count.nextElementSibling;

    let num = parseInt(count.innerHTML.substr(1, count.innerHTML.length)) - 1;
    let amount = parseFloat(dollar.innerHTML.substr(1, dollar.innerHTML.length));
    amount -= price;

    count.innerHTML = "x" + num;
    dollar.innerHTML = "ksh" + amount.toFixed(2);
  } else {
    div.removeChild(nodes[idx])
    for (i = idx; i < nodes.length; i++) {
      nodes[i].tabIndex = i;
    }

    switch (category) {
      case "drink":
        drinkIdx--;
        break;
      case "breakfast":
        breakfastIdx--;
        break;
      case "lunch":
        lunchIdx--;
        break;
      case "dinner":
        dinnerIdx--;
        break;
      case "sweet":
        sweetIdx--;
        break;
    }
  }
  clearTotal();
};