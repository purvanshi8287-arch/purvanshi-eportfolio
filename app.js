(function () {
  "use strict";
  const data = window.PORTFOLIO || {};
  const $ = (s, root) => (root || document).querySelector(s);
  const make = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const link = (label, href, cls) => {
    try {
      const u = new URL(href, location.href);
      const localPath = /^projects\/[a-z0-9-]+(?:\/[a-z0-9.-]+)*$/i.test(href);
      if (!["https:", "http:", "mailto:", "tel:"].includes(u.protocol) && !(u.protocol === "file:" && localPath)) return null;
      const a = make("a", cls, label); a.href = href;
      if (href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      return a;
    } catch (_) { return null; }
  };
  document.querySelectorAll("[data-profile]").forEach(n => {
    const v = data.profile && data.profile[n.dataset.profile];
    if (v) n.textContent = v;
  });
  (data.roles || []).forEach(v => $("#role-list").append(make("span", "role-pill", v)));
  $("#about-summary").textContent = data.about || "To Be Added";
  (data.education || []).forEach(v => {
    const row = make("div", "fact");
    row.append(make("strong", "", v.title), make("span", "", v.detail));
    $("#education-list").append(row);
  });
  if (data.experience) {
    const e = data.experience, card = make("div", "experience-card");
    const meta = make("div", "experience-meta");
    meta.append(make("h3", "", e.title), make("p", "", e.organization), make("p", "", e.period));
    const body = make("div", "experience-content"), list = make("ul");
    (e.tasks || []).forEach(v => list.append(make("li", "", v)));
    body.append(list, make("p", "small-note", e.note || ""));
    card.append(meta, body); $("#experience-list").replaceWith(card);
  }
  (data.projects || []).forEach(p => {
    const card = make("article", "project-card" + (p.placeholder ? " placeholder-card" : " featured"));
    if (p.placeholder) {
      card.append(make("span", "project-type", "Project slot"), make("h3", "", p.title), make("p", "", "Purpose, process, outcome and evidence — To Be Added."));
      $("#project-list").append(card); return;
    }
    const main = make("div");
    main.append(make("span", "project-type", p.kind || "Project"), make("h3", "", p.title), make("span", "project-status", p.status || "Academic prototype"));
    [["Purpose", p.purpose], ["Process", p.process], ["Outcome", p.outcome]].forEach(s => {
      const para = make("p");
      para.append(make("strong", "", s[0] + ": "), document.createTextNode(s[1] || "To Be Added"));
      main.append(para);
    });
    const links = make("div", "project-links");
    (p.evidence || []).forEach(v => { const a = link(v.label, v.href); if (a) links.append(a); });
    main.append(links);
    const aside = make("aside", "project-evidence");
    aside.append(make("h4", "", "Evidence & boundaries"));
    aside.append(make("p", "", "The prototype and source pack are available to inspect. It is an academic prototype; no live business use or financial impact is claimed."));
    aside.append(make("p", "", "Stress-test result is self-reported. The submitted results sheet is blank, so the result cannot be independently verified."));
    card.append(main, aside); $("#project-list").append(card);
  });
  (data.skills || []).forEach(v => $("#skill-list").append(make("span", "tag", v)));
  (data.tools || []).forEach(v => $("#tool-list").append(make("span", "tag", v)));
  (data.certificates || []).forEach(c => {
    const card = make("article", "certificate-card");
    card.append(make("span", "issuer", c.issuer || "Issuer — To Be Added"), make("h3", "", c.title), make("p", "", c.detail || ""));
    const a = link("View certificate ↗", c.href, "certificate-link");
    if (a && c.verified) card.append(a);
    else card.append(make("span", "unverified", "Verification link — To Be Added"));
    $("#certificate-list").append(card);
  });
  $("#contact-city").textContent = data.profile.city || "";
  [
    ["Email Purvanshi ↗", "mailto:" + data.profile.email],
    ["Call " + data.profile.phone, "tel:" + data.profile.phone.replace(/[^\d+]/g, "")],
    ["LinkedIn profile ↗", data.profile.linkedin]
  ].forEach(v => { const a = link(v[0], v[1]); if (a) $("#contact-links").append(a); });
  $("#year").textContent = new Date().getFullYear();
  const button = $(".menu-toggle"), nav = $("#main-nav");
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open"); button.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); button.setAttribute("aria-expanded", "false");
  }));
})();
