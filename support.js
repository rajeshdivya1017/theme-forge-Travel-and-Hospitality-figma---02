(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const toastRegion = $('#toastRegion');

  function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `stackly-toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '✦'}</span><div><b>${title}</b><p>${message}</p></div><button type="button" aria-label="Dismiss notification">×</button>`;
    toastRegion.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    toast.querySelector('button').addEventListener('click', () => dismiss());
    const timer = setTimeout(dismiss, 4200);
    function dismiss() {
      clearTimeout(timer);
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }

  const help = $('#helpSearch');
  help.addEventListener('submit', event => {
    event.preventDefault();
    const query = $('#helpQuery').value.trim();
    showToast(query ? 'Help topics found' : 'Search needed', query ? `Showing sample guidance related to “${query}”.` : 'Enter a topic or booking ID to search.', query ? 'success' : 'info');
  });

  document.querySelectorAll('[data-topic]').forEach(button => {
    button.addEventListener('click', () => {
      $('#helpQuery').value = button.dataset.topic;
      showToast('Topic selected', `${button.dataset.topic} is ready to search.`);
    });
  });

  const actionMessages = {
    chat: ['Live Concierge Chat', 'Live chat demo selected. Connect a chat provider to enable real-time agents.'],
    callback: ['Callback request', 'Your callback preference is selected. A phone service can be connected for real requests.'],
    ticket: ['New support ticket', 'Complete the message form below to prepare your support request.']
  };

  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const [title, message] = actionMessages[button.dataset.action];
      showToast(title, message, 'success');
      if (button.dataset.action === 'ticket') $('#ticketForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.option-check').forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
      const card = checkbox.closest('.support-option');
      const button = $('.support-button', card);
      card.classList.toggle('selected', checkbox.checked);
      button.classList.toggle('selected-action', checkbox.checked);
      showToast(checkbox.checked ? 'Support option selected' : 'Selection cleared', checkbox.checked ? `${button.textContent.trim()} is now highlighted.` : 'The support option returned to its default state.');
    });
  });

  const file = $('#attachments');
  file.addEventListener('change', () => {
    $('#fileNames').textContent = [...file.files].map(item => item.name).join(', ');
    if (file.files.length) showToast('Files attached', `${file.files.length} file(s) selected.`, 'success');
  });

  $('#ticketForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    showToast('Message prepared', 'Your form passed validation. This frontend demo does not send or store support tickets.', 'success');
    $('#ticketFeedback').textContent = 'Form validated. Backend connection is required to submit a real ticket.';
  });

  $('#ticketForm').addEventListener('reset', () => {
    $('#fileNames').textContent = '';
    $('#ticketFeedback').textContent = '';
    showToast('Form cleared', 'All form fields have been reset.');
  });
})();
