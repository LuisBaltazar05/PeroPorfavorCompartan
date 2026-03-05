// Guarda el indice del elemento que se esta arrastrando
var dragSourceIndex = null;

function renderParticipants() {
  var listContainer = document.getElementById('participantsList');
  var participants = JSON.parse(localStorage.getItem('ppc_participants') || '[]');

  // Limpiamos la lista actual antes de redibujar
  listContainer.innerHTML = '';

  // Creamos un elemento visual por cada participante
  participants.forEach(function(participant, index) {
    var item = document.createElement('div');
    item.className = 'participant-item';
    item.draggable = true;            // Habilitamos el arrastre HTML5
    item.dataset.index = index;       // Guardamos el índice como atributo

    // Construimos el contenido interno del elemento
    var badge = participant.isOrganizer
      ? '<span class="organizer-badge">org.</span>'
      : '';

    var removeBtn = !participant.isOrganizer
      ? '<button class="btn-remove" onclick="removeParticipant(' + index + ')" title="Eliminar participante">✕</button>'
      : '';

    item.innerHTML =
      '<span class="drag-handle" title="Arrastra para reordenar">⠿</span>' +
      '<span class="participant-name">' + escapeHtml(participant.name) + '</span>' +
      badge +
      removeBtn;

    //Drag and Drop

    // dragstart, el usuario empieza a arrastrar
    item.addEventListener('dragstart', function(e) {
      dragSourceIndex = index;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    // dragend, el usuario suelta 
    item.addEventListener('dragend', function() {
      item.classList.remove('dragging');
      // Quitamos el estilo drag-over de todos los elementos
      document.querySelectorAll('.participant-item').forEach(function(el) {
        el.classList.remove('drag-over');
      });
    });

    // dragover se usa mientras otro elemento pasa por encima
    // se llama preventDefault() para permitir el drop
    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      // Quitamos el resaltado de otros elementos
      document.querySelectorAll('.participant-item').forEach(function(el) {
        el.classList.remove('drag-over');
      });
      item.classList.add('drag-over');
    });

    // drop el usuario suelta encima de este elemento
    item.addEventListener('drop', function(e) {
      e.preventDefault();

      // Si soltamos en el mismo lugar no pasa nada
      if (dragSourceIndex === null || dragSourceIndex === index) return;

      // Leemos la lista fresca de localStorage
      var parts = JSON.parse(localStorage.getItem('ppc_participants') || '[]');

      // Sacamos el elemento arrastrado de su posicion original
      var moved = parts.splice(dragSourceIndex, 1)[0];

      // Lo insertamos en la nueva posición
      parts.splice(index, 0, moved);

      // Guardamos el nuevo orden en localStorage
      localStorage.setItem('ppc_participants', JSON.stringify(parts));

      // Redibujamos la lista con el nuevo orden
      renderParticipants();
    });

    listContainer.appendChild(item);
  });

  // Actualizamos el contador de participantes
  document.getElementById('participantCount').textContent = participants.length;
}


function addParticipant() {
  var input = document.getElementById('newParticipantInput');
  var name = input.value.trim();

  // Validación: nombre no vacio
  if (!name) {
    showToast('Escribe un nombre para agregar');
    input.focus();
    return;
  }

  var participants = JSON.parse(localStorage.getItem('ppc_participants') || '[]');

  // Validación: no permitir duplicados 
  var isDuplicate = participants.some(function(p) {
    return p.name.toLowerCase() === name.toLowerCase();
  });

  if (isDuplicate) {
    showToast(' ' + name + ' ya está en la lista');
    input.value = '';
    input.focus();
    return;
  }

  // Creamos el nuevo participante
  // El id usa Date.now() para que sea único aunque se agreguen rápido
  var newParticipant = {
    id: 'p_' + Date.now(),
    name: name,
    isOrganizer: false
  };

  participants.push(newParticipant);
  localStorage.setItem('ppc_participants', JSON.stringify(participants));

  // Limpiamos el input y devolvemos el foco para agregar otro rápido
  input.value = '';
  input.focus();

  // Redibujamos
  renderParticipants();
}


/**
 @param {number} index Posición del participante en el arreglo*/

function removeParticipant(index) {
  var participants = JSON.parse(localStorage.getItem('ppc_participants') || '[]');

  // Sacamos el participante eliminado para mostrar su nombre en el toast
  var removed = participants.splice(index, 1);
  localStorage.setItem('ppc_participants', JSON.stringify(participants));

  if (removed.length > 0) {
    showToast( + removed[0].name + ' eliminado', 2000);
  }

  renderParticipants();
}



function saveParticipants() {
  var participants = JSON.parse(localStorage.getItem('ppc_participants') || '[]');

  if (participants.length < 2) {
    showToast(' Necesitas al menos 2 participantes para el sorteo');
    return;
  }

  // Todo bien, navegamos al paso de exclusiones
  goToStep('step-exclusions');
}


