// Initialisation de toutes les fonctionnalités au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Référence aux éléments DOM fréquemment utilisés
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
    const scrollTopBtn = createScrollTopButton();
    
    // Initialiser AOS (Animate On Scroll) si disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Gestion du menu mobile
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            const icon = mobileMenuBtn.querySelector('i');
            
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Animation du menu
                gsapMenuAnimation(true);
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Animation inverse du menu
                gsapMenuAnimation(false);
            }
        });
    }

    // Gestion des liens de navigation
    navLinks.forEach(link => {
        // Ajouter la classe animated-link pour l'effet de survol
        link.classList.add('animated-link');
        
        // Fermer le menu mobile lorsqu'on clique sur un lien
        link.addEventListener('click', function(e) {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                gsapMenuAnimation(false);
            }
        });
    });
    
    // Navigation active en fonction de la section visible
    function setActiveNavLink() {
        let current = '';
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach((link) => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // Défilement fluide pour les liens d'ancrage avec animation GSAP
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Animation avec GSAP si disponible, sinon utiliser scrollTo natif
                if (typeof gsap !== 'undefined') {
                    gsap.to(window, {
                        duration: 1, 
                        scrollTo: { y: targetPosition, autoKill: false },
                        ease: 'power2.out'
                    });
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Gestion améliorée du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Ajouter des classes pour les animations
        const formElements = contactForm.querySelectorAll('input, textarea');
        formElements.forEach(element => {
            // Créer un conteneur pour l'effet de focus
            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
            
            // Ajouter l'effet de focus
            element.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });
            
            element.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentNode.classList.remove('focused');
                }
            });
            
            // Si l'élément a déjà une valeur (ex: après erreur)
            if (element.value !== '') {
                element.parentNode.classList.add('focused');
            }
        });
        
        // Gestion de la soumission du formulaire
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation des champs
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.parentNode.classList.add('error');
                } else {
                    field.parentNode.classList.remove('error');
                }
            });
            
            // Vérification de l'email
            const emailField = contactForm.querySelector('[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.parentNode.classList.add('error');
                }
            }
            
            if (isValid) {
                // Animation de chargement
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                submitBtn.disabled = true;
                
                // Simuler une requête AJAX (à remplacer par l'envoi réel du formulaire)
                setTimeout(() => {
                    // Afficher un message de succès stylisé
                    const formContainer = contactForm.parentNode;
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <h3>Message envoyé avec succès !</h3>
                        <p>Nous vous contacterons bientôt.</p>
                    `;
                    
                    // Animer la transition
                    contactForm.style.height = contactForm.offsetHeight + 'px';
                    contactForm.style.overflow = 'hidden';
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to(contactForm, {
                            duration: 0.5, 
                            opacity: 0, 
                            y: 20, 
                            onComplete: () => {
                                contactForm.style.display = 'none';
                                formContainer.appendChild(successMessage);
                                gsap.fromTo(successMessage, 
                                    {opacity: 0, y: -20},
                                    {duration: 0.5, opacity: 1, y: 0}
                                );
                            }
                        });
                    } else {
                        contactForm.style.display = 'none';
                        formContainer.appendChild(successMessage);
                    }
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                }, 1500);
            }
        });
    }

    // Animations au défilement
    function setupScrollAnimations() {
        // Si GSAP et ScrollTrigger sont disponibles, les utiliser pour des animations avancées
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Animation des titres de section
            gsap.utils.toArray('section h2').forEach(heading => {
                gsap.fromTo(heading, 
                    { opacity: 0, y: 30 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8, 
                        scrollTrigger: {
                            trigger: heading,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
            
            // Animation des cartes de service
            gsap.utils.toArray('.card').forEach((card, index) => {
                gsap.fromTo(card, 
                    { opacity: 0, y: 50 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6, 
                        delay: index * 0.1,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
            
            // Effet parallaxe pour les images de fond
            gsap.utils.toArray('.parallax-bg').forEach(bg => {
                gsap.to(bg, {
                    y: '-20%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: bg.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });
        } else {
            // Fallback avec animations CSS simples
            const elements = document.querySelectorAll('.card, .gallery-item, .about-content, .contact-container, .team-member, .vignes-content, .attelage-content');
            
            const style = document.createElement('style');
            style.textContent = `
                .animate-on-scroll {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }
                .animate-on-scroll.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
            
            elements.forEach(element => {
                element.classList.add('animate-on-scroll');
            });
            
            function revealElements() {
                const windowHeight = window.innerHeight;
                elements.forEach(element => {
                    const elementPosition = element.getBoundingClientRect().top;
                    if (elementPosition < windowHeight - 100) {
                        element.classList.add('revealed');
                    }
                });
            }
            
            window.addEventListener('scroll', revealElements);
            revealElements(); // Vérification initiale
        }
    }
    
    // Fonction pour créer le bouton de retour en haut
    function createScrollTopButton() {
        const button = document.createElement('button');
        button.className = 'scroll-top-btn';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.setAttribute('aria-label', 'Retour en haut');
        button.style.display = 'none';
        document.body.appendChild(button);
        
        button.addEventListener('click', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.out' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        return button;
    }
    
    // Animation du menu mobile avec GSAP si disponible
    function gsapMenuAnimation(isOpen) {
        if (typeof gsap !== 'undefined') {
            const navItems = document.querySelectorAll('nav ul li');
            
            if (isOpen) {
                gsap.fromTo(navItems, 
                    { opacity: 0, y: -20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        stagger: 0.1, 
                        duration: 0.4,
                        ease: 'power2.out'
                    }
                );
            }
        }
    }
    
    // Initialiser les animations de défilement
    setupScrollAnimations();
    
    // Gérer le changement de header au défilement et le bouton de retour en haut
    window.addEventListener('scroll', function() {
        // Mise à jour du header et du bouton de retour en haut
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            scrollTopBtn.style.display = 'block';
            
            if (typeof gsap !== 'undefined' && scrollTopBtn.style.opacity !== '1') {
                gsap.to(scrollTopBtn, { duration: 0.3, opacity: 1 });
            }
        } else {
            header.classList.remove('scrolled');
            
            if (typeof gsap !== 'undefined' && scrollTopBtn.style.display !== 'none') {
                gsap.to(scrollTopBtn, { 
                    duration: 0.3, 
                    opacity: 0,
                    onComplete: () => { scrollTopBtn.style.display = 'none'; }
                });
            } else {
                scrollTopBtn.style.display = 'none';
            }
        }
        
        // Mettre à jour le lien de navigation actif
        setActiveNavLink();
    });
    
    // Initialisation initiale
    setActiveNavLink();
});

// Gestion des effets de parallaxe pour les images de fond
window.addEventListener('load', function() {
    // Ajouter la classe parallax-bg aux images qui nécessitent un effet de parallaxe
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const parallaxBg = document.createElement('div');
        parallaxBg.className = 'parallax-bg';
        heroSection.prepend(parallaxBg);
    }
    
    // Animation des compteurs pour les statistiques
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // 2 secondes
            const steps = 50;
            const stepValue = target / steps;
            let current = 0;
            const increment = target / (duration / (1000 / steps));
            
            const updateCounter = () => {
                current += increment;
                if (current > target) current = target;
                counter.textContent = Math.floor(current);
                if (current < target) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counterObserver.observe(counter);
        });
    }
    
    initCounters();
});

// Chargement des scripts externes
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Chargement des polices Google en JavaScript pour un meilleur contrôle
function loadGoogleFonts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;600&family=Playfair+Display:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
}

// Charger les scripts GSAP pour les animations avancées (si besoin)
function loadGSAP() {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js', () => {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js', () => {
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollToPlugin.min.js', () => {
                // Déclencher un événement personnalisé lorsque GSAP est complètement chargé
                document.dispatchEvent(new Event('gsapReady'));
            });
        });
    });
}

// Initialiser le chargement des ressources
loadGoogleFonts();

// Pour optimiser les performances, on peut charger GSAP de manière conditionnelle
// par exemple seulement pour les grands écrans ou après le chargement initial
if (window.innerWidth > 768) {
    // Charger GSAP après un délai pour prioriser le contenu essentiel
    setTimeout(loadGSAP, 1000);
}
