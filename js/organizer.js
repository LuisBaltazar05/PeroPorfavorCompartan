
function saveOrganizer() {
  var nameInput = document.getElementById('organizerName');
  var name = nameInput.value.trim();
  var included = document.getElementById('includeOrganizer').checked;

  // Validación: el nombre no puede estar vacío
  if (!name) {
    showToast('Escribe tu nombre para continuar');
    nameInput.focus();
    return;
  }

  // Guardamos el organizador en localStorage
  var organizerData = {
    name: name,
    included: included
  };
  localStorage.setItem('ppc_organizer', JSON.stringify(organizerData));

  // Manejamos la lista de participantes
  // Obtenemos la lista actual (puede estar vacía si es la primera vez)
  var participants = JSON.parse(localStorage.getItem('ppc_participants') || '[]');

  // Eliminamos al organizador si ya estaba en la lista (para no duplicarlo)
  participants = participants.filter(function(p) {
    return p.id !== 'organizer';
  });

  // Si el organizador se incluye, lo agregamos al inicio de la lista
  if (included) {
    participants.unshift({
      id: 'organizer',
      name: name,
      isOrganizer: true
    });
  }

  // Guardamos la lista actualizada
  localStorage.setItem('ppc_participants', JSON.stringify(participants));

  // Navegamos al siguiente paso y renderizamos la lista
  goToStep('step-participants');
  renderParticipants();
}


function restoreOrganizer() {
  var saved = localStorage.getItem('ppc_organizer');
  if (!saved) return; // No hay nada guardado, formulario vacío está bien

  var organizer = JSON.parse(saved);
  document.getElementById('organizerName').value = organizer.name;
  document.getElementById('includeOrganizer').checked = organizer.included;
}


// Restauramos los datos del organizador cuando la página termina de cargar
window.addEventListener('load', function() {
  restoreOrganizer();
});
