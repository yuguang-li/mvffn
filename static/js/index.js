(() => {
  const copyButton = document.querySelector('[data-copy-target]');
  const toast = document.querySelector('.toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  function copyWithFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.inset = '0 auto auto -9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Copy command failed');
  }

  document.querySelector('[data-status]')?.addEventListener('click', (event) => {
    showToast(event.currentTarget.dataset.status);
  });

  copyButton?.addEventListener('click', async () => {
    const source = document.getElementById(copyButton.dataset.copyTarget);
    if (!source) return;

    const citation = source.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(citation);
      } else {
        copyWithFallback(citation);
      }
      copyButton.querySelector('span').textContent = 'Copied';
      showToast('BibTeX copied to clipboard');
      window.setTimeout(() => {
        copyButton.querySelector('span').textContent = 'Copy BibTeX';
      }, 1800);
    } catch {
      showToast('Copy failed — select the citation manually');
    }
  });
})();
