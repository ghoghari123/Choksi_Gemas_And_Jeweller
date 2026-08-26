document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.main-navigation');
    const mobileToggle = document.querySelector('.mobile-menu-button');
    const searchButtons = document.querySelectorAll('.search-button');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="search"]') : null;
    const searchForms = document.querySelectorAll('.search-form');
    const faqItems = document.querySelectorAll('details.faq-item, details.contact-faq-item');
    const contactForm = document.getElementById('contactForm');
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    const backToTop = document.createElement('button');

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-navigation .nav-link').forEach((link) => {
        const linkPage = link.getAttribute('href')?.split('#')[0] || '';
        link.classList.toggle('active', linkPage === currentPage);
    });

    document.querySelectorAll('.nav-item.dropdown').forEach((item) => {
        const link = item.querySelector(':scope > .nav-link');
        if (!link || !link.getAttribute('href') || !link.getAttribute('href').includes('diamonds.html')) return;
        item.classList.remove('dropdown');
        item.querySelector(':scope > .dropdown-menu')?.remove();
        item.querySelector(':scope > .nav-link i')?.remove();
    });

    document.querySelectorAll('img').forEach((image) => {
        const applyImageFallback = () => {
            if (image.dataset.fallbackApplied) return;
            image.dataset.fallbackApplied = 'true';
            image.src = 'images/logo.png';
            image.classList.add('image-fallback');
        };
        image.addEventListener('error', applyImageFallback);
        if (image.complete && image.naturalWidth === 0) applyImageFallback();
    });

    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    body.appendChild(backToTop);

    function setHeaderState() {
        if (!header) return;
        header.classList.toggle('header-scrolled', window.scrollY > 20);
    }

    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    function openMobileMenu() {
        if (!nav || !mobileToggle) return;
        nav.classList.add('nav-open');
        mobileToggle.classList.add('is-active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        if (!nav || !mobileToggle) return;
        nav.classList.remove('nav-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = nav && nav.classList.contains('nav-open');
            if (isOpen) closeMobileMenu();
            else openMobileMenu();
        });
    }

    if (nav) {
        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) closeMobileMenu();
            });
        });
    }

    if (searchClose && searchForms[0]) {
        searchClose.type = 'button';
        searchClose.classList.add('search-inline-close');
        searchForms[0].appendChild(searchClose);
    }

    const closeSearch = () => {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('is-open');
        body.classList.remove('search-open');
    };

    const openSearch = () => {
        if (!searchOverlay) return;
        searchOverlay.classList.add('is-open');
        body.classList.add('search-open');
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 100);
    };

    if (searchButtons.length) {
        searchButtons.forEach((button) => {
            button.addEventListener('click', openSearch);
        });
    }

    const pageSearchEntries = [
        { label: 'Diamond rings', url: 'jewellery.html#rings', keywords: 'ring rings solitaire engagement bridal diamond gold setting', description: 'Explore diamond rings designed for engagements, bridal celebrations and everyday elegance.' },
        { label: 'Diamond earrings', url: 'jewellery.html#earrings', keywords: 'earrings studs drops diamond jewellery', description: 'Browse refined diamond earrings, from classic studs to graceful statement designs.' },
        { label: 'Diamond necklaces', url: 'jewellery.html#necklaces', keywords: 'necklace necklaces pendant diamond jewellery', description: 'Discover diamond necklaces and pendants created to bring light to every occasion.' },
        { label: 'Bracelets', url: 'jewellery.html#bracelets', keywords: 'bracelet bracelets diamond gold jewellery', description: 'Find diamond bracelets made with balanced proportions and considered craftsmanship.' },
        { label: 'Bridal jewellery', url: 'collections.html', keywords: 'bridal wedding engagement collection jewellery diamond', description: 'Our bridal collections pair meaningful design with carefully sourced diamonds and precious metals.' },
        { label: 'Diamond 4Cs', url: '4cs.html', keywords: 'diamond cut color clarity carat 4cs', description: 'Learn how cut, color, clarity and carat weight describe a diamond and guide comparison.' },
        { label: 'Diamond shapes', url: 'diamond-shapes.html', keywords: 'shape round oval emerald pear marquise princess cushion heart', description: 'Compare popular diamond shapes and find an outline that suits your style and setting.' },
        { label: 'Diamond buying guide', url: 'diamond-guide.html', keywords: 'buying budget value price sourcing trade diamond selection', description: 'Use practical guidance on budget, proportions, certification and choosing a diamond.' },
        { label: 'Diamond certification', url: 'certification.html', keywords: 'certification grading report gia igi laboratory report appraisal', description: 'Understand grading reports, laboratory documentation and the difference from an appraisal.' },
        { label: 'Craftsmanship', url: 'craftsmanship.html', keywords: 'craftsmanship manufacturing making design finishing quality', description: 'See how thoughtful design, skilled making and finishing shape Choksi jewellery.' },
        { label: 'Jewellery care', url: 'jewellery-care.html', keywords: 'care cleaning maintenance storage polish repair', description: 'Follow practical care guidance to protect the beauty and finish of your jewellery.' },
        { label: 'Consultation', url: 'contact.html', keywords: 'contact consultation showroom appointment custom service', description: 'Speak with Choksi Gems & Jewellers about jewellery, diamonds and a personal consultation.' }
    ];

    function renderSearchResults(query) {
        if (!searchOverlay) return;
        const resultBox = searchOverlay.querySelector('.search-results');
        if (!resultBox) return;

        const value = query.trim().toLowerCase();
        if (!value) {
            resultBox.classList.remove('is-visible');
            resultBox.innerHTML = '';
            return;
        }

        const matches = pageSearchEntries.filter((entry) => {
            const haystack = `${entry.label} ${entry.keywords} ${entry.url}`.toLowerCase();
            return haystack.includes(value);
        }).slice(0, 5);

        if (!matches.length) {
            resultBox.innerHTML = '<div class="search-empty">No matching jewellery or diamond content found. Try “diamond”, “ring”, or “certification”.</div>';
            resultBox.classList.add('is-visible');
            return;
        }

        resultBox.innerHTML = `
      <ul class="search-result-list">
        ${matches.map((entry) => `
          <li class="search-result-item">
            <a class="search-result-link" href="${entry.url}">
              <span><strong>${entry.label}</strong><small>${entry.description}</small></span>
              <span class="search-result-meta">View</span>
            </a>
          </li>
        `).join('')}
      </ul>
    `;
        resultBox.classList.add('is-visible');
    }

    searchForms.forEach((form) => {
        const input = form.querySelector('input[type="search"]');
        const results = document.createElement('div');
        results.className = 'search-results';
        form.parentNode.insertBefore(results, form.nextSibling);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = (input && input.value) ? input.value : '';
            renderSearchResults(query);
        });

        if (input) {
            input.addEventListener('input', (event) => renderSearchResults(event.target.value));
        }
    });

    if (searchClose) searchClose.addEventListener('click', closeSearch);

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (event) => {
            if (event.target === searchOverlay) closeSearch();
        });
    }

    document.querySelectorAll('[data-shape-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.shapeFilter;
            document.querySelectorAll('[data-shape-filter]').forEach((item) => item.classList.toggle('active', item === button));
            document.querySelectorAll('.shape-overview-grid [data-shape]').forEach((card) => {
                card.hidden = filter !== 'all' && card.dataset.shape !== filter;
            });
        });
    });

    const faqSearchInput = document.getElementById('faqSearch');
    const faqCategoryButtons = document.querySelectorAll('[data-category]');
    let selectedFaqCategory = 'all';

    const updateFaqVisibility = () => {
        const query = faqSearchInput ? faqSearchInput.value.trim().toLowerCase() : '';
        document.querySelectorAll('[data-category-section]').forEach((section) => {
            const categoryMatches = selectedFaqCategory === 'all' || section.dataset.categorySection === selectedFaqCategory;
            const visibleItems = [...section.querySelectorAll('[data-faq-item]')].filter((item) => {
                const matches = !query || item.textContent.toLowerCase().includes(query);
                item.hidden = !matches;
                return matches;
            });
            section.hidden = !categoryMatches || visibleItems.length === 0;
        });
    };

    faqCategoryButtons.forEach((button) => {
        if (!button.closest('.faq-category-list')) return;
        button.addEventListener('click', () => {
            selectedFaqCategory = button.dataset.category || 'all';
            document.querySelectorAll('.faq-category-list [data-category]').forEach((item) => item.classList.toggle('active', item === button));
            updateFaqVisibility();
        });
    });

    if (faqSearchInput) faqSearchInput.addEventListener('input', updateFaqVisibility);
    if (faqSearchInput || document.querySelector('[data-category-section]')) updateFaqVisibility();

    if (faqItems.length) {
        faqItems.forEach((item) => {
            item.addEventListener('toggle', () => {
                if (!item.open) return;
                faqItems.forEach((other) => {
                    if (other !== item) other.removeAttribute('open');
                });
            });
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSearch();
            closeMobileMenu();
            closeAuthModal();
        }
    });

    document.addEventListener('click', (event) => {
        const clickedInsideNav = nav && nav.contains(event.target);
        const clickedToggle = mobileToggle && mobileToggle.contains(event.target);
        if (window.innerWidth < 992 && nav && nav.classList.contains('nav-open') && !clickedInsideNav && !clickedToggle) {
            closeMobileMenu();
        }

        if (searchOverlay && searchOverlay.classList.contains('is-open') && event.target === searchOverlay) {
            closeSearch();
        }
    });

    function updateBackToTop() {
        if (!backToTop) return;
        backToTop.classList.toggle('is-visible', window.scrollY > 350);
    }

    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('main section, .reveal, .intro-image, .category-card, .blog-card, .gallery-card, .education-card, .info-card, .collection-card, .feature-card, .certificate-c-card, .certification-feature-card, .report-comparison-card, .faq-item, .contact-faq-item').forEach((item) => {
        item.classList.add('reveal');
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    }

    function readStorage(key, fallbackValue) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallbackValue;
        } catch (error) {
            return fallbackValue;
        }
    }

    function writeStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    if (contactForm) {
        const nameField = contactForm.querySelector('[name="full_name"]') || contactForm.querySelector('[name="name"]');
        const emailField = contactForm.querySelector('[name="email"]');
        const phoneField = contactForm.querySelector('[name="phone"]');
        const subjectField = contactForm.querySelector('[name="subject"]');
        const messageField = contactForm.querySelector('[name="message"]');
        const formMessage = document.createElement('div');
        formMessage.className = 'form-message';
        contactForm.appendChild(formMessage);

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const values = {
                full_name: nameField ? nameField.value.trim() : '',
                email: emailField ? emailField.value.trim() : '',
                phone: phoneField ? phoneField.value.trim() : '',
                subject: subjectField ? subjectField.value.trim() : '',
                message: messageField ? messageField.value.trim() : '',
                createdAt: new Date().toISOString()
            };

            const isValid = values.full_name && values.email && values.subject && values.message;

            if (!isValid) {
                formMessage.textContent = 'Please complete the required fields before submitting.';
                formMessage.classList.add('show');
                return;
            }

            const entries = readStorage('diamond_contact_entries', []);
            entries.push(values);
            writeStorage('diamond_contact_entries', entries);

            formMessage.textContent = 'Your enquiry has been Send Sucessfully. We will be in touch soon.';
            formMessage.classList.add('show');
            contactForm.reset();
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 3000);
        });
    }

    document.querySelectorAll('.newsletter-form').forEach((form) => {
        const emailInput = form.querySelector('input[type="email"]');
        const successBox = document.createElement('div');
        successBox.className = 'newsletter-success';
        form.appendChild(successBox);
        let messageTimer;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!emailInput || !emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                successBox.textContent = 'Please enter a valid email address.';
                successBox.classList.add('show');
                if (emailInput) emailInput.focus();
                return;
            }

            const email = emailInput.value.trim().toLowerCase();
            const subscriptions = readStorage('diamond_newsletter', []);
            if (!subscriptions.some((subscription) => subscription.email === email)) {
                subscriptions.push({ email, createdAt: new Date().toISOString() });
            }
            writeStorage('diamond_newsletter', subscriptions);

            successBox.textContent = 'Thank you for subscribing.';
            successBox.classList.add('show');
            form.reset();
            clearTimeout(messageTimer);
            messageTimer = setTimeout(() => successBox.classList.remove('show'), 2500);
        });
    });

    function addAuthModal() {
        if (document.getElementById('authModal')) return;

        const actions = document.querySelector('.header-actions');
        if (actions) {
            const loginBtn = document.createElement('button');
            loginBtn.type = 'button';
            loginBtn.className = 'auth-toggle';
            loginBtn.setAttribute('data-auth', 'login');
            loginBtn.innerHTML = '<i class="fa-solid fa-user"></i>';
            loginBtn.setAttribute('aria-label', 'Login');

            if (!actions.querySelector('[data-auth="login"]')) {
                actions.insertBefore(loginBtn, actions.firstChild);
            }
        }

        const modal = document.createElement('div');
        modal.id = 'authModal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
      <div class="auth-panel" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <div class="auth-header">
          <div>
            <span class="section-label">Account</span>
            <h3 id="authTitle">Welcome</h3>
          </div>
          <button type="button" class="icon-button auth-close" aria-label="Close auth form" style="color:black;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="auth-tabs">
          <button type="button" class="auth-tab is-active" data-mode="login">Login</button>
          <button type="button" class="auth-tab" data-mode="register">Register</button>
        </div>

        <form class="auth-form is-active" data-form="login">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input id="login-email" type="email" name="email" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input id="login-password" type="password" name="password" placeholder="Enter your password" required>
          </div>
          <button type="submit" class="btn-primary w-100">Login</button>
          <div class="auth-message"></div>
        </form>

        <form class="auth-form" data-form="register">
                    <p class="auth-intro">Create your account to make future jewellery consultations and enquiries easier.</p>
          <div class="form-group">
            <label for="register-name">Full Name</label>
            <input id="register-name" type="text" name="name" placeholder="Your full name" required>
          </div>
          <div class="form-group">
            <label for="register-email">Email</label>
            <input id="register-email" type="email" name="email" placeholder="Your email address" required>
          </div>
                    <div class="form-group">
                        <label for="register-phone">Contact Number</label>
                        <input id="register-phone" type="tel" name="phone" placeholder="Your contact number" required style="width:610px !important;">
                    </div>
                    <div class="form-group">
                        <label for="register-address">Address</label>
                        <textarea id="register-address" name="address" rows="2" placeholder="Your address" required></textarea>
                    </div>
          <div class="form-group">
            <label for="register-password">Password</label>
            <input id="register-password" type="password" name="password" placeholder="Create a password" required>
          </div>
                    <div class="form-group">
                        <label for="register-confirm-password">Confirm Password</label>
                        <input id="register-confirm-password" type="password" name="confirm_password" placeholder="Confirm your password" required>
                    </div>
          <button type="submit" class="btn-primary w-100">Register</button>
          <div class="auth-message"></div>
        </form>
      </div>
    `;

        body.appendChild(modal);

        const authModal = document.getElementById('authModal');
        const authTabs = authModal.querySelectorAll('.auth-tab');
        const authForms = authModal.querySelectorAll('.auth-form');
        const authClose = authModal.querySelector('.auth-close');

        authTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.mode;
                authTabs.forEach((item) => item.classList.toggle('is-active', item === tab));
                authForms.forEach((form) => form.classList.toggle('is-active', form.dataset.form === mode));
            });
        });

        authClose.addEventListener('click', closeAuthModal);
        authModal.addEventListener('click', (event) => {
            if (event.target === authModal) closeAuthModal();
        });

        document.querySelectorAll('.auth-toggle').forEach((button) => {
            button.addEventListener('click', () => {
                openAuthModal(button.dataset.auth || 'login');
            });
        });

        const loginForm = authModal.querySelector('[data-form="login"]');
        const registerForm = authModal.querySelector('[data-form="register"]');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = loginForm.querySelector('#login-email').value.trim();
            const password = loginForm.querySelector('#login-password').value.trim();
            const users = readStorage('diamond_users', []);
            const matchedUser = users.find((user) => user.email === email && user.password === password);
            const message = loginForm.querySelector('.auth-message');

            if (!matchedUser) {
                message.textContent = 'Invalid email or password.';
                message.classList.add('show');
                return;
            }

            writeStorage('diamond_current_user', {
                name: matchedUser.name,
                email: matchedUser.email
            });
            writeStorage('diamond_welcome_email', {
                to: matchedUser.email,
                subject: 'Welcome to Choksi Gems & Jewellers',
                message: 'Thank you for visiting Choksi Gems & Jewellers. We sincerely appreciate your interest and look forward to serving you.',
                createdAt: new Date().toISOString()
            });

            // Immediately update header
            updateHeaderAccount();

            message.textContent = `Welcome back, ${matchedUser.name}.`;
            message.classList.add('show');

            setTimeout(() => closeAuthModal(), 900);
        });

        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = registerForm.querySelector('#register-name').value.trim();
            const email = registerForm.querySelector('#register-email').value.trim();
            const phone = registerForm.querySelector('#register-phone').value.trim();
            const address = registerForm.querySelector('#register-address').value.trim();
            const password = registerForm.querySelector('#register-password').value.trim();
            const confirmPassword = registerForm.querySelector('#register-confirm-password').value.trim();
            const message = registerForm.querySelector('.auth-message');

            if (!name || !email || !phone || !address || !password || !confirmPassword) {
                message.textContent = 'Please complete all fields.';
                message.classList.add('show');
                return;
            }

            if (password !== confirmPassword) {
                message.textContent = 'Password and confirm password must match.';
                message.classList.add('show');
                return;
            }

            const users = readStorage('diamond_users', []);
            const exists = users.some((user) => user.email === email);

            if (exists) {
                message.textContent = 'An account with this email already exists.';
                message.classList.add('show');
                return;
            }

            users.push({ name, email, phone, address, password, createdAt: new Date().toISOString() });
            writeStorage('diamond_users', users);
            message.textContent = 'Registration Successful.';
            message.classList.add('show');
            setTimeout(() => openAuthModal('login'), 1100);
        });
    }

    function openAuthModal(mode = 'login') {
        const modal = document.getElementById('authModal');
        if (!modal) return;
        body.classList.add('modal-open');
        modal.classList.add('is-open');
        const authTabs = modal.querySelectorAll('.auth-tab');
        const authForms = modal.querySelectorAll('.auth-form');
        authTabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.mode === mode));
        authForms.forEach((form) => form.classList.toggle('is-active', form.dataset.form === mode));
    }

    function closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (!modal) return;
        modal.classList.remove('is-open');
        body.classList.remove('modal-open');
    }
    function updateHeaderAccount() {
        const actions = document.querySelector('.header-actions');

        if (!actions) return;

        // Remove existing account/login UI
        actions.querySelector('.user-account')?.remove();
        actions.querySelector('[data-auth="login"]')?.remove();

        const currentUser = readStorage('diamond_current_user', null);

        if (currentUser) {

            // =========================
            // LOGGED IN
            // =========================

            const userAccount = document.createElement('div');
            userAccount.className = 'user-account';

            userAccount.innerHTML = `
            <span class="user-name">
                <i class="fa-solid fa-user"></i>
                ${currentUser.name}
            </span>

            <button type="button" class="logout-button">
                <i class="fa-solid fa-right-from-bracket"></i>
                Logout
            </button>
        `;

            actions.appendChild(userAccount);

            // Logout without page refresh
            userAccount.querySelector('.logout-button').addEventListener('click', () => {
                localStorage.removeItem('diamond_current_user');
                updateHeaderAccount();
            });

        } else {

            // =========================
            // LOGGED OUT
            // =========================

            const loginBtn = document.createElement('button');

            loginBtn.type = 'button';
            loginBtn.className = 'auth-toggle';
            loginBtn.setAttribute('data-auth', 'login');
            loginBtn.setAttribute('aria-label', 'Login');

            loginBtn.innerHTML = '<i class="fa-solid fa-user"></i>';

            loginBtn.style.width = '42px';
            loginBtn.style.height = '42px';

            loginBtn.addEventListener('click', () => {
                openAuthModal('login');
            });

            actions.insertBefore(loginBtn, actions.firstChild);
        }
    }

    if (document.getElementById('authModal') || document.querySelector('.header-actions')) {
        addAuthModal();
    }

    updateHeaderAccount();

    const legalModal = document.createElement('div');
    legalModal.className = 'legal-modal';
    legalModal.innerHTML = `<div class="legal-panel" role="dialog" aria-modal="true" aria-labelledby="legal-title"><button type="button" class="icon-button legal-close" aria-label="Close policy"><i class="fa-solid fa-xmark"></i></button><span class="section-label">CHOKSI GEMS & JEWELLERS</span><h2 id="legal-title"></h2><div class="legal-content"></div></div>`;
    body.appendChild(legalModal);
    const legalContent = {
        privacy: ['Privacy Policy', '<p>Choksi Gems & Jewellers respects your privacy. Information shared through enquiry, account and newsletter forms is used to respond to your requests, provide relevant service and maintain our customer relationship.</p><p>We do not sell personal information. Data stored by this front-end demonstration remains in your browser local storage unless you choose to contact us directly. Please avoid entering sensitive information in public or shared devices.</p><p>You may contact us to ask about the information associated with your enquiry or request its removal, subject to records required for legitimate business and legal purposes.</p>'],
        terms: ['Terms & Conditions', '<p>By using this website, you acknowledge that product descriptions, images and educational material are provided for general information and may change as collections and availability are updated.</p><p>Diamond characteristics, grading documentation, pricing and availability should be confirmed with Choksi Gems & Jewellers before purchase. A grading report describes characteristics and is distinct from an appraisal or insurance valuation.</p><p>Website content may not be copied, reproduced or used commercially without permission. Enquiries and appointments are subject to confirmation by our team.</p>']
    };
    const closeLegal = () => legalModal.classList.remove('is-open');
    document.querySelectorAll('.footer-legal a').forEach((link) => {
        const type = link.textContent.toLowerCase().includes('privacy') ? 'privacy' : 'terms';
        link.href = `#${type}`;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            legalModal.querySelector('#legal-title').textContent = legalContent[type][0];
            legalModal.querySelector('.legal-content').innerHTML = legalContent[type][1];
            legalModal.classList.add('is-open');
        });
    });
    legalModal.querySelector('.legal-close').addEventListener('click', closeLegal);
    legalModal.addEventListener('click', (event) => { if (event.target === legalModal) closeLegal(); });

    if (document.querySelector('.auth-toggle')) {
        document.querySelectorAll('.auth-toggle').forEach((btn) => {
            btn.style.width = '42px';
            btn.style.height = '42px';
        });
    }
});
