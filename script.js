//define the prices for each item
let price = {
  egg: 30,
  muffin: 350, // blueband
  pancake: 40,
  biscuit: 65,    //bread
  oj: 80,         //milk
  pbj: 50,         //Cabbage
  bologna: 180, //peas
  taco: 800,    //rice
  soup: 30,    //avocado
  water: 70,
  burger: 120,
  pizza: 50,  //sukumawiki
  chicken: 300, // meat
  salad: 120,
  soda: 110,
  icecream: 350,
  flan: 100,  //biscuit
  cookie: 120, //oreo
  cupcake: 150, //tropical sweet
  milkshake: 150 //yorghut
};
// Fetch data from db.json file
function fetchData() {
  fetch('db.json')
      .then(response => response.json())
      .then(data => {
          // Process the retrieved data
          console.log(data);
          // Populate the shopping cart interface with the retrieved data
          populateCart(data.items);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}
function postData(data) {
  fetch('https://project-shopping-cart-1.onrender.com/items', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(newItem => {
      console.log('New item added:', newItem);
      // Handle the response as needed
  })
  .catch(error => {
      console.error('Error posting data:', error);
  });
}

// Example usage:
const newItem = {
  name: 'New Item',
  price: 100,
  image: 'images/new-item.jpg',
  category: 'other'
};

postData(newItem);


// Function to populate the shopping cart interface with item data
function populateCart(items) {
  // Loop through each item and add it to the appropriate category in the UI
  items.forEach(item => {
      addItemToUI(item);
  });
}

// Function to add an item to the UI
function addItemToUI(item) {
  // Create HTML elements for the item
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Ksh ${item.price}</p>
  `;

  // Add click event listener to the item
  itemDiv.addEventListener('click', () => {
      // Call a function to add the item to the shopping cart
      addToCart(item);
  });

  // Append the item to the appropriate category in the UI based on its category
  const categoryDiv = document.getElementById(item.category);
  categoryDiv.appendChild(itemDiv);
}

// Call the fetchData function when the page loads
fetchData();


// Example of using POST method to send data to server
function addToCart(item) {
  // Prepare data to send to the server
  const data = {
      itemId: item.id,
      itemName: item.name,
      itemPrice: item.price
      // Add more item details if needed
  };

  // Perform an AJAX request to send data to the server
  fetch('/api/cart', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      // Handle response from server
      console.log('Item added to cart:', data);
  })
  .catch(error => {
      console.error('Error adding item to cart:', error);
  });
}

// Example usage: Call addToCart function when an item is clicked
const item = {
  id: 'egg',
  name: 'Egg',
  price: 30
};
addToCart(item);



// define categories for each item
var drink = ["oj", "water", "soda", "milkshake"];
var breakfast = ["egg", "muffin", "pancake", "biscuit"];
var lunch = ["pbj", "bologna", "taco", "soup"];
var dinner = ["burger", "pizza", "chicken", "salad"];
var sweet = ["icecream", "flan", "cookie", "cupcake"];


// add each category to an object (used for match individual items to their categories)
 var cats = { drink, breakfast, lunch, dinner, sweet };

/* indicies for items added to category divs
 * e.g. if muffin is added after pancake, muffin will have an index of 1
 */

var drinkIdx = 0;
var breakfastIdx = 0;
var lunchIdx = 0;
var dinnerIdx = 0;
var sweetIdx = 0;


/* sets image attribtes that apply to all images
 * this also saves some clutter in the HTML
 */
function setAttributes() {
  var unassigned = document.getElementsByTagName("img");
  for (i = 0; i < unassigned.length; i++) {
    unassigned[i].onclick = function () { addItem(this); };
    unassigned[i].style.width = "150px";
  }
} setAttributes();

// returns the price of an item based on the image id
function getPrice(obj) {
  var id = obj.id;
  for (i in price) {
    if (i == id) {
      return price[i];
    }
  }
};

// returns the category of an item based on the image id
function getCategory(obj) {
  var id = obj.id;
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
  var total = 0;
  for (i in cats) {
    var div = document.getElementById(i);
    var nodes = div.childNodes;
    for (j = 0; j < nodes.length; j++) {
      total += parseFloat(nodes[j].getAttribute("price"));
    }
  }
  var parseTotal = total.toFixed(2);
  var totalDiv = document.getElementById("total");
  totalDiv.innerHTML = "Total: ksh" + parseTotal;
}

// clears the output of calculatePrice() and replaced it with a non-breaking space
function clearTotal() {
  var div = document.getElementById("total");
  if (div.innerHTML != "") {
    div.innerHTML = "&nbsp";
  }
}

// clears each category div, and resets each category index to 0
function clearList() {
  for (i in cats) {
    var div = document.getElementById(i)
    while (div.hasChildNodes()) {
      var nodes = div.childNodes;
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
  var cat = obj.nextElementSibling.id;
  var div = document.getElementById(cat);
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
  var idx = obj.tabIndex;
  var div = document.getElementById(category);
  var nodes = div.childNodes;
  var itemP = nodes[idx].getAttribute("price");
  var n = itemP / price;
  for (i = 0; i < n - 1; i++) {
    deleteItem(obj, category, price);
  }
}


// adds an item's image into a category div based on the image's id
function addItem(obj) {
  var idx; //used to idicate what position an item is in a column
  var category = getCategory(obj);
  var div = document.getElementById(category);

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
  var stack = false;
  if (idx > 0) {
    var srcImg = 'url("' + obj.src + '")';
    var nodes = document.getElementById(category).childNodes;
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
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class", "fix");
    newDiv.style.backgroundImage = "url(" + obj.src + ")";
    newDiv.style.backgroundSize = "150px 150px";
    newDiv.style.backgroundRepeat = "no-repeat";
    newDiv.setAttribute("price", getPrice(obj));
    newDiv.tabIndex = idx;
    newDiv.onclick = function () { deleteItem(this, category, getPrice(obj)); };

    var text = document.createElement("div");
    text.innerHTML = "x1";
    text.setAttribute("class", "fixed")

    var dollar = document.createElement("div");
    dollar.innerHTML = "ksh" + getPrice(obj).toFixed(2);
    dollar.setAttribute("class", "fixed")

    var inputDiv = document.createElement("div");
    var input = document.createElement("input");
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
    var index;
    for (i = 0; i < div.childNodes.length; i++) {
      if (div.childNodes[i].style.backgroundImage == srcImg) {
        index = i;
      }
    }
    var node = div.childNodes[index];
    var itemP = parseFloat(node.getAttribute("price"));
    var count = node.firstElementChild;
    var num = parseInt(count.innerHTML.substr(1, count.innerHTML.length)) + 1;

    var dollar = count.nextElementSibling;
    var amount = parseFloat(dollar.innerHTML.substr(1, dollar.innerHTML.length));
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
  var idx = obj.tabIndex;
  var div = document.getElementById(category);
  var nodes = div.childNodes;
  var itemP = parseFloat(nodes[idx].getAttribute("price")).toFixed(2);

  if (itemP > price) {
    nodes[idx].setAttribute("price", itemP - price);
    var count = nodes[idx].firstElementChild;
    var dollar = count.nextElementSibling;

    var num = parseInt(count.innerHTML.substr(1, count.innerHTML.length)) - 1;
    var amount = parseFloat(dollar.innerHTML.substr(1, dollar.innerHTML.length));
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