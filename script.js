document.addEventListener("DOMContentLoaded", function() {
    function initializeLoadMore(sectionId, batchSize = 6) {
        const section = document.querySelector(`#${sectionId}`);
        const cards = section.querySelectorAll(".card");
        const loadMoreButton = section.querySelector("#loadMore");
        const goBackButton = section.querySelector("#goBack");
        const sections = document.querySelectorAll('section.reveal');

        let currentStartIndex = 0;

        function showCards(startIndex, count) {
            cards.forEach((card, index) => {
                if (index >= startIndex && index < startIndex + count) {
                    card.style.display = "block";
                    card.classList.add('fade-in');
                } else {
                    card.style.display = "none";
                }
            });
        }

        // Initial state
        showCards(currentStartIndex, batchSize);
        goBackButton.style.display = "none";

        loadMoreButton.addEventListener("click", function() {
            currentStartIndex += batchSize;
            showCards(currentStartIndex, batchSize);

            if (currentStartIndex + batchSize >= cards.length) {
                loadMoreButton.style.display = "none";
            }
            goBackButton.style.display = "block";
        });

        goBackButton.addEventListener("click", function() {
            currentStartIndex -= batchSize;
            if (currentStartIndex < 0) currentStartIndex = 0;
            showCards(currentStartIndex, batchSize);

            loadMoreButton.style.display = "block";
            if (currentStartIndex === 0) {
                goBackButton.style.display = "none";
            }
        });

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once it's revealed
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    ["attractions", "forts", "beaches", "food", "festivals", "temples"].forEach(sectionId => {
        initializeLoadMore(sectionId);
    });

    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            navigateToSection(sectionId);
            history.pushState({ sectionId: sectionId }, '', `#${sectionId}`);
        });
    });

    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.sectionId) {
            navigateToSection(event.state.sectionId);
        }
    });

    function navigateToSection(sectionId) {
        document.querySelector(`#${sectionId}`).scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Navbar background change on scroll
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Lazy loading images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const config = {
        rootMargin: '0px 0px 50px 0px',
        threshold: 0
    };

    let observer;
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    preloadImage(entry.target);
                    self.unobserve(entry.target);
                }
            });
        }, config);

        lazyImages.forEach(image => {
            observer.observe(image);
        });
    } else {
        lazyImages.forEach(image => {
            preloadImage(image);
        });
    }

    function preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) { return; }
        img.src = src;
    }

    // Enhanced Search Functionality
    const searchBar = document.getElementById('searchBar');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('section.reveal');
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No results found.';
    noResultsMessage.style.display = 'none';
    document.querySelector('.card-container').appendChild(noResultsMessage);

    let timeout;

    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const searchString = e.target.value.toLowerCase();
                let matches = 0;
                let matchedSections = new Set();

                cards.forEach(card => {
                    const cardText = card.textContent.toLowerCase();
                    const highlightedText = cardText.replace(new RegExp(searchString, 'gi'), (match) => `<mark>${match}</mark>`);
                    card.innerHTML = card.innerHTML.replace(/<mark>|<\/mark>/g, ''); // Clear previous highlights

                    if (cardText.includes(searchString)) {
                        card.style.display = '';
                        card.innerHTML = card.innerHTML.replace(cardText, highlightedText);
                        matchedSections.add(card.closest('section').id);
                        matches++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                sections.forEach(section => {
                    if (matchedSections.has(section.id)) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });

                noResultsMessage.style.display = matches === 0 ? 'block' : 'none';
            }, 300);
        }
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
});
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Tour booked successfully!');
});

document.querySelectorAll('.card .cta-button').forEach(button => {
    button.addEventListener('click', function() {
        alert('Tickets purchased successfully!');
    });
});
