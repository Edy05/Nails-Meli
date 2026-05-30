document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Animations (Optimized for mobile)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.easeLoad').forEach(el => observer.observe(el));

  // 2. Mobile Menu
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
  }));

  // 3. Gallery Data & Rendering
  const galleryData = [
    { id: 1, cat: 'rubber', src: './imagenes/unias-descarga1.webp', alt: 'Base Rubber Clásico' },
    { id: 2, cat: 'diseño', src: './imagenes/unias-descarga2.webp', alt: 'Diseño Minimalista' },
    { id: 3, cat: 'pedicura', src: './imagenes/unias-descarga3.webp', alt: 'Pedicura Spa' },
    { id: 4, cat: 'acrilico', src: './imagenes/unia1.jpg', alt: 'Acrílico Esculpido' },
    { id: 5, cat: 'rubber', src: './imagenes/unia2.jpg', alt: 'Base Rubber Nude' },
    { id: 6, cat: 'diseño', src: './imagenes/unia3.jpg', alt: 'Diseño Francesa' },
    { id: 7, cat: 'pedicura', src: './imagenes/unia4.jpg', alt: 'Pedicura Gel' },
    { id: 8, cat: 'acrilico', src: './imagenes/unias-descarga1.webp', alt: 'Acrílico Ombré' }
  ];

  const galleryGrid = document.getElementById('gallery');
  
 function renderGallery() {
  galleryGrid.innerHTML = galleryData.map((item, index) => `
    <div class="gallery-item easeLoad" data-category="${item.cat}" data-src="${item.src}" data-index="${index}">
      <img src="${item.src}" alt="${item.alt}" loading="lazy">
    </div>
  `).join('');
  document.querySelectorAll('.gallery-item.easeLoad').forEach(el => observer.observe(el));
}
  renderGallery();

  // 4. Gallery Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      document.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 5. Lightbox Logic
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  let currentImages = [];
  let currentIndex = 0;

galleryGrid.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item || item.classList.contains('hidden')) return;

  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  currentImages = galleryData.filter(img => activeFilter === 'all' || img.cat === activeFilter);
  
  // Comparamos con data-src (ruta relativa exacta) en vez de .src (URL absoluta)
  const clickedSrc = item.dataset.src;
  currentIndex = currentImages.findIndex(img => img.src === clickedSrc);

  if (currentIndex !== -1) {
    openLightbox();
  }
});

  function openLightbox() {
    lightbox.classList.add('active');
    updateLightbox();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
  if (currentIndex < 0 || currentIndex >= currentImages.length) return;
  const img = currentImages[currentIndex];
  lbImg.src = img.src;
  lbCaption.textContent = img.alt;
}

  function nextSlide() { currentIndex = (currentIndex + 1) % currentImages.length; updateLightbox(); }
  function prevSlide() { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateLightbox(); }

  document.querySelector('.lb-close').addEventListener('click', closeLightbox);
  document.querySelector('.lb-next').addEventListener('click', nextSlide);
  document.querySelector('.lb-prev').addEventListener('click', prevSlide);
  lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  });

  // 6. Form -> WhatsApp
  const form = document.getElementById('booking-form');
  const PHONE = '56046231'; // 🔴 REEMPLAZA CON EL NÚMERO REAL

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value.trim();

    const msg = `Hola Nails Meli , soy *${name}*. Quisiera reservar *${service}* para el *${date}*. ${notes ? 'Nota: ' + notes : ''}`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // Auto-fill service from cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      const select = document.getElementById('service');
      
      let target = '';
      if (category === 'manicura') target = 'Base Rubber';
      else if (category === 'pedicura') target = 'Pedicura Spa Pro';
      else if (category === 'spajelly') target = 'Jelly Manicura';
      
      if(target) {
        for(let opt of select.options) {
          if(opt.value.includes(target)) {
            select.value = opt.value;
            break;
          }
        }
        document.getElementById('reservar').scrollIntoView({behavior: 'smooth'});
      }
    });
  });

  // 7. Header Shadow on Scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-top)' : 'none';
  });

  // 8. Image Loading Handler (Fixes flickering/crashing on mobile)
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });
});