document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // ROI Calculator function
    window.calculateROI = function() {
        const monthlyRevenue = parseFloat(document.getElementById('monthly-revenue').value) || 0;
        const refundRate = parseFloat(document.getElementById('refund-rate').value) || 0;
        const chargebackRate = parseFloat(document.getElementById('chargeback-rate').value) || 0;
        const serviceCost = 6000;
    
        if (monthlyRevenue <= 0 || refundRate < 0 || chargebackRate < 0) {
            alert('Please enter valid values.');
            return;
        }
    
        const annualRevenue = monthlyRevenue * 12;
        const refundLoss = annualRevenue * (refundRate / 100);
        const chargebackLoss = annualRevenue * (chargebackRate / 100);
        const totalLoss = refundLoss + chargebackLoss;
    
        const refundRecovery = refundLoss * 0.40;
        const chargebackRecovery = chargebackLoss * 0.30;
        const potentialRecovery = refundRecovery + chargebackRecovery;
        const netSavings = potentialRecovery - serviceCost;
        const roi = ((netSavings) / serviceCost) * 100;
    
        const formatCurrency = (val) => '$' + Math.round(val).toLocaleString();
        
        // Hide placeholder content when showing results
        const placeholderContent = document.querySelector('.placeholder-content');
        if (placeholderContent) {
            placeholderContent.style.display = 'none';
        }
        
        // Show results content
        const resultsContent = document.getElementById('results-content');
        resultsContent.style.display = 'block';
        resultsContent.style.width = '100%';
    
        resultsContent.innerHTML = `
            <div class="result-item">
                <span class="result-label">Annual Revenue Loss:</span>
                <span class="result-value">${formatCurrency(totalLoss)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Potential Recovery:</span>
                <span class="result-value">${formatCurrency(potentialRecovery)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Net Annual Savings:</span>
                <span class="result-value">${formatCurrency(netSavings)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">ROI:</span>
                <span class="result-value">${roi > 0 ? '+' : ''}${roi.toFixed(0)}%</span>
            </div>
        `;
    }
    
    // Alert functionality removed - no longer needed

    // Smooth scrolling for anchor links - optimized
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 100;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    });

    // Active nav link highlighting
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (currentLocation === '/' && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    // Sticky header effect with optimized performance
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    let ticking = false;
    let scrollTimeout;
    
    // Optimized scroll handler for better performance
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Only update classes if the scroll position crossed the threshold
                if ((scrollTop > 100 && lastScrollTop <= 100) || (scrollTop <= 100 && lastScrollTop > 100)) {
                    if (scrollTop > 100) {
                        header.classList.add('sticky');
                        if (topAlert) {
                            topAlert.classList.add('hidden');
                        }
                    } else {
                        header.classList.remove('sticky');
                        if (topAlert) {
                            topAlert.classList.remove('hidden');
                        }
                    }
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Use throttled scroll event with passive flag for better performance
    window.addEventListener('scroll', handleScroll, {passive: true});

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
        
        // Open first FAQ item by default
        if (faqItems[0]) {
            faqItems[0].classList.add('active');
        }
    }

    // Lead Capture Modal Functionality
    const modal = document.getElementById('leadModal');
    const modalClose = document.querySelector('.modal-close');
    const leadForm = document.getElementById('leadForm');
    const formSuccess = document.getElementById('formSuccess');
    let modalShown = false;
    
    // Show modal after 10 seconds
    setTimeout(() => {
        if (!modalShown) {
            showModal();
        }
    }, 10000);
    
    // Show modal function
    function showModal() {
        if (!modalShown) {
            modal.classList.add('active');
            modalShown = true;
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Hide modal function
    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideModal();
        }
    });
    
    // Form validation and submission
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Validate form
            let isValid = true;
            
            // Full Name validation
            const fullName = document.getElementById('fullName');
            if (!fullName.value.trim()) {
                showError('fullNameError', 'Full name is required');
                fullName.classList.add('error');
                isValid = false;
            } else {
                fullName.classList.remove('error');
            }
            
            // Email validation
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError('emailError', 'Email address is required');
                email.classList.add('error');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                showError('emailError', 'Please enter a valid email address');
                email.classList.add('error');
                isValid = false;
            } else {
                email.classList.remove('error');
            }
            
            // Service Type validation
            const serviceType = document.getElementById('serviceType');
            if (!serviceType.value) {
                showError('serviceTypeError', 'Please select a service type');
                serviceType.classList.add('error');
                isValid = false;
            } else {
                serviceType.classList.remove('error');
            }
            
            // Agreement validation
            const agreement = document.getElementById('agreement');
            if (!agreement.checked) {
                showError('agreementError', 'You must agree to the terms and conditions');
                isValid = false;
            }
            
            if (isValid) {
                // Submit form to Formspree
                const submitBtn = leadForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                
                // Create FormData and submit to Formspree
                const formData = new FormData(leadForm);
                
                fetch(leadForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Hide form and show success message
                        leadForm.style.display = 'none';
                        formSuccess.style.display = 'block';
                        
                        // Auto-close modal after 5 seconds
                        setTimeout(() => {
                            hideModal();
                            // Reset form for next time
                            setTimeout(() => {
                                leadForm.style.display = 'block';
                                formSuccess.style.display = 'none';
                                leadForm.reset();
                                clearErrors();
                                submitBtn.textContent = originalText;
                                submitBtn.disabled = false;
                            }, 500);
                        }, 5000);
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting the form. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
            }
        });
    }
    
    // Helper functions
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        const inputElements = document.querySelectorAll('.lead-form input, .lead-form select, .lead-form textarea');
        inputElements.forEach(element => {
            element.classList.remove('error');
        });
    }
    
    // Real-time validation feedback
    const formInputs = document.querySelectorAll('.lead-form input, .lead-form select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Clear error state when user starts correcting
            if (this.classList.contains('error') && this.value.trim()) {
                this.classList.remove('error');
                const errorId = this.id + 'Error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });
    });
});