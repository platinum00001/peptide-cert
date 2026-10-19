/* Lesson content. Educational overview only — no dosing amounts, no protocols.
 * Each lesson: id, title, minutes, html, takeaways[], check[] (short self-check,
 * graded in the browser; it does not count toward the certificate). */
window.PC1_LESSONS = [
{
  id: "intro",
  title: "Introduction & Important Disclaimer",
  kicker: "Orientation",
  minutes: 6,
  requiresAck: true,
  html: `
<div class="callout callout-warn" role="note">
  <strong>Education only — not medical advice.</strong>
  <p>This course provides general educational information about peptides. It is not medical, legal or pharmacy advice, it does not establish a provider–patient relationship, and it does not contain dosing amounts, protocols, or step-by-step reconstitution or administration instructions. Never start, stop or change any treatment without consulting a licensed healthcare professional. If you think you are having a medical emergency, call your local emergency number immediately.</p>
</div>
<h3>Who this course is for</h3>
<p>Peptide Certification Level 1 is an introductory, science-literacy course for wellness professionals, clinic and front-desk staff, pharmacy and lab support staff, students and informed consumers. It gives you a shared vocabulary and a framework for asking good questions — about the science, product quality, safety, regulation and ethics — so you can recognize when something needs to be referred to a licensed professional.</p>
<h3>Learning objectives</h3>
<p>By the end of the course you should be able to:</p>
<ul>
  <li>Explain how peptides are built from amino acids and how they act through receptors and cell signaling.</li>
  <li>Distinguish FDA-approved peptide medicines from investigational and "research-use-only" peptides.</li>
  <li>Read a certificate of analysis (COA) critically and describe what purity and third-party testing do — and do not — prove.</li>
  <li>Describe reconstitution and storage <em>concepts</em> and why product labeling governs them.</li>
  <li>Recognize general categories of adverse events, contraindications and emergency warning signs, and know how adverse events are reported.</li>
  <li>Summarize the U.S. regulatory landscape: FDA approval, compounding under sections 503A/503B, and research-use-only labeling.</li>
  <li>Apply core ethical principles and the elements of informed consent.</li>
</ul>
<h3>What this certificate is — and is not</h3>
<p>Passing the Level 1 assessment (80% or higher) earns a certificate of completion. The certificate documents that you completed an educational course. It is <strong>not</strong> a professional license, a credential to prescribe, compound, dispense or administer any substance, or an endorsement of any product. What you may do professionally is governed by the laws of your jurisdiction and your licensure and scope of practice.</p>
<h3>How the course works</h3>
<ol>
  <li>Read each of the seven lessons. Each ends with <strong>key takeaways</strong> and a short <strong>knowledge check</strong> (practice only — it is not scored).</li>
  <li>Mark each lesson complete. Your progress tracker shows where you are.</li>
  <li>Take the 25-question multiple-choice assessment. You need 20 correct answers (80%) to pass, and retakes are allowed.</li>
  <li>On passing, print or save your certificate. Each certificate has a unique ID that anyone can check on the public verification page.</li>
</ol>
<p>A <a href="#/glossary">glossary</a> of key terms is available at any time from the Lessons page.</p>`,
  takeaways: [
    "This course is educational only: no dosing amounts, protocols or medical advice.",
    "The certificate documents course completion — it is not a license or authority to prescribe or administer anything.",
    "Scope of practice and the law in your jurisdiction always determine what you may do professionally."
  ],
  check: [
    { q: "What does the Level 1 certificate document?", options: ["Authority to prescribe peptides", "Completion of an educational course", "FDA approval of a product"], answer: 1,
      explain: "It is a certificate of course completion only — not a license or product endorsement." },
    { q: "Where should individual treatment decisions come from?", options: ["A licensed healthcare professional", "This course", "A product seller"], answer: 0,
      explain: "Only a licensed professional who knows the person's history can make individual treatment decisions." }
  ]
},
{
  id: "how",
  title: "How Peptides Work",
  kicker: "The science",
  minutes: 12,
  html: `
<p><strong>Peptides</strong> are short chains of <strong>amino acids</strong> — the same building blocks that make up proteins — joined by <strong>peptide (amide) bonds</strong>. A peptide bond forms when the carboxyl group of one amino acid links to the amino group of the next, releasing a molecule of water.</p>
<h3>The building blocks</h3>
<p>Living things use <strong>20 standard amino acids</strong>. Each shares the same backbone (an amino group, a carboxyl group and a central carbon) but carries a different <strong>side chain</strong> that may be water-loving, water-repelling, acidic, basic or able to form special links such as the <strong>disulfide bridges</strong> between cysteines. The order of amino acids — the <strong>sequence</strong>, or <em>primary structure</em> — is written from the N-terminus to the C-terminus and determines how the chain folds and what it binds.</p>
<figure class="chain-figure" aria-label="Diagram: amino acids linked into a peptide chain">
  <div class="chain" aria-hidden="true"><span>N</span><i></i><b>A1</b><i></i><b>A2</b><i></i><b>A3</b><i></i><b>A4</b><i></i><b>…</b><i></i><span>C</span></div>
  <figcaption>Amino acids (A1, A2, …) joined by peptide bonds, read from the N-terminus to the C-terminus.</figcaption>
</figure>
<h3>Peptides vs. proteins</h3>
<p>The difference is mainly one of size and structure. A common scientific convention treats chains of roughly <strong>50 amino acids or fewer</strong> as peptides and longer chains as proteins, although the boundary is not absolute (U.S. regulation uses its own cut-off, covered in the Regulatory lesson). Proteins usually fold into stable three-dimensional shapes; many peptides are smaller and more flexible.</p>
<div class="table-wrap"><table class="table">
  <thead><tr><th>Term</th><th>Approximate length</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Di-/tripeptide</td><td>2–3 amino acids</td><td>Glutathione (a tripeptide antioxidant made by the body)</td></tr>
    <tr><td>Oligopeptide</td><td>A few to ~20</td><td>Oxytocin and vasopressin (9 amino acids each)</td></tr>
    <tr><td>Polypeptide</td><td>Longer chains, up to ~50</td><td>Insulin (51 amino acids in two chains linked by disulfide bridges)</td></tr>
  </tbody>
</table></div>
<h3>Receptors: the lock-and-key idea</h3>
<p>Most peptide hormones and signaling peptides act by binding a <strong>receptor</strong> — a protein, usually on the cell surface — whose shape and chemistry fit the peptide closely. The peptide is the <strong>ligand</strong>. How tightly it binds is its <strong>affinity</strong>; how selectively it binds one receptor over others is its <strong>selectivity</strong>.</p>
<ul>
  <li>An <strong>agonist</strong> binds and activates a receptor (for example, GLP-1 receptor agonists activate the receptor for the gut hormone GLP-1).</li>
  <li>An <strong>antagonist</strong> binds and blocks a receptor without activating it.</li>
  <li>Many peptide receptors are <strong>G-protein-coupled receptors (GPCRs)</strong>; others, such as the insulin receptor, are <strong>receptor tyrosine kinases</strong>.</li>
</ul>
<h3>Signaling: from binding to effect</h3>
<p>Binding is only the first step. The activated receptor triggers a <strong>signal transduction cascade</strong> inside the cell — for GPCRs often through "second messengers" such as cyclic AMP (cAMP) or calcium — which changes enzyme activity, gene expression or secretion. Because one receptor can switch on many downstream molecules, signals are <strong>amplified</strong>, and the body uses <strong>feedback loops</strong> to keep them in balance. This is why peptide hormones can have powerful effects at tiny concentrations, and why interfering with one signal can ripple through a whole hormonal axis.</p>
<h3>Why peptides behave the way they do</h3>
<ul>
  <li><strong>Short half-life.</strong> Enzymes called <strong>peptidases/proteases</strong> break peptide bonds quickly, so many natural peptides last only minutes in the bloodstream.</li>
  <li><strong>Limited oral absorption.</strong> Digestive enzymes and the gut wall break down or block most peptides, which is why many peptide medicines are given by injection or other non-oral routes. (A few products use special formulations to allow oral delivery.)</li>
  <li><strong>Engineering for stability.</strong> Drug developers modify sequences — swapping amino acids, cyclizing the chain, or attaching a fatty-acid or polymer chain — to resist breakdown and last longer. Semaglutide, for example, carries a fatty-acid side chain that helps it bind albumin in the blood.</li>
  <li><strong>Specificity cuts both ways.</strong> Small changes in sequence, impurities or degradation can change what a peptide binds, how strongly, and whether it triggers an immune response.</li>
</ul>
<h3>Where peptides come from</h3>
<ul>
  <li><strong>Endogenous</strong> peptides are made naturally in the body (hormones, neurotransmitters, antimicrobial peptides).</li>
  <li><strong>Food-derived</strong> peptides are released when dietary proteins (milk, fish, collagen) are digested.</li>
  <li><strong>Synthetic</strong> peptides are manufactured by <strong>solid-phase peptide synthesis (SPPS)</strong> — adding amino acids one at a time to a growing chain anchored to a resin — or by <strong>recombinant DNA technology</strong>, in which engineered cells produce the peptide.</li>
</ul>`,
  takeaways: [
    "Peptides are amino-acid chains; their sequence determines folding, binding and function.",
    "Peptides act mainly by binding receptors (agonists activate, antagonists block), triggering amplified signaling cascades.",
    "Natural peptides are broken down quickly and poorly absorbed orally; drug developers engineer stability.",
    "Because peptides are so specific, small changes in structure or purity can change their effects."
  ],
  check: [
    { q: "A molecule that binds a receptor and activates it is called:", options: ["An antagonist", "An agonist", "A peptidase"], answer: 1,
      explain: "Agonists activate receptors; antagonists block them; peptidases are enzymes that break peptide bonds." },
    { q: "Why are many peptide medicines not taken as ordinary pills?", options: ["Digestive enzymes and the gut wall break down or block most peptides", "Peptides are too sweet", "Pills cannot contain amino acids"], answer: 0,
      explain: "Peptides are digested like dietary protein, so most need non-oral routes or special formulations." },
    { q: "What determines a peptide's shape and what it binds?", options: ["Its color", "Its amino-acid sequence", "The size of its container"], answer: 1,
      explain: "The primary structure (sequence) drives folding and receptor binding." }
  ]
},
{
  id: "approved",
  title: "Research vs. Approved Peptides",
  kicker: "The evidence spectrum",
  minutes: 10,
  html: `
<p>"Peptide" describes a type of molecule, not a level of evidence. Some peptides are thoroughly tested, FDA-approved medicines; others have only laboratory or animal data. Telling them apart is one of the most important skills in this course.</p>
<h3>FDA-approved peptide medicines</h3>
<p>More than 80 peptide drugs have been approved worldwide. Each is approved for <strong>specific indications</strong>, in a specific formulation, with official <strong>labeling</strong> (the prescribing information) that describes uses, warnings and contraindications. Examples, described at a general level:</p>
<div class="table-wrap"><table class="table">
  <thead><tr><th>Peptide / class</th><th>What it is</th><th>General approved use area</th></tr></thead>
  <tbody>
    <tr><td><strong>Insulin</strong> and insulin analogs</td><td>A pancreatic hormone; first used medically in 1922, and in 1982 the first recombinant human medicine</td><td>Diabetes (blood-glucose control)</td></tr>
    <tr><td><strong>GLP-1 receptor agonists</strong> — e.g. exenatide, liraglutide, dulaglutide, semaglutide</td><td>Engineered versions of the gut hormone GLP-1 (exenatide is based on a peptide found in Gila monster saliva)</td><td>Type 2 diabetes; certain products for chronic weight management or cardiovascular risk reduction</td></tr>
    <tr><td><strong>Tirzepatide</strong></td><td>A dual GIP and GLP-1 receptor agonist</td><td>Type 2 diabetes and chronic weight management (product-specific)</td></tr>
    <tr><td><strong>Oxytocin</strong></td><td>A 9-amino-acid hormone</td><td>Obstetric use in hospital settings</td></tr>
    <tr><td><strong>Desmopressin</strong> (vasopressin analog)</td><td>Engineered antidiuretic hormone</td><td>Certain urinary and bleeding disorders</td></tr>
    <tr><td><strong>Octreotide</strong></td><td>A long-acting somatostatin analog</td><td>Certain hormone-secreting conditions and tumors</td></tr>
    <tr><td><strong>Leuprolide</strong></td><td>A GnRH analog</td><td>Certain hormone-sensitive cancers and other hormonal conditions</td></tr>
    <tr><td><strong>Teriparatide</strong></td><td>A fragment of parathyroid hormone</td><td>Osteoporosis in people at high fracture risk</td></tr>
  </tbody>
</table></div>
<p class="small muted">Indications differ by product and change over time. Always refer to the current FDA-approved labeling; this table is for orientation only.</p>
<h3>Approved for one use is not approved for every use</h3>
<p>Approval covers a product, a formulation and particular indications. A prescriber may sometimes use an approved drug <strong>off-label</strong> (for an unapproved indication) based on professional judgment, but that is a different evidence situation from the approved use, and it should be disclosed in consent conversations. A compounded or "research" version of an approved molecule is <strong>not</strong> the approved product.</p>
<h3>Investigational and research peptides</h3>
<p>Many peptides discussed online have never completed the clinical-trial process. Their evidence may come only from cell studies or animals, or from small, uncontrolled human reports. In the U.S., testing an unapproved drug in people requires an <strong>Investigational New Drug (IND)</strong> application and oversight by an <strong>Institutional Review Board (IRB)</strong>.</p>
<h3>The evidence ladder</h3>
<ol class="ladder">
  <li><strong>In vitro</strong> (cells or tissues in the lab) — shows a possible mechanism.</li>
  <li><strong>Animal studies</strong> — useful, but effects often fail to translate to humans.</li>
  <li><strong>Case reports and observational data</strong> — cannot separate cause from coincidence or placebo.</li>
  <li><strong>Phase 1–3 randomized controlled trials</strong> — test safety, then effectiveness, in progressively larger groups.</li>
  <li><strong>Regulatory review and post-marketing surveillance</strong> — independent evaluation and ongoing safety monitoring.</li>
</ol>
<p>When someone claims a peptide "works", ask: <em>which rung of this ladder is the evidence on, in which population, for which outcome, and compared with what?</em></p>
<h3>Other places you will meet peptides</h3>
<ul>
  <li><strong>Foods and dietary supplements</strong> — e.g. collagen peptides, regulated as foods/supplements, not drugs, and not allowed to claim to treat disease.</li>
  <li><strong>Cosmetics</strong> — "signal" and "carrier" peptides in skin-care products, regulated as cosmetics as long as they make no drug claims.</li>
  <li><strong>Natural defense molecules</strong> — antimicrobial peptides are part of innate immunity and an active research area.</li>
</ul>`,
  takeaways: [
    "Approved peptide drugs (e.g. insulin, GLP-1 receptor agonists, oxytocin) are approved for specific products and indications with official labeling.",
    "Off-label, compounded and research versions are different evidence situations from the approved product.",
    "Research peptides may have only cell or animal data; human testing requires an IND and IRB oversight.",
    "Always ask where a claim sits on the evidence ladder."
  ],
  check: [
    { q: "Which of these is an FDA-approved peptide medicine class?", options: ["GLP-1 receptor agonists", "Research-use-only powders", "Omega-3 fatty acids"], answer: 0,
      explain: "GLP-1 receptor agonists such as semaglutide and liraglutide are approved for specific indications." },
    { q: "Strong results in mice mean that a peptide:", options: ["Is proven safe and effective in people", "Has early evidence that may or may not translate to humans", "Is FDA-approved"], answer: 1,
      explain: "Animal data sits low on the evidence ladder; many findings do not translate to humans." },
    { q: "Testing an unapproved drug in people in the U.S. generally requires:", options: ["A social media following", "An IND application and IRB oversight", "Nothing at all"], answer: 1,
      explain: "Clinical investigations of unapproved drugs are conducted under an IND with IRB review." }
  ]
},
{
  id: "quality",
  title: "Quality, Sourcing, Reconstitution & Storage",
  kicker: "Product integrity",
  minutes: 12,
  html: `
<p>For a peptide product, <strong>what is actually in the vial</strong> matters as much as the molecule's name. Identity, purity, potency, sterility and stability all depend on how the product was made, tested, shipped and stored.</p>
<h3>Regulated supply chains</h3>
<p>FDA-approved drugs are manufactured under <strong>current Good Manufacturing Practice (cGMP)</strong>, released against approved specifications, and distributed through licensed wholesalers and pharmacies with product-tracing requirements. Compounded products come from state-licensed pharmacies (503A) or FDA-registered outsourcing facilities (503B). Products sold online as "research chemicals" sit outside these systems, so the buyer has little assurance about what they contain.</p>
<h3>Reading a certificate of analysis (COA)</h3>
<p>A <strong>COA</strong> is a document reporting test results for a specific manufacturing <strong>lot (batch)</strong>. A credible COA usually shows:</p>
<ul>
  <li><strong>Product name, lot number and test date</strong> — and the lot number should match the label on the product in hand.</li>
  <li><strong>Identity</strong> — typically by <strong>mass spectrometry (MS)</strong>, which confirms the molecular weight matches the expected sequence.</li>
  <li><strong>Purity</strong> — typically by <strong>high-performance liquid chromatography (HPLC)</strong>, reported as the percentage of the main peak, ideally with the chromatogram itself.</li>
  <li><strong>Peptide content / assay</strong> — how much of the powder is actually peptide. A sample can be "99% pure" by HPLC yet contain substantial water, salts or counter-ions (such as TFA or acetate) by weight.</li>
  <li>For any product intended for injection: <strong>sterility</strong> and <strong>bacterial endotoxin</strong> results. Endotoxins are fragments of bacteria that can cause fever and serious reactions even when no live bacteria remain.</li>
  <li><strong>Who tested it</strong> — the laboratory's name, accreditation (for example ISO/IEC 17025) and the methods used, with an authorized signature.</li>
</ul>
<h3>Third-party testing</h3>
<p><strong>Independent (third-party) testing</strong> by an accredited lab that has no financial stake in the result adds credibility, especially when the report can be verified directly with the lab. Remember its limits: a COA describes the <em>sample that was tested</em>; it does not prove that every vial, or a different lot, is the same, and it says nothing about storage after testing.</p>
<div class="callout callout-danger" role="note"><strong>COA red flags</strong>
  <p>No lot number, or one that doesn't match the vial · the same COA used for every batch · no lab name or contact · purity stated with no chromatogram or MS data · no sterility/endotoxin data for an injectable · edited-looking documents · "for research use only" labeling alongside dosing advice for people.</p></div>
<h3>Reconstitution — concepts only</h3>
<p>Many peptides are supplied <strong>lyophilized</strong> (freeze-dried) because they are more stable as a dry powder. <strong>Reconstitution</strong> means dissolving that powder in a liquid <strong>diluent</strong> so it can be used. Key concepts:</p>
<ul>
  <li>The correct diluent, technique and resulting concentration are specified by the product's <strong>labeling or the dispensing pharmacist</strong> — not by forums, sellers or this course.</li>
  <li>Reconstitution of products intended for people should be done with <strong>aseptic (sterile) technique</strong> by, or under the direction of, appropriately licensed professionals.</li>
  <li>Once in solution, peptides generally become <strong>less stable</strong>; labeling or a pharmacist assigns a <strong>beyond-use date</strong>.</li>
  <li>Wrong diluents, contamination and calculation errors are recognized causes of harm — one reason this course deliberately gives no step-by-step instructions or amounts.</li>
</ul>
<h3>Storage principles</h3>
<ul>
  <li><strong>Follow the labeling.</strong> Storage conditions differ between products and between dry and reconstituted forms.</li>
  <li><strong>Temperature and cold chain.</strong> Many products require refrigeration; heat exposure in shipping or storage can degrade them, often invisibly.</li>
  <li><strong>Light and moisture.</strong> Keep products in original packaging, protected from light and humidity.</li>
  <li><strong>Avoid repeated freeze–thaw cycles</strong>, which can damage peptides; never freeze a product unless its labeling says to.</li>
  <li><strong>Keep labels intact</strong> and never transfer products into unlabeled containers.</li>
</ul>
<h3>Inspect, and know when not to use</h3>
<p>Do not use a product that is past its expiration or beyond-use date, has a damaged seal, or looks cloudy, discolored or contains particles when it should not. Set it aside, and dispose of or report it according to pharmacy, local or manufacturer guidance. Used needles and other sharps go in an <strong>FDA-cleared sharps disposal container</strong> — never loose in household trash, never shared.</p>`,
  takeaways: [
    "A credible COA is lot-specific and shows identity (MS), purity (HPLC), content and — for injectables — sterility and endotoxin data from a named, accredited lab.",
    "Purity is not the same as potency or safety; a COA covers only the tested sample.",
    "Reconstitution is governed by product labeling and licensed professionals, using aseptic technique.",
    "Follow labeled storage; protect from heat, light and moisture; avoid freeze–thaw; inspect before use."
  ],
  check: [
    { q: "On a COA, which test confirms a peptide's identity by molecular weight?", options: ["Mass spectrometry", "A taste test", "Visual inspection"], answer: 0,
      explain: "Mass spectrometry confirms the molecular weight; HPLC is mainly used for purity." },
    { q: "A COA shows a lot number that does not match the vial. This means:", options: ["It is fine — all lots are identical", "The COA does not describe the product in hand", "The product is extra pure"], answer: 1,
      explain: "A COA is lot-specific. A mismatched lot number gives no assurance about the vial you have." },
    { q: "Who determines the correct diluent and method for reconstituting a product?", options: ["An online forum", "The product labeling or dispensing pharmacist", "Whoever is nearby"], answer: 1,
      explain: "Labeling and licensed professionals govern reconstitution." }
  ]
},
{
  id: "safety",
  title: "Safety, Contraindications & Adverse Events",
  kicker: "Risk awareness",
  minutes: 11,
  html: `
<p>Every biologically active substance carries risk. Safety awareness means understanding the kinds of harm that can occur, who may be at higher risk, and what to do when something goes wrong. Individual risk can only be assessed by a licensed clinician.</p>
<h3>Key vocabulary</h3>
<ul>
  <li><strong>Adverse event (AE)</strong> — any unwanted medical occurrence in someone using a product, whether or not it was caused by the product.</li>
  <li><strong>Side effect / adverse reaction</strong> — an unwanted effect reasonably linked to the product.</li>
  <li><strong>Serious adverse event</strong> — one that results in death, is life-threatening, requires or prolongs hospitalization, causes significant disability, causes a birth defect, or needs intervention to prevent such outcomes.</li>
  <li><strong>Contraindication</strong> — a condition or factor that makes use inadvisable. <em>Absolute</em> contraindications mean "do not use"; <em>relative</em> ones mean "use only if a clinician judges the benefit outweighs the risk".</li>
</ul>
<h3>General categories of adverse effects</h3>
<ul>
  <li><strong>Local reactions</strong> — redness, swelling, itching or pain where a product was applied or injected.</li>
  <li><strong>Systemic effects</strong> — effects that follow from a peptide's action on its receptor. For example, gastrointestinal effects such as nausea are commonly reported with GLP-1 receptor agonists, and low blood sugar (hypoglycemia) is a key risk with insulin.</li>
  <li><strong>Allergic and hypersensitivity reactions</strong> — from mild rash to <strong>anaphylaxis</strong>.</li>
  <li><strong>Immunogenicity</strong> — the body may form antibodies against a peptide, which can reduce its effect or cause reactions.</li>
  <li><strong>Hormonal-axis effects</strong> — because of feedback loops, influencing one hormone can affect others.</li>
  <li><strong>Interactions</strong> — with other medicines, supplements or medical conditions.</li>
</ul>
<h3>Contraindications and higher-risk groups (general)</h3>
<p>Contraindications are product-specific and are listed in each product's labeling. As an illustration, the labeling of several GLP-1-based medicines carries a <strong>boxed warning</strong> about thyroid C-cell tumors seen in rodents and lists a personal or family history of medullary thyroid carcinoma or MEN 2 as a contraindication. More generally, extra caution and professional assessment are especially important for:</p>
<ul>
  <li>Pregnancy, possible pregnancy and breastfeeding</li>
  <li>Children and adolescents, and older adults</li>
  <li>People with kidney, liver, heart or endocrine disease, or a history of cancer</li>
  <li>People with a history of serious allergies</li>
  <li>People taking other prescription medicines</li>
  <li>Competitive athletes (anti-doping rules — see the Regulatory lesson)</li>
</ul>
<h3>Product-quality risks</h3>
<p>Products from unregulated ("gray market") sources add risks beyond the molecule itself: the wrong substance, under- or over-strength content, toxic impurities, microbial contamination, endotoxins, and degradation from poor storage or shipping. These risks are a major reason regulators warn against such products.</p>
<div class="callout callout-danger" role="note"><strong>Seek emergency care immediately</strong> for difficulty breathing, swelling of the face, lips, tongue or throat, widespread hives, chest pain, fainting, confusion, or signs of severe low blood sugar. Call your local emergency number.</div>
<h3>Reporting adverse events</h3>
<p><strong>Pharmacovigilance</strong> is the science of detecting and preventing adverse effects. It relies on reports. In the U.S., anyone — patients, caregivers or professionals — can report adverse events and product-quality problems for FDA-regulated products to the <strong>FDA MedWatch</strong> program. Keep the product, its packaging and lot number; record what happened and when; and tell the treating clinician.</p>`,
  takeaways: [
    "An adverse event is any unwanted occurrence; a serious AE includes death, life-threatening events, hospitalization, disability or birth defects.",
    "Contraindications are product-specific and listed in labeling; absolute means do not use, relative means clinician judgment.",
    "Gray-market products add quality risks: wrong substance, wrong strength, contamination, endotoxins.",
    "Know the emergency warning signs, and report adverse events to FDA MedWatch."
  ],
  check: [
    { q: "An absolute contraindication means:", options: ["The product should not be used in that situation", "The product works better", "A clinician may ignore it"], answer: 0,
      explain: "Absolute = do not use. Relative contraindications require clinician judgment." },
    { q: "Which is a sign of a possible serious allergic reaction?", options: ["Mild hunger", "Swelling of the throat with difficulty breathing", "A faded bruise"], answer: 1,
      explain: "Throat swelling and breathing difficulty can signal anaphylaxis — call emergency services." },
    { q: "Formation of antibodies against a peptide is called:", options: ["Lyophilization", "Immunogenicity", "Reconstitution"], answer: 1,
      explain: "Immunogenicity can reduce a peptide's effect or cause reactions." }
  ]
},
{
  id: "regulations",
  title: "The Regulatory Landscape",
  kicker: "Rules of the road",
  minutes: 12,
  html: `
<p>This lesson is a high-level, U.S.-focused summary. Regulations and agency policies change, and they differ between countries and states. Always check current official sources or consult a qualified regulatory professional.</p>
<h3>The FDA and drug approval</h3>
<p>The <strong>Food and Drug Administration (FDA)</strong> regulates drugs under the <strong>Federal Food, Drug, and Cosmetic Act (FD&amp;C Act)</strong>. Before a new drug can be marketed it must be shown safe and effective for its intended use through clinical trials and FDA review of a <strong>New Drug Application (NDA)</strong> or, for biological products, a <strong>Biologics License Application (BLA)</strong>. Approved products have official labeling, are made under cGMP and are monitored after approval.</p>
<h3>Peptide or protein? The regulatory line</h3>
<p>For regulatory purposes the FDA treats an amino-acid chain of <strong>40 amino acids or fewer as a peptide</strong> (regulated as a drug) and a chain of <strong>more than 40 as a protein</strong> (regulated as a biological product). That is why insulin — 51 amino acids — was transitioned to the biologics pathway in 2020, while most GLP-1 receptor agonists are regulated as drugs.</p>
<h3>Compounding: 503A and 503B</h3>
<p><strong>Compounding</strong> is the combining, mixing or altering of ingredients to create a medication tailored to an individual patient's needs. Two sections of the FD&amp;C Act set the framework:</p>
<div class="table-wrap"><table class="table">
  <thead><tr><th></th><th>Section 503A — compounding pharmacies</th><th>Section 503B — outsourcing facilities</th></tr></thead>
  <tbody>
    <tr><td>Basis</td><td>Patient-specific prescriptions</td><td>May compound without patient-specific prescriptions (e.g. for hospitals and clinics)</td></tr>
    <tr><td>Oversight</td><td>Primarily state boards of pharmacy; USP standards</td><td>Register with FDA, follow cGMP, FDA inspections</td></tr>
    <tr><td>Bulk ingredients</td><td>Generally must have a USP monograph, be a component of an approved drug, or appear on FDA's 503A bulks list</td><td>Generally must be on FDA's 503B bulks list or address a drug shortage</td></tr>
  </tbody>
</table></div>
<p>Compounded drugs are <strong>not FDA-approved</strong>: FDA does not review them for safety, effectiveness or quality before they are sold. Compounders are also generally restricted from making copies of commercially available approved drugs; wider allowances exist while a drug is on FDA's <strong>drug shortage list</strong>. For example, when FDA declared shortages of tirzepatide and semaglutide resolved (in 2024–2025), those temporary allowances narrowed. FDA has also identified certain peptides as bulk substances raising significant safety concerns, which limits their use in compounding.</p>
<h3>"Research use only" (RUO) labeling</h3>
<p>Products labeled <strong>"for research use only — not for human consumption"</strong> are not approved, not intended and not tested for use in people. The label does not make it legal to market such products for human use: selling them with dosing advice, health claims or "for personal use" messaging can make them unapproved drugs under the FD&amp;C Act, and FDA has issued warning letters to sellers on that basis.</p>
<h3>Supplements, foods, cosmetics and advertising</h3>
<ul>
  <li><strong>Dietary supplements</strong> (regulated under DSHEA) are not approved before sale and may not claim to diagnose, treat, cure or prevent disease.</li>
  <li><strong>Cosmetics</strong> are intended to cleanse or beautify; a claim to change the body's structure or function can make a product a drug.</li>
  <li>The <strong>Federal Trade Commission (FTC)</strong> polices deceptive health advertising, including online and influencer marketing.</li>
</ul>
<h3>Scope of practice</h3>
<p>Who may prescribe, compound, dispense or administer a drug is set by <strong>state law, professional licensure and scope of practice</strong>. No course certificate — including this one — expands anyone's legal scope.</p>
<h3>Sport and outside the U.S.</h3>
<p>The <strong>World Anti-Doping Agency (WADA) Prohibited List</strong> bans many peptide hormones, growth factors and related substances at all times for athletes under anti-doping rules. Other countries have their own regulators — for example the EMA (EU), MHRA (UK), Health Canada and the TGA (Australia) — and rules can differ significantly.</p>`,
  takeaways: [
    "FDA approval (NDA/BLA) requires evidence of safety and effectiveness; approved products have official labeling and cGMP manufacturing.",
    "FDA's regulatory line: ≤ 40 amino acids = peptide (drug); > 40 = protein (biologic).",
    "Compounding falls under 503A (patient-specific, state-overseen) or 503B (FDA-registered outsourcing facilities); compounded drugs are not FDA-approved.",
    "\"Research use only\" products are not for human use, and marketing them for people can violate the law."
  ],
  check: [
    { q: "Compounded medications are:", options: ["FDA-approved before sale", "Not FDA-approved, though compounders are regulated", "Unregulated in every respect"], answer: 1,
      explain: "Compounders are regulated (state boards, FDA for 503B), but compounded drugs are not FDA-approved." },
    { q: "Which section covers FDA-registered outsourcing facilities that follow cGMP?", options: ["503A", "503B", "DSHEA"], answer: 1,
      explain: "Section 503B covers outsourcing facilities; 503A covers traditional compounding pharmacies." },
    { q: "Under FDA's definition, a chain of more than 40 amino acids is regulated as:", options: ["A protein (biological product)", "A dietary supplement", "A cosmetic"], answer: 0,
      explain: "Chains over 40 amino acids are proteins and regulated as biological products." }
  ]
},
{
  id: "ethics",
  title: "Ethics & Informed Consent",
  kicker: "Professional practice",
  minutes: 10,
  html: `
<p>Peptides sit in an area where hype, commercial pressure and genuine science overlap. Ethical practice protects the people you serve, your organization and your own professional standing.</p>
<h3>Four core principles</h3>
<ul>
  <li><strong>Respect for autonomy</strong> — people have the right to make informed, voluntary decisions about their own care.</li>
  <li><strong>Beneficence</strong> — act in the person's best interest.</li>
  <li><strong>Non-maleficence</strong> — "first, do no harm"; avoid exposing people to unjustified risk.</li>
  <li><strong>Justice</strong> — treat people fairly and honestly, without exploitation.</li>
</ul>
<h3>Honesty, conflicts of interest and boundaries</h3>
<ul>
  <li>Describe evidence accurately — including where it is weak or absent — and never present an unapproved product as approved.</li>
  <li>Disclose financial interests, such as commissions or ownership in products you discuss.</li>
  <li>Avoid testimonials or "before and after" claims that overstate results.</li>
  <li>Stay within your scope; refer medical questions to a licensed clinician.</li>
  <li>Protect privacy and confidentiality of health information (HIPAA applies to covered entities and their business associates in the U.S.).</li>
</ul>
<h3>Informed consent</h3>
<p><strong>Informed consent</strong> is an ongoing communication process — not just a signature on a form — through which a person, with the help of a qualified professional, understands a proposed intervention and voluntarily decides whether to accept it.</p>
<h3>Core elements</h3>
<ol>
  <li><strong>Nature and purpose</strong> of the proposed intervention.</li>
  <li><strong>Risks</strong>, including common and serious adverse effects and uncertainties.</li>
  <li><strong>Expected benefits</strong>, described realistically — never guaranteed.</li>
  <li><strong>Reasonable alternatives</strong>, including doing nothing.</li>
  <li><strong>Regulatory status</strong> — approved, off-label, compounded or investigational — and the strength of the evidence.</li>
  <li><strong>Opportunity to ask questions</strong> and receive understandable answers.</li>
  <li><strong>Voluntary agreement</strong>, free of pressure, with the right to decline or withdraw at any time.</li>
</ol>
<h3>Capacity and voluntariness</h3>
<p>Valid consent requires <strong>decision-making capacity</strong> — the ability to understand the information, appreciate how it applies to oneself, reason about options and communicate a choice — and <strong>voluntariness</strong>. High-pressure sales tactics, "limited-time" offers or bundling consent with payment undermine voluntariness. Plain language, interpreters and teach-back ("can you tell me in your own words…") support understanding.</p>
<h3>Documentation</h3>
<p>Good practice records what was discussed, the materials provided, questions asked and the person's decision, with date and signatures as required by your setting and jurisdiction. Consent should be revisited when circumstances, products or risks change.</p>
<h3>Course summary</h3>
<p>You have learned how peptides work, the difference between approved and research peptides, how to judge product quality, general storage and safety principles, the regulatory landscape and the ethics of informed consent. Review the <a href="#/glossary">glossary</a>, then take the assessment.</p>`,
  takeaways: [
    "Autonomy, beneficence, non-maleficence and justice guide ethical practice.",
    "Disclose conflicts of interest, describe evidence honestly and stay within scope.",
    "Informed consent is an ongoing, documented process covering risks, benefits, alternatives and regulatory status.",
    "Valid consent requires capacity and voluntariness — no pressure, and the right to withdraw."
  ],
  check: [
    { q: "Which is NOT an element of informed consent?", options: ["Discussion of alternatives", "A guarantee of results", "Disclosure of regulatory status"], answer: 1,
      explain: "Benefits must be described realistically — results can never be guaranteed." },
    { q: "\"First, do no harm\" describes which principle?", options: ["Justice", "Autonomy", "Non-maleficence"], answer: 2,
      explain: "Non-maleficence means avoiding unjustified harm." },
    { q: "A seller pressures someone to sign up today to get a discount. This mainly undermines:", options: ["Voluntariness", "Lyophilization", "Purity"], answer: 0,
      explain: "Pressure tactics undermine the voluntariness that valid consent requires." }
  ]
}
];

window.PC1_GLOSSARY = [
  ["Adverse event (AE)", "Any unwanted medical occurrence in a person using a product, whether or not caused by it."],
  ["Agonist", "A molecule that binds a receptor and activates it."],
  ["Amino acid", "The building block of peptides and proteins; 20 standard amino acids are used by living things."],
  ["Anaphylaxis", "A severe, potentially life-threatening allergic reaction requiring emergency care."],
  ["Antagonist", "A molecule that binds a receptor and blocks it without activating it."],
  ["Aseptic technique", "Practices that prevent microbial contamination when preparing or handling sterile products."],
  ["Beyond-use date (BUD)", "The date after which a compounded or reconstituted preparation should not be used."],
  ["BLA / NDA", "Biologics License Application / New Drug Application — FDA marketing applications for biologics and drugs."],
  ["Certificate of analysis (COA)", "A lot-specific document reporting test results such as identity, purity, content, sterility and endotoxin."],
  ["cGMP", "Current Good Manufacturing Practice — FDA quality-system requirements for drug manufacturing."],
  ["Compounding", "Combining, mixing or altering ingredients to create a medication tailored to an individual patient."],
  ["Contraindication", "A condition that makes use of a product inadvisable (absolute or relative)."],
  ["Diluent", "The liquid used to dissolve (reconstitute) a dry product, as specified by its labeling."],
  ["Endotoxin", "Toxic fragments of bacterial cell walls that can cause fever and serious reactions."],
  ["GLP-1 receptor agonist", "A class of approved peptide medicines that activate the receptor for the gut hormone GLP-1."],
  ["GPCR", "G-protein-coupled receptor — a large family of cell-surface receptors used by many peptide hormones."],
  ["Half-life", "The time for the amount of a substance in the body to fall by half."],
  ["HPLC", "High-performance liquid chromatography — a lab method commonly used to measure peptide purity."],
  ["Immunogenicity", "The tendency of a substance to provoke an immune (antibody) response."],
  ["IND", "Investigational New Drug application — required to test an unapproved drug in people in the U.S."],
  ["Informed consent", "An ongoing, documented process by which a person understands and voluntarily agrees to an intervention."],
  ["IRB", "Institutional Review Board — a committee that protects the rights and welfare of research participants."],
  ["Labeling", "The FDA-approved prescribing information and packaging text describing uses, warnings and storage."],
  ["Ligand", "A molecule that binds to a receptor."],
  ["Lot (batch)", "A quantity of product made in one production run and identified by a lot number."],
  ["Lyophilized", "Freeze-dried; many peptides are supplied this way for stability."],
  ["Mass spectrometry (MS)", "A lab method that measures molecular weight, used to confirm a peptide's identity."],
  ["MedWatch", "FDA's program for reporting adverse events and product problems."],
  ["Off-label use", "Use of an approved drug for an indication, population or manner not in its approved labeling."],
  ["Outsourcing facility (503B)", "An FDA-registered compounder that follows cGMP and is inspected by FDA."],
  ["Peptide bond", "The amide bond linking one amino acid's carboxyl group to the next one's amino group."],
  ["Peptidase / protease", "An enzyme that breaks peptide bonds."],
  ["Pharmacovigilance", "The science and activities of detecting, assessing and preventing adverse effects."],
  ["Purity", "The proportion of the intended molecule relative to related impurities (often by HPLC); not the same as potency."],
  ["Receptor", "A protein that a specific molecule binds to in order to trigger a cellular response."],
  ["Reconstitution", "Dissolving a lyophilized product in a diluent according to its labeling."],
  ["Research use only (RUO)", "Labeling indicating a product is not approved or intended for use in people."],
  ["Scope of practice", "The activities a licensed professional is legally permitted to perform."],
  ["Signal transduction", "The chain of events inside a cell that follows receptor activation."],
  ["SPPS", "Solid-phase peptide synthesis — building a peptide one amino acid at a time on a resin support."],
  ["Third-party testing", "Testing by an independent laboratory with no financial stake in the result."],
  ["WADA", "World Anti-Doping Agency, which publishes the Prohibited List for sport."]
];
