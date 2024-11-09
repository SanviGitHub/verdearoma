document.addEventListener('DOMContentLoaded', () => {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Efecto de parallax en el hero
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    // Animación de aparición para las secciones
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Cargar productos dinámicamente
    const productGrid = document.querySelector('.product-grid');
    const products = [
        { id: 1, name: 'Camiseta Orgánica', price: 29.99, image: '/placeholder.svg?height=250&width=250' },
        { id: 2, name: 'Pantalón Reciclado', price: 59.99, image: '/placeholder.svg?height=250&width=250' },
        { id: 3, name: 'Vestido Sostenible', price: 79.99, image: '/placeholder.svg?height=250&width=250' },
        { id: 4, name: 'Chaqueta Ecológica', price: 99.99, image: '/placeholder.svg?height=250&width=250' },
        { id: 5, name: 'Zapatos Veganos', price: 89.99, image: '/placeholder.svg?height=250&width=250' },
        { id: 6, name: 'Bolso Reciclado', price: 49.99, image: '/placeholder.svg?height=250&width=250' },
    ];

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Añadir al Carrito</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Carrito de compras
    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutModal = document.getElementById('checkout-modal');
    const cashPayment = document.getElementById('cash-payment');
    const mercadopagoPayment = document.getElementById('mercadopago-payment');

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
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = cartCount;
        document.querySelector('.cart-icon').setAttribute('data-count', cartCount);
    }

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
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    });

    function closeModals() {
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'none';
    }

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal || e.target === checkoutModal) {
            closeModals();
        }
    });

    function sendWhatsAppMessage(paymentMethod) {
        const phoneNumber = '1234567890'; // Reemplaza con el número de teléfono real de la tienda
        let message = 'Hola,\nQuisiera comprar los siguientes productos:\n';
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            message += `${product.name} (Cantidad: ${item.quantity})\n`;
        });
        message += `\nQuisiera pagar con ${paymentMethod}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }

    cashPayment.addEventListener('click', () => sendWhatsAppMessage('Efectivo'));
    mercadopagoPayment.addEventListener('click', () => sendWhatsAppMessage('Mercado Pago'));

    // Notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
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

    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Gracias por tu mensaje. Te contactaremos pronto.');
        contactForm.reset();
    });

    // Animación de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});