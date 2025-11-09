const loginBtn = document.getElementById('loginBtn');
const pinInput = document.getElementById('pinInput');
const dashboard = document.getElementById('dashboard');
const userNameEl = document.getElementById('userName');
const balanceEl = document.getElementById('balance');
const transactionsEl = document.getElementById('transactions');

loginBtn.addEventListener('click', async () => {
  const pin = pinInput.value.trim();

  if (pin.length !== 6) {
    alert('Please enter a 6-digit PIN.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    const data = await response.json();

    if (data.success) {
      // Hide login section and show dashboard
      document.getElementById('login-section').style.display = 'none';
      dashboard.style.display = 'block';

      userNameEl.textContent = data.name;
      balanceEl.textContent = `$${data.balance}`;

      transactionsEl.innerHTML = '';
      data.transactions.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.desc}: $${t.amount}`;
        transactionsEl.appendChild(li);
      });
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Could not connect to backend.');
  }
});
