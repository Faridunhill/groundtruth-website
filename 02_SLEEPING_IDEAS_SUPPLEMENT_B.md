# SLEEPING IDEAS — SUPPLEMENT B
Version: 1.0 | Compiled 2026-07-31
Status: LIST ONLY. Same rule as the drawer — nothing here is a project. Only Farid moves an idea out.
Scope: recovered from the `faridunhill/groundtruth-website` repository, which the MIND project could not read.

**Source documents newly read:**
1. `GROUNDTRUTH_PRODUCT_REGISTRY.md.txt` — gt:registry-v1.0, 2026-06-24, 857 lines
2. `groundtruth_realtor_outreach_email.md` — v1.0, outreach playbook
3. `index.html` — the live page, 290 lines
4. Git history — 4 commits, 16 archived landing pages deleted in `866bac1`

Same key as the drawer: **RECORDED** = fact. **SOURCE** = where. **GAP** = never written. **MY READ** = my reasoning, not record.

---

# H. RECOVERED FROM THE WEBSITE REPO

### H0. THE CONTRADICTION — read this first
- **RECORDED:** Registry (06-24) specifies Tennessee, three tiers at $99/$299/$499, live Stripe, a 24-origin-state tax calculator, and a 10-section report. Drawer C2 (07-27) calls Tennessee "the largest finished-and-unused asset in the portfolio." The live `index.html` is New Jersey only, view-only, with `mailto:` links and no payment path.
- **SOURCE:** Registry Sections 04/05/06; drawer C2; `index.html`; commits `5a6a0fe` (Stripe live) → `866bac1` (Gate 0, Stripe removed).
- **GAP:** Nothing records *why* the rollback happened, or whether NJ-first is a decision or a holding pattern.
- **MY READ:** This is the most important fact recovered. Tennessee was not sitting unused awaiting a decision — it was built, launched with live payment links, and then deliberately withdrawn. Three documents describe three different companies. Until one of them is authoritative, every downstream idea in section C is being reasoned about from a false premise.

### H1. Area Research (no address required)
- **RECORDED:** FAQ Q3 — *"Do I need a specific property to order? No. Area Research option — county or zip. **Many buyers order this first.**"* Logged as GAP-08: mentioned in FAQ, absent from pricing.
- **SOURCE:** Registry Section 07 (FAQ Q3); Section 11 (GAP-08).
- **GAP:** No price. No section list. No delivery format. Never appeared in the pricing grid.
- **MY READ:** A product the FAQ says buyers already want, that the pricing page does not sell. It is the only GroundTruth product that needs no parcel, no address, and no SSURGO join — which also makes it the only one that is state-agnostic. It survives the NJ/TN fight untouched.

### H2. HR WorkMove
- **RECORDED:** Listed in the footer navigation as a product. GAP-07: *"no landing section on page… CKA writes product definition first."*
- **SOURCE:** Registry Section 09 (footer links); Section 11 (GAP-07).
- **GAP:** Everything. No definition, no buyer, no price. A name in a footer.
- **MY READ:** Same disease as drawer entries A3–A7 — a name doing the work of a product. B2B corporate relocation is a different buyer, a different sales cycle, and a different contract than a $299 consumer PDF.

### H3. Rental Report
- **RECORDED:** Listed in footer navigation alongside Home Buyer Report and Land Report.
- **SOURCE:** Registry Section 09.
- **GAP:** No spec anywhere. Never priced, never described.
- **MY READ:** Footer-only, like H2.

### H4. Land Report
- **RECORDED:** *"Dedicated Land Report: buildability, septic, soil, wetlands, flood, zoning, utility access, solar potential."*
- **SOURCE:** Registry FAQ Q6. Also carried a live Stripe pricing toggle in commit `5a6a0fe`.
- **GAP:** Not in the pricing table with the other three tiers.
- **MY READ:** The best-specified product in the registry and the one that most directly consumes the SSURGO soil asset. Unlike H2 and H3 this has an actual content list. It is also the product the 16 archived `NJ_Land_Intelligence_*` pages were circling for months.

### H5. Realtor referral program & partner portal
- **RECORDED:** 20% off for the buyer, 20% commission to the agent, paid by GroundTruth not the buyer. Code format `GT-[LASTNAME]-[2DIGITS]`. *"Track in Supabase. **Field already built into intake form.**"* GAP-05: portal is a `href="#"`.
- **SOURCE:** Registry Section 05 + GAP-05; outreach email (referral format, tracking columns, call script).
- **GAP:** No code-issuance mechanism, no commission payout process, no portal.
- **MY READ:** The economics are unusual — a 40% total giveaway on a $299 report leaves $179. But customer acquisition cost is otherwise unbounded, and the Supabase field already exists. This is the closest thing in the whole portfolio to a distribution channel rather than a marketing tactic.

### H6. The tax savings calculator — a working asset, removed
- **RECORDED:** 24 origin states. Bracket-based rate lookup, animated counter, 10-year projection, and an email capture immediately after the result: *"Send me the discount code."* Seven named JS functions registered.
- **SOURCE:** Registry Section 06. Present in `groundtruth_landing_ULTIMATE_v2.html`, deleted at `866bac1`.
- **GAP:** Nothing records a decision to remove it.
- **MY READ:** This was the only lead-capture mechanism on the site and the only reason for a visitor with no immediate purchase intent to hand over an email. It is finished, it worked, and it is now in the archive. Whatever happens to the NJ/TN question, deleting the free tool that captures emails is the one move with no upside.

### H7. Free sample report as a sales weapon
- **RECORDED:** Outreach Email C — *"send me the address and I'll turn it around in 24 hours at no cost, as a demonstration. No strings."*
- **SOURCE:** `groundtruth_realtor_outreach_email.md`, Email C.
- **MY READ:** Drawer C7 records free reports as a pricing question. This is sharper: free reports as the *opening move of a B2B conversation*, aimed at agents rather than buyers. Same Encyclopedia logic — give the artifact away, and the artifact does the selling. Also note GAP-04: the "View Sample Report" button has never had a file behind it. The sales motion depends on an asset that does not exist.

### H8. "Every report has an engineer reviewing it before delivery"
- **RECORDED:** Stated as a differentiator in the outreach email. *"This is not a generic AI report."* Turnaround promised: Quick Scan 2 hours, Standard 24 hours, Full DD 48 hours, Rush same-day.
- **SOURCE:** Outreach email; Registry Section 05.
- **GAP:** No record of how many reports per week that reviewer can produce.
- **MY READ:** The most valuable sentence in the marketing and the hardest ceiling in the business, and they are the same sentence. The engineer is Farid. A same-day rush option is a promise on his personal calendar. This is the single most important unasked question in the GroundTruth stack — every growth idea in section C is downstream of the answer.

### H9. The design system as a portable asset
- **RECORDED:** Registry Section 02 locks 16 colour variables, a three-font stack, and a full spacing grid. CKA note: *"Any future product pages MUST use the identical colour system, font stack, and spacing. This registry is the single source of truth. No deviations without a log entry."*
- **SOURCE:** Registry Sections 02 and 14.
- **MY READ:** Drawer D2 argues the *pricing engine* proves domain-blindness. This is the same argument for the visual layer, and it is further along — already specified, already versioned, already governed by a written protocol. Ashcombe needs a look; one exists and is documented.

### H10. Cross-project data flows
- **RECORDED:** Registry Section 13 defines five flows, including *"GroundTruth landing → FARIDUNHILL → Lead gen for pipe buyers → passive"* and *"Tax Calculator → farid_os.db → Lead emails captured → on-capture."*
- **SOURCE:** Registry Section 13.
- **GAP:** No evidence any flow was ever wired.
- **MY READ:** The GroundTruth-to-pipes flow assumes an out-of-state homebuyer is a latent pipe collector. They share an owner, not a buyer. The Tax-Calculator-to-database flow is the only one of the five with a real mechanism behind it, and it died with H6.

### H11. Analytics — still absent
- **RECORDED:** GAP-09 — *"No GA4, no Hotjar, no conversion tracking. Impact: HIGH — you need conversion data from day 1."*
- **SOURCE:** Registry Section 11; confirmed against live `index.html` — the only external links are Google Fonts and two `mailto:` addresses.
- **MY READ:** Recorded as a gap on 06-24 and still open on 07-31. The site cannot currently answer whether anyone visits it.

### H12. "Blueprint Authority" — an abandoned direction
- **RECORDED:** Two archived pages, `GROKgroundtruth-blueprint-authority.html` and `groundtruth-blueprint-authority-full.html`, deleted at `866bac1`.
- **GAP:** Never mentioned in the registry or the drawer. No record of what it was or why it stopped.
- **MY READ:** A positioning direction that ran far enough to produce two full pages and then vanished without a kill note. Recording the death is the point — otherwise it resurfaces from the archive every time someone browses the folder.

### H13. Sixteen archived landing pages
- **RECORDED:** `866bac1` deleted 16 HTML/JSX files totalling ~11,000 lines: six NJ Land Intelligence variants, four full landing pages, a JSX version, two blueprint pages.
- **MY READ:** Not an idea — a measurement. Roughly a dozen complete builds of the same page, none of which is the live one. The bottleneck in GroundTruth has never been building.

---

# I. STRUCTURAL OBSERVATIONS

### I1. The registry's own review date has passed
Registry header: *"Next Review: 2026-07-24."* Not performed. Ten gaps logged 06-24; on the evidence of the live page, GAP-01, 03, 04, 05, 06, 07, 08 and 09 are all still open, and GAP-01 was closed and then reopened.

### I2. The upgrade protocol was written and then not followed
Section 12 mandates six steps for any page change: log before touching, archive, increment filename, QC, update registry, deploy with timestamp. Commit `866bac1` rewrote the page from 963 lines to 290, deleted the entire archive folder, and added no version-log row. **MY READ:** the protocol is not the problem — the absence of anything enforcing it is. This is precisely the drawer's E2 (WATCH skill, never written).

### I3. The B1 lesson applies here, unnoticed
Drawer B1 records the correction: authenticity was asked in 1 buyer message out of 1,053, so the Passport should answer *"what condition, which parts original"* — not *"is it genuine."* GroundTruth has the same shape and has not had the same correction. The registry's ten sections deliver **data**. The outreach email sells a **decision** — "should I sign this." No document records which one the buyer actually pays for, because unlike the pipes business there are no buyer messages to count. **MY READ:** the pipes business earned that correction from 1,053 messages. GroundTruth has zero. That asymmetry, not the data layer, is the real difference between the two businesses.

---

# J. WHAT IS STILL MISSING

1. **SKILL-DATA-001** — unchanged from drawer section G. Still the highest-value missing document.
2. **The Supabase intake form** — referenced twice as already built, present in no readable file.
3. **The sample report PDF** — the outreach email says "attach it," GAP-04 says it does not exist.
4. **Any record of the Gate 0 decision** — the largest strategic reversal in the portfolio, undocumented.
5. **Fifteen-plus other Claude projects** — unchanged from drawer section G.

---

*Nothing in this file is authorized. Nothing in this file has an owner.*
*Compiled from repository evidence only. Where a claim is inference it is marked MY READ.*
