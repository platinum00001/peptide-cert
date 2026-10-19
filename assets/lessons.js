/* Lesson content. Educational overview only — no dosing instructions. */
window.PC1_LESSONS = [
{
  id: "intro",
  title: "Introduction & Important Disclaimer",
  minutes: 5,
  requiresAck: true,
  html: `
<div class="callout callout-warn" role="note">
  <strong>Education only — not medical advice.</strong>
  <p>This course provides general educational information about peptides. It is not medical, legal or pharmacy advice, it does not establish a provider–patient relationship, and it does not contain dosing, reconstitution, or administration instructions. Never start, stop or change any treatment without consulting a licensed healthcare professional. If you think you are having a medical emergency, call your local emergency number immediately.</p>
</div>
<h3>What this course covers</h3>
<p>Peptide Certification Level 1 is an introductory overview designed for wellness professionals, clinic staff, students and informed consumers. By the end of the course you should be able to:</p>
<ul>
  <li>Explain what peptides are and how they differ from proteins.</li>
  <li>Recognize the common categories of peptides and where they are encountered.</li>
  <li>Describe general storage and handling principles.</li>
  <li>Identify key safety risks and when to seek medical help.</li>
  <li>Summarize the regulatory landscape at a high level.</li>
  <li>Describe the elements of informed consent.</li>
</ul>
<h3>What this certificate is — and is not</h3>
<p>Passing the Level 1 assessment (80% or higher) earns a certificate of completion. The certificate documents that you completed an educational course. It is <strong>not</strong> a professional license, a credential to prescribe, compound, dispense or administer any substance, or an endorsement of any product. What you may do professionally is governed by the laws of your jurisdiction and your licensure and scope of practice.</p>
<h3>How the course works</h3>
<ol>
  <li>Read each of the seven lessons and mark it complete.</li>
  <li>Take the 25-question multiple-choice assessment. You need 20 correct answers (80%) to pass.</li>
  <li>On passing, download or print your certificate. Each certificate has a unique ID that anyone can check on the public verification page.</li>
</ol>`
},
{
  id: "what",
  title: "What Peptides Are",
  minutes: 8,
  html: `
<p><strong>Peptides</strong> are short chains of <strong>amino acids</strong> — the same building blocks that make up proteins — joined together by <strong>peptide bonds</strong>. A peptide bond forms when the carboxyl group of one amino acid links to the amino group of the next, releasing a molecule of water.</p>
<h3>Peptides vs. proteins</h3>
<p>The difference is mainly one of size and structure. A widely used convention treats chains of roughly <strong>50 amino acids or fewer</strong> as peptides and longer chains as proteins, although the boundary is not absolute. Proteins usually fold into complex three-dimensional shapes; many peptides are smaller and more flexible.</p>
<table class="table">
  <thead><tr><th>Term</th><th>Approximate length</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Dipeptide / tripeptide</td><td>2–3 amino acids</td><td>Glutathione (a tripeptide antioxidant made by the body)</td></tr>
    <tr><td>Oligopeptide</td><td>A few to ~20 amino acids</td><td>Oxytocin (9 amino acids)</td></tr>
    <tr><td>Polypeptide</td><td>Longer chains, up to ~50</td><td>Insulin (51 amino acids in two chains — often cited as the borderline case)</td></tr>
  </tbody>
</table>
<h3>Where peptides come from</h3>
<ul>
  <li><strong>Endogenous peptides</strong> are made naturally in the body and act as hormones, neurotransmitters, immune molecules and signaling molecules.</li>
  <li><strong>Food-derived peptides</strong> are released when proteins (for example from milk, fish or collagen) are broken down.</li>
  <li><strong>Synthetic peptides</strong> are manufactured, most often by <strong>solid-phase peptide synthesis (SPPS)</strong>, in which amino acids are added one at a time to a growing chain, or by <strong>recombinant DNA technology</strong>, in which engineered cells produce the peptide.</li>
</ul>
<h3>Why peptides matter</h3>
<p>Because peptides can bind to specific receptors, they can have very targeted effects. That same specificity is why identity, purity and correct use matter so much: a small change in structure, contamination or degradation can change how a peptide behaves. Several peptide-based medicines are approved by regulators, while many other peptides are sold without approval — a distinction covered in the Regulations lesson.</p>`
},
{
  id: "categories",
  title: "Common Categories of Peptides",
  minutes: 8,
  html: `
<p>Peptides can be grouped by their origin, their function in the body, or how they are regulated and sold. The categories below are a practical overview, not an exhaustive scientific classification.</p>
<h3>By biological role</h3>
<ul>
  <li><strong>Peptide hormones</strong> — signaling molecules released into the bloodstream. Examples include insulin and glucagon (blood sugar regulation), oxytocin and vasopressin, and incretin hormones such as GLP-1.</li>
  <li><strong>Neuropeptides</strong> — peptides used by nerve cells to communicate, such as endorphins and substance P.</li>
  <li><strong>Antimicrobial peptides</strong> — part of the body's <strong>innate immune defenses</strong>; they help protect skin and mucous membranes against microbes.</li>
  <li><strong>Growth-factor and tissue-signaling peptides</strong> — involved in growth, repair and cell communication.</li>
</ul>
<h3>By how they are encountered</h3>
<ul>
  <li><strong>Approved peptide medicines</strong> — prescription drugs that have gone through regulatory review, for example insulin products and GLP-1 receptor agonists. These have approved labeling describing indications, risks and use.</li>
  <li><strong>Compounded preparations</strong> — prepared by licensed pharmacies for individual patients under specific legal rules (see Regulations).</li>
  <li><strong>Food, supplement and cosmetic peptides</strong> — for example collagen peptides in foods and supplements, and signal peptides used in skincare formulations. These are regulated differently from drugs and may not make disease-treatment claims.</li>
  <li><strong>"Research use only" peptides</strong> — sold for laboratory research and labeled <em>not for human consumption</em>. This label means the product is <strong>not approved or intended for administration to people</strong>, and it typically has not been made or tested to standards required for human use.</li>
</ul>
<div class="callout">
  <strong>Key point:</strong> The same-sounding peptide name can refer to products with very different regulatory status and quality. Always identify which category a product belongs to before discussing it with anyone.
</div>`
},
{
  id: "storage",
  title: "Storage & Handling Basics",
  minutes: 7,
  html: `
<p>Peptides can be fragile. Heat, light, moisture, oxygen and contamination can break them down or introduce harmful microbes. These are <em>general principles</em>; the product's labeling and the dispensing pharmacist's instructions always take priority.</p>
<h3>Product forms</h3>
<ul>
  <li><strong>Lyophilized (freeze-dried) powder</strong> — water has been removed to improve stability during storage and shipping.</li>
  <li><strong>Solutions and pre-filled pens</strong> — ready-to-use products that often have stricter storage requirements and shorter in-use periods.</li>
</ul>
<h3>General storage principles</h3>
<ul>
  <li><strong>Follow the labeling.</strong> Store at the temperature stated by the manufacturer or pharmacy, typically protected from heat, direct light and moisture.</li>
  <li><strong>Maintain the cold chain</strong> when refrigeration is required, including during transport. Do not leave products in hot vehicles or direct sun.</li>
  <li><strong>Avoid repeated freeze–thaw cycles</strong>, which can degrade peptides. Do not freeze products unless the labeling says to.</li>
  <li>Keep products in their <strong>original, labeled containers</strong>, out of reach of children and pets.</li>
  <li>Note the <strong>expiration date</strong> and any "discard after opening" period.</li>
</ul>
<h3>Inspect before any use</h3>
<p>Do not use a product — set it aside and follow disposal or reporting guidance — if it is past its expiration date, the packaging is damaged or tampered with, the label is missing or unclear, or it looks different from what is expected (for example cloudy, discolored or containing particles when it should be clear).</p>
<h3>Hygiene, sharps and disposal</h3>
<ul>
  <li>Products intended for injection must be prepared and used only as directed by a licensed professional using aseptic (sterile) technique. This course does not teach preparation or administration.</li>
  <li><strong>Never share</strong> needles, syringes, pens or vials.</li>
  <li>Place used needles and sharps in an <strong>FDA-cleared sharps disposal container</strong> and follow local disposal rules. Never place loose sharps in household trash or recycling.</li>
  <li>Dispose of unused or expired products through take-back programs or as directed by the pharmacy.</li>
</ul>`
},
{
  id: "safety",
  title: "Safety Considerations",
  minutes: 8,
  html: `
<p>Every biologically active substance carries risk. Understanding the main categories of risk helps you ask better questions and recognize when to seek professional help.</p>
<h3>Types of adverse effects</h3>
<ul>
  <li><strong>Injection-site reactions</strong> — redness, swelling, pain or itching.</li>
  <li><strong>Systemic side effects</strong> — effects elsewhere in the body, which vary by peptide (for example gastrointestinal symptoms, changes in blood sugar, or changes in heart rate or blood pressure).</li>
  <li><strong>Allergic reactions</strong> — from mild rash to <strong>anaphylaxis</strong>, a life-threatening emergency.</li>
  <li><strong>Infection</strong> — from contaminated products or non-sterile technique.</li>
  <li><strong>Interactions</strong> — with prescription medicines, supplements or medical conditions.</li>
</ul>
<div class="callout callout-danger" role="note">
  <strong>Seek emergency care immediately</strong> for difficulty breathing, wheezing, swelling of the face, lips, tongue or throat, widespread hives, fainting, chest pain, or confusion. Call your local emergency number.
</div>
<h3>Product quality risks</h3>
<p>Products from unregulated ("gray market") sources — including many sold online as "research chemicals" — pose particular risks: the <strong>identity, purity, potency and sterility are unknown</strong>. Independent testing has found mislabeled products, incorrect amounts and contamination with bacteria, endotoxins or other substances. Counterfeit versions of approved peptide medicines have also been reported.</p>
<h3>Higher-risk situations</h3>
<p>Extra caution and professional oversight are especially important for people who are pregnant or breastfeeding, minors, older adults, people with chronic conditions (such as diabetes, heart, kidney or liver disease, or a history of cancer), and people taking other medicines.</p>
<h3>Reporting problems</h3>
<p>In the United States, adverse events and product quality problems involving FDA-regulated products can be reported to the <strong>FDA MedWatch</strong> program. Other countries have equivalent systems (for example the MHRA Yellow Card scheme in the UK). Reporting helps regulators identify unsafe products.</p>`
},
{
  id: "regulations",
  title: "Regulatory Overview",
  minutes: 9,
  html: `
<p>Regulation of peptides is complex and changes over time. This lesson gives a high-level, primarily U.S.-focused overview. It is not legal advice — always check current rules from the relevant authority and consult qualified counsel for your situation.</p>
<h3>Approved drugs</h3>
<p>In the United States the <strong>Food and Drug Administration (FDA)</strong> approves prescription drugs, including peptide drugs, after reviewing evidence of safety and effectiveness for specific uses. Approved drugs come with official labeling. Use of an approved drug for a purpose not on the label ("off-label") is a medical decision made by a licensed prescriber.</p>
<h3>Compounding</h3>
<p>Licensed pharmacies may compound medications under <strong>sections 503A and 503B of the Federal Food, Drug, and Cosmetic Act</strong>. Compounded drugs are not FDA-approved, and there are restrictions on which bulk substances can be used. The FDA has identified certain peptides as raising significant safety concerns for compounding, and that list is updated periodically — check the current status before relying on any source.</p>
<h3>"Research use only" products</h3>
<p>Products labeled <em>for research use only / not for human consumption</em> are not approved for human use. Selling or marketing such products for human use can violate federal law, and regulators have issued warning letters to companies doing so.</p>
<h3>Supplements, foods and cosmetics</h3>
<p>Some peptides (for example collagen peptides) are sold as foods, dietary supplements or cosmetic ingredients. These categories cannot lawfully be marketed to diagnose, treat, cure or prevent disease. Advertising claims are also policed by the <strong>Federal Trade Commission (FTC)</strong>, which requires that health claims be truthful and supported by evidence.</p>
<h3>Scope of practice</h3>
<p>Who may prescribe, dispense or administer drugs is determined by <strong>state law, professional licensure and scope of practice</strong>. A course certificate — including this one — does not change those rules.</p>
<h3>Sport</h3>
<p>Many peptide hormones, growth factors and related substances are <strong>prohibited at all times</strong> under the World Anti-Doping Agency (WADA) Prohibited List. Athletes subject to testing should check the current list and their sport's rules.</p>
<h3>Outside the United States</h3>
<p>Other regulators — such as the European Medicines Agency (EMA), the UK's MHRA, Health Canada and Australia's TGA — have their own rules. Requirements differ significantly by country.</p>`
},
{
  id: "consent",
  title: "Informed Consent",
  minutes: 7,
  html: `
<p><strong>Informed consent</strong> is the process by which a person, after receiving clear information, voluntarily agrees to a proposed intervention. It is an <strong>ongoing, documented communication process</strong> — not simply a signature on a form.</p>
<h3>Core elements</h3>
<ul>
  <li><strong>Nature and purpose</strong> of what is proposed.</li>
  <li><strong>Risks</strong>, including common side effects and serious but rare risks.</li>
  <li><strong>Expected benefits</strong>, described honestly and without exaggeration.</li>
  <li><strong>Reasonable alternatives</strong>, including the option of doing nothing.</li>
  <li><strong>Regulatory status</strong> — whether the product is approved for this use, compounded, or unapproved, and how strong the evidence is.</li>
  <li><strong>Opportunity to ask questions</strong> and receive understandable answers.</li>
  <li><strong>Voluntariness</strong> — the decision is made freely, without pressure or coercion.</li>
  <li><strong>Right to withdraw</strong> at any time.</li>
</ul>
<h3>Capacity and voluntariness</h3>
<p>For consent to be valid, the person must have <strong>decision-making capacity</strong> — the ability to understand the information, appreciate how it applies to them, reason about options and communicate a choice — and must agree <strong>voluntarily</strong>. Special rules apply to minors and to people who lack capacity.</p>
<h3>Transparency about unapproved uses</h3>
<p>When a product is not approved for the use being discussed, this must be <strong>clearly disclosed</strong>, together with the fact that supporting evidence may be limited. Describing an unapproved product as "FDA-approved," or promising results, is misleading and unethical.</p>
<div class="callout">
  <strong>What informed consent never includes:</strong> a guarantee of specific results, pressure to decide quickly, or a waiver of a person's rights.
</div>
<h3>Documentation</h3>
<p>Good practice is to document what was discussed, the materials provided, the questions asked and the person's decision, and to revisit consent when circumstances change.</p>
<h3>Course summary</h3>
<p>You have now covered what peptides are, their common categories, storage and handling basics, safety, regulation and informed consent. Return to the dashboard to take the Level 1 assessment.</p>`
}
];
