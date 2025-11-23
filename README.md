<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buy Ultra Clean Laundry Soap | QuickShelf.com</title>
    <link rel="stylesheet" href="styles.css"> 
    <link rel="stylesheet" href="detail-styles.css"> 
</head>
<body>

    <header class="main-header">
        <h1>QuickShelf.com</h1>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                </ul>
        </nav>
        <div class="cart-icon">🛒 (0)</div>
    </header>

    <main class="detail-container">

        <p class="breadcrumbs">
            <a href="index.html">Home</a> &gt; 
            <a href="#detergents">Detergents</a> &gt; 
            <span>Ultra Clean Laundry Soap</span>
        </p>

        <section class="product-detail-area">

            <div class="product-gallery">
                <div class="main-image">
                    <img src="images/laundry_soap_large.jpg" alt="Ultra Clean Laundry Soap Bottle" id="primary-image">
                </div>
                <div class="thumbnail-strip">
                    <img src="images/laundry_soap_view1.jpg" 
                         alt="View 1" 
                         class="thumbnail active-thumb" 
                         data-full="images/laundry_soap_large.jpg"
                         onclick="changeImage(this)">
                    <img src="images/laundry_soap_view2.jpg" 
                         alt="View 2" 
                         class="thumbnail" 
                         data-full="images/laundry_soap_view2_large.jpg"
                         onclick="changeImage(this)">
                    <img src="images/laundry_soap_view3.jpg" 
                         alt="View 3" 
                         class="thumbnail" 
                         data-full="images/laundry_soap_view3_large.jpg"
                         onclick="changeImage(this)">
                </div>
            </div>

            <div class="product-info">
                </div>
        </section>

        <section class="related-products">
            </section>

    </main>
    
    <footer class="main-footer">
        <p>&copy; 2025 QuickShelf.com | All Rights Reserved</p>
    </footer>

    <script>
        /**
         * Changes the main product image when a thumbnail is clicked.
         * @param {HTMLElement} thumbnail - The clicked thumbnail element.
         */
        function changeImage(thumbnail) {
            // 1. Get the URL of the large image from the thumbnail's data-full attribute
            const newImageSrc = thumbnail.getAttribute('data-full');
            
            // 2. Set the main image source
            const primaryImage = document.getElementById('primary-image');
            primaryImage.src = newImageSrc;
            primaryImage.alt = thumbnail.alt; // Update alt text for accessibility

            // 3. Update active state of thumbnails (for visual feedback)
            // Remove 'active-thumb' class from all thumbnails
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumb => {
                thumb.classList.remove('active-thumb');
            });

            // Add 'active-thumb' class to the clicked thumbnail
            thumbnail.classList.add('active-thumb');
        }
    </script>
</body>
</html>
# QUICKSHELF.COM
