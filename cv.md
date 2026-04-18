---
layout: cv
title: "Curriculum Vitae"
description: "Academic CV of Aaron Snowberger, Ph.D. — AI Researcher & CS Educator, Jeonju, South Korea"
permalink: /cv/
---

{% assign cv = site.data.cv %}
{% assign cp = cv.personal.email | split: "@" %}

<main class="cv-main">

  <!-- ══ HEADER ══════════════════════════════════════════════ -->
  <header class="cv-header">
    <div class="cv-header-name">
      <h1>{{ cv.personal.name }}</h1>
      <span class="cv-name-ko">{{ cv.personal.name_ko }} · {{ cv.personal.credentials }}</span>
    </div>
    <p class="cv-header-title">{{ cv.personal.title_en }}</p>
    <div class="cv-contact-strip">
      <span>{{ cv.personal.address }}</span>
      <span class="cv-sep">·</span>
      <span>{{ cv.personal.phone }}</span>
      <span class="cv-sep">·</span>
      <a href="mailto:{{ cp[0] }}&#64;{{ cp[1] }}">{{ cp[0] }}&#64;{{ cp[1] }}</a>
      <span class="cv-sep">·</span>
      <a href="{{ cv.personal.website }}" target="_blank">{{ cv.personal.website }}</a>
      <span class="cv-sep">·</span>
      <a href="{{ cv.personal.lab_site }}">{{ cv.personal.lab_site }}</a>
    </div>
  </header>

  <!-- ══ EDUCATION ════════════════════════════════════════════ -->
  <section class="cv-section">
    <h2 class="cv-section-title">Education</h2>
    {% for ed in cv.education %}
    <div class="cv-entry">
      <div class="cv-entry-meta">{{ ed.years }}</div>
      <div class="cv-entry-body">
        <div class="cv-entry-title">
          <strong>{{ ed.degree }}, {{ ed.field }}</strong>
          {% if ed.award %}<span class="cv-award">{{ ed.award }}</span>{% endif %}
        </div>
        <div class="cv-entry-org">{{ ed.institution }}{% if ed.location %}, {{ ed.location }}{% endif %}</div>
        {% if ed.advisor %}<div class="cv-entry-sub">Advisor: {{ ed.advisor }}</div>{% endif %}
        {% if ed.thesis_en %}
        <div class="cv-entry-sub">
          Thesis:
          {% if ed.thesis_url %}<a href="{{ ed.thesis_url }}" target="_blank"><em>{{ ed.thesis_en }}</em></a>{% else %}<em>{{ ed.thesis_en }}</em>{% endif %}
          {% if ed.thesis_ko %}<br><span class="cv-ko"> ({{ ed.thesis_ko }})</span>{% endif %}
        </div>
        {% endif %}
        {% if ed.project %}<div class="cv-entry-sub">Senior Project: <em>{{ ed.project }}</em></div>{% endif %}
      </div>
    </div>
    {% endfor %}
  </section>

  <!-- ══ EMPLOYMENT ════════════════════════════════════════════ -->
  <section class="cv-section">
    <h2 class="cv-section-title">Employment</h2>
    {% for job in cv.employment %}
    <div class="cv-entry">
      <div class="cv-entry-meta">{{ job.years }}</div>
      <div class="cv-entry-body">
        <div class="cv-entry-title"><strong>{{ job.title }}</strong></div>
        <div class="cv-entry-org">{{ job.org }}{% if job.dept %} — <span class="cv-dept">{{ job.dept }}</span>{% endif %}</div>
      </div>
    </div>
    {% endfor %}
  </section>

  <!-- ══ HONORS ════════════════════════════════════════════════ -->
  <section class="cv-section">
    <h2 class="cv-section-title">Honors &amp; Awards</h2>
    {% for h in cv.honors %}
    <div class="cv-entry">
      <div class="cv-entry-meta">{{ h.year }}</div>
      <div class="cv-entry-body">
        <div class="cv-entry-title">
          <strong>{% if h.url %}<a href="{{ h.url }}" target="_blank">{{ h.title }}</a>{% else %}{{ h.title }}{% endif %}</strong>
        </div>
        <div class="cv-entry-org">{{ h.org }}</div>
        {% if h.note %}<div class="cv-entry-sub"><em>{{ h.note }}</em></div>{% endif %}
      </div>
    </div>
    {% endfor %}
  </section>

  <!-- ══ PUBLICATIONS ══════════════════════════════════════════ -->
  <section class="cv-section">
    <h2 class="cv-section-title">Publications</h2>

    <h3 class="cv-subsection">Theses</h3>
    {% for p in cv.publications.theses %}
    <div class="cv-pub">
      <span class="cv-pub-num"></span>
      <div class="cv-pub-content">
        <span class="cv-pub-authors">{{ p.author }}</span>
        {% if p.url %}<a href="{{ p.url }}" target="_blank" class="cv-pub-title">"{{ p.title }}"</a>{% else %}<span class="cv-pub-title">"{{ p.title }}"</span>{% endif %}
        {% if p.title_ko %}<span class="cv-ko"> ({{ p.title_ko }})</span>{% endif %}
        <span class="cv-pub-venue">{{ p.inst }}, {{ p.year }}.</span>
        <span class="cv-pub-badge cv-badge-deg">{{ p.type }}</span>
        {% if p.rg %}<a href="{{ p.rg }}" target="_blank" class="cv-pub-link">[RG]</a>{% endif %}
      </div>
    </div>
    {% endfor %}

    <h3 class="cv-subsection">Refereed Journal Articles</h3>
    {% for p in cv.publications.journals %}
    <div class="cv-pub">
      <span class="cv-pub-num">{{ forloop.rindex }}.</span>
      <div class="cv-pub-content">
        <span class="cv-pub-authors">{{ p.authors }}, </span>
        {% if p.url %}<a href="{{ p.url }}" target="_blank" class="cv-pub-title">"{{ p.title }},"</a>{% else %}<span class="cv-pub-title">"{{ p.title }},"</span>{% endif %}
        <em class="cv-pub-venue"> {{ p.journal }}</em>, vol. {{ p.vol }}{% if p.pages %}, p. {{ p.pages }}{% endif %}. ({{ p.year }}){% if p.doi %} DOI: {{ p.doi }}.{% endif %}
        {% if p.rg %}<a href="{{ p.rg }}" target="_blank" class="cv-pub-link">[RG]</a>{% endif %}
      </div>
    </div>
    {% endfor %}

    <h3 class="cv-subsection">Conference Proceedings</h3>
    {% for p in cv.publications.conferences %}
    <div class="cv-pub">
      <span class="cv-pub-num">{{ forloop.rindex }}.</span>
      <div class="cv-pub-content">
        <span class="cv-pub-authors">{{ p.authors }}, </span>
        {% if p.rg %}<a href="{{ p.rg }}" target="_blank" class="cv-pub-title">"{{ p.title }},"</a>{% else %}<span class="cv-pub-title">"{{ p.title }},"</span>{% endif %}
        <em class="cv-pub-venue"> {{ p.proc }}</em>{% if p.pages %}, p. {{ p.pages }}{% endif %}, {{ p.org }}. ({{ p.year }}){% if p.note %} <em class="cv-note">[{{ p.note }}]</em>{% endif %}{% if p.award %} <span class="cv-award">{{ p.award }}</span>{% endif %}
        {% if p.rg %}<a href="{{ p.rg }}" target="_blank" class="cv-pub-link">[RG]</a>{% endif %}
      </div>
    </div>
    {% endfor %}

    <h3 class="cv-subsection">Books <span class="cv-subsection-note">(as Graphic Designer / Author)</span></h3>
    {% for b in cv.publications.books %}
    <div class="cv-pub">
      <span class="cv-pub-num"></span>
        <div class="cv-pub-content">
        <span class="cv-pub-authors">{{ b.role }}: </span>
        {% if b.url %}<a href="{{ b.url }}" target="_blank" class="cv-pub-title"><em>{{ b.title }}</em></a>{% else %}<em class="cv-pub-title">{{ b.title }}</em>{% endif %}
        <span class="cv-pub-venue">, {{ b.pub }}, {{ b.year }}.</span>
      </div>
    </div>
    {% endfor %}
  </section>

  <!-- ══ TEACHING ══════════════════════════════════════════════ -->
  <section class="cv-section">
    <h2 class="cv-section-title">Teaching</h2>
    {% for inst in cv.teaching %}
    <div class="cv-teach-block">
      <div class="cv-teach-header">
        <span class="cv-teach-inst">{{ inst.institution }}{% if inst.location %}, {{ inst.location }}{% endif %}</span>
        <span class="cv-teach-years">{{ inst.years }}</span>
      </div>
      {% if inst.dept %}<div class="cv-teach-dept">{{ inst.dept }}</div>{% endif %}
      <ul class="cv-course-list">
        {% for course in inst.courses %}
        <li>
          {% if course.url %}<a href="{{ course.url }}" target="_blank">{{ course.title }}</a>{% else %}{{ course.title }}{% endif %}
          <span class="cv-course-term">{{ course.term }}</span>
        </li>
        {% endfor %}
      </ul>
    </div>
    {% endfor %}
  </section>

  <!-- ══ PRESENTATIONS ═════════════════════════════════════════ -->
  <section class="cv-section">
    <h2 class="cv-section-title">Presentations</h2>
    {% for p in cv.presentations %}
    <div class="cv-entry">
      <div class="cv-entry-meta">{{ p.year }}</div>
      <div class="cv-entry-body">
        {% if p.url %}<a href="{{ p.url }}" target="_blank" class="cv-pres-title">{{ p.title }}</a>{% else %}<span class="cv-pres-title">{{ p.title }}</span>{% endif %}
        {% if p.type %}<span class="cv-award">[{{ p.type }}]</span>{% endif %}
        <span class="cv-entry-org">, {{ p.venue }}.</span>
      </div>
    </div>
    {% endfor %}
  </section>

  <!-- ══ PROFESSIONAL ACTIVITIES ═══════════════════════════════ -->
  <section class="cv-section">
    <h2 class="cv-section-title">Professional Activities</h2>
    {% for a in cv.activities %}
    <div class="cv-entry">
      <div class="cv-entry-meta">{{ a.years }}</div>
      <div class="cv-entry-body">
        <strong>{{ a.title }}</strong>,
        {% if a.url %}<a href="{{ a.url }}" target="_blank">{{ a.org }}</a>{% else %}{{ a.org }}{% endif %}
      </div>
    </div>
    {% endfor %}
  </section>

  <!-- ══ CERTIFICATIONS ════════════════════════════════════════ -->
  <section class="cv-section cv-section-2col">
    <div>
      <h2 class="cv-section-title">Certifications</h2>
      <h3 class="cv-subsection">Technology</h3>
      {% for c in cv.certifications.technology %}
      <div class="cv-cert">
        <strong>{{ c.name }}</strong>, {{ c.org }}, <em>{{ c.year }}</em>
      </div>
      {% endfor %}
      <h3 class="cv-subsection">Language Education</h3>
      {% for c in cv.certifications.language %}
      <div class="cv-cert">
        <strong>{{ c.name }}</strong>, {{ c.org }}, <em>{{ c.year }}</em>
      </div>
      {% endfor %}
    </div>

    <div>
      <h2 class="cv-section-title">Languages</h2>
      {% for lang in cv.languages %}
      <div class="cv-lang">
        <div class="cv-lang-name"><strong>{{ lang.lang }}</strong> <span class="cv-dept">— {{ lang.level }}</span></div>
        {% for s in lang.scores %}
        <div class="cv-cert">{{ s.test }}: {{ s.score }}{% if s.year %} <em>({{ s.year }})</em>{% endif %}</div>
        {% endfor %}
      </div>
      {% endfor %}
    </div>
  </section>

  <div class="cv-footer-note no-print">
    <p>Last updated: April 2026 · <a href="{{ '/' | relative_url }}">aaronsnowberger.com</a> · <a href="mailto:{{ cp[0] }}&#64;{{ cp[1] }}">{{ cp[0] }}&#64;{{ cp[1] }}</a></p>
  </div>

</main>
