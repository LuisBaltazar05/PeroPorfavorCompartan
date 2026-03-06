/**
 * goToStep(stepId)
 * ----------------
 * Oculta todos los pasos y muestra únicamente el que recibe como parámetro.
 *
 * @param {string} stepId - El id del paso en el que vamos
**/
function goToStep(stepId) {
  // Quitamos la clase 'active' de todos los pasos
  document.querySelectorAll('.step').forEach(function(section) {
    section.classList.remove('active');
  });

  // Activamos solo el paso deseado
  const target = document.getElementById(stepId);
  if (target) {
    target.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/**
 * showToast(mensaje, duracion)
 * ----------------------------
 * Muestra una notificacion de validaciones y avisos en la parte inferior de la pantalla.
 * @param {string} msg 
 * @param {number} duration 
**/
function showToast(msg, duration) {
  if (duration === undefined) { duration = 2500; }

  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(function() {
    toast.classList.remove('show');
  }, duration);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}