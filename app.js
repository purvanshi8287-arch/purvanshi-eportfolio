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
  const makeDocumentPlaceholder = (className, title, onOpen, available) => {
    const placeholder = make("button", className + " document-placeholder-button");
    placeholder.type = "button";
    placeholder.setAttribute("aria-label", (available ? "Open certificate: " : "Open document preview: ") + title);
    const icon = make("span", "document-placeholder-icon", "▤");
    icon.setAttribute("aria-hidden", "true");
    placeholder.append(
      icon,
      make("span", "document-placeholder-status", available ? "EXPERIENCE CERTIFICATE" : "DOCUMENT PREVIEW · PLACEHOLDER"),
      make("strong", "document-placeholder-title", title),
      make("span", "document-placeholder-help", available ? "JBM Kanemitsu · Finance Department · September–October 2025" : "To display it here, add a redacted copy or public verification link."),
      make("span", "document-placeholder-action", available ? "Click to view certificate ↗" : "Click to open preview ↗")
    );
    if (onOpen) placeholder.addEventListener("click", onOpen);
    return placeholder;
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

  // The scroll-led hero now carries the welcome copy directly, so the legacy
  // welcome dialog remains in the document but does not block the first scroll.

  document.querySelectorAll("[data-profile]").forEach((element) => {
    const value = data.profile && data.profile[element.dataset.profile];
    if (value) element.textContent = value;
  });
  const heroEmail = $("#hero-email");
  const copyEmailButton = $("#copy-email");
  const copyEmailStatus = $("#copy-email-status");
  if (heroEmail && data.profile && data.profile.email) {
    heroEmail.textContent = data.profile.email;
    heroEmail.href = "mailto:" + data.profile.email;
  }
  if (copyEmailButton && data.profile && data.profile.email) {
    copyEmailButton.addEventListener("click", async () => {
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(data.profile.email);
          copied = true;
        }
      } catch (_) {}
      if (!copied) {
        const temporary = make("textarea", "sr-only");
        temporary.value = data.profile.email;
        temporary.setAttribute("readonly", "");
        document.body.append(temporary);
        temporary.select();
        try { copied = document.execCommand("copy"); } catch (_) {}
        temporary.remove();
      }
      if (copyEmailStatus) copyEmailStatus.textContent = copied ? "Email address copied." : "Copy unavailable. Select the email address to copy it.";
      copyEmailButton.setAttribute("aria-label", copied ? "Email address copied" : "Copy email address");
      window.setTimeout(() => copyEmailButton.setAttribute("aria-label", "Copy email address"), 1800);
    });
  }
  (data.roles || []).forEach((role) => $("#role-list").append(make("span", "role-pill", role)));
  const interests = data.interests || data.roles || [];
  const marquee = $("#interest-marquee-track");
  if (marquee) {
    [0, 1].forEach(() => {
      const group = make("div", "interest-marquee-group");
      group.setAttribute("aria-hidden", "true");
      interests.forEach((interest) => {
        group.append(make("span", "interest-marquee-item", interest));
        group.append(make("span", "interest-marquee-star", "✳"));
      });
      marquee.append(group);
    });
  }
  const experienceEntries = Array.isArray(data.experience) ? data.experience : data.experience ? [data.experience] : [];
  const glance = $("#hero-at-a-glance");
  if (glance) {
    const internshipCount = experienceEntries.filter((entry) => entry.type === "internship").length;
    const debtProject = (data.projects || []).find((project) => /debt market/i.test(project.title));
    const metric = debtProject && debtProject.headlineMetric;
    const countMetric = (value, decimals) => {
      const span = make("span", "count-value", Number(value).toFixed(decimals));
      span.dataset.countTarget = String(value);
      span.dataset.countDecimals = String(decimals);
      return span;
    };
    const glanceItems = [
      { nodes: [countMetric((data.projects || []).filter((project) => !project.placeholder).length, 0)], label: "featured projects" },
      { nodes: [countMetric(internshipCount, 0)], label: "finance internship" },
      { nodes: [countMetric((data.certificates || []).length, 0)], label: "certificate records" }
    ];
    if (metric && Number.isFinite(metric.fromValue) && Number.isFinite(metric.toValue)) {
      glanceItems.push({ nodes: ["₹", countMetric(metric.fromValue, 1), " → ₹", countMetric(metric.toValue, 1), " L cr"], label: "outstanding bonds · FY22 → FY26*", footnote: "*FY26 provisional" });
    }
    glanceItems.forEach((item) => {
      const stat = make("div", "hero-proof-item");
      const value = make("strong", "hero-proof-value");
      item.nodes.forEach((node) => value.append(typeof node === "string" ? document.createTextNode(node) : node));
      stat.append(value, make("span", "", item.label));
      if (item.footnote) stat.append(make("small", "hero-proof-footnote", item.footnote));
      glance.append(stat);
    });
  }
  $("#about-summary").textContent = data.about || "To Be Added";
  const aboutProfileLinks = $("#about-profile-links");
  if (aboutProfileLinks && data.profile) {
    [
      ["GitHub ↗", data.profile.github],
      [data.profile.email, "mailto:" + (data.profile.email || "")],
      [data.profile.personalEmail, "mailto:" + (data.profile.personalEmail || "")]
    ].forEach(([label, href]) => {
      if (!label || !href) return;
      const anchor = makeLink(label, href, "about-profile-link");
      if (anchor) aboutProfileLinks.append(anchor);
    });
  }
  (data.roles || []).forEach((role) => {
    const tag = make("span", "about-interest", role);
    $("#about-interest-list").append(tag);
  });
  const experienceDialog = $("#experience-lightbox");
  const experienceDocument = $("#experience-lightbox-document");
  const openExperienceRecord = (entry) => {
    $("#experience-lightbox-kicker").textContent = (entry.type || "experience").replace(/-/g, " ").toUpperCase() + " RECORD";
    $("#experience-lightbox-title").textContent = entry.title || "Experience record";
    $("#experience-lightbox-note").textContent = entry.certificateFile
      ? (entry.certificateFile.toLowerCase().endsWith(".pdf") ? "JBM experience certificate · PDF preview. Use the link below if your browser does not display the document." : "Certificate image supplied with this portfolio.")
      : "This is a placeholder preview. Add a redacted copy or public verification link to display the actual document.";
    experienceDocument.replaceChildren();
    if (entry.certificateFile) {
      if (entry.certificateFile.toLowerCase().endsWith(".pdf")) {
        const frame = make("iframe", "experience-certificate-pdf");
        frame.src = entry.certificateFile;
        frame.title = (entry.title || "Experience") + " certificate PDF preview";
        frame.loading = "lazy";
        const openLink = make("a", "experience-certificate-open-link", "Open or download the certificate PDF ↗");
        openLink.href = entry.certificateFile;
        openLink.target = "_blank";
        openLink.rel = "noopener noreferrer";
        experienceDocument.append(frame, openLink);
      } else {
        const image = make("img", "experience-certificate-image");
        image.src = entry.certificateFile;
        image.alt = (entry.title || "Experience") + " certificate";
        experienceDocument.append(image);
      }
    } else {
      const preview = make("div", "experience-placeholder-preview");
      const icon = make("span", "experience-placeholder-preview-icon", "▤");
      icon.setAttribute("aria-hidden", "true");
      preview.append(
        icon,
        make("span", "experience-placeholder-preview-label", "DOCUMENT PREVIEW · PLACEHOLDER"),
        make("strong", "experience-placeholder-preview-title", entry.certificatePreviewTitle || entry.title || "Supporting document"),
        make("p", "experience-placeholder-preview-copy", "The actual document is not linked here yet. A redacted public copy or verification link can be added when available.")
      );
      experienceDocument.append(preview);
    }
    if (typeof experienceDialog.showModal === "function") experienceDialog.showModal();
    else experienceDialog.setAttribute("open", "");
  };
  (data.education || []).forEach((item) => {
    const row = make("div", "education-item");
    row.append(make("span", "education-mark", "↗"), make("div", "education-copy"));
    row.lastElementChild.append(make("strong", "", item.title), make("span", "", item.detail));
    if (item.certificatePlaceholder) {
      const title = "Bachelor of Commerce degree certificate";
      const previewRecord = { type: "education", title: item.title, certificatePreviewTitle: title };
      row.lastElementChild.append(makeDocumentPlaceholder("credential-placeholder", title, () => openExperienceRecord(previewRecord)));
    }
    $("#education-list").append(row);
  });
  experienceEntries.forEach((experience, index) => {
    const card = make("article", "experience-item reveal experience-" + (experience.type || "record"));
    card.dataset.timelineSide = index % 2 === 0 ? "left" : "right";
    const marker = make("span", "experience-timeline-marker");
    marker.setAttribute("aria-hidden", "true");
    const details = make("div", "experience-card");
    const top = make("div", "experience-card-top");
    top.append(make("span", "experience-period", experience.period || "[PLACEHOLDER: DATES]"));
    top.append(make("span", "experience-kicker", (experience.type || "experience").replace(/-/g, " ").toUpperCase()));
    details.append(top);
    const identity = make("div", "experience-identity");
    if (/jbm/i.test(experience.organization || "")) {
      const logo = make("img", "experience-logo");
      logo.src = "assets/jbm-group-logo.png";
      logo.alt = "JBM Group logo";
      logo.loading = "lazy";
      identity.append(logo);
    }
    identity.append(make("h3", "experience-role", experience.title || "Role — [PLACEHOLDER]"));
    details.append(identity, make("p", "experience-organization", [experience.organization, experience.location].filter(Boolean).join(" · ")));
    const list = make("ul", "experience-tasks");
    (experience.tasks || []).forEach((task) => list.append(make("li", "", task)));
    details.append(list);
    const skills = make("div", "experience-skill-row");
    const skillLabel = experience.type === "education" ? "AREAS" : experience.type === "event" ? "CERTIFICATE RECORD" : "SKILLS USED";
    skills.append(make("span", "experience-skill-label", skillLabel));
    const skillTags = make("div", "experience-skill-tags");
    (experience.skills || ["[PLACEHOLDER: add demonstrated skills]"]).forEach((skill) => skillTags.append(make("span", "experience-skill-tag", skill)));
    skills.append(skillTags);
    details.append(skills);
    if (experience.note) details.append(make("p", "experience-note", experience.note));
    if (experience.certificatePlaceholder || experience.certificateFile) {
      experience.certificatePreviewTitle = "JBM internship experience letter";
      details.append(makeDocumentPlaceholder("experience-certificate-placeholder", experience.certificatePreviewTitle, () => openExperienceRecord(experience), Boolean(experience.certificateFile)));
    }
    const recordButton = make("button", "experience-record-button", experience.certificateFile ? "View certificate · Tap to enlarge ↗" : "View record · Certificate [PLACEHOLDER] ↗");
    recordButton.type = "button";
    recordButton.setAttribute("aria-label", (experience.certificateFile ? "View certificate for " : "View experience record for ") + experience.title);
    recordButton.addEventListener("click", () => openExperienceRecord(experience));
    details.append(recordButton);
    card.append(marker, details);
    $("#experience-list").append(card);
  });
  $("#experience-lightbox-close").addEventListener("click", () => experienceDialog.close());
  experienceDialog.addEventListener("click", (event) => { if (event.target === experienceDialog) experienceDialog.close(); });

  const projectCategory = (project) => {
    if (project.placeholder) return "Coming soon";
    if (/BYJU/i.test(project.title)) return "Academic";
    if (/dashboard/i.test(project.title)) return "Dashboard";
    if (/debt|market/i.test(project.title)) return "Research";
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
    if (project.id) card.id = project.id;
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
    if (project.headlineMetric) {
      const metricPanel = make("div", "project-metric");
      metricPanel.append(make("strong", "project-metric-value", project.headlineMetric.value || "[PLACEHOLDER: METRIC]"));
      const metricCopy = make("div", "project-metric-copy");
      metricCopy.append(make("span", "project-metric-label", project.headlineMetric.label || "Project measure"));
      if (project.headlineMetric.note) metricCopy.append(make("small", "project-metric-note", project.headlineMetric.note));
      metricPanel.append(metricCopy);
      card.append(metricPanel);
    }
    if (!project.placeholder) {
      const contribution = make("div", "project-contribution");
      contribution.append(make("span", "case-label", "My contribution"), make("p", "", project.contribution || "To Be Added."));
      card.append(contribution);
    }
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
    if (project.limits) {
      const limits = make("p", "project-limits-note");
      limits.append(make("strong", "", "Limits · "), document.createTextNode(project.limits));
      card.append(limits);
    }
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

  const appendSkillEvidence = (container, item) => {
    const skill = typeof item === "string" ? { name: item } : item;
    const card = make("article", "skill-evidence-card");
    card.append(make("strong", "skill-evidence-name", skill.name || "Skill — To Be Added"));
    if (skill.proof && skill.href) {
      const proof = make("a", "skill-evidence-link", "Shown in " + skill.proof + " ↗");
      proof.href = skill.href;
      card.append(proof);
    }
    container.append(card);
  };
  (data.skills || []).forEach((skill) => appendSkillEvidence($("#skill-list"), skill));
  (data.tools || []).forEach((tool) => appendSkillEvidence($("#tool-list"), tool));
  const certificates = data.certificates || [];
  $("#certificate-count").textContent = String(certificates.length).padStart(2, "0");
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
  const certificateOrbitPeriodSeconds = 28;
  certificates.forEach((certificate, index) => {
    const card = make("button", "certificate-orbit-card");
    card.type = "button";
    card.style.setProperty("--orbit-delay", "-" + ((index * certificateOrbitPeriodSeconds) / Math.max(1, certificates.length)) + "s");
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
    if (galleryCount.lastElementChild) galleryCount.lastElementChild.textContent = "/ 0" + gallerySlides.length;
  };
  if (galleryCount.lastElementChild) galleryCount.lastElementChild.textContent = "/ 0" + gallerySlides.length;
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
    [data.profile.email, "mailto:" + (data.profile.email || "")],
    [data.profile.personalEmail, "mailto:" + (data.profile.personalEmail || "")],
    ["LinkedIn", data.profile.linkedin || ""]
  ].forEach(([label, href]) => {
    if (!label || !href) return;
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
  const heroWrapper = $("#home");
  const heroStage = $("#hero-stage");
  const heroName = $("#hero-giant-name");
  const heroAbout = $("#hero-scroll-about");
  const heroAboutSteps = heroAbout ? Array.from(heroAbout.querySelectorAll("[data-hero-step]")) : [];
  const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const easeOutCubic = (value) => 1 - Math.pow(1 - clamp01(value), 3);
  let scrollFrame = 0;
  const updateScrollScene = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = "scaleX(" + (scrollable > 0 ? window.scrollY / scrollable : 0) + ")";
      if (!heroWrapper || !heroStage) return;

      const reduced = reducedMotionPreference.matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const heroScrollDistance = Math.max(1, heroWrapper.offsetHeight - window.innerHeight);
      const heroTop = heroWrapper.getBoundingClientRect().top;
      const p = reduced ? 1 : clamp01(-heroTop / heroScrollDistance);
      heroStage.style.setProperty("--hero-progress", p.toFixed(4));

      const nameProgress = easeOutCubic(p / 0.35);
      heroStage.style.setProperty("--name-opacity", String(1 - nameProgress));
      heroStage.style.setProperty("--name-blur", (12 * nameProgress).toFixed(2) + "px");
      heroStage.style.setProperty("--name-y", (-window.innerHeight * 0.05 * nameProgress).toFixed(1) + "px");

      const portraitProgress = easeOutCubic(p / 0.35);
      const portraitShift = isMobile ? 0 : -window.innerWidth * 0.28 * portraitProgress;
      const portraitScale = isMobile ? 0.94 : 1 - 0.15 * portraitProgress;
      heroStage.style.setProperty("--portrait-x", portraitShift.toFixed(1) + "px");
      heroStage.style.setProperty("--portrait-scale", portraitScale.toFixed(4));

      const aboutProgress = easeOutCubic((p - 0.25) / 0.30);
      heroStage.style.setProperty("--about-opacity", String(aboutProgress));
      heroStage.style.setProperty("--about-y", ((1 - aboutProgress) * 24).toFixed(1) + "px");
      heroStage.style.setProperty("--about-blur", ((1 - aboutProgress) * 6).toFixed(2) + "px");
      heroAboutSteps.forEach((step, index) => {
        const stepProgress = easeOutCubic((p - (0.25 + index * 0.025)) / 0.15);
        step.style.setProperty("--step-opacity", String(stepProgress));
        step.style.setProperty("--step-y", ((1 - stepProgress) * 24).toFixed(1) + "px");
        step.style.setProperty("--step-blur", ((1 - stepProgress) * 5).toFixed(2) + "px");
        if ("inert" in step) step.inert = !reduced && (stepProgress < 0.92 || p >= 0.56);
      });
      if (heroAbout) {
        const isAboutInteractive = reduced || (aboutProgress > 0.04 && p < 0.56);
        heroAbout.classList.toggle("is-interactive", isAboutInteractive);
        heroAbout.setAttribute("aria-hidden", String(!isAboutInteractive));
        if ("inert" in heroAbout) heroAbout.inert = !isAboutInteractive;
        else if (isAboutInteractive) heroAbout.removeAttribute("inert");
        else heroAbout.setAttribute("inert", "");
      }

    });
  };
  window.addEventListener("scroll", updateScrollScene, { passive: true });
  window.addEventListener("resize", updateScrollScene);
  if (typeof reducedMotionPreference.addEventListener === "function") reducedMotionPreference.addEventListener("change", updateScrollScene);
  updateScrollScene();
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
  const countValues = Array.from(document.querySelectorAll("[data-count-target]"));
  const animateCount = (element) => {
    const target = Number(element.dataset.countTarget);
    const decimals = Number(element.dataset.countDecimals || 0);
    if (!Number.isFinite(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = target.toFixed(decimals);
      return;
    }
    const start = performance.now();
    const duration = 1050;
    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  };
  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    countValues.forEach((element) => countObserver.observe(element));
  } else {
    countValues.forEach(animateCount);
  }
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll("a").forEach((anchor) => anchor.classList.toggle("is-current", anchor.hash === "#" + entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    nav.querySelectorAll("a[href^='#']").forEach((anchor) => {
      const section = document.getElementById(anchor.hash.slice(1));
      if (section) sectionObserver.observe(section);
    });
  }

  const projectList = data.projects || [];
  const profile = data.profile || {};
  const findProject = (pattern) => projectList.find((project) => pattern.test(project.title));
  const answerPortfolio = (question) => {
    const q = question.toLowerCase().replace(/[’‘]/g, "'").trim();
    const projects = projectList.filter((project) => !project.placeholder);
    const byju = findProject(/byju/i);
    const titan = findProject(/titan/i);
    const debt = findProject(/corporate debt/i);
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
    if (/debt market|corporate bond|fmi project|financial market institution/.test(q) && debt) {
      return { text: debt.title + ". " + debt.purpose + " " + debt.process + " " + debt.outcome + " " + debt.evidenceNote, link: debt.evidence && debt.evidence[0] ? debt.evidence[0].href : "", linkLabel: "Read the project brief" };
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
      const entries = Array.isArray(data.experience) ? data.experience : data.experience ? [data.experience] : [];
      return { text: entries.map((experience) => [experience.title, experience.organization, experience.period, ...(experience.tasks || []), experience.note].filter(Boolean).join(". ")).join(" ") };
    }
    if (/education|degree|college|university|fiib|study|pgdm/.test(q)) {
      return { text: (data.education || []).map((item) => item.title + " — " + item.detail).join(". ") || "Education details — To Be Added." };
    }
    if (/role|career|job target|looking for|interested in/.test(q)) {
      return { text: "Purvanshi lists these career interests: " + (data.roles || []).join(", ") + "." };
    }
    if (/skill|tool|excel|software|proficien/.test(q)) {
      const skillNames = (data.skills || []).map((item) => typeof item === "string" ? item : item.name);
      const toolNames = (data.tools || []).map((item) => typeof item === "string" ? item : item.name);
      return { text: "Skills shown in my work: " + skillNames.join(", ") + ". Tools used: " + toolNames.join(", ") + ". Links connect each item to its supporting project or experience; no proficiency ratings are implied." };
    }
    if (/certificate|certification|course|learning/.test(q)) {
      return { text: (data.certificates || []).map((certificate) => certificate.title + " (" + certificate.issuer + "; course focus: " + (certificate.focus || []).join(", ") + "; " + (certificate.verified ? "LinkedIn verification link available" : "certificate file available, no public verification link provided") + ")").join(". ") + " Course focus describes course content, not independent proficiency.", link: "#certificates", linkLabel: "Explore certificates" };
    }
    if (/gallery|other work|portfolio guide|portfolio tour/.test(q)) {
      return { text: "The gallery previews the Titan dashboard, BYJU’S academic prototype, JBM internship context and the corporate debt market review. Other work includes the browser-based portfolio guide.", link: "#gallery", linkLabel: "Open the gallery" };
    }
    if (/resume|cv/.test(q)) {
      return { text: "You can open Purvanshi’s resume from the portfolio.", link: "assets/Purvanshi_Resume_Updated.pdf", linkLabel: "View resume" };
    }
    if (/contact|email|linkedin|phone|connect/.test(q)) {
      const emails = [profile.email, profile.personalEmail].filter(Boolean).join(" or ");
      return { text: "Contact Purvanshi by email at " + (emails || "To Be Added") + " or visit her LinkedIn profile.", link: profile.linkedin, linkLabel: "Open LinkedIn" };
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
