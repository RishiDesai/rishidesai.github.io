document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.querySelector('.prose');
    if (!contentDiv) return;

    // Function to generate a slug from heading text
    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .trim();                         // Trim - from start and end
    }

    // Process all headings to ensure they have IDs
    const headings = contentDiv.querySelectorAll('h1, h2, h3, h4');
    const tocList = document.getElementById('toc-list');
    
    if (!tocList || headings.length === 0) return;
    
    // Clear any existing content
    tocList.innerHTML = '';
    
    // Add IDs to headings if they don't have them
    headings.forEach(heading => {
        if (!heading.id) {
            heading.id = slugify(heading.textContent);
        }
    });
    
    // Build hierarchical TOC
    let currentH1Section = null;
    let currentH2Section = null;
    let currentH3Section = null;

    // Filter to exclude the page title (first h1)
    const pageTitle = document.querySelector('h1.text-4xl');
    const tocHeadings = Array.from(headings).filter(h => 
        h !== pageTitle && 
        parseInt(h.tagName.charAt(1)) >= 1 && 
        parseInt(h.tagName.charAt(1)) <= 4
    );
    
    // Add an "Introduction" entry for content before the first heading
    if (tocHeadings.length > 0 && tocHeadings[0].tagName !== 'H1') {
        // Create a virtual H1 for the introduction
        const introSection = document.createElement('li');
        introSection.className = 'toc-section';
        
        const introLink = document.createElement('a');
        introLink.href = '#'; // Scroll to top
        introLink.textContent = 'Introduction';
        introLink.className = 'toc-link toc-link-h1';
        introLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        introSection.appendChild(introLink);
        
        // Create nested list for potential child items
        const nestedList = document.createElement('ul');
        nestedList.className = 'toc-nested-list';
        introSection.appendChild(nestedList);
        
        // Add to main TOC
        tocList.appendChild(introSection);
    }
    
    tocHeadings.forEach(heading => {
        const headingLevel = parseInt(heading.tagName.charAt(1));
        const headingId = heading.id;
        const headingText = heading.textContent;
        
        if (headingLevel === 1) {
            // Create a new section for H1
            currentH1Section = document.createElement('li');
            currentH1Section.className = 'toc-section';
            
            // Create H1 link
            const h1Link = document.createElement('a');
            h1Link.href = `#${headingId}`;
            h1Link.textContent = headingText;
            h1Link.className = 'toc-link toc-link-h1';
            h1Link.setAttribute('data-target', headingId);
            
            currentH1Section.appendChild(h1Link);
            
            // Create nested list for child items
            const nestedList = document.createElement('ul');
            nestedList.className = 'toc-nested-list';
            currentH1Section.appendChild(nestedList);
            
            // Add to main TOC
            tocList.appendChild(currentH1Section);
            
            // Reset lower level sections
            currentH2Section = null;
            currentH3Section = null;
        }
        else if (headingLevel === 2) {
            // If no parent H1 exists, create a default section
            if (!currentH1Section) {
                currentH1Section = document.createElement('li');
                currentH1Section.className = 'toc-section';
                
                const nestedList = document.createElement('ul');
                nestedList.className = 'toc-nested-list';
                currentH1Section.appendChild(nestedList);
                
                tocList.appendChild(currentH1Section);
            }
            
            // Create a new section for H2
            currentH2Section = document.createElement('li');
            currentH2Section.className = 'toc-child-item';
            
            // Create H2 link
            const h2Link = document.createElement('a');
            h2Link.href = `#${headingId}`;
            h2Link.textContent = headingText;
            h2Link.className = 'toc-link toc-link-h2';
            h2Link.setAttribute('data-target', headingId);
            
            currentH2Section.appendChild(h2Link);
            
            // Create nested list for child items
            const nestedList = document.createElement('ul');
            nestedList.className = 'toc-nested-list';
            currentH2Section.appendChild(nestedList);
            
            // Add to H1 section
            currentH1Section.querySelector('.toc-nested-list').appendChild(currentH2Section);
            
            // Reset H3 section
            currentH3Section = null;
        } 
        else if (headingLevel === 3) {
            // If no parent H2 exists but H1 does, create a default H2 section
            if (!currentH2Section && currentH1Section) {
                currentH2Section = document.createElement('li');
                currentH2Section.className = 'toc-child-item';
                
                const nestedList = document.createElement('ul');
                nestedList.className = 'toc-nested-list';
                currentH2Section.appendChild(nestedList);
                
                currentH1Section.querySelector('.toc-nested-list').appendChild(currentH2Section);
            }
            // If neither H1 nor H2 exist, create default containers
            else if (!currentH1Section) {
                currentH1Section = document.createElement('li');
                currentH1Section.className = 'toc-section';
                
                const h1NestedList = document.createElement('ul');
                h1NestedList.className = 'toc-nested-list';
                currentH1Section.appendChild(h1NestedList);
                
                currentH2Section = document.createElement('li');
                currentH2Section.className = 'toc-child-item';
                
                const h2NestedList = document.createElement('ul');
                h2NestedList.className = 'toc-nested-list';
                currentH2Section.appendChild(h2NestedList);
                
                h1NestedList.appendChild(currentH2Section);
                tocList.appendChild(currentH1Section);
            }
            
            // Create a new item for H3
            currentH3Section = document.createElement('li');
            currentH3Section.className = 'toc-child-item';
            
            // Create H3 link
            const h3Link = document.createElement('a');
            h3Link.href = `#${headingId}`;
            h3Link.textContent = headingText;
            h3Link.className = 'toc-link toc-link-h3';
            h3Link.setAttribute('data-target', headingId);
            
            currentH3Section.appendChild(h3Link);
            
            // Create nested list for H4 child items
            const nestedList = document.createElement('ul');
            nestedList.className = 'toc-nested-list-h4';
            currentH3Section.appendChild(nestedList);
            
            // Add to parent H2 section
            currentH2Section.querySelector('.toc-nested-list').appendChild(currentH3Section);
        }
        else if (headingLevel === 4) {
            // If we have H1 but no H2/H3, create direct H4 under H1
            if (currentH1Section && !currentH2Section && !currentH3Section) {
                const h4Item = document.createElement('li');
                h4Item.className = 'toc-child-item';
                
                // Create H4 link
                const h4Link = document.createElement('a');
                h4Link.href = `#${headingId}`;
                h4Link.textContent = headingText;
                h4Link.className = 'toc-link toc-link-h4 toc-link-h4-under-h1';
                h4Link.setAttribute('data-target', headingId);
                
                h4Item.appendChild(h4Link);
                
                // Add directly to H1 section
                currentH1Section.querySelector('.toc-nested-list').appendChild(h4Item);
                
                // Add click handler for smooth scrolling
                const link = document.querySelector(`[data-target="${headingId}"]`);
                if (link) {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        document.getElementById(headingId).scrollIntoView({
                            behavior: 'smooth'
                        });
                        
                        // Update URL hash
                        history.pushState(null, null, `#${headingId}`);
                    });
                }
                
                return; // Use return instead of continue
            }
            
            // If no parent H3 exists but H2 does, create a default H3 section
            if (!currentH3Section && currentH2Section) {
                currentH3Section = document.createElement('li');
                currentH3Section.className = 'toc-child-item';
                
                const nestedList = document.createElement('ul');
                nestedList.className = 'toc-nested-list-h4';
                currentH3Section.appendChild(nestedList);
                
                currentH2Section.querySelector('.toc-nested-list').appendChild(currentH3Section);
            } 
            // If neither H2 nor H3 exist but H1 does, create default containers
            else if (!currentH2Section && currentH1Section) {
                currentH2Section = document.createElement('li');
                currentH2Section.className = 'toc-child-item';
                
                const h2NestedList = document.createElement('ul');
                h2NestedList.className = 'toc-nested-list';
                currentH2Section.appendChild(h2NestedList);
                
                currentH3Section = document.createElement('li');
                currentH3Section.className = 'toc-child-item';
                
                const h3NestedList = document.createElement('ul');
                h3NestedList.className = 'toc-nested-list-h4';
                currentH3Section.appendChild(h3NestedList);
                
                h2NestedList.appendChild(currentH3Section);
                currentH1Section.querySelector('.toc-nested-list').appendChild(currentH2Section);
            }
            // If no H1, H2, or H3 exist, create all default containers
            else if (!currentH1Section) {
                currentH1Section = document.createElement('li');
                currentH1Section.className = 'toc-section';
                
                const h1NestedList = document.createElement('ul');
                h1NestedList.className = 'toc-nested-list';
                currentH1Section.appendChild(h1NestedList);
                
                currentH2Section = document.createElement('li');
                currentH2Section.className = 'toc-child-item';
                
                const h2NestedList = document.createElement('ul');
                h2NestedList.className = 'toc-nested-list';
                currentH2Section.appendChild(h2NestedList);
                
                currentH3Section = document.createElement('li');
                currentH3Section.className = 'toc-child-item';
                
                const h3NestedList = document.createElement('ul');
                h3NestedList.className = 'toc-nested-list-h4';
                currentH3Section.appendChild(h3NestedList);
                
                h2NestedList.appendChild(currentH3Section);
                h1NestedList.appendChild(currentH2Section);
                tocList.appendChild(currentH1Section);
            }
            
            // Create a new item for H4
            const h4Item = document.createElement('li');
            h4Item.className = 'toc-child-item';
            
            // Create H4 link
            const h4Link = document.createElement('a');
            h4Link.href = `#${headingId}`;
            h4Link.textContent = headingText;
            h4Link.className = 'toc-link toc-link-h4';
            h4Link.setAttribute('data-target', headingId);
            
            h4Item.appendChild(h4Link);
            
            // Add to parent H3 section
            currentH3Section.querySelector('.toc-nested-list-h4').appendChild(h4Item);
        }
        
        // Add click handler for smooth scrolling
        const link = document.querySelector(`[data-target="${headingId}"]`);
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById(headingId).scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, `#${headingId}`);
            });
        }
    });
    
    // Function to highlight the current section in TOC
    function updateTOC() {
        // Get all headings that are targets in our TOC
        const headingElements = Array.from(headings).filter(h => h !== pageTitle);
        if (headingElements.length === 0) return;
        
        // Calculate where each heading is relative to the viewport
        const headingPositions = headingElements.map(heading => {
            const rect = heading.getBoundingClientRect();
            return {
                id: heading.id,
                top: rect.top,
                bottom: rect.bottom
            };
        });
        
        // Find the first heading that's at or above the 1/3 mark of viewport
        const viewportHeight = window.innerHeight;
        const targetPosition = viewportHeight / 3;
        
        // Find headings that are visible in the viewport
        let activeHeading = null;
        for (let i = 0; i < headingPositions.length; i++) {
            const heading = headingPositions[i];
            if (heading.top <= targetPosition && heading.bottom > 0) {
                activeHeading = heading.id;
                break;
            }
        }
        
        // If no heading is active but we've scrolled down, use the last heading
        if (!activeHeading && window.scrollY > 0 && headingPositions.length > 0) {
            // Find the last heading that's above the viewport
            for (let i = headingPositions.length - 1; i >= 0; i--) {
                if (headingPositions[i].bottom <= 0) {
                    activeHeading = headingPositions[i].id;
                    break;
                }
            }
            
            // If still no active heading, use the first one
            if (!activeHeading) {
                activeHeading = headingPositions[0].id;
            }
        }
        
        // Update active class for TOC links
        const tocLinks = document.querySelectorAll('.toc-link');
        tocLinks.forEach(link => {
            if (link.getAttribute('data-target') === activeHeading) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Update TOC on scroll and on load
    window.addEventListener('scroll', updateTOC, { passive: true });
    updateTOC();
    
    // Update TOC when the window is resized
    window.addEventListener('resize', updateTOC, { passive: true });
}); 