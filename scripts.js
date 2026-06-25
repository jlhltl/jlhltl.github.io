function tick() {
  const diff = new Date('2026-10-17T14:00:00') - new Date();
  if (diff <= 0) return;
  document.getElementById('days').textContent = Math.floor(diff / 86400000);
  document.getElementById('hours').textContent = Math.floor((diff % 86400000) / 3600000);
  document.getElementById('mins').textContent = Math.floor((diff % 3600000) / 60000);
  document.getElementById('secs').textContent = Math.floor((diff % 60000) / 1000);
}
tick();
setInterval(tick, 1000);

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.section').forEach(s => obs.observe(s));

const attYes = document.getElementById('att-yes');
const attNo  = document.getElementById('att-no');
const guestsField = document.getElementById('guestsField');
const dietField   = document.getElementById('dietField');

function toggleGuestFields() {
  const attending = attYes.checked;
  guestsField.classList.toggle('visible', attending);
  dietField.style.display = attending ? '' : 'none';
}

attYes.addEventListener('change', toggleGuestFields);
attNo.addEventListener('change', toggleGuestFields);

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxA1UgG0jSRQFp7C6fH0cnldEA8yPwnp3opBTAm4dMcmNR9QllJxwqHxyyf6SPD3yqu/exec';

document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name      = document.getElementById('rsvp-name').value.trim();
  const attending = document.querySelector('input[name="attending"]:checked');

  if (!name) { document.getElementById('rsvp-name').focus(); return; }
  if (!attending) return;

  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Lähetetään…';
  submitBtn.disabled = true;

  const params = new URLSearchParams({
    name,
    attending: attending.value,
    guests:  document.getElementById('rsvp-guests').value,
    diet:    document.getElementById('rsvp-diet').value.trim(),
    message: document.getElementById('rsvp-message').value.trim()
  });

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
  } catch (_) {}

  const isYes = attending.value === 'yes';
  const successText = isYes
    ? `Kiitos ilmoittautumisestasi!<br>Nähdään 17.10.2026.`
    : `Kiitos vastauksestasi!<br>Toivottavasti nähdään pian!`;

  document.getElementById('rsvpSuccessText').innerHTML = successText;
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('rsvpSuccess').style.display = 'block';
});