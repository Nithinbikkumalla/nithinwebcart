let cart = {};
let totalPrice = 0;

fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => {
    data.forEach(element => {
        const markup = `
        <div class="card-item">
          <div class="items1">
            <img src="${element.image}" alt="${element.title}">
            <div class="card-body">
              <h5 class="card-title">Name: ${element.title}</h5>
              <h5 class="card-price">Price: ₹${element.price}</h5>
              <button class="add-to-cart" data-id="${element.id}">Add to Cart</button>
            </div>
          </div>
        </div>`;
        
        document.querySelector('.cart-items').insertAdjacentHTML('beforeend', markup);
    });

    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-id');
        addToCart(productId, data);
      });
    });
  })
  .catch(err => console.log(err));

function addToCart(productId, data) {
  const product = data.find(item => item.id == productId);

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 1 };
  } else {
    cart[productId].quantity += 1;
  }

  totalPrice += product.price;
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  const totalAmountEl = document.getElementById('total-amount');
  
  cartItems.innerHTML = ''; 

  for (let itemId in cart) {
    const item = cart[itemId];
    const cartItemMarkup = `
      <li>
        <div class="cart-item-container">
          <img src="${item.image}" alt="Item image" class="cart-item-image">
          <div class="cart-item-details">
            <h6>${item.title}</h6>
            <p>₹${(item.price * item.quantity).toFixed(2)} (x${item.quantity})</p>
            <div class="cart-item-actions">
              <button class="adjust-quantity" onclick="adjustQuantity(${itemId}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="adjust-quantity" onclick="adjustQuantity(${itemId}, 1)">+</button>
              <button class="remove-item" onclick="removeFromCart(${itemId})">Remove</button>
            </div>
          </div>
        </div>
      </li>`;
    cartItems.insertAdjacentHTML('beforeend', cartItemMarkup);
  }

  totalPriceEl.textContent = totalPrice.toFixed(2);
  totalAmountEl.textContent = (totalPrice + 20 - 50 + 10).toFixed(2);
}

function adjustQuantity(itemId, change) {
  if (!cart[itemId]) return;
  cart[itemId].quantity += change;

  if (cart[itemId].quantity <= 0) {
    totalPrice -= cart[itemId].price * (cart[itemId].quantity + 1); // Adjust total price when item removed
    delete cart[itemId];
  } else {
    totalPrice += cart[itemId].price * change;
  }
  
  updateCartDisplay();
}

function removeFromCart(itemId) {
  if (!cart[itemId]) return;
  totalPrice -= cart[itemId].price * cart[itemId].quantity;
  delete cart[itemId];
  updateCartDisplay();
}

document.getElementById('search-button').addEventListener('click', function() {
  const searchQuery = document.getElementById('itemname').value.toLowerCase();
  filterItems(searchQuery);
});

function filterItems(query) {
  const cards = document.querySelectorAll('.card-item');
  cards.forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    if (title.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
