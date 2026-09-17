// ===== SECTION SWITCHING =====
class Product{
    constructor(productName, productPrice){
        this.productName = productName;
        this.productPrice = productPrice;
    }

    getPrice(){
        return this.productPrice;
    }

    getName(){
        return this.productName;
    }
}


const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.items');
const shoppingCartDiv = document.getElementById('shopping-cart-div');
const products = [];


function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active-link');
        }
    });

    if (sectionId === 'shopping-cart') {
        renderCart();
    }
}

function renderCart(){
    shoppingCartDiv.innerHTML = products.map(item => `<div class="">
    <span>${item.getName()} </span>
    <span> ${item.getPrice()}</span>
    <button class="shopping-cart-delete-button">-</button>
    </div>`).join('');
}

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        showSection(sectionId);
    });
});

// ===== ADD TO CART FUNCTION =====
function addToCart(productName, price) {
    alert(`✅ ${productName} added to cart!\n💰 Price: $${price}`);
    

    const buttons = document.querySelectorAll('.buy-btn');
    let product = new Product(productName, price);
    products.push(product);
    buttons.forEach(btn => {
        if (btn.textContent.includes('Add to Cart')) {
            btn.textContent = '✓ Added!';
            btn.style.background = '#27ae60';
            setTimeout(() => {
                btn.textContent = 'Add to Cart 🛒';
                btn.style.background = '#27ae60';
            }, 2000);
        }
    });
}

// ===== CONTACT FORM =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // جلوگیری از رفرش صفحه
        
        // گرفتن مقادیر
        const fullName = document.getElementById('writter-name').value.trim();
        const email = document.getElementById('writter-email').value.trim();
        const content = document.getElementById('mail-content').value.trim();
        
        // اعتبارسنجی
        if (!fullName || !email || !content) {
            alert('❌ Please fill in all fields!');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('❌ Please enter a valid email address!');
            return;
        }
        
        // آماده کردن داده
        const formData = {
            name: fullName,
            email: email,
            content: content,
            timeStamp: new Date().toISOString()
        };
        
        console.log('📧 Form Data:', formData);
        
        // ===== ارسال به Backend =====
        await sendToBackend(formData);
    });
}

// ===== اعتبارسنجی ایمیل =====
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// ===== ارسال به Backend =====
async function sendToBackend(data) {
    const submitBtn = document.getElementById('mail-submit');
    const originalText = submitBtn.textContent;
    
    
    submitBtn.textContent = '⏳ Sending...';
    submitBtn.disabled = true;
    
    try {
        // ===== ارسال به سرور=====
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Server error');
        }
        
        const result = await response.json();
        console.log('✅ Server response:', result);
        
        // موفقیت
        submitBtn.textContent = '✓ Sent!';
        submitBtn.style.background = '#27ae60';
        alert('✅ Thank you! We will get back to you soon.');
        
        // پاک کردن فرم
        contactForm.reset();
        
    } catch (error) {
        console.error('❌ Error:', error);
        submitBtn.textContent = '❌ Failed';
        submitBtn.style.background = '#e74c3c';
        alert('❌ Failed to send message.\n\nMake sure the backend server is running on http://localhost:3000');
        
    } finally {
        // برگرداندن دکمه به حالت اولیه
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#3498db';
            submitBtn.disabled = false;
        }, 2500);
    }
}

// Home active by default
showSection('home');
