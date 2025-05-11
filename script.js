document.addEventListener("DOMContentLoaded", function () {
  const loggedIn = localStorage.getItem("loggedin") === "true";
  const accountLink = document.getElementById("account-link");
  const accountName = document.getElementById("account-name");
  const accountDropdown = document.getElementById("account-dropdown");
  const logoutButton = document.getElementById("logout-button");

  if (loggedIn) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedin_user"));
    accountName.textContent = loggedInUser.name.split(" ")[0];
  }

  accountLink.addEventListener("click", function (event) {
    if (loggedIn) {
      event.preventDefault();
      const isDropdownVisible = accountDropdown.style.display === "block";
      accountDropdown.style.display = isDropdownVisible ? "none" : "block";
    } else {
      window.location.href = "login.html";
    }
  });

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedin");
    localStorage.removeItem("loggedin_user");
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
    window.location.href = "login.html"; // Redirect to login page
  });

  document.addEventListener("click", function (event) {
    if (
      !document.getElementById("account-icon-container").contains(event.target)
    ) {
      accountDropdown.style.display = "none";
      accountName.style.display = "inline";
    }
  });
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      this.classList.toggle("active");
    });
  }

  // Sticky Header
  const header = document.querySelector("header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  // Product Thumbnail Gallery
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("main-product-image");

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        // Remove active class from all thumbnails
        thumbnails.forEach((t) => t.classList.remove("active"));

        // Add active class to clicked thumbnail
        this.classList.add("active");

        // Update main image
        const imageUrl = this.getAttribute("data-image");
        mainImage.src = imageUrl;
      });
    });
  }

  // Product Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  if (tabBtns.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons and panes
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabPanes.forEach((p) => p.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Show corresponding tab pane
        const tabId = this.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }

  // Quantity Selector
  const decreaseBtn = document.getElementById("decrease-quantity");
  const increaseBtn = document.getElementById("increase-quantity");
  const quantityInput = document.getElementById("quantity");

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", function () {
      let value = parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
      }
    });

    increaseBtn.addEventListener("click", function () {
      let value = parseInt(quantityInput.value);
      if (value < 10) {
        quantityInput.value = value + 1;
      }
    });
  }

  // Product Options
  const sizeOptions = document.querySelectorAll("#size-options .option-btn");
  const materialOptions = document.querySelectorAll(
    "#material-options .option-btn"
  );

  function setupOptionButtons(buttons) {
    if (buttons.length > 0) {
      buttons.forEach((btn) => {
        btn.addEventListener("click", function () {
          // Remove active class from all buttons in the same group
          buttons.forEach((b) => b.classList.remove("active"));

          // Add active class to clicked button
          this.classList.add("active");
        });
      });
    }
  }

  setupOptionButtons(sizeOptions);
  setupOptionButtons(materialOptions);

  // Add to Cart
  const addToCartBtn = document.getElementById("add-to-cart");

  const courtCount = document.getElementById("cart-count");
  if (courtCount) {
    courtCount.textContent = getCartCount();
  }

  if (courtCount) {
    const cart = getCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    courtCount.textContent = cartCount;
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      if (loggedIn) {
        // Get selected options
        const selectedSize = document.querySelector(
          "#size-options .option-btn.active"
        )?.textContent;
        const selectedMaterial = document.querySelector(
          "#material-options .option-btn.active"
        )?.textContent;
        const quantity = parseInt(document.getElementById("quantity").value);

        // Create cart item object
        const product = {
          name: document.querySelector(".product-info h1").textContent,
          price: parseFloat(
            document
              .querySelector(".product-price")
              .textContent.replace(/[^\d.]/g, "")
          ),
          size: selectedSize,
          material: selectedMaterial,
          quantity: quantity,
          image: document.getElementById("main-product-image").src,
        };

        // Get existing cart or create new one
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Add product to cart
        cart.push(product);

        // Save cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Show confirmation message
        alert("Product added to cart!");
        window.location.reload();
      } else {
        alert("Please log in to add items to your cart.");
        window.location.reload();
      }
    });
  }

  // Function to get cart count
  function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Shop Page Filters
  const categoryFilters = document.querySelectorAll("#category-filters a");
  const materialFilters = document.querySelectorAll("#material-filters a");
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-value");
  const sortSelect = document.getElementById("sort-select");
  const productGrid = document.getElementById("product-grid");

  // Sample product data (in a real application, this would come from a database)
  const products = [
    {
      id: 1,
      name: "Ring Of Leaves",
      price: "₱11,333",
      formattedPrice: "₱11,333",
      category: "rings",
      image: "products/product-1-large.jpg",
    },
    {
      id: 2,
      name: "Simple Chain Ring",
      price: "₱5,666",
      formattedPrice: "₱5,666",
      category: "rings",
      image: "products/product-2-large.jpg",
    },
    {
      id: 3,
      name: "Tiara Ring",
      price: "₱8,500",
      formattedPrice: "₱8,500",
      category: "rings",
      image: "products/product-3-large.jpg",
    },
    {
      id: 4,
      name: "Rose Ring",
      price: "₱5,666",
      formattedPrice: "₱5,666",
      category: "rings",
      image: "products/product-4-large.jpg",
    },
    {
      id: 5,
      name: "Signet Ring",
      price: "₱5,666",
      formattedPrice: "₱5,666",
      category: "rings",
      image: "products/product-5-large.jpg",
    },
    {
      id: 6,
      name: "Ruby Pendant",
      price: "₱14,166",
      formattedPrice: "₱14,166",
      category: "necklaces",
      image: "products/productN1.jpg",
    },
    {
      id: 7,
      name: "Diamond Choker",
      price: "₱17,000",
      formattedPrice: "₱17,000",
      category: "necklaces",
      image: "products/productN2.jpg",
    },
    {
      id: 8,
      name: "Heart Drop",
      price: "₱11,333",
      formattedPrice: "₱11,333",
      category: "necklaces",
      image: "products/productN3.jpg",
    },
    {
      id: 9,
      name: "Initial Pendant",
      price: "₱5,666",
      formattedPrice: "₱5,666",
      category: "necklaces",
      image: "products/productN4.jpg",
    },
    {
      id: 10,
      name: "Leaf Pendant",
      price: "₱5,100",
      formattedPrice: "₱5,100",
      category: "necklaces",
      image: "products/productN5.jpg",
    },
    {
      id: 11,
      name: "Chained Cuff",
      price: "₱11,333",
      formattedPrice: "₱11,333",
      category: "bracelets",
      image: "products/productB1.jpg",
    },
    {
      id: 12,
      name: "Thin Chain",
      price: "₱5,100",
      formattedPrice: "₱5,100",
      category: "bracelets",
      image: "products/productB2.jpg",
    },
    {
      id: 13,
      name: "Leafy Chain",
      price: "₱3,400",
      formattedPrice: "₱3,400",
      category: "bracelets",
      image: "products/productB3.jpg",
    },
    {
      id: 14,
      name: "Flora Chain",
      price: "₱2,266",
      formattedPrice: "₱2,266",
      category: "bracelets",
      image: "products/productB4.jpg",
    },
    {
      id: 15,
      name: "Arrow Cuff",
      price: "₱2,833",
      formattedPrice: "₱2,833",
      category: "bracelets",
      image: "products/productB5.jpg",
    },
    {
      id: 16,
      name: "Diamond Studs",
      price: "₱11,333",
      formattedPrice: "₱11,333",
      category: "earrings",
      image: "products/productE1.jpg",
    },
    {
      id: 17,
      name: "Mini Hoops",
      price: "₱5,100",
      formattedPrice: "₱5,100",
      category: "earrings",
      image: "products/productE2.jpg",
    },
    {
      id: 18,
      name: "Dangling Leaves",
      price: "₱3,400",
      formattedPrice: "₱3,400",
      category: "earrings",
      image: "products/productE3.jpg",
    },
    {
      id: 19,
      name: "Leaf Studs",
      price: "₱2,266",
      formattedPrice: "₱2,266",
      category: "earrings",
      image: "products/productE4.jpg",
    },
    {
      id: 20,
      name: "Chain Drops",
      price: "₱2,266",
      formattedPrice: "₱2,266",
      category: "earrings",
      image: "products/productE5.jpg",
    },
  ];

  // Filter state
  let filters = {
    category: "all",
    material: "all",
    maxPrice: 20000,
    sort: "featured",
  };

  // Current page for pagination
  let currentPage = 1;
  const productsPerPage = 8;

  // Function to render products based on filters
  function renderProducts() {
    if (!productGrid) return;

    // Filter products
    let filteredProducts = products.filter((product) => {
      // Category filter
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }

      // Material filter
      if (filters.material !== "all" && product.material !== filters.material) {
        return false;
      }

      // Price filter
      if (product.price > filters.maxPrice) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (filters.sort) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured - no sorting needed
        break;
    }

    // Update product count
    const productCount = document.getElementById("product-count");
    if (productCount) {
      productCount.textContent = filteredProducts.length;
    }

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

    // Update pagination UI
    updatePagination(totalPages);

    // Clear product grid
    productGrid.innerHTML = "";

    // Render products
    paginatedProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <a href="product${product.id}.html" class="btn-secondary">View Details</a>
            `;

      productGrid.appendChild(productCard);
    });
  }

  // Function to update pagination UI
  function updatePagination(totalPages) {
    const pageNumbers = document.getElementById("page-numbers");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");

    if (!pageNumbers || !prevPageBtn || !nextPageBtn) return;

    // Clear page numbers
    pageNumbers.innerHTML = "";

    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("span");
      pageNumber.className = `page-number ${i === currentPage ? "active" : ""}`;
      pageNumber.textContent = i;

      pageNumber.addEventListener("click", function () {
        currentPage = i;
        renderProducts();
      });

      pageNumbers.appendChild(pageNumber);
    }

    // Update prev/next buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  // Set up event listeners for filters
  if (categoryFilters.length > 0) {
    categoryFilters.forEach((filter) => {
      filter.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all category filters
        categoryFilters.forEach((f) => f.classList.remove("active"));

        // Add active class to clicked filter
        this.classList.add("active");

        // Update filter state
        filters.category = this.getAttribute("data-category");

        // Reset to first page
        currentPage = 1;

        // Render products with new filters
        renderProducts();
      });
    });
  }

  if (materialFilters.length > 0) {
    materialFilters.forEach((filter) => {
      filter.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all material filters
        materialFilters.forEach((f) => f.classList.remove("active"));

        // Add active class to clicked filter
        this.classList.add("active");

        // Update filter state
        filters.material = this.getAttribute("data-material");

        // Reset to first page
        currentPage = 1;

        // Render products with new filters
        renderProducts();
      });
    });
  }

  if (priceRange && priceValue) {
    priceRange.addEventListener("input", function () {
      const value = this.value;

      // Update price value display
      priceValue.textContent = value === "20000" ? "₱20000+" : `$${value}`;

      // Update filter state
      filters.maxPrice = parseInt(value);

      // Reset to first page
      currentPage = 1;

      // Render products with new filters
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      // Update filter state
      filters.sort = this.value;

      // Render products with new sort
      renderProducts();
    });
  }

  // Pagination buttons
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", function () {
      currentPage++;
      renderProducts();
    });
  }

  // Initialize products on shop page
  if (productGrid) {
    renderProducts();
  }

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value;

      // In a real application, you would send this to your server
      console.log("Newsletter subscription:", email);

      // Show confirmation message
      alert("Thank you for subscribing to our newsletter!");

      // Reset form
      this.reset();
    });
  }

  // Load reviews for product page
  const reviewList = document.querySelector(".review-list");
  const loadMoreReviewsBtn = document.getElementById("load-more-reviews");

  // Sample review data
  const reviews = [
    {
      name: "Sarah J.",
      rating: 5,
      date: "2025-03-15",
      title: "Absolutely beautiful!",
      content:
        "This ring is even more beautiful in person. The craftsmanship is exceptional and it fits perfectly. I wear it every day and get so many compliments!",
    },
    {
      name: "Michael T.",
      rating: 4,
      date: "2025-02-28",
      title: "Great quality",
      content:
        "Bought this as a gift for my wife and she loves it. The gold is a beautiful color and the ring seems very well made. Would definitely purchase from this brand again.",
    },
    {
      name: "Emma L.",
      rating: 5,
      date: "2025-02-10",
      title: "Perfect everyday ring",
      content:
        "I've been wearing this ring daily for a month now and it still looks brand new. It's comfortable, elegant, and goes with everything. Highly recommend!",
    },
  ];

  // Function to render reviews
  function renderReviews() {
    if (!reviewList) return;

    reviews.forEach((review) => {
      const reviewItem = document.createElement("div");
      reviewItem.className = "review-item";

      // Generate stars HTML
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
          starsHTML += '<span class="star filled">★</span>';
        } else {
          starsHTML += '<span class="star">★</span>';
        }
      }

      // Format date
      const date = new Date(review.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      reviewItem.innerHTML = `
                <div class="review-header">
                    <div class="review-meta">
                        <h4>${review.name}</h4>
                        <div class="review-date">${formattedDate}</div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">${starsHTML}</div>
                    </div>
                </div>
                <h3 class="review-title">${review.title}</h3>
                <p class="review-content">${review.content}</p>
            `;

      reviewList.appendChild(reviewItem);
    });
  }

  // Initialize reviews on product page
  if (reviewList) {
    renderReviews();
  }

  // Load more reviews button
  if (loadMoreReviewsBtn) {
    loadMoreReviewsBtn.addEventListener("click", function () {
      // In a real application, you would load more reviews from the server
      alert("No more reviews to load.");
      this.disabled = true;
    });
  }

  // URL parameter handling for shop page
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Check for category parameter in URL
  const categoryParam = getUrlParameter("category");
  if (categoryParam && categoryFilters.length > 0) {
    // Find the matching category filter
    const matchingFilter = Array.from(categoryFilters).find(
      (filter) => filter.getAttribute("data-category") === categoryParam
    );

    if (matchingFilter) {
      // Remove active class from all category filters
      categoryFilters.forEach((f) => f.classList.remove("active"));

      // Add active class to matching filter
      matchingFilter.classList.add("active");

      // Update filter state
      filters.category = categoryParam;

      // Render products with new filters
      renderProducts();
    }
  }

  // Initialize cart
  renderCart();

  // Event listeners for cart actions
  const clearCartBtn = document.getElementById("clear-cart-button");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  const applyCouponBtn = document.getElementById("apply-coupon");
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", applyCoupon);
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }

  // Function to populate ordered items table
  function populateOrderedItemsTable() {
    const orderedItemsTable = document.getElementById("ordered-items-table");
    const cart = getCart();

    if (!orderedItemsTable || cart.length === 0) return;

    const tbody = orderedItemsTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows

    cart.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
            <td class="item-name" style="text-align: left; padding: 10px 20px;">${
              item.name
            }</td>
            <td class="item-price" style="text-align: center; padding: 10px 20px;">₱${item.price.toFixed(
              2
            )}</td>
            <td class="item-quantity" style="text-align: center; padding: 10px 20px;">${
              item.quantity
            }</td>
        `;

      tbody.appendChild(row);
    });
  }

  // Call the function to populate the table
  populateOrderedItemsTable();

  // Mock functions (replace with actual implementations or imports)
  function renderCart() {
    console.log("renderCart function called");
  }

  function updateCartCount() {
    console.log("updateCartCount function called");
  }

  function showNotification(message) {
    alert(message);
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  }

  function formatPrice(price) {
    return "₱" + price.toFixed(2);
  }

  // Function to clear cart
  function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      localStorage.removeItem("cart");
      renderCart();
      updateCartCount();
      appliedCoupon = null;
      window.location.reload();
    }
  }

  // Function to calculate cart totals
  function calculateTotals() {
    const cart = getCart();

    // Calculate items and subtotal
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Calculate shipping fee
    let shippingFee = 100;

    // Calculate total
    const total = subtotal + shippingFee;

    return {
      itemCount,
      subtotal,
      shippingFee,
      total,
    };
  }
  updateSummary();
  // Function to update cart summary
  function updateSummary() {
    const totals = calculateTotals();

    const summaryItemsElement = document.getElementById("summary-items");
    const summarySubtotalElement = document.getElementById("summary-subtotal");
    const summaryShippingElement = document.getElementById("summary-shipping");
    const summaryTotalElement = document.getElementById("summary-total");

    if (summaryItemsElement) {
      summaryItemsElement.textContent = totals.itemCount;
    }

    if (summarySubtotalElement) {
      summarySubtotalElement.textContent = formatPrice(totals.subtotal);
    }

    if (summaryShippingElement) {
      summaryShippingElement.textContent = formatPrice(totals.shippingFee);
    }

    if (summaryTotalElement) {
      summaryTotalElement.textContent = formatPrice(totals.total);
    }
  }

  // Function to proceed to checkout
  function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
      showNotification("Your cart is empty.");
      return;
    }

    // Save order details for receipt display
    const totals = calculateTotals();

    // Generate receipt content
    let receiptContent = "Receipt:\n\n";
    cart.forEach((item, index) => {
      receiptContent += `${index + 1}. ${item.name} - ₱${item.price.toFixed(
        2
      )} x ${item.quantity}\n`;
    });
    receiptContent += `\nSubtotal: ${formatPrice(totals.subtotal)}`;
    receiptContent += `\nShipping: ${formatPrice(totals.shippingFee)}`;
    receiptContent += `\nTotal: ${formatPrice(totals.total)}`;

    // Display receipt
    alert(receiptContent);
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
    window.location.href = "success.html";
  }
});
