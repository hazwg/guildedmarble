// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".nav-link");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Highlight active nav link on scroll
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (!id) return;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        document
          .querySelectorAll(".nav-link")
          .forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach((sec) => observer.observe(sec));

// Tabs (Target sectors)
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");

    tabButtons.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.id === `tab-${target}`;
      panel.classList.toggle("active", isActive);
      if (isActive) {
        panel.removeAttribute("aria-hidden");
      } else {
        panel.setAttribute("aria-hidden", "true");
      }
    });
  });
});

// Product filters
const finishFilter = document.getElementById("finishFilter");
const useFilter = document.getElementById("useFilter");
const productCards = document.querySelectorAll(".product-card");

function applyProductFilters() {
  const finish = finishFilter?.value || "all";
  const use = useFilter?.value || "all";

  productCards.forEach((card) => {
    const finishes = card.getAttribute("data-finish") || "";
    const uses = card.getAttribute("data-use") || "";

    const finishMatch = finish === "all" || finishes.includes(finish);
    const useMatch = use === "all" || uses.includes(use);

    card.style.display = finishMatch && useMatch ? "" : "none";
  });
}

finishFilter?.addEventListener("change", applyProductFilters);
useFilter?.addEventListener("change", applyProductFilters);

// Product modal content
const productDetails = {
  "Ziarat White": {
    description:
      "A high-demand Pakistani marble with a clean white base and soft grey veining.",
    bullets: [
      "Popular for premium kitchens, bathrooms and staircases.",
      "Works well with modern minimalist and Scandinavian-style interiors.",
      "Can be supplied as slabs or cut-to-size tiles.",
    ],
  },
  "Verona Beige": {
    description:
      "Warm beige marble ideal for lobbies, bathrooms and spa-style spaces.",
    bullets: [
      "Comfortable, timeless neutral tone.",
      "Suitable for large-format flooring and wall cladding.",
      "Pairs well with wood, brass and matte black fittings.",
    ],
  },
  "Black and Gold": {
    description:
      "Dramatic black marble with golden veining for statement applications.",
    bullets: [
      "Best used as a feature material in bars, counters or reception areas.",
      "Polished finish highlights the contrast in veining.",
      "Ideal where lighting can emphasise the stone’s movement.",
    ],
  },
  "Botticino Fancy": {
    description:
      "Classic cream marble with fine veining, suited to both traditional and modern designs.",
    bullets: [
      "Good choice for floors and walls where a calm, elegant base is needed.",
      "Works particularly well in hotels, showrooms and residential halls.",
      "Can be used alongside more dramatic marbles for feature areas.",
    ],
  },
  "Onyx Varieties": {
    description:
      "Translucent onyx options, designed for backlighting and feature installations.",
    bullets: [
      "Ideal for bars, receptions and spa features.",
      "Backlighting reveals depth and banding.",
      "Requires considered detailing and protection in high-traffic areas.",
    ],
  },
};

// Modal logic
const modalBackdrop = document.querySelector('.modal-backdrop[data-modal="product"]');
const modalClose = modalBackdrop?.querySelector(".modal-close");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductList = document.getElementById("modalProductList");

function openProductModal(productName) {
  if (!modalBackdrop) return;
  const data = productDetails[productName];
  if (!data) return;

  modalProductName.textContent = productName;
  modalProductDescription.textContent = data.description;
  modalProductList.innerHTML = "";

  data.bullets.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    modalProductList.appendChild(li);
  });

  modalBackdrop.hidden = false;
}

function closeProductModal() {
  if (!modalBackdrop) return;
  modalBackdrop.hidden = true;
}

document.querySelectorAll(".open-product-modal").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = btn.getAttribute("data-product");
    if (product) openProductModal(product);
  });
});

modalClose?.addEventListener("click", closeProductModal);

modalBackdrop?.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) {
    closeProductModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalBackdrop?.hidden) {
    closeProductModal();
  }
});

// Quote form multi-step
const form = document.getElementById("quoteForm");
const steps = document.querySelectorAll(".form-step");
const stepDots = document.querySelectorAll(".step-indicator-dot");
const nextButtons = document.querySelectorAll(".next-step");
const prevButtons = document.querySelectorAll(".prev-step");
const reviewBox = document.getElementById("reviewBox");

let currentStep = 1;

function showStep(step) {
  currentStep = step;
  steps.forEach((el) => {
    const stepNum = Number(el.getAttribute("data-step"));
    el.classList.toggle("form-step-active", stepNum === step);
  });
  stepDots.forEach((dot) => {
    const stepNum = Number(dot.getAttribute("data-step"));
    dot.classList.toggle("step-active", stepNum === step);
  });
}

function validateStep(step) {
  let valid = true;

  if (step === 1) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const nameError = document.querySelector('[data-error-for="name"]');
    const emailError = document.querySelector('[data-error-for="email"]');

    if (!name.value.trim()) {
      nameError.textContent = "Please enter your name.";
      valid = false;
    } else {
      nameError.textContent = "";
    }

    if (!email.value.trim()) {
      emailError.textContent = "Please enter your email.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      emailError.textContent = "Please enter a valid email address.";
      valid = false;
    } else {
      emailError.textContent = "";
    }
  }

  if (step === 2) {
    const projectType = document.getElementById("projectType");
    const projectError = document.querySelector('[data-error-for="projectType"]');
    if (!projectType.value) {
      projectError.textContent = "Please select a project type.";
      valid = false;
    } else {
      projectError.textContent = "";
    }
  }

  return valid;
}

nextButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 3) {
      showStep(currentStep + 1);
      if (currentStep === 3) {
        buildReview();
      }
    }
  });
});

prevButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
});

function buildReview() {
  if (!reviewBox) return;

  const fields = {
    Name: document.getElementById("name").value,
    Email: document.getElementById("email").value,
    Company: document.getElementById("company").value,
    Role: document.getElementById("role").value,
    "Project type": document.getElementById("projectType").value,
    "Preferred stones": [...document.getElementById("preferredProducts").selectedOptions]
      .map((o) => o.value)
      .join(", "),
    "Approx. area / quantity": document.getElementById("approxArea").value,
    Timescale: document.getElementById("timescale").value,
    "Additional notes": document.getElementById("projectNotes").value,
  };

  const lines = Object.entries(fields)
    .filter(([_, value]) => value && value.trim() !== "")
    .map(([label, value]) => `<strong>${label}:</strong> ${value}`);

  reviewBox.innerHTML = lines.length
    ? lines.map((l) => `<p>${l}</p>`).join("")
    : "<p>No details captured yet.</p>";
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  buildReview();

  const name = document.getElementById("name").value || "";
  const email = document.getElementById("email").value || "";
  const reviewText = reviewBox.innerText || "";

  const subject = encodeURIComponent("PakMarble UK - Project Quote Request");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nQuote request details:\n\n${reviewText}\n\n--\nSubmitted via PakMarble UK website.`
  );

  window.location.href = `mailto:info@pakmarble.co.uk?subject=${subject}&body=${body}`;
});

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Initial filter
applyProductFilters();
