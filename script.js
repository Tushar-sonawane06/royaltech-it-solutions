document.addEventListener('DOMContentLoaded', () => {

    // Sticky Navbar
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll Reveal Animation using Intersection Observer
    // We add the 'reveal' class to sections/elements we want to animate
    const revealElements = document.querySelectorAll('.section-title, .service-card, .approach-text, .image-wrapper, .testimonial-card, .product-card');

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Uncomment to animate only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update active class
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // =========================================
    // E-COMMERCE CART LOGIC
    // =========================================
    let cart = [];

    const cartBadge = document.getElementById('cartBadge');
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Toggle Modal
    if (floatingCartBtn && cartModal && closeCartBtn) {
        floatingCartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
        });

        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        // Close on outside click
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    // Add to Cart Buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            // Visual feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> ADDED';
            btn.style.backgroundColor = '#2ECC71';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
            }, 1500);

            updateCartUI();
        });
    });

    // Update Cart UI
    function updateCartUI() {
        // Update badge
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;

        // Update Modal Items
        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="fa-solid fa-cart-arrow-down" style="font-size:40px; margin-bottom:15px; color:var(--text-light)"></i>
                    <p>Your cart is currently empty.</p>
                </div>
            `;
            checkoutBtn.disabled = true;
            cartTotalPrice.textContent = '$0.00';
            return;
        }

        checkoutBtn.disabled = false;

        let itemsHTML = '';
        let totalCost = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalCost += itemTotal;

            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item" data-index="${index}"><i class="fa-solid fa-trash"></i> Remove</button>
                </div>
            `;
        });

        cartItemsList.innerHTML = itemsHTML;
        cartTotalPrice.textContent = '$' + totalCost.toFixed(2);

        // Add event listeners to new remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    // Checkout Simulation
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const btnOriginalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCESSING...';

            setTimeout(() => {
                alert('Order placed successfully! This is a simulation.');
                cart = [];
                updateCartUI();
                checkoutBtn.innerHTML = btnOriginalText;
                cartModal.classList.remove('active');
            }, 1500);
        });
    }

});

const chatBtn = document.getElementById("chatbot-btn");
const chatContainer = document.getElementById("chatbot-container");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");


chatBtn.addEventListener("click", () => {
    chatContainer.classList.toggle("hidden");
  });
  
  closeChat.addEventListener("click", () => {
    chatContainer.classList.add("hidden");
  });

sendBtn.onclick = sendMessage;
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  callAPI(text);
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBody.appendChild(msg);

  chatBody.scrollTop = chatBody.scrollHeight;
}

async function callAPI(userMessage) {
  try {
    const response = await fetch("https://yashodeep2006-royaltech.hf.space/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userMessage,
      }),
    });

    const data = await response.json();

    addMessage(data.answer || "No response", "bot");

  } catch (error) {
    addMessage("Error connecting to server", "bot");
    console.error(error);
  }
}