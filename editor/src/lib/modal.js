export function showErrorModal(errorMsg) {
  const modal = document.getElementById('errorModal');
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = errorMsg;
  modal.style.display = 'flex';
}

export function closeErrorModal() {
  const modal = document.getElementById('errorModal');
  modal.style.display = 'none';
}