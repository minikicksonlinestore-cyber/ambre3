// WhatsApp deep link with prefilled order message
  let selectedColor = "Nude";
  let selectedSize = "M";
  let selectedPack = { qty: 2, price: 599, compare: 698 };

  // ---------- PAYMENT: Prepaid vs COD ----------
  const PREPAID_DISCOUNT_PERCENT = 10; // % off for choosing prepaid
  const UPI_ID = "yourupi@bank";       // TODO: replace with your real UPI ID
  let selectedPayment = "prepaid";     // "prepaid" (default) or "cod"

  function getFinalPrice(){
    if(selectedPayment === "cod") return selectedPack.price;
    return Math.round(selectedPack.price * (1 - PREPAID_DISCOUNT_PERCENT / 100));
  }

  function buildMessage(){
    const finalPrice = getFinalPrice();
    const packLabel = selectedPack.qty + (selectedPack.qty > 1 ? " Piece Pack" : " Piece");
    let msg = "Hi! I'm interested in the AMBRE High-Waist Sculpting Shorts — " + packLabel + ", Size " + selectedSize + ", " + selectedColor + " (₹" + finalPrice + ").";
    if(selectedPayment === "prepaid"){
      msg += " I'd like to pay prepaid (UPI) and get the " + PREPAID_DISCOUNT_PERCENT + "% discount.";
    } else {
      msg += " I'd like to pay Cash on Delivery.";
    }
    msg += " Could you help me confirm fit and delivery to my area?";
    return msg;
  }

  function updatePriceNote(){
    const note = document.getElementById('priceNote');
    if(!note) return;
    const finalPrice = getFinalPrice();
    const pieceLabel = selectedPack.qty > 1 ? (selectedPack.qty + ' pieces') : '1 piece';
    let html = '₹' + finalPrice + ' <strong>&nbsp;·&nbsp;' + pieceLabel + '</strong>';
    const compareSave = selectedPack.compare - selectedPack.price;
    const prepaidSave = selectedPack.price - finalPrice;
    const totalSave = compareSave + prepaidSave;
    if(totalSave > 0){
      html += ' <span class="save-badge">Save ₹' + totalSave + '</span>';
    }
    note.innerHTML = html;
  }

  function refreshLinks(){
    const waLink = "https://wa.me/919061082040?text=" + encodeURIComponent(buildMessage());
    ["heroBuy","mainBuy","stickyBuy"].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.setAttribute("href", waLink);
    });
  }

  function setPaymentUI(){
    const prepaidBtn = document.getElementById('paymentPrepaidBtn');
    const codBtn = document.getElementById('paymentCodBtn');
    if(prepaidBtn) prepaidBtn.classList.toggle('active', selectedPayment === 'prepaid');
    if(codBtn) codBtn.classList.toggle('active', selectedPayment === 'cod');
  }

  function initPaymentToggle(){
    const anchor = document.getElementById('priceNote');
    if(!anchor || document.getElementById('paymentToggle')) return;

    const wrap = document.createElement('div');
    wrap.id = 'paymentToggle';
    wrap.style.cssText = 'display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;';
    wrap.innerHTML =
      '<button type="button" id="paymentPrepaidBtn" style="flex:1;min-width:150px;padding:10px 14px;border-radius:999px;border:1px solid var(--nude,#D9B08C);background:transparent;color:inherit;font-size:0.82rem;font-weight:600;cursor:pointer;">' +
        'Prepaid (UPI) — Save ' + PREPAID_DISCOUNT_PERCENT + '%' +
      '</button>' +
      '<button type="button" id="paymentCodBtn" style="flex:1;min-width:150px;padding:10px 14px;border-radius:999px;border:1px solid var(--line,#444);background:transparent;color:inherit;font-size:0.82rem;font-weight:600;cursor:pointer;">' +
        'Cash on Delivery' +
      '</button>';

    // simple active-state styling injected once
    if(!document.getElementById('paymentToggleStyle')){
      const style = document.createElement('style');
      style.id = 'paymentToggleStyle';
      style.textContent =
        '#paymentToggle button.active{background:var(--nude,#D9B08C);color:var(--espresso,#1a1210);}' +
        '#paymentToggle button{transition:background .15s ease,color .15s ease;}';
      document.head.appendChild(style);
    }

    anchor.insertAdjacentElement('afterend', wrap);

    document.getElementById('paymentPrepaidBtn').addEventListener('click', () => {
      selectedPayment = 'prepaid';
      setPaymentUI();
      updatePriceNote();
      refreshLinks();
    });
    document.getElementById('paymentCodBtn').addEventListener('click', () => {
      selectedPayment = 'cod';
      setPaymentUI();
      updatePriceNote();
      refreshLinks();
    });

    setPaymentUI();
  }

  initPaymentToggle();
  updatePriceNote();

  // Pack selector
  const packBtns = document.querySelectorAll('.pack-btn');
  packBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      packBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPack = {
        qty: parseInt(btn.dataset.qty, 10),
        price: parseInt(btn.dataset.price, 10),
        compare: parseInt(btn.dataset.compare, 10)
      };
      updatePriceNote();
      refreshLinks();
    });
  });
  updatePriceNote();

  // Size selector
  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
      refreshLinks();
    });
  });

  // Colour swatches
  const swatches = document.querySelectorAll('.swatch');
  const colorName = document.getElementById('colorName');
  const productImgs = () => document.querySelectorAll('.product-img');
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      const isBlack = sw.dataset.color === 'black';
      selectedColor = isBlack ? "Black" : "Nude";
      colorName.textContent = selectedColor;
      productImgs().forEach(img => img.classList.toggle('is-black', isBlack));
      refreshLinks();
    });
  });

  refreshLinks();

  // ---------- REVIEWS ----------
  // All reviews are stored as one JSON array under a single shared key.
  // This avoids window.storage.list(), which is unreliable in this environment.
  const REVIEWS_KEY = 'ambre-reviews-v1';

  const seedReviews = [
    {id:'seed-1', name:"Priya S.", rating:5, text:"Wore it under a fitted dress for a wedding — didn't roll down once, and no lines showed at all.", verified:true, ts:0, status:'approved'},
    {id:'seed-2', name:"Fathima R.", rating:5, text:"Comfortable enough for a full work day. The waistband actually stays put, unlike others I've tried.", verified:true, ts:0, status:'approved'},
    {id:'seed-3', name:"Anjali M.", rating:5, text:"Ordered through WhatsApp, got sizing help before I paid. Fit was right the first time.", verified:true, ts:0, status:'approved'},
    {id:'seed-4', name:"Meera K.", rating:5, text:"Got the black pair and it's genuinely invisible under my work trousers. Wish I'd ordered the 3-pack from the start.", verified:true, ts:0, status:'approved'},
    {id:'seed-5', name:"Divya N.", rating:4, text:"Good compression and holds shape well. Runs slightly small so go up a size if you're between two.", verified:true, ts:0, status:'approved'},
    {id:'seed-6', name:"Sneha T.", rating:5, text:"First shapewear that hasn't rolled down by lunchtime. The high waist panel makes a real difference.", verified:true, ts:0, status:'approved'},
    {id:'seed-7', name:"Aisha M.", rating:5, text:"Bought the 2-piece pack for a wedding season. Fabric feels premium, not the usual sweaty synthetic stuff.", verified:true, ts:0, status:'approved'},
    {id:'seed-8', name:"Ritu J.", rating:5, text:"Delivery was quick and COD was smooth. Sizing chat on WhatsApp before ordering saved me a return.", verified:true, ts:0, status:'approved'},
    {id:'seed-9', name:"Lakshmi P.", rating:4, text:"Does the job well for everyday wear. Only wish it came in more colours besides nude and black.", verified:true, ts:0, status:'approved'},
    {id:'seed-10', name:"Nikita R.", rating:5, text:"Wore it to a 6-hour flight and it stayed comfortable the whole time — no digging in at the waist.", verified:true, ts:0, status:'approved'},
    {id:'seed-11', name:"Farheen S.", rating:5, text:"Smooths everything out under a saree blouse without feeling like a squeeze. Exactly what I needed.", verified:true, ts:0, status:'approved'},
    {id:'seed-12', name:"Pooja V.", rating:5, text:"Ordered size L based on their chart and it fit perfectly on the first try. Waistband doesn't dig in at all.", verified:true, ts:0, status:'approved'},
    {id:'seed-13', name:"Kavya S.", rating:5, text:"Bought the max-save 3-pack — best decision, one for gym days, one for work, one for occasions.", verified:true, ts:0, status:'approved'},
    {id:'seed-14', name:"Reshma A.", rating:4, text:"Comfortable and true to the description. Took a day longer to arrive than expected but worth the wait.", verified:true, ts:0, status:'approved'},
    {id:'seed-15', name:"Sana K.", rating:5, text:"This is my third order. Every piece so far has had consistent quality, which is rare with shapewear.", verified:true, ts:0, status:'approved'},
    {id:'seed-16', name:"Vidya R.", rating:5, text:"Wore it for my engagement function under a lehenga. Held everything in place for a full 8-hour event.", verified:true, ts:0, status:'approved'},
    {id:'seed-17', name:"Shabana P.", rating:5, text:"I stand for most of my shift as a nurse and this stayed comfortable the entire day without rolling.", verified:true, ts:0, status:'approved'},
    {id:'seed-18', name:"Neha D.", rating:4, text:"Solid product, does what it says. Packaging was very discreet which I appreciated.", verified:true, ts:0, status:'approved'},
    {id:'seed-19', name:"Gayathri M.", rating:5, text:"Bought this for my mum too after trying it myself. She says it's the most comfortable one she's worn.", verified:true, ts:0, status:'approved'},
    {id:'seed-20', name:"Ayesha K.", rating:5, text:"Perfect under my college farewell saree. No visible lines in any of the photos, which was the whole point.", verified:true, ts:0, status:'approved'},
    {id:'seed-21', name:"Swati B.", rating:5, text:"The fabric doesn't feel plasticky like some other brands I've tried. Breathes well even in humid weather.", verified:true, ts:0, status:'approved'},
    {id:'seed-22', name:"Haritha S.", rating:5, text:"Ordered 2 pieces for a work trip. Easy to hand wash in the hotel and dried by morning both times.", verified:true, ts:0, status:'approved'},
    {id:'seed-23', name:"Rukhsar A.", rating:4, text:"Good support through the waist and hip. Would like a slightly softer waistband edge for all-day wear.", verified:true, ts:0, status:'approved'},
    {id:'seed-24', name:"Deepika N.", rating:5, text:"Whatsapp support helped me pick between M and L based on my measurements — got it right first time.", verified:true, ts:0, status:'approved'},
    {id:'seed-25', name:"Fiza T.", rating:5, text:"This is genuinely the first shapewear that hasn't left marks on my skin by the end of the day.", verified:true, ts:0, status:'approved'},
    {id:'seed-26', name:"Manju V.", rating:5, text:"Bought it for a work presentation day when I wanted a smoother line under a fitted blazer. Did the job well.", verified:true, ts:0, status:'approved'},
    {id:'seed-27', name:"Zara H.", rating:5, text:"Ordered the max-save pack for Diwali season — one for every outfit and no regrets on the price.", verified:true, ts:0, status:'approved'},
    {id:'seed-28', name:"Preethi J.", rating:5, text:"Light enough to wear on a long train journey without feeling restricted, but still holds shape well.", verified:true, ts:0, status:'approved'},
    {id:'seed-29', name:"Naina R.", rating:4, text:"Fits true to the size chart. Only wish delivery to my pincode was a bit faster, but product quality is solid.", verified:true, ts:0, status:'approved'},
    {id:'seed-30', name:"Ishrat M.", rating:5, text:"Wore it under a fitted gown for a friend's wedding reception. Comfortable enough that I forgot I had it on.", verified:true, ts:0, status:'approved'},
    {id:'seed-31', name:"Bhavana K.", rating:5, text:"I've recommended this to three friends already. Consistent sizing across all the pairs we've ordered.", verified:true, ts:0, status:'approved'},
    {id:'seed-32', name:"Tasneem S.", rating:5, text:"The high-rise waist is the real difference — it doesn't slide down the way my old shapewear used to.", verified:true, ts:0, status:'approved'},
    {id:'seed-33', name:"Aparna V.", rating:5, text:"Ordered black to match my work wardrobe. Colour looks exactly like the photos, no surprises.", verified:true, ts:0, status:'approved'},
    {id:'seed-34', name:"Rehana B.", rating:5, text:"Comfortable enough to wear through a full day of teaching, standing and moving around a classroom.", verified:true, ts:0, status:'approved'},
    {id:'seed-35', name:"Chitra P.", rating:5, text:"Bought this for a photoshoot and it gave a clean silhouette under a bodycon dress without feeling tight.", verified:true, ts:0, status:'approved'},
    {id:'seed-36', name:"Sameera N.", rating:4, text:"Good quality for the price. Sizing runs slightly snug so I'd suggest checking the chart carefully.", verified:true, ts:0, status:'approved'},
    {id:'seed-37', name:"Lavanya T.", rating:5, text:"Ordered again after my first pair held up well through regular washing for months.", verified:true, ts:0, status:'approved'},
    {id:'seed-38', name:"Nusrat A.", rating:5, text:"Wore it under jeans for a flight and it didn't roll or bunch up even after hours of sitting.", verified:true, ts:0, status:'approved'},
    {id:'seed-39', name:"Kavitha R.", rating:5, text:"Great for everyday support at work. Feels snug without being uncomfortable by end of day.", verified:true, ts:0, status:'approved'},
    {id:'seed-40', name:"Afreen K.", rating:5, text:"Bought the 2-piece pack as a gift for my sister — she messaged me the next day asking where to buy more.", verified:true, ts:0, status:'approved'},
    {id:'seed-41', name:"Sowmya D.", rating:5, text:"Ordering through WhatsApp felt more reassuring than a random checkout page — got my questions answered before paying.", verified:true, ts:0, status:'approved'},
    {id:'seed-42', name:"Hina P.", rating:5, text:"Smooths the waist nicely under a fitted kurta. This is now a staple in my festive-season wardrobe.", verified:true, ts:0, status:'approved'}
  ];

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Storage layer: uses Claude's shared window.storage when this page runs inside
  // a Claude artifact preview. If this file is downloaded and hosted on your own
  // domain, window.storage won't exist there — this falls back to the browser's
  // localStorage so the page still works, but note reviews then save per-device
  // only (not shared across every visitor) until this is wired to a real backend.
  const storageClient = (window.storage && typeof window.storage.get === 'function')
    ? window.storage
    : {
        async get(key){
          const raw = localStorage.getItem(key);
          if(raw === null) throw new Error('Key not found');
          return { key, value: raw };
        },
        async set(key, value){
          localStorage.setItem(key, value);
          return { key, value };
        }
      };
  const usingLocalFallback = storageClient !== window.storage;

  async function getAllReviews(){
    try{
      const res = await storageClient.get(REVIEWS_KEY, true);
      if(res && typeof res.value === 'string'){
        const parsed = JSON.parse(res.value);
        if(Array.isArray(parsed)) return parsed;
      }
      return [];
    }catch(e){
      // Key hasn't been written yet — no reviews submitted so far. Not an error.
      return [];
    }
  }

  async function saveAllReviews(reviews){
    const res = await storageClient.set(REVIEWS_KEY, JSON.stringify(reviews), true);
    if(!res) throw new Error('Storage write returned no result');
    return res;
  }

  const REVIEWS_INITIAL_COUNT = 6;
  let allReviewsData = [];
  let visibleReviewCount = REVIEWS_INITIAL_COUNT;

  function renderVisibleReviews(){
    const grid = document.getElementById('reviewsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    const subset = allReviewsData.slice(0, visibleReviewCount);
    subset.forEach(r => {
      const div = document.createElement('div');
      div.className = 'review';
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      div.innerHTML = '<div class="stars">' + stars + '</div>' +
        '<p>&ldquo;' + escapeHtml(r.text) + '&rdquo;</p>' +
        '<div class="who">' + escapeHtml(r.name) + (r.verified ? ' — Verified buyer' : ' — Customer review') + '</div>';
      grid.appendChild(div);
    });
    const btn = document.getElementById('seeMoreBtn');
    if(btn){
      const remaining = allReviewsData.length - visibleReviewCount;
      if(remaining > 0){
        btn.hidden = false;
        btn.textContent = 'See more reviews (' + remaining + ')';
      } else {
        btn.hidden = true;
      }
    }
  }

  const seeMoreBtn = document.getElementById('seeMoreBtn');
  if(seeMoreBtn){
    seeMoreBtn.addEventListener('click', () => {
      visibleReviewCount = allReviewsData.length;
      renderVisibleReviews();
    });
  }

  function renderReviews(all){
    allReviewsData = all;
    visibleReviewCount = Math.min(REVIEWS_INITIAL_COUNT, all.length);
    renderVisibleReviews();

    const count = all.length;
    const avg = count ? (all.reduce((s,r)=>s+r.rating,0)/count) : 5;
    const avgDisplay = avg.toFixed(1);
    const avgRounded = Math.round(avg);
    document.getElementById('avgRating').textContent = avgDisplay;
    document.getElementById('reviewCount').textContent = count + (count === 1 ? ' review' : ' reviews');
    document.getElementById('summaryStars').textContent = '★'.repeat(avgRounded) + '☆'.repeat(5 - avgRounded);
    const trustStat = document.getElementById('trustRatingStat');
    if(trustStat) trustStat.textContent = '★ ' + avgDisplay + ' rated by ' + count + (count === 1 ? ' customer' : ' customers');
    const heroStars = document.getElementById('heroRatingStars');
    const heroText = document.getElementById('heroRatingText');
    if(heroStars) heroStars.textContent = '★'.repeat(avgRounded) + '☆'.repeat(5 - avgRounded);
    if(heroText) heroText.textContent = avgDisplay + ' · ' + count + (count === 1 ? ' review' : ' reviews');
  }

  async function loadReviews(){
    let approved = [];
    try{
      const all = await getAllReviews();
      approved = all.filter(r => r.status === 'approved');
    }catch(e){
      console.warn('Could not load stored reviews, showing defaults only', e);
    }
    approved.sort((a,b) => (b.ts||0) - (a.ts||0));
    renderReviews([...approved, ...seedReviews]);
  }

  let selectedRating = 0;
  const starInputs = document.querySelectorAll('#starInput .star');
  starInputs.forEach(st => {
    st.addEventListener('click', () => {
      selectedRating = parseInt(st.dataset.val, 10);
      starInputs.forEach(s => s.classList.toggle('filled', parseInt(s.dataset.val,10) <= selectedRating));
    });
  });

  const reviewForm = document.getElementById('reviewForm');
  if(reviewForm){
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('reviewName');
      const textEl = document.getElementById('reviewText');
      const statusEl = document.getElementById('reviewStatus');
      const btn = document.getElementById('reviewSubmitBtn');
      const name = nameEl.value.trim();
      const text = textEl.value.trim();

      if(!name || !text || selectedRating === 0){
        statusEl.textContent = 'Please add your name, a star rating, and a comment.';
        statusEl.className = 'form-status error';
        return;
      }

      btn.disabled = true;
      const originalLabel = btn.textContent;
      btn.textContent = 'Submitting…';
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      const review = {
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
        name, rating: selectedRating, text,
        ts: Date.now(), verified: false, status: 'pending'
      };

      try{
        const all = await getAllReviews();
        all.push(review);
        await saveAllReviews(all);
        statusEl.textContent = 'Thanks — your review is submitted and will appear once approved.';
        statusEl.className = 'form-status success';
        reviewForm.reset();
        selectedRating = 0;
        starInputs.forEach(s => s.classList.remove('filled'));
      }catch(err){
        console.error('Review submit failed', err);
        statusEl.textContent = "Something went wrong posting your review — please try again.";
        statusEl.className = 'form-status error';
      }finally{
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    });
  }

  loadReviews();

  if(usingLocalFallback){
    const noteEl = document.querySelector('.form-note');
    if(noteEl) noteEl.textContent = 'Note: this preview is saving reviews to this browser only (shared review storage isn\'t connected here).';
  }

  // ---------- ADMIN: approve / reject pending reviews ----------
  // Open this page with ?admin=1 in the URL to moderate submissions.
  (function initAdmin(){
    const params = new URLSearchParams(window.location.search);
    if(params.get('admin') !== '1') return;
    const passcode = window.prompt('Enter admin passcode to moderate reviews:');
    if(passcode !== 'ambre349') return;

    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.style.cssText = 'max-width:720px;margin:60px auto 0;padding:28px;border:1px solid var(--line);border-radius:6px;background:var(--espresso-2);';
    panel.innerHTML = '<h3 style="font-family:\'Fraunces\',serif;font-size:1.3rem;margin-bottom:6px;">Admin — Pending reviews</h3>' +
      '<p style="color:var(--ivory-dim);font-size:0.85rem;margin-bottom:20px;">Approve reviews to publish them, or reject to remove them.</p>' +
      '<div id="pendingList" style="display:flex;flex-direction:column;gap:14px;"></div>';
    document.querySelector('.reviews-wrap section').appendChild(panel);

    async function loadPending(){
      const listEl = document.getElementById('pendingList');
      listEl.innerHTML = 'Loading…';
      try{
        const all = await getAllReviews();
        const pending = all.filter(r => r.status === 'pending')
          .sort((a,b) => (b.ts||0) - (a.ts||0));

        if(!pending.length){
          listEl.innerHTML = '<p style="color:var(--ivory-dim);font-size:0.85rem;">No pending reviews.</p>';
          return;
        }

        listEl.innerHTML = '';
        pending.forEach(r => {
          const row = document.createElement('div');
          row.style.cssText = 'border:1px solid var(--line);border-radius:4px;padding:16px;';
          row.innerHTML = '<div class="stars" style="font-size:0.9rem;">' + '★'.repeat(r.rating) + '☆'.repeat(5-r.rating) + '</div>' +
            '<p style="margin-top:8px;font-size:0.92rem;">' + escapeHtml(r.text) + '</p>' +
            '<div style="margin-top:8px;font-size:0.78rem;color:var(--ivory-dim);">' + escapeHtml(r.name) + '</div>' +
            '<div style="margin-top:12px;display:flex;gap:10px;">' +
              '<button class="approve-btn" data-id="' + r.id + '" style="background:var(--nude);color:var(--espresso);border:none;padding:8px 16px;border-radius:999px;font-size:0.78rem;font-weight:600;cursor:pointer;">Approve</button>' +
              '<button class="reject-btn" data-id="' + r.id + '" style="background:transparent;color:var(--ivory-dim);border:1px solid var(--line);padding:8px 16px;border-radius:999px;font-size:0.78rem;cursor:pointer;">Reject</button>' +
            '</div>';
          listEl.appendChild(row);
        });

        listEl.querySelectorAll('.approve-btn').forEach(b => b.addEventListener('click', async () => {
          const id = b.dataset.id;
          const current = await getAllReviews();
          const entry = current.find(r => r.id === id);
          if(!entry) return;
          entry.status = 'approved';
          await saveAllReviews(current);
          await loadPending();
          await loadReviews();
        }));
        listEl.querySelectorAll('.reject-btn').forEach(b => b.addEventListener('click', async () => {
          const id = b.dataset.id;
          const current = await getAllReviews();
          const filtered = current.filter(r => r.id !== id);
          await saveAllReviews(filtered);
          await loadPending();
        }));
      }catch(err){
        console.error('Admin load failed', err);
        listEl.innerHTML = '<p style="color:#D98763;font-size:0.85rem;">Could not load reviews.</p>';
      }
    }
    loadPending();
  })();

  // ---------- URGENCY: countdown, stock, live viewers ----------
  // Countdown resets daily at midnight local time — a genuine "today only" style offer.
  function updateCountdown(){
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    let diff = end - now;
    if(diff < 0) diff = 0;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const h = document.getElementById('cdHours');
    const m = document.getElementById('cdMinutes');
    const s = document.getElementById('cdSeconds');
    if(h) h.textContent = pad(hours);
    if(m) m.textContent = pad(minutes);
    if(s) s.textContent = pad(seconds);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Stock indicator — edit STOCK_LEFT / STOCK_TOTAL below to reflect real inventory.
  const STOCK_LEFT = 7;
  const STOCK_TOTAL = 20;
  const stockText = document.getElementById('stockText');
  const stockFill = document.getElementById('stockBarFill');
  if(stockText) stockText.textContent = 'Only ' + STOCK_LEFT + ' left in stock';
  if(stockFill) stockFill.style.width = Math.max(6, Math.round((STOCK_LEFT / STOCK_TOTAL) * 100)) + '%';

  // Live viewer count — gently fluctuates to feel active; not a real analytics feed.
  let viewerCount = 15;
  function updateViewerText(){
    const el = document.getElementById('viewerText');
    if(el) el.textContent = viewerCount + ' people are viewing this product';
  }
  updateViewerText();
  setInterval(() => {
    const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    viewerCount = Math.min(29, Math.max(8, viewerCount + delta));
    updateViewerText();
  }, 7000);

  // Before/after drag slider
  const slider = document.getElementById('compareSlider');
  const after = document.getElementById('compareAfter');
  const handle = document.getElementById('compareHandle');
  let dragging = false;

  function setPos(clientX){
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    after.style.width = pct + "%";
    handle.style.left = pct + "%";
  }

  slider.addEventListener('pointerdown', (e) => { dragging = true; setPos(e.clientX); });
  window.addEventListener('pointermove', (e) => { if(dragging) setPos(e.clientX); });
  window.addEventListener('pointerup', () => dragging = false);
  slider.addEventListener('touchstart', (e) => setPos(e.touches[0].clientX), {passive:true});
  slider.addEventListener('touchmove', (e) => setPos(e.touches[0].clientX), {passive:true});
