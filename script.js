// IDs of sources (replace with real links if you want)
document.getElementById('src1').href = 'https://desw.gov.in/en/pensions';
document.getElementById('src2').href = 'https://www.groww.in/calculators/gratuity-calculator';
document.getElementById('src3').href = 'https://en.wikipedia.org/wiki/7th_Central_Pay_Commission_and_Defence_Forces';

function applyMSPbyRank(){
  const sel = document.getElementById('rankSelect');
  const msp = sel.options[sel.selectedIndex].dataset.msp;
  document.getElementById('msp').value = msp;
}

function money(x){ return '₹' + Number(x).toLocaleString('en-IN', {maximumFractionDigits:0}); }

function calculateAll(){
  const basic = parseFloat(document.getElementById('basicPay').value) || 0;
  const msp = parseFloat(document.getElementById('msp').value) || 0;
  const yrs = parseFloat(document.getElementById('serviceYears').value) || 0;
  const daPct = parseFloat(document.getElementById('daPercent').value) || 0;
  const commPct = parseFloat(document.getElementById('commutationPct').value) || 0;
  const commFactor = parseFloat(document.getElementById('commutationFactor').value) || 12.0;

  const resultsDiv = document.getElementById('results');

  if(yrs <= 0){
    resultsDiv.innerHTML = '<p class="muted">⚠️ Enter valid qualifying service (years).</p>';
    return;
  }

  // Basic Pension (50% of emoluments: Basic + MSP)
  const emoluments = basic + msp;
  const pension = emoluments * 0.5;

  // DA amount
  const daAmount = pension * (daPct/100);

  // Total monthly pension before/after commutation
  const commutedPortion = pension * (commPct/100);
  const postCommutationPension = pension - commutedPortion;

  // Commutation lump sum
  const commutationLump = commutedPortion * commFactor;

  // Gratuity: using common central govt formula (15/26 * last basic * years)
  const gratuityRaw = (15/26) * basic * yrs;
  const gratuityCap = 2000000; // show cap, user can change later if needed
  const gratuityCapped = Math.min(gratuityRaw, gratuityCap);

  // Family pension (ordinary) = 30% of emoluments (min rules may apply)
  const familyPension = emoluments * 0.30;

  // Build results HTML
  resultsDiv.innerHTML = `
    <div class="result-grid">
      <div class="result-card">
        <h3>Basic Pension</h3>
        <p>${money(pension)}/month</p>
        <small> (50% of Basic + MSP)</small>
      </div>

      <div class="result-card">
        <h3>DA (${daPct}%)</h3>
        <p>${money(daAmount)}/month</p>
        <small>Applied on basic pension</small>
      </div>

      <div class="result-card">
        <h3>Total (before commutation)</h3>
        <p>${money(pension + daAmount)}/month</p>
      </div>

      <div class="result-card">
        <h3>Commutation</h3>
        <p>Lump sum: ${money(commutationLump)}</p>
        <p>Post-commutation pension: ${money(postCommutationPension)}/month</p>
        <small>Commuted ${commPct}% × pension, factor ${commFactor}</small>
      </div>

      <div class="result-card">
        <h3>Gratuity</h3>
        <p>Calculated: ${money(Math.round(gratuityRaw))}</p>
        <p>Capped (₹20,00,000): ${money(Math.round(gratuityCapped))}</p>
        <small>Formula used: (15/26) × Last Basic × Years</small>
      </div>

      <div class="result-card">
        <h3>Family Pension</h3>
        <p>${money(Math.round(familyPension))}/month</p>
        <small>Ordinary rate: 30% of emoluments</small>
      </div>
    </div>

    <div style="margin-top:12px; font-size:13px; color:#42523d">
      <strong>Notes:</strong>
      <ul>
        <li>Minimum qualifying service for pension: Commissioned Officers 20 years; PBOR 15 years (verify with official rules).</li>
        <li>Gratuity cap shown as ₹20,00,000. Official ceilings can change — verify with authorities.</li>
        <li>Commutation factors vary by age at retirement and official tables; this tool uses a generic factor input for estimates.</li>
        <li>This is an informational calculator only — for authoritative determination contact pension authorities.</li>
      </ul>
    </div>
  `;
}

// set initial MSP from rank
applyMSPbyRank();

function resetForm(){
  document.getElementById('basicPay').value = 55000;
  document.getElementById('serviceYears').value = 28;
  document.getElementById('daPercent').value = 46;
  document.getElementById('commutationPct').value = 40;
  document.getElementById('commutationFactor').value = 12.0;
  applyMSPbyRank();
  document.getElementById('results').innerHTML = '<p class="muted">Enter inputs and click <em>Calculate</em> to see results.</p>';
}
