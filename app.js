// Game Data
const gameData = {
  initialBudget: 1000,
  equipment: [
    {"id": "oven", "name": "Professional Oven", "price": 300, "icon": "🔥"},
    {"id": "molds", "name": "Cake Mold Set (3pc)", "price": 45, "icon": "🧁"},
    {"id": "mixer", "name": "Stand Mixer", "price": 200, "icon": "🥄"},
    {"id": "whisk", "name": "Whisk Set", "price": 25, "icon": "🥄"},
    {"id": "cups", "name": "Measuring Cups", "price": 15, "icon": "📏"},
    {"id": "bowls", "name": "Mixing Bowls Set", "price": 35, "icon": "🥣"},
    {"id": "blender", "name": "Hand Blender", "price": 80, "icon": "🔄"},
    {"id": "scale", "name": "Weighing Scale", "price": 40, "icon": "⚖️"},
    {"id": "trays", "name": "Baking Trays", "price": 30, "icon": "🍪"},
    {"id": "racks", "name": "Cooling Racks", "price": 25, "icon": "🌡️"}
  ],
  ingredients: [
    {"id": "flour", "name": "All-purpose Flour (1kg)", "price": 3, "icon": "🌾"},
    {"id": "sugar", "name": "Sugar (1kg)", "price": 2, "icon": "🍯"},
    {"id": "eggs", "name": "Eggs (dozen)", "price": 4, "icon": "🥚"},
    {"id": "butter", "name": "Butter (500g)", "price": 5, "icon": "🧈"},
    {"id": "vanilla", "name": "Vanilla Essence", "price": 8, "icon": "🌿"},
    {"id": "cream", "name": "Cream Cheese", "price": 6, "icon": "🧀"},
    {"id": "chocolate", "name": "Chocolate Slabs", "price": 10, "icon": "🍫"},
    {"id": "cocoa", "name": "Cocoa Powder", "price": 7, "icon": "☕"},
    {"id": "powder", "name": "Baking Powder", "price": 4, "icon": "⚪"},
    {"id": "milk", "name": "Milk (1L)", "price": 3, "icon": "🥛"}
  ],
  orderTypes: [
    {
      "name": "Chocolate Cupcakes",
      "value": [60, 80],
      "ingredients": ["flour", "sugar", "eggs", "butter", "cocoa", "powder", "milk"],
      "icon": "🧁"
    },
    {
      "name": "Vanilla Birthday Cake",
      "value": [120, 180],
      "ingredients": ["flour", "sugar", "eggs", "butter", "vanilla", "cream", "powder", "milk"],
      "icon": "🎂"
    },
    {
      "name": "Chocolate Chip Cookies",
      "value": [45, 65],
      "ingredients": ["flour", "sugar", "eggs", "butter", "chocolate", "powder"],
      "icon": "🍪"
    },
    {
      "name": "Red Velvet Cake",
      "value": [100, 150],
      "ingredients": ["flour", "sugar", "eggs", "butter", "cocoa", "cream", "powder", "milk"],
      "icon": "❤️"
    },
    {
      "name": "Blueberry Muffins",
      "value": [50, 70],
      "ingredients": ["flour", "sugar", "eggs", "butter", "powder", "milk"],
      "icon": "🫐"
    }
  ],
  weeklyCosts: {
    electricity: 50,
    packaging: 30,
    maintenance: 20,
    total: 100
  }
};

// Day names for tracking
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Game State
let gameState = {
  user: null,
  balance: 1000,
  ownedEquipment: [],
  currentDay: 1,
  currentWeek: 1,
  currentDayOfWeek: 0, // 0 = Monday, 6 = Sunday
  setupComplete: false,
  todaysOrders: [],
  completedOrders: [],
  pendingProfits: [], // Orders completed today, waiting for payment
  dailyProfits: 0, // Total pending profits for display
  currentOrder: null,
  selectedIngredients: [],
  totalOrdersCompleted: 0,
  weeklyRevenue: 0
};

// Shopping Cart
let shoppingCart = [];
let currentOrderIngredientCost = 0;

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
  loadGameState();
  initializeGame();
});

// Google Sign-In Handler
function handleCredentialResponse(response) {
  try {
    const responsePayload = decodeJwtResponse(response.credential);
    
    gameState.user = {
      id: responsePayload.sub,
      name: responsePayload.name,
      email: responsePayload.email,
      picture: responsePayload.picture
    };
    
    saveGameState();
    showUserInfo();
    
    if (gameState.setupComplete) {
      showGameScreen();
    } else {
      showSetupScreen();
    }
  } catch (error) {
    console.error('Error handling Google sign-in:', error);
    demoLogin();
  }
}

// Decode JWT Response
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
}

// Demo Login
function demoLogin() {
  gameState.user = {
    id: 'demo-user',
    name: 'Demo Baker',
    email: 'demo@bakery.com',
    picture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGRjY5QjQiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiA0YzEuMTA1IDAgMi40NzEuMzkxIDMuNzUgMS4xNDNDMTcuMDI5IDUuODg1IDE4IDcuMjYgMTggOXY2YzAgMS4xMDUtLjg5NSAyLTIgMkg4Yy0xLjEwNSAwLTItLjg5NS0yLTJWOWMwLTEuNzQuOTcxLTMuMTE1IDIuMjUtMy44NTdDOS41MjkgNC4zOTEgMTAuODk1IDQgMTIgNHptMCAyYy0uNjQ3IDAtMS40MDIuMjM5LTIuMjUuNjQzQzguOTAzIDcuMDQ3IDggNy42NiA4IDl2Nmg4VjljMC0xLjM0LS45MDMtMS45NTMtMS43NS0yLjM1N0MxMy40MDIgNi4yMzkgMTIuNjQ3IDYgMTIgNnoiLz4KPC9zdmc+Cjwvc3ZnPgo='
  };
  
  saveGameState();
  showUserInfo();
  
  if (gameState.setupComplete) {
    showGameScreen();
  } else {
    showSetupScreen();
  }
}

// Show User Info
function showUserInfo() {
  const userAvatars = document.querySelectorAll('#userAvatar, #gameUserAvatar');
  const userNames = document.querySelectorAll('#userName, #gameUserName');
  
  userAvatars.forEach(avatar => {
    avatar.src = gameState.user.picture;
    avatar.alt = gameState.user.name;
  });
  
  userNames.forEach(nameEl => {
    nameEl.textContent = gameState.user.name;
  });
}

// Initialize Game
function initializeGame() {
  if (gameState.user) {
    showUserInfo();
    if (gameState.setupComplete) {
      showGameScreen();
    } else {
      showSetupScreen();
    }
  } else {
    showLoginScreen();
  }
}

// Screen Management
function showLoginScreen() {
  hideAllScreens();
  document.getElementById('loginScreen').classList.add('active');
}

function showSetupScreen() {
  hideAllScreens();
  document.getElementById('setupScreen').classList.add('active');
  updateSetupBalance();
  renderEquipment();
}

function showGameScreen() {
  hideAllScreens();
  document.getElementById('gameScreen').classList.add('active');
  updateGameDisplay();
  generateDailyOrders();
  renderIngredients();
}

function hideAllScreens() {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
}

// Equipment Setup
function renderEquipment() {
  const equipmentGrid = document.getElementById('equipmentGrid');
  equipmentGrid.innerHTML = '';
  
  gameData.equipment.forEach(equipment => {
    const equipmentEl = document.createElement('div');
    equipmentEl.className = 'equipment-item';
    equipmentEl.draggable = true;
    equipmentEl.dataset.equipmentId = equipment.id;
    
    equipmentEl.innerHTML = `
      <div class="equipment-icon">${equipment.icon}</div>
      <div class="equipment-name">${equipment.name}</div>
      <div class="equipment-price">$${equipment.price}</div>
    `;
    
    equipmentEl.addEventListener('dragstart', handleDragStart);
    equipmentEl.addEventListener('dragend', handleDragEnd);
    
    equipmentGrid.appendChild(equipmentEl);
  });
  
  setupDropZone();
}

function setupDropZone() {
  const cartContainer = document.getElementById('cartContainer');
  
  // Remove existing event listeners to prevent duplicates
  cartContainer.removeEventListener('dragover', handleDragOver);
  cartContainer.removeEventListener('drop', handleDrop);
  cartContainer.removeEventListener('dragenter', handleDragEnter);
  cartContainer.removeEventListener('dragleave', handleDragLeave);
  
  // Add event listeners to the container instead of just the drop zone
  cartContainer.addEventListener('dragover', handleDragOver);
  cartContainer.addEventListener('drop', handleDrop);
  cartContainer.addEventListener('dragenter', handleDragEnter);
  cartContainer.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.equipmentId);
  e.target.classList.add('dragging');
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragEnter(e) {
  e.preventDefault();
  const dropZone = document.getElementById('cartDropZone');
  if (dropZone) {
    dropZone.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  // Only remove drag-over class if we're actually leaving the container
  if (!e.currentTarget.contains(e.relatedTarget)) {
    const dropZone = document.getElementById('cartDropZone');
    if (dropZone) {
      dropZone.classList.remove('drag-over');
    }
  }
}

function handleDrop(e) {
  e.preventDefault();
  
  const dropZone = document.getElementById('cartDropZone');
  if (dropZone) {
    dropZone.classList.remove('drag-over');
  }
  
  const equipmentId = e.dataTransfer.getData('text/plain');
  const equipment = gameData.equipment.find(eq => eq.id === equipmentId);
  
  if (equipment && !shoppingCart.find(item => item.id === equipmentId)) {
    shoppingCart.push(equipment);
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  const dropZone = document.getElementById('cartDropZone');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (shoppingCart.length === 0) {
    dropZone.innerHTML = '<p>Drag equipment here to add to cart</p>';
  } else {
    dropZone.innerHTML = `
      <div class="cart-items">
        ${shoppingCart.map(item => `
          <div class="cart-item">
            <span>${item.icon} ${item.name}</span>
            <div>
              <span>$${item.price}</span>
              <button class="remove-btn" onclick="removeFromCart('${item.id}')">&times;</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 16px; padding: 12px; border: 2px dashed var(--game-purple); border-radius: 8px; color: var(--game-purple);">
        <p>Drop more equipment here</p>
      </div>
    `;
  }
  
  const total = shoppingCart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total;
  
  checkoutBtn.disabled = shoppingCart.length === 0 || total > gameState.balance;
  
  // Re-setup drop zone event listeners after updating HTML
  setupDropZone();
}

function removeFromCart(equipmentId) {
  shoppingCart = shoppingCart.filter(item => item.id !== equipmentId);
  updateCartDisplay();
}

function checkoutEquipment() {
  const total = shoppingCart.reduce((sum, item) => sum + item.price, 0);
  
  if (total <= gameState.balance) {
    gameState.balance -= total;
    gameState.ownedEquipment = [...shoppingCart];
    gameState.setupComplete = true;
    shoppingCart = [];
    
    saveGameState();
    showGameScreen();
  }
}

function updateSetupBalance() {
  document.getElementById('setupBalance').textContent = gameState.balance;
}

// Game Screen
function updateGameDisplay() {
  document.getElementById('gameBalance').textContent = gameState.balance;
  document.getElementById('currentDay').textContent = gameState.currentDay;
  document.getElementById('currentWeek').textContent = gameState.currentWeek;
  document.getElementById('currentDayOfWeek').textContent = dayNames[gameState.currentDayOfWeek];
  document.getElementById('pendingProfits').textContent = gameState.dailyProfits;
  
  // Update pending display styling
  const pendingDisplay = document.getElementById('pendingDisplay');
  const endDayBtn = document.getElementById('endDayBtn');
  
  if (gameState.dailyProfits > 0) {
    pendingDisplay.classList.add('has-profits');
    endDayBtn.classList.add('has-pending');
  } else {
    pendingDisplay.classList.remove('has-profits');
    endDayBtn.classList.remove('has-pending');
  }
}

function generateDailyOrders() {
  const numOrders = Math.floor(Math.random() * 4) + 2; // 2-5 orders
  gameState.todaysOrders = [];
  
  for (let i = 0; i < numOrders; i++) {
    const orderType = gameData.orderTypes[Math.floor(Math.random() * gameData.orderTypes.length)];
    const value = Math.floor(Math.random() * (orderType.value[1] - orderType.value[0] + 1)) + orderType.value[0];
    
    gameState.todaysOrders.push({
      id: `order-${gameState.currentDay}-${i}`,
      name: orderType.name,
      value: value,
      ingredients: [...orderType.ingredients],
      icon: orderType.icon,
      completed: false,
      pending: false // New status for completed but not paid
    });
  }
  
  renderOrders();
}

function renderOrders() {
  const ordersGrid = document.getElementById('ordersGrid');
  ordersGrid.innerHTML = '';
  
  gameState.todaysOrders.forEach(order => {
    const orderEl = document.createElement('div');
    let className = 'order-card';
    let clickable = true;
    
    if (order.completed) {
      className += ' completed';
      clickable = false;
    } else if (order.pending) {
      className += ' pending';
      clickable = false;
    }
    
    orderEl.className = className;
    orderEl.onclick = clickable ? () => openOrderModal(order) : null;
    
    let statusText = '';
    if (order.completed) {
      statusText = '<div class="status status--success">✅ Completed & Paid</div>';
    } else if (order.pending) {
      statusText = '<div class="status status--warning">⏳ Payment Pending</div>';
    }
    
    orderEl.innerHTML = `
      <div class="order-icon">${order.icon}</div>
      <div class="order-name">${order.name}</div>
      <div class="order-value">$${order.value}</div>
      ${statusText}
    `;
    
    ordersGrid.appendChild(orderEl);
  });
}

function renderIngredients() {
  const ingredientsGrid = document.getElementById('ingredientsGrid');
  ingredientsGrid.innerHTML = '';
  
  gameData.ingredients.forEach(ingredient => {
    const ingredientEl = document.createElement('div');
    ingredientEl.className = 'ingredient-item';
    ingredientEl.dataset.ingredientId = ingredient.id;
    
    ingredientEl.innerHTML = `
      <div class="ingredient-icon">${ingredient.icon}</div>
      <div class="ingredient-name">${ingredient.name}</div>
      <div class="ingredient-price">$${ingredient.price}</div>
    `;
    
    ingredientsGrid.appendChild(ingredientEl);
  });
}

// Order Modal
function openOrderModal(order) {
  gameState.currentOrder = order;
  gameState.selectedIngredients = [];
  currentOrderIngredientCost = 0;
  
  document.getElementById('modalOrderTitle').textContent = order.name;
  document.getElementById('modalOrderValue').textContent = order.value;
  
  // Show required ingredients
  const ingredientsList = document.getElementById('modalIngredientsList');
  ingredientsList.innerHTML = order.ingredients.map(ingredientId => {
    const ingredient = gameData.ingredients.find(ing => ing.id === ingredientId);
    return `<span class="ingredient-tag">${ingredient.icon} ${ingredient.name}</span>`;
  }).join('');
  
  // Render available ingredients for purchase
  renderModalIngredients(order);
  updateOrderSummary();
  
  document.getElementById('orderModal').classList.remove('hidden');
}

function renderModalIngredients(order) {
  const modalGrid = document.getElementById('modalIngredientsGrid');
  modalGrid.innerHTML = '';
  
  // Only show ingredients required for this order
  order.ingredients.forEach(ingredientId => {
    const ingredient = gameData.ingredients.find(ing => ing.id === ingredientId);
    const ingredientEl = document.createElement('div');
    ingredientEl.className = 'ingredient-item';
    ingredientEl.dataset.ingredientId = ingredient.id;
    ingredientEl.onclick = () => toggleIngredientSelection(ingredient.id);
    
    ingredientEl.innerHTML = `
      <div class="ingredient-icon">${ingredient.icon}</div>
      <div class="ingredient-name">${ingredient.name}</div>
      <div class="ingredient-price">$${ingredient.price}</div>
    `;
    
    modalGrid.appendChild(ingredientEl);
  });
}

function toggleIngredientSelection(ingredientId) {
  const ingredient = gameData.ingredients.find(ing => ing.id === ingredientId);
  const ingredientEl = document.querySelector(`#modalIngredientsGrid [data-ingredient-id="${ingredientId}"]`);
  
  if (gameState.selectedIngredients.includes(ingredientId)) {
    gameState.selectedIngredients = gameState.selectedIngredients.filter(id => id !== ingredientId);
    currentOrderIngredientCost -= ingredient.price;
    ingredientEl.classList.remove('selected');
  } else {
    gameState.selectedIngredients.push(ingredientId);
    currentOrderIngredientCost += ingredient.price;
    ingredientEl.classList.add('selected');
  }
  
  updateOrderSummary();
}

function updateOrderSummary() {
  document.getElementById('ingredientCost').textContent = currentOrderIngredientCost;
  const profit = gameState.currentOrder.value - currentOrderIngredientCost;
  document.getElementById('orderProfit').textContent = profit;
  
  // Check if all required ingredients are selected and player has enough money
  const allIngredientsSelected = gameState.currentOrder.ingredients.every(id => 
    gameState.selectedIngredients.includes(id)
  );
  const canAfford = currentOrderIngredientCost <= gameState.balance;
  
  document.getElementById('fulfillOrderBtn').disabled = !allIngredientsSelected || !canAfford;
}

function fulfillOrder() {
  if (currentOrderIngredientCost <= gameState.balance) {
    // Deduct ingredient cost only - do NOT add order value to balance yet
    gameState.balance -= currentOrderIngredientCost;
    
    const profit = gameState.currentOrder.value - currentOrderIngredientCost;
    
    // Add to pending profits instead of balance
    gameState.pendingProfits.push({
      orderId: gameState.currentOrder.id,
      profit: profit,
      orderValue: gameState.currentOrder.value
    });
    
    // Update daily profits total
    gameState.dailyProfits += profit;
    
    // Mark order as pending (completed but not paid)
    gameState.currentOrder.pending = true;
    gameState.totalOrdersCompleted++;
    
    saveGameState();
    closeOrderModal();
    updateGameDisplay();
    renderOrders();
    
    // Check for game over
    if (gameState.balance < 0) {
      showGameOver();
    }
  }
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.add('hidden');
  gameState.currentOrder = null;
  gameState.selectedIngredients = [];
  currentOrderIngredientCost = 0;
}

// Day Management
function generateNewOrders() {
  generateDailyOrders();
}

function endDay() {
  // Credit all pending profits to balance
  const totalPendingProfits = gameState.dailyProfits;
  const dailyOrdersCompleted = gameState.pendingProfits.length;
  
  // Add pending profits to balance
  gameState.balance += totalPendingProfits;
  
  // Mark all pending orders as completed
  gameState.todaysOrders.forEach(order => {
    if (order.pending) {
      order.completed = true;
      order.pending = false;
      gameState.completedOrders.push(order.id);
    }
  });
  
  // Clear pending profits
  gameState.pendingProfits = [];
  const previousDailyProfits = gameState.dailyProfits;
  gameState.dailyProfits = 0;
  
  // Show end day summary
  showEndDaySummary(dailyOrdersCompleted, previousDailyProfits);
  
  // Increment day and day of week
  gameState.currentDay++;
  gameState.currentDayOfWeek = (gameState.currentDayOfWeek + 1) % 7;
  
  // Check if week is complete (every 7 days)
  if (gameState.currentDay > gameState.currentWeek * 7) {
    gameState.currentWeek++;
    gameState.weeklyRevenue += previousDailyProfits;
    
    // Deduct weekly costs after showing day summary
    setTimeout(() => {
      gameState.balance -= gameData.weeklyCosts.total;
      saveGameState();
      
      // Check for game over after weekly costs
      if (gameState.balance < 0) {
        document.getElementById('endDaySummaryModal').classList.add('hidden');
        showGameOver();
        return;
      }
      
      showWeeklySummary();
    }, 100);
  } else {
    gameState.weeklyRevenue += previousDailyProfits;
  }
  
  saveGameState();
}

function showEndDaySummary(ordersCompleted, profitsEarned) {
  document.getElementById('endDayNumber').textContent = gameState.currentDay;
  document.getElementById('dailyOrdersCompleted').textContent = ordersCompleted;
  document.getElementById('dailyProfitsEarned').textContent = profitsEarned;
  document.getElementById('newBalance').textContent = gameState.balance;
  
  // Fix: Show the next day of the week correctly
  const nextDayIndex = gameState.currentDayOfWeek % 7;
  document.getElementById('nextDayOfWeek').textContent = dayNames[nextDayIndex];
  
  document.getElementById('endDaySummaryModal').classList.remove('hidden');
}

function closeEndDaySummary() {
  document.getElementById('endDaySummaryModal').classList.add('hidden');
  updateGameDisplay();
  generateDailyOrders();
}

function showWeeklySummary() {
  document.getElementById('weekNumber').textContent = gameState.currentWeek - 1;
  document.getElementById('ordersCompleted').textContent = gameState.completedOrders.length;
  document.getElementById('totalRevenue').textContent = gameState.weeklyRevenue;
  
  document.getElementById('weeklySummaryModal').classList.remove('hidden');
}

function closeWeeklySummary() {
  document.getElementById('weeklySummaryModal').classList.add('hidden');
  
  // Reset weekly revenue counter
  gameState.weeklyRevenue = 0;
  saveGameState();
  updateGameDisplay();
  generateDailyOrders();
}

// Game Over
function showGameOver() {
  document.getElementById('finalDays').textContent = gameState.currentDay - 1;
  document.getElementById('finalOrders').textContent = gameState.totalOrdersCompleted;
  document.getElementById('finalBalance').textContent = gameState.balance;
  
  document.getElementById('gameOverModal').classList.remove('hidden');
}

function restartGame() {
  gameState = {
    user: gameState.user, // Keep user info
    balance: 1000,
    ownedEquipment: [],
    currentDay: 1,
    currentWeek: 1,
    currentDayOfWeek: 0, // Start on Monday
    setupComplete: false,
    todaysOrders: [],
    completedOrders: [],
    pendingProfits: [],
    dailyProfits: 0,
    currentOrder: null,
    selectedIngredients: [],
    totalOrdersCompleted: 0,
    weeklyRevenue: 0
  };
  
  shoppingCart = [];
  currentOrderIngredientCost = 0;
  
  saveGameState();
  document.getElementById('gameOverModal').classList.add('hidden');
  showSetupScreen();
}

// Logout
function logout() {
  gameState.user = null;
  saveGameState();
  showLoginScreen();
}

// Save/Load Game State
function saveGameState() {
  try {
    localStorage.setItem('sweetBakeryEmpire', JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

function loadGameState() {
  try {
    const savedState = localStorage.getItem('sweetBakeryEmpire');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      gameState = { ...gameState, ...parsedState };
      
      // Initialize new properties for existing saves
      if (gameState.currentDayOfWeek === undefined) {
        gameState.currentDayOfWeek = (gameState.currentDay - 1) % 7;
      }
      if (gameState.pendingProfits === undefined) {
        gameState.pendingProfits = [];
      }
      if (gameState.dailyProfits === undefined) {
        gameState.dailyProfits = 0;
      }
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }
}

// Initialize drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
  // Prevent default drag behaviors on document
  document.addEventListener('dragover', function(e) {
    e.preventDefault();
  });
  
  document.addEventListener('drop', function(e) {
    e.preventDefault();
  });
});

// Add click handlers for modal close buttons
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal') && !e.target.classList.contains('modal-content')) {
    if (e.target.id === 'orderModal') {
      closeOrderModal();
    } else if (e.target.id === 'weeklySummaryModal') {
      closeWeeklySummary();
    } else if (e.target.id === 'endDaySummaryModal') {
      closeEndDaySummary();
    }
  }
});