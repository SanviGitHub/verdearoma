document.addEventListener('DOMContentLoaded', () => {
    // Initialize products
    const products = [
        {
            id: 1,
            name: 'Vestido Sostenible',
            price: 79.99,
            image: 'verdearoma.jpg'
        },
        {
            id: 2,
            name: 'Pantalón Reciclado',
            price: 59.99,
            image: 'verdearoma.jpg'
        },
        {
            id: 3,
            name: 'Blusa Ecológica',
            price: 45.99,
            image: 'verdearoma.jpg'
        },
        {
            id: 4,
            name: 'Chaqueta Verde',
            price: 89.99,
            image: 'verdearoma.jpg'
        }
    ];

    // Cart state
    let cart = [];

    // DOM Elements
    const productGrid = document.getElementById('product-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const closeButtons = document.querySelectorAll('.close');
    const cashPayment = document.getElementById('cash-payment');
    const mercadopagoPayment = document.getElementById('mercadopago-payment');
    const contactForm = document.getElementById('contact-form');

    // Load products
    function loadProducts() {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">
                        Añadir al Carrito
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Update cart display
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            total += product.price * item.quantity;

            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${product.name}</span>
                    <span>Cantidad: ${item.quantity}</span>
                    <span>$${(product.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        document.querySelector('.cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }, 100);
    }

    // Send WhatsApp message
    function sendWhatsAppMessage(paymentMethod) {
        const phoneNumber = '+5491161017614';
        let message = '¡Hola Verde Aroma!\nQuisiera realizar la siguiente compra:\n\n';
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            message += `• ${product.name} (${item.quantity}x $${product.price})\n`;
        });
        
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product.price * item.quantity);
        }, 0);
        
        message += `\nTotal: $${total.toFixed(2)}`;
        message += `\nMétodo de pago: ${paymentMethod}`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }

    // Event Listeners
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }
            
            updateCart();
            showNotification('Producto añadido al carrito');
        }
    });

    cartIcon.addEventListener('click', () => {
        updateCart();
        cartModal.style.display = 'block';
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('El carrito está vacío');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
        });
    });

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    cashPayment.addEventListener('click', () => {
        sendWhatsAppMessage('Efectivo');
        checkoutModal.style.display = 'none';
        cart = [];
        updateCart();
        showNotification('¡Gracias por tu compra!');
    });

    mercadopagoPayment.addEventListener('click', () => {
        sendWhatsAppMessage('Mercado Pago');
        checkoutModal.style.display = 'none';
        cart = [];
        updateCart();
        showNotification('¡Gracias por tu compra!');
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Mensaje enviado correctamente');
        contactForm.reset();
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal || e.target === checkoutModal) {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                navLinks.classList.remove('active');
            }
        });
    });

    // Initialize products on load
    loadProducts();
});