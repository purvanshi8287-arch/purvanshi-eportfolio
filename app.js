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
  (data.education || []).forEach((item) => {
    const row = make("div", "education-item");
    row.append(make("span", "education-mark", "↗"), make("div", "education-copy"));
    row.lastElementChild.append(make("strong", "", item.title), make("span", "", item.detail));
    $("#education-list").append(row);
  });

  if (data.experience) {
    const experience = data.experience;
    const card = make("article", "experience-item reveal");
    const meta = make("div", "experience-meta");
    meta.append(make("span", "experience-period", experience.period || "Period — To Be Added"));
    meta.append(make("h3", "", experience.title || "Role — To Be Added"));
    meta.append(make("p", "", experience.organization || "Organization — To Be Added"));
    const body = make("div", "experience-content");
    const list = make("ul");
    (experience.tasks || []).forEach((task) => list.append(make("li", "", task)));
    body.append(list);
    if (experience.note) body.append(make("p", "small-note", experience.note));
    card.append(meta, body);
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
  (data.certificates || []).forEach((certificate, index) => {
    const card = make("article", "certificate-card reveal");
    const top = make("div", "certificate-top");
    top.append(make("span", "certificate-index", "0" + (index + 1)), make("span", "certificate-issuer", certificate.issuer || "Issuer — To Be Added"));
    card.append(top, make("h3", "", certificate.title || "Certificate — To Be Added"), make("p", "", certificate.detail || ""));
    const anchor = certificate.verified && makeLink("View credential", certificate.href, "certificate-link");
    card.append(anchor || make("span", "unverified", "Verification link — To Be Added"));
    $("#certificate-list").append(card);
  });
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
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("purvanshi-theme") || "light"; } catch (_) {}
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
    try { localStorage.setItem("purvanshi-theme", document.body.dataset.theme); } catch (_) {}
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
      return { text: "I can point you to information published on this portfolio: projects, purpose/process/outcome, experience, education, skills, tools, certificates and contact. Try a specific question." };
    }
    if (/chatbot|byju|spend review|stress test/.test(q) && byju) {
      return {
        text: byju.title + ". " + byju.process + " " + byju.outcome + (byju.evidenceNote ? " Evidence note: " + byju.evidenceNote : ""),
        link: byju.evidence && byju.evidence[0] ? byju.evidence[0].href : "",
        linkLabel: "Open the prototype"
      };
    }
    if (/titan|dashboard/.test(q) && titan) {
      return {
        text: titan.title + ". " + titan.purpose + " " + titan.process + " " + titan.outcome + (titan.evidenceNote ? " Evidence note: " + titan.evidenceNote : ""),
        link: titan.evidence && titan.evidence[0] ? titan.evidence[0].href : "",
        linkLabel: "Open the dashboard"
      };
    }
    if (/project|projects|portfolio work|what has .* built|work samples/.test(q)) {
      const links = projects.map((project) => {
        const item = project.evidence && project.evidence[0];
        return project.title + (item ? " — " + item.label : "");
      });
      return { text: "The portfolio currently lists " + projects.map((project) => project.title).join(" and ") + ". " + projects.map((project) => project.outcome).join(" ") };
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
      return { text: (data.certificates || []).map((certificate) => certificate.title + " (" + certificate.issuer + "; " + (certificate.verified ? "verification link available" : "verification link To Be Added") + ")").join(". ") };
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
  const appendMessage = (text, role, linkHref, linkLabel) => {
    const message = make("div", "chat-message " + role);
    message.setAttribute("role", role === "assistant" ? "article" : "status");
    message.append(make("p", "", text));
    if (linkHref && linkLabel) {
      const anchor = makeLink(linkLabel + " ↗", linkHref, "chat-link");
      if (anchor) message.append(anchor);
    }
    assistantMessages.append(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  };
  const openAssistant = () => {
    assistantPanel.hidden = false;
    assistantLauncher.setAttribute("aria-expanded", "true");
    if (!welcomed) {
      appendMessage("Hi! I can help you explore Purvanshi’s projects, experience and skills. I answer from this portfolio only.", "assistant");
      welcomed = true;
    }
    assistantInput.focus();
  };
  const closeAssistant = () => {
    assistantPanel.hidden = true;
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
    window.setTimeout(() => appendMessage(reply.text, "assistant", reply.link, reply.linkLabel), 220);
  };
  $("#assistant-form").addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestion(assistantInput.value);
  });
  $("#assistant-suggestions").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-question]");
    if (button) submitQuestion(button.dataset.question);
  });
})();
