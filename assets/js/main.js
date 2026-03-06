const SITE_CONFIG = {
  brandName: "VARAD Healthcare",
  whatsappNumber: "919426537414",
  contact: {
    phone: "+91 94265 37414",
    email: "hello@reallygreatsite.com",
    address: "723, Nakshtra-VIII, Opp. Sun City Appt, Sadhu Vaswani Road, Rajkot - 360005"
  },
  whyChoosePoints: [
    {
      title: "Clinically Focused Designs",
      description: "Each support is shaped for comfort, stability, and daily movement in real-life use."
    },
    {
      title: "Consistent Quality Materials",
      description: "Breathable fabrics, durable stitching, and secure straps provide reliable long-term support."
    },
    {
      title: "Wide Orthopedic Range",
      description: "From elbow and wrist to knee, back, compression, and therapy products in one catalog."
    },
    {
      title: "Made For Everyday Recovery",
      description: "Products are practical for home, travel, work routines, and post-injury care."
    }
  ],
  faqs: [
    {
      question: "Are these products suitable for daily use?",
      answer:
        "Most VARAD support products are designed for daily wear, with breathable fabrics and comfort-focused fits for regular routines."
    },
    {
      question: "Do you offer products for post-surgery recovery?",
      answer:
        "Yes. The catalog includes immobilizers, braces, and compression supports commonly used during rehabilitation and post-operative recovery."
    },
    {
      question: "Can I place an order directly on this website?",
      answer:
        "This website is a product showcase catalog. Use the Enquiry button or WhatsApp contact to request pricing and availability."
    },
    {
      question: "How do I choose the right product variant?",
      answer:
        "Use the product details page to compare features, benefits, and recommended use cases, then contact the team for personalized guidance."
    }
  ]
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function formatPrice(value) {
  return inrFormatter.format(value);
}

function productLink(slug) {
  return `product.html?slug=${encodeURIComponent(slug)}`;
}

function getProductBySlug(slug) {
  return products.find((item) => item.slug === slug);
}

function productCardTemplate(product) {
  const topBenefits = product.benefits.slice(0, 3).map((benefit) => `<li>${benefit}</li>`).join("");

  return `
    <article class="product-card">
      <a href="${productLink(product.slug)}" class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
      </a>

      <div class="product-content">
        <span class="product-badge">${product.badge}</span>
        <p class="product-category">${product.category}</p>
        <h3><a href="${productLink(product.slug)}">${product.name}</a></h3>
        <p class="product-variant">${product.variant}</p>
        <p class="product-description">${product.description}</p>

        <ul class="product-benefits">${topBenefits}</ul>

        <div class="product-footer">
          <p class="product-price">${formatPrice(product.price)}</p>
          <a href="${productLink(product.slug)}" class="ghost-link">View Details</a>
        </div>
      </div>
    </article>
  `;
}

function setupGlobalLayout() {
  $("#currentYear")?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));

  $$(".js-phone").forEach((node) => {
    node.textContent = SITE_CONFIG.contact.phone;
  });
  $$(".js-email").forEach((node) => {
    node.textContent = SITE_CONFIG.contact.email;
  });
  $$(".js-address").forEach((node) => {
    node.textContent = SITE_CONFIG.contact.address;
  });

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
  $$(".js-whatsapp-link").forEach((link) => {
    link.setAttribute("href", whatsappUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  });

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    $$("a", mainNav).forEach((link) => {
      link.addEventListener("click", () => mainNav.classList.remove("open"));
    });
  }
}

function initHomePage() {
  const featuredContainer = $("#featuredProducts");
  const popularContainer = $("#popularProducts");
  const countBtn = $("#catalogCountBtn");
  const whyChooseGrid = $("#whyChooseGrid");
  const faqList = $("#faqList");

  if (featuredContainer) {
    const featured = featuredProductSlugs
      .map((slug) => getProductBySlug(slug))
      .filter(Boolean);
    featuredContainer.innerHTML = featured.map((product) => productCardTemplate(product)).join("");
  }

  if (popularContainer) {
    popularContainer.innerHTML = products.slice(0, 8).map((product) => productCardTemplate(product)).join("");
  }

  if (countBtn) {
    countBtn.textContent = `View Full Catalog (${products.length} Products)`;
  }

  if (whyChooseGrid) {
    whyChooseGrid.innerHTML = SITE_CONFIG.whyChoosePoints
      .map(
        (point) => `
        <article class="info-card">
          <h3>${point.title}</h3>
          <p>${point.description}</p>
        </article>
      `
      )
      .join("");
  }

  if (faqList) {
    faqList.innerHTML = SITE_CONFIG.faqs
      .map(
        (faq) => `
        <details>
          <summary>${faq.question}</summary>
          <p>${faq.answer}</p>
        </details>
      `
      )
      .join("");
  }
}

function initProductsPage() {
  const filtersRoot = $("#categoryFilters");
  const grid = $("#productsGrid");
  const searchInput = $("#productSearch");
  const resultCount = $("#resultCount");
  const emptyState = $("#emptyState");

  if (!filtersRoot || !grid || !searchInput || !resultCount || !emptyState) {
    return;
  }

  let activeCategory = "All";
  let searchTerm = "";

  function renderFilters() {
    const categories = ["All", ...productCategories];
    filtersRoot.innerHTML = categories
      .map(
        (category) =>
          `<button class="chip ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">${category}</button>`
      )
      .join("");

    $$("button", filtersRoot).forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category || "All";
        renderFilters();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      if (!categoryMatch) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = `${product.name} ${product.variant} ${product.description} ${product.features.join(" ")} ${product.benefits.join(" ")}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });

    resultCount.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

    if (!filtered.length) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    grid.innerHTML = filtered.map((product) => productCardTemplate(product)).join("");
  }

  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    renderProducts();
  });

  renderFilters();
  renderProducts();
}

function initProductPage() {
  const root = $("#productDetailRoot");
  if (!root) {
    return;
  }

  const slug = new URLSearchParams(window.location.search).get("slug");
  const product = slug ? getProductBySlug(slug) : null;

  if (!product) {
    root.innerHTML = `
      <div class="empty-state">
        <h1>Product Not Found</h1>
        <p>The product you are looking for is not available in this catalog.</p>
        <a href="products.html" class="btn btn-primary">Back To Catalog</a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} ${product.variant} | VARAD Healthcare`;
  const metaDescription = $("meta[name='description']");
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `${product.description} Explore features, benefits, and MRP for ${product.name}.`
    );
  }

  const gallery = product.gallery
    .map(
      (image, index) => `
        <button type="button" class="thumb-btn ${index === 0 ? "is-active" : ""}" data-image="${image}" aria-label="View image ${index + 1}">
          <img src="${image}" alt="${product.name} thumbnail ${index + 1}" class="product-image" loading="lazy" />
        </button>
      `
    )
    .join("");

  const features = product.features.map((item) => `<li>${item}</li>`).join("");
  const benefits = product.benefits.map((item) => `<li>${item}</li>`).join("");
  const recommended = product.recommendedFor.map((item) => `<li>${item}</li>`).join("");

  const message = encodeURIComponent(
    `Hello VARAD Healthcare, I want details for ${product.name} (${product.variant}) priced at ${formatPrice(product.price)}.`
  );
  const enquiryLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;

  root.innerHTML = `
    <div class="breadcrumbs">
      <a href="index.html">Home</a>
      <span>/</span>
      <a href="products.html">Products</a>
      <span>/</span>
      <span>${product.name}</span>
    </div>

    <div class="product-detail-layout">
      <div class="product-gallery">
        <div class="gallery-main">
          <img src="${product.image}" alt="${product.name}" class="product-image" id="mainProductImage" />
        </div>
        <div class="gallery-thumbs" id="galleryThumbs">${gallery}</div>
      </div>

      <div class="product-detail-panel">
        <span class="product-badge">${product.badge}</span>
        <p class="product-category">${product.category}</p>
        <h1>${product.name}</h1>
        <p class="product-variant">${product.variant}</p>
        <p class="product-price hero-price">${formatPrice(product.price)}</p>
        <p class="product-description">${product.description}</p>

        <a href="${enquiryLink}" target="_blank" rel="noreferrer" class="btn btn-primary">Enquiry Now</a>
      </div>
    </div>

    <div class="detail-grid">
      <article class="detail-card">
        <h2>Features / Specifications</h2>
        <ul>${features}</ul>
      </article>
      <article class="detail-card">
        <h2>Benefits</h2>
        <ul>${benefits}</ul>
      </article>
      <article class="detail-card">
        <h2>Recommended For</h2>
        <ul>${recommended}</ul>
      </article>
    </div>
  `;

  const mainImage = $("#mainProductImage", root);
  const thumbsRoot = $("#galleryThumbs", root);

  if (mainImage && thumbsRoot) {
    $$(".thumb-btn", thumbsRoot).forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const selectedImage = thumb.dataset.image;
        if (!selectedImage) {
          return;
        }

        mainImage.src = selectedImage;
        $$(".thumb-btn", thumbsRoot).forEach((node) => node.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });
  }
}

function boot() {
  setupGlobalLayout();

  const page = document.body.dataset.page;
  if (page === "home") {
    initHomePage();
    return;
  }
  if (page === "products") {
    initProductsPage();
    return;
  }
  if (page === "product") {
    initProductPage();
  }
}

document.addEventListener("DOMContentLoaded", boot);
