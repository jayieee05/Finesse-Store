// cart.js

// Initialize cart
let cart = [];

// Function to add item to cart
function addToCart(productId, productName, productPrice) {
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }
    
    updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const summaryItems = document.getElementById('summary-items');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTotal = document.getElementById('summary-total');

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });

    cartCount.textContent = totalItems;
    summaryItems.textContent = totalItems;
    summarySubtotal.textContent = `₱${subtotal.toFixed(2)}`;
    
    // Assuming a flat shipping fee
    const shippingFee = subtotal > 100 ? 0 : 10; // Free shipping over ₱100
    summaryShipping.textContent = `₱${shippingFee.toFixed(2)}`;
    summaryTotal.textContent = `₱${(subtotal + shippingFee).toFixed(2)}`;
}

// Event listener for Add to Cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        const productName = this.getAttribute('data-product-name');
        const productPrice = parseFloat(this.getAttribute('data-product-price'));
        
        addToCart(productId, productName, productPrice);
    });
});
