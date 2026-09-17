class Product {
  constructor(productName, productPrice){ this.productName=productName; this.productPrice=productPrice; }
  getPrice(){ return this.productPrice; }
  getName(){ return this.productName; }
}

const sections=document.querySelectorAll('.section');
const navLinks=document.querySelectorAll('[data-section]');
const cartCountEl=document.getElementById('cart-count');
const shoppingCartDiv=document.getElementById('shopping-cart-div');
const cartSummary=document.getElementById('cart-summary');
const products=[];
const menuBtn=document.getElementById('mobile-menu-btn');
const nav=document.getElementById('nav-links');

function showSection(sectionId){
  sections.forEach(section=>section.classList.toggle('active',section.id===sectionId));
  document.querySelectorAll('.nav-link').forEach(link=>link.classList.toggle('active-link',link.dataset.section===sectionId));
  if(sectionId==='shopping-cart') renderCart();
  window.scrollTo({top:0,behavior:'smooth'});
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
}

document.querySelectorAll('[data-section]').forEach(link=>{
  link.addEventListener('click',e=>{
    const sectionId=link.dataset.section;
    if(!sectionId) return;
    e.preventDefault();
    showSection(sectionId);
    if(link.classList.contains('heart-btn')) e.stopPropagation();
  });
});

function updateCartCount(){ cartCountEl.textContent=products.length; }

function addToCart(productName,price){
  const product=new Product(productName,price);
  products.push(product);
  updateCartCount();
  const sourceButtons=[...document.querySelectorAll('.buy-btn')];
  const button=sourceButtons.find(btn=>btn.closest('.product-card')?.querySelector('h3')?.textContent===productName || btn.getAttribute('onclick')?.includes(productName));
  if(button){
    const old=button.textContent;
    button.textContent='Added ✓';
    button.disabled=true;
    setTimeout(()=>{button.textContent=old;button.disabled=false;},1400);
  }
}

function removeFromCart(index){ products.splice(index,1); updateCartCount(); renderCart(); }

function renderCart(){
  if(!products.length){
    shoppingCartDiv.innerHTML=`<div class="cart-empty"><div class="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Add a few tech essentials and they’ll show up here.</p><button class="btn btn-primary" type="button" onclick="showSection('products')">Browse products →</button></div>`;
    cartSummary.innerHTML=`<h3>Summary</h3><div class="summary-line"><span>Items</span><span>$0.00</span></div><div class="summary-line"><span>Shipping</span><span>Free</span></div><div class="summary-total"><span>Total</span><span>$0.00</span></div>`;
    return;
  }
  shoppingCartDiv.innerHTML=products.map((item,index)=>`<div class="cart-row"><div class="cart-row-main"><strong>${escapeHtml(item.getName())}</strong><span>Selected product</span></div><div class="cart-row-actions"><strong>$${item.getPrice().toFixed(2)}</strong><button class="remove-cart" type="button" onclick="removeFromCart(${index})" aria-label="Remove ${escapeHtml(item.getName())}">×</button></div></div>`).join('');
  const total=products.reduce((sum,item)=>sum+item.getPrice(),0);
  cartSummary.innerHTML=`<h3>Summary</h3><div class="summary-line"><span>Items (${products.length})</span><span>$${total.toFixed(2)}</span></div><div class="summary-line"><span>Shipping</span><span>Free</span></div><div class="summary-total"><span>Total</span><span>$${total.toFixed(2)}</span></div><button class="btn btn-primary" type="button" onclick="alert('Checkout flow is ready to connect to your payment backend.')">Proceed to checkout <span>→</span></button>`;
}

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}

document.querySelectorAll('.category-pill').forEach(pill=>pill.addEventListener('click',()=>{
  document.querySelectorAll('.category-pill').forEach(p=>p.classList.remove('active')); pill.classList.add('active');
}));

document.querySelectorAll('.heart-btn').forEach(btn=>btn.addEventListener('click',()=>{
  btn.textContent=btn.textContent==='♡'?'♥':'♡'; btn.style.color=btn.textContent==='♥'?'#635bff':'';
}));

menuBtn?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded',String(open));
});

const contactForm=document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit',async e=>{
    e.preventDefault();
    const fullName=document.getElementById('writter-name').value.trim();
    const email=document.getElementById('writter-email').value.trim();
    const content=document.getElementById('mail-content').value.trim();
    const submitBtn=document.getElementById('mail-submit');
    if(!fullName||!email||!content){alert('Please complete all fields.');return;}
    if(!isValidEmail(email)){alert('Please enter a valid email address.');return;}
    const payload={name:fullName,email,content,timeStamp:new Date().toISOString()};
    const original=submitBtn.innerHTML;
    submitBtn.disabled=true;submitBtn.innerHTML='Sending…';
    try{
      const response=await fetch('http://localhost:3000/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!response.ok) throw new Error('Server error');
      submitBtn.innerHTML='Message sent ✓';contactForm.reset();
    }catch(error){
      console.warn('Backend unavailable:',error);
      submitBtn.innerHTML='Saved locally ✓';
      localStorage.setItem('techhub-contact-draft',JSON.stringify(payload));
    }finally{setTimeout(()=>{submitBtn.innerHTML=original;submitBtn.disabled=false;},1800);}
  });
}
function isValidEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}

updateCartCount();
showSection('home');
