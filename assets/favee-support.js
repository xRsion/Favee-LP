(() => {
  const form = document.getElementById('favee-support-form');
  if (!form) return;
  const status = document.getElementById('favee-support-status');
  const button = form.querySelector('button[type=submit]');
  const endpoint = 'https://xrsion.co.jp/api/favee-contact';
  let token = null, sending = false, sent = false;
  async function prepare() {
    token = null; button.disabled = true; button.textContent = '送信の準備中です';
    try {
      const response = await fetch(endpoint, {method:'GET',credentials:'omit',cache:'no-store'});
      const data = await response.json();
      if (!response.ok || typeof data.token !== 'string') throw new Error();
      token = data.token; button.textContent = '送信する'; button.disabled = false; status.textContent = '';
    } catch (_) {
      button.textContent = '再接続する'; button.disabled = false;
      status.textContent = '現在、送信の準備ができません。時間をおいて「再接続する」を押してください。';
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (sending || sent) return;
    if (!token) { await prepare(); return; }
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const body = {token,name:values.get('name'),email:values.get('email'),category:values.get('category'),message:values.get('message'),website:values.get('website') || '',consent:values.get('consent') === 'on'};
    sending = true; button.disabled = true; button.textContent = '送信中です'; status.textContent = '';
    try {
      const encoded = JSON.stringify(body);
      const bytes = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(encoded));
      const hash = [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');
      const response = await fetch(endpoint,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json','X-Amz-Content-Sha256':hash},body:encoded});
      const data = await response.json();
      if (response.ok && data.sent === true) {
        sent = true; form.reset(); button.textContent = '送信しました';
        status.textContent = 'お問い合わせを受け付けました。ご入力のメールアドレスへ担当者からご連絡します。';
      } else if (response.status === 429) {
        button.textContent = '時間をおいてお試しください';
        status.textContent = '送信回数が上限に達しました。時間をおいてお試しください。';
      } else if (response.status === 409 || response.status === 503) {
        button.textContent = '受付状況をご確認ください';
        status.textContent = '受付状況を確認できませんでした。重複を避けるため、この画面からは再送しません。しばらくたっても連絡がない場合は、時間をおいて改めてお問い合わせください。';
      } else {
        token = null; button.disabled = false; button.textContent = '再接続する';
        status.textContent = '入力内容と通信状況をご確認ください。内容は保持されています。「再接続する」を押してから再度お試しください。';
      }
    } catch (_) {
      button.textContent = '受付状況をご確認ください';
      status.textContent = '通信が途切れ、受付状況を確認できませんでした。重複を避けるため、この画面からは再送しません。';
    } finally { sending = false; }
  });
  prepare();
})();
