(function () {
  "use strict";
  document.documentElement.classList.add("js-ready");
  const data = window.PORTFOLIO || {};
  const $ = (selector, root) => (root || document).querySelector(selector);
  const make = (tag, cls, text) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const safeUrl = (href) => {
    try {
      const url = new URL(href, location.href);
      const localProject = /^projects\/[a-z0-9-]+(?:\/[a-z0-9.-]+)*$/i.test(href);
      return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) ||
        (url.protocol === "file:" && localProject) ? href : null;
    } catch (_) { return null; }
  };
  const makeLink = (label, href, className) => {
    const safe = safeUrl(href || "");
    if (!safe) return null;
    const anchor = make("a", className, label);
    anchor.href = safe;
    if (/^https?:/.test(safe)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  };

  document.querySelectorAll("[data-profile]").forEach((element) => {
    const value = data.profile && data.profile[element.dataset.profile];
    if (value) element.textContent = value;
  });
  (data.roles || []).forEach((role) => $("#role-list").append(make("span", "role-pill", role)));
  $("#about-summary").textContent = data.about || "To Be Added";
  (data.roles || []).forEach((role) => {
    const tag = make("span", "about-interest", role);
    $("#about-interest-list").append(tag);
  });
  (data.education || []).forEach((item) => {
    const row = make("div", "education-item");
    row.append(make("span", "education-mark", "↗"), make("div", "education-copy"));
    row.lastElementChild.append(make("strong", "", item.title), make("span", "", item.detail));
    $("#education-list").append(row);
  });

  if (data.experience) {
    const experience = data.experience;
    const card = make("article", "experience-item reveal");
    const visual = make("div", "experience-visual");
    visual.append(make("span", "experience-kicker", "FINANCE INTERNSHIP"));
    if (/jbm/i.test(experience.organization || "")) {
      const logoLink = make("a", "experience-logo");
      logoLink.href = "https://www.jbmgroup.com/";
      logoLink.target = "_blank";
      logoLink.rel = "noopener noreferrer";
      logoLink.setAttribute("aria-label", "JBM Group official website");
      const logo = make("img");
      logo.src = "assets/jbm-group-logo.png";
      logo.alt = "JBM Group logo";
      logo.loading = "lazy";
      logoLink.append(logo);
      visual.append(logoLink);
    }
    visual.append(make("h3", "experience-role", experience.title || "Role — To Be Added"));
    visual.append(make("p", "experience-organization", experience.organization || "Organization — To Be Added"));
    visual.append(make("span", "experience-period", [experience.period, experience.location].filter(Boolean).join(" · ") || "Period — To Be Added"));
    const body = make("div", "experience-content");
    body.append(make("span", "experience-content-kicker", "02 · LEARNING THROUGH PRACTICE"));
    body.append(make("h3", "experience-content-title", "Finance operations"));
    body.append(make("p", "experience-content-intro", "Practical exposure across payment clearing, reconciliations, invoice checks and finance documentation."));
    const list = make("ul");
    (experience.tasks || []).forEach((task) => list.append(make("li", "", task)));
    body.append(list);
    if (experience.note) body.append(make("p", "small-note", experience.note));
    card.append(visual, body);
    $("#experience-list").replaceWith(card);
  }

  const projectCategory = (project) => {
    if (project.placeholder) return "Coming soon";
    if (/BYJU/i.test(project.title)) return "Academic";
    if (/dashboard/i.test(project.title)) return "Dashboard";
    return "Project";
  };
  const categoryFilters = ["All", ...new Set((data.projects || []).map(projectCategory))];
  categoryFilters.forEach((category, index) => {
    const button = make("button", "filter-chip" + (index === 0 ? " is-active" : ""), category);
    button.type = "button";
    button.dataset.filter = category;
    button.setAttribute("aria-pressed", String(index === 0));
    $("#project-filters").append(button);
  });
  (data.projects || []).forEach((project, index) => {
    const category = projectCategory(project);
    const card = make("article", "project-card reveal" + (project.placeholder ? " placeholder-card" : ""));
    card.dataset.category = category;
    card.dataset.search = (project.title + " " + (project.kind || "")).toLowerCase();
    const header = make("div", "project-card-top");
    header.append(make("span", "project-index", "0" + (index + 1).toString().slice(-1)));
    header.append(make("span", "project-category", category));
    card.append(header);
    const heading = make("div", "project-title-row");
    heading.append(make("div", "", ""));
    heading.firstElementChild.append(make("p", "project-type", project.kind || "Project"), make("h3", "", project.title));
    if (project.status) heading.append(make("span", "project-status", project.status));
    card.append(heading);
    if (project.placeholder) {
      card.append(make("p", "placeholder-copy", "Purpose, process, outcome and supporting evidence — To Be Added."));
      $("#project-list").append(card);
      return;
    }
    const details = make("div", "case-points");
    [["Purpose", project.purpose], ["Process", project.process], ["Outcome", project.outcome]].forEach(([label, content]) => {
      const point = make("div", "case-point");
      point.append(make("span", "case-label", label), make("p", "", content || "To Be Added"));
      details.append(point);
    });
    card.append(details);
    const footer = make("div", "project-card-footer");
    const evidence = make("p", "evidence-note", project.evidenceNote || "See the linked materials for project context and evidence.");
    footer.append(evidence);
    const links = make("div", "project-links");
    (project.evidence || []).forEach((item) => {
      const anchor = makeLink(item.label + " ↗", item.href, "text-link");
      if (anchor) links.append(anchor);
    });
    footer.append(links);
    card.append(footer);
    $("#project-list").append(card);
  });
  $("#project-filters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    const selected = button.dataset.filter;
    $("#project-filters").querySelectorAll("button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    $("#project-list").querySelectorAll(".project-card").forEach((card) => {
      card.hidden = selected !== "All" && card.dataset.category !== selected;
    });
  });

  (data.skills || []).forEach((skill) => $("#skill-list").append(make("span", "tag", skill)));
  (data.tools || []).forEach((tool) => $("#tool-list").append(make("span", "tag", tool)));
  const certificates = data.certificates || [];
  $("#certificate-count").textContent = String(certificates.length).padStart(2, "0");
  const verificationCount = certificates.filter((certificate) => certificate.verified && certificate.href).length;
  const certificateFileCount = certificates.filter((certificate) => certificate.file).length;
  $("#certificate-status").textContent = verificationCount + " LinkedIn links · " + certificateFileCount + " certificate files";
  const certificateDialog = $("#certificate-dialog");
  const certificateDocument = $("#certificate-document");
  const certificateFileLink = (certificate) => makeLink("Open certificate file ↗", certificate.file, "certificate-link");
  const openCertificate = (certificate) => {
    $("#certificate-dialog-issuer").textContent = certificate.issuer || "Issuer — To Be Added";
    $("#certificate-dialog-title").textContent = certificate.title || "Certificate — To Be Added";
    $("#certificate-dialog-detail").textContent = [certificate.detail, certificate.evidenceStatus].filter(Boolean).join(" · ");
    $("#certificate-dialog-focus-title").textContent = certificate.focusHeading || "Course focus";
    $("#certificate-dialog-note").textContent = certificate.note || "Course records confirm completion, not independent proficiency.";
    const skillList = $("#certificate-dialog-skills");
    skillList.replaceChildren();
    (certificate.focus || []).forEach((skill) => skillList.append(make("li", "", skill)));
    certificateDocument.replaceChildren();
    if (certificate.file) {
      const isImage = /\.(png|jpe?g|webp)$/i.test(certificate.file);
      const record = make(isImage ? "img" : "iframe", "certificate-record");
      record.src = certificate.file;
      record.title = certificate.title + " certificate";
      if (isImage) record.alt = certificate.title + " certificate";
      certificateDocument.append(record);
    }
    const links = $("#certificate-dialog-links");
    links.replaceChildren();
    const fileLink = certificateFileLink(certificate);
    if (fileLink) {
      fileLink.target = "_blank";
      fileLink.rel = "noopener noreferrer";
      links.append(fileLink);
    }
    if (certificate.verified && certificate.href) {
      const verificationLink = makeLink("Verify on LinkedIn ↗", certificate.href, "certificate-link");
      if (verificationLink) links.append(verificationLink);
    }
    if (typeof certificateDialog.showModal === "function") certificateDialog.showModal();
    else certificateDialog.setAttribute("open", "");
  };
  certificates.forEach((certificate, index) => {
    const card = make("button", "certificate-orbit-card");
    card.type = "button";
    card.style.setProperty("--orbit-delay", "-" + ((index * 34) / Math.max(1, certificates.length)) + "s");
    const orbitAngle = index * 360 / Math.max(1, certificates.length);
    card.style.setProperty("--orbit-angle", orbitAngle + "deg");
    card.style.setProperty("--orbit-angle-reverse", -orbitAngle + "deg");
    card.setAttribute("aria-label", "Open " + certificate.title + " certificate and course focus");
    const contents = make("span", "certificate-orbit-content");
    const top = make("span", "certificate-top");
    top.append(make("span", "certificate-index", "0" + (index + 1)), make("span", "certificate-issuer", certificate.issuer || "Issuer — To Be Added"));
    contents.append(top, make("strong", "certificate-orbit-title", certificate.orbitTitle || certificate.title || "Certificate — To Be Added"));
    const focus = make("span", "certificate-orbit-focus", (certificate.focus || []).join(" · "));
    contents.append(focus, make("span", "certificate-orbit-open", "Open certificate ↗"));
    card.append(contents);
    card.addEventListener("click", () => openCertificate(certificate));
    $("#certificate-orbit-cards").append(card);
  });
  $("#certificate-dialog-close").addEventListener("click", () => certificateDialog.close());
  certificateDialog.addEventListener("click", (event) => {
    if (event.target === certificateDialog) certificateDialog.close();
  });

  const gallerySlides = Array.from(document.querySelectorAll("[data-gallery-slide]"));
  const galleryCount = $("#gallery-count");
  const galleryToggle = $("#gallery-toggle");
  let galleryIndex = 0;
  let galleryPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let galleryTimer = 0;
  const showGallerySlide = (nextIndex) => {
    if (!gallerySlides.length) return;
    galleryIndex = (nextIndex + gallerySlides.length) % gallerySlides.length;
    gallerySlides.forEach((slide, index) => {
      const active = index === galleryIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      if (active) slide.removeAttribute("inert");
      else slide.setAttribute("inert", "");
    });
    galleryCount.firstChild.textContent = "0" + (galleryIndex + 1) + " ";
  };
  const updateGalleryPlayback = () => {
    window.clearInterval(galleryTimer);
    galleryToggle.textContent = galleryPaused ? "Play" : "Pause";
    galleryToggle.setAttribute("aria-pressed", String(galleryPaused));
    if (!galleryPaused && gallerySlides.length > 1) galleryTimer = window.setInterval(() => showGallerySlide(galleryIndex + 1), 6200);
  };
  $("#gallery-prev").addEventListener("click", () => showGallerySlide(galleryIndex - 1));
  $("#gallery-next").addEventListener("click", () => showGallerySlide(galleryIndex + 1));
  galleryToggle.addEventListener("click", () => { galleryPaused = !galleryPaused; updateGalleryPlayback(); });
  $("#gallery-carousel").addEventListener("mouseenter", () => window.clearInterval(galleryTimer));
  $("#gallery-carousel").addEventListener("mouseleave", updateGalleryPlayback);
  $("#gallery-carousel").addEventListener("focusin", () => window.clearInterval(galleryTimer));
  $("#gallery-carousel").addEventListener("focusout", (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) updateGalleryPlayback();
  });
  updateGalleryPlayback();
  $("#contact-city").textContent = data.profile.city || "";
  [
    ["Email", "mailto:" + (data.profile.email || "")],
    ["LinkedIn", data.profile.linkedin || ""]
  ].forEach(([label, href]) => {
    const anchor = makeLink(label + " ↗", href, "contact-link");
    if (anchor) $("#contact-links").append(anchor);
  });
  $("#year").textContent = new Date().getFullYear();

  const menuButton = $(".menu-toggle");
  const nav = $("#main-nav");
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));

  const themeButton = $("#theme-toggle");
  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem("purvanshi-theme-v2") || "dark"; } catch (_) {}
  document.body.dataset.theme = savedTheme;
  const updateThemeButton = () => {
    const dark = document.body.dataset.theme === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeButton.firstElementChild.textContent = dark ? "☼" : "◐";
  };
  updateThemeButton();
  themeButton.addEventListener("click", () => {
    document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("purvanshi-theme-v2", document.body.dataset.theme); } catch (_) {}
    updateThemeButton();
  });

  const progress = $("#scroll-progress");
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (scrollable > 0 ? window.scrollY / scrollable : 0) + ")";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll("a").forEach((anchor) => anchor.classList.toggle("is-current", anchor.hash === "#" + entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  }

  const projectList = data.projects || [];
  const profile = data.profile || {};
  const findProject = (pattern) => projectList.find((project) => pattern.test(project.title));
  const answerPortfolio = (question) => {
    const q = question.toLowerCase().replace(/[’‘]/g, "'").trim();
    const projects = projectList.filter((project) => !project.placeholder);
    const byju = findProject(/byju/i);
    const titan = findProject(/titan/i);
    if (/^(hi|hello|hey|good morning|good afternoon)\b/.test(q)) {
      return { text: "Hello! I’m Purvanshi’s portfolio guide. Ask about her projects, experience, skills, certificates or contact details." };
    }
    if (/what can you|help me|what do you know|how do i use/.test(q)) {
      return { text: "I can point you to information published on this portfolio: projects, gallery, experience, education, skills, certificates and contact. Try a specific question." };
    }
    if (/chatbot|byju|spend review|stress test/.test(q) && byju) {
      return {
        text: byju.title + ". " + byju.process + " " + byju.outcome,
        link: byju.evidence && byju.evidence[0] ? byju.evidence[0].href : "",
        linkLabel: "Open the prototype"
      };
    }
    if (/titan|dashboard/.test(q) && titan) {
      return {
        text: titan.title + ". " + titan.purpose + " " + titan.process + " " + titan.outcome,
        link: titan.evidence && titan.evidence[0] ? titan.evidence[0].href : "",
        linkLabel: "Open the dashboard"
      };
    }
    if (/project|projects|portfolio work|what has .* built|work samples/.test(q)) {
      const links = projects.map((project) => {
        const item = project.evidence && project.evidence[0];
        return item ? { href: item.href, label: item.label } : null;
      }).filter(Boolean);
      return {
        text: "The portfolio currently lists " + projects.map((project) => project.title).join(" and ") + ". " + projects.map((project) => project.outcome).join(" "),
        links: links
      };
    }
    if (/intern|experience|work history|job/.test(q)) {
      const experience = data.experience || {};
      return { text: [experience.title, experience.organization, experience.period, ...(experience.tasks || []), experience.note].filter(Boolean).join(". ") };
    }
    if (/education|degree|college|university|fiib|study|pgdm/.test(q)) {
      return { text: (data.education || []).map((item) => item.title + " — " + item.detail).join(". ") || "Education details — To Be Added." };
    }
    if (/role|career|job target|looking for|interested in/.test(q)) {
      return { text: "Purvanshi lists these career interests: " + (data.roles || []).join(", ") + "." };
    }
    if (/skill|tool|excel|software|proficien/.test(q)) {
      return { text: "Skills: " + (data.skills || []).join(", ") + ". Tools: " + (data.tools || []).join(", ") + ". The portfolio does not assign proficiency ratings." };
    }
    if (/certificate|certification|course|learning/.test(q)) {
      return { text: (data.certificates || []).map((certificate) => certificate.title + " (" + certificate.issuer + "; course focus: " + (certificate.focus || []).join(", ") + "; " + (certificate.verified ? "LinkedIn verification link available" : "certificate file available, no public verification link provided") + ")").join(". ") + " Course focus describes course content, not independent proficiency.", link: "#certificates", linkLabel: "Explore certificates" };
    }
    if (/gallery|other work|portfolio guide|portfolio tour/.test(q)) {
      return { text: "The gallery previews the Titan dashboard, BYJU’S academic prototype and JBM internship context. Other work includes the browser-based portfolio guide.", link: "#gallery", linkLabel: "Open the gallery" };
    }
    if (/resume|cv/.test(q)) {
      return { text: "You can open Purvanshi’s resume from the portfolio.", link: "assets/Purvanshi_Resume_Updated.pdf", linkLabel: "View resume" };
    }
    if (/contact|email|linkedin|phone|connect/.test(q)) {
      return { text: "Contact Purvanshi by email at " + (profile.email || "To Be Added") + " or visit her LinkedIn profile.", link: profile.linkedin, linkLabel: "Open LinkedIn" };
    }
    if (/where|location|city/.test(q)) {
      return { text: "The portfolio lists " + (profile.city || "Location — To Be Added") + "." };
    }
    if (/about|who is|background|introduce/.test(q)) {
      return { text: data.about || "Background — To Be Added." };
    }
    if (/ai|artificial intelligence|store|stored|privacy/.test(q)) {
      return { text: "This is a local portfolio guide with prepared keyword responses based on the information on this site. It does not call an AI service or store your questions." };
    }
    return { text: "I don’t have a verified answer to that from this portfolio yet. Try asking about projects, experience, education, skills, certificates or contact details." };
  };

  const assistantPanel = $("#assistant-panel");
  const assistantLauncher = $("#assistant-launcher");
  const assistantInput = $("#assistant-input");
  const assistantMessages = $("#assistant-messages");
  let welcomed = false;
  const appendMessage = (text, role, linkHref, linkLabel, moreLinks) => {
    const message = make("div", "chat-message " + role);
    message.setAttribute("role", role === "assistant" ? "article" : "status");
    message.append(make("p", "", text));
    const links = [];
    if (linkHref && linkLabel) links.push({ href: linkHref, label: linkLabel });
    (moreLinks || []).forEach((item) => links.push(item));
    links.forEach((item) => {
      const anchor = makeLink(item.label + " ↗", item.href, "chat-link");
      if (anchor) message.append(anchor);
    });
    assistantMessages.append(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  };
  const openAssistant = () => {
    assistantPanel.hidden = false;
    document.body.classList.add("assistant-open");
    assistantLauncher.setAttribute("aria-expanded", "true");
    if (!welcomed) {
      appendMessage("Hi! I can help you explore Purvanshi’s projects, gallery, experience, skills and certificates. I answer from this portfolio only.", "assistant");
      welcomed = true;
    }
    assistantInput.focus();
  };
  $("#other-work-open-guide").addEventListener("click", openAssistant);
  const closeAssistant = () => {
    assistantPanel.hidden = true;
    document.body.classList.remove("assistant-open");
    assistantLauncher.setAttribute("aria-expanded", "false");
    assistantLauncher.focus();
  };
  assistantLauncher.addEventListener("click", () => assistantPanel.hidden ? openAssistant() : closeAssistant());
  $("#assistant-close").addEventListener("click", closeAssistant);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !assistantPanel.hidden) closeAssistant();
  });
  const submitQuestion = (question) => {
    const text = question.trim();
    if (!text) return;
    appendMessage(text, "user");
    assistantInput.value = "";
    const reply = answerPortfolio(text);
    window.setTimeout(() => appendMessage(reply.text, "assistant", reply.link, reply.linkLabel, reply.links), 220);
  };
  $("#assistant-form").addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestion(assistantInput.value);
  });
  $("#assistant-suggestions").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-question]");
    if (button) submitQuestion(button.dataset.question);
  });

  $("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = $("#contact-name").value.trim();
    const replyTo = $("#contact-email").value.trim();
    const message = $("#contact-message").value.trim();
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\nReply to: " + replyTo);
    window.location.href = "mailto:" + encodeURIComponent(profile.email || "") + "?subject=" + subject + "&body=" + body;
  });
})();
