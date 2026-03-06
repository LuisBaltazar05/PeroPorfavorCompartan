function getOrganizerData() {
  return JSON.parse(localStorage.getItem('ppc_organizer') || 'null');
}

function getEventData() {
  return JSON.parse(localStorage.getItem('ppc_event') || 'null');
}

function getBudgetData() {
  return JSON.parse(localStorage.getItem('ppc_budget') || 'null');
}

function getParticipantsData() {
  return JSON.parse(localStorage.getItem('ppc_participants') || '[]');
}

function getExclusionsData() {
  return JSON.parse(localStorage.getItem('ppc_exclusions') || '{}');
}

function formatParticipants(participants) {
  if (!participants.length) {
    return 'Sin participantes';
  }

  return participants.map(function(p) {
    return p.name;
  }).join(', ');
}

function formatExclusions(exclusions) {
  var people = Object.keys(exclusions);

  if (!people.length) {
    return 'Sin exclusiones';
  }

  return people.map(function(person) {
    return person + ': ' + exclusions[person].join(', ');
  }).join(' | ');
}

function getEventDisplayName(eventData) {
  if (!eventData) return 'No definido';

  if (eventData.customName && eventData.customName.trim() !== '') {
    return eventData.customName.trim();
  }

  if (eventData.type && eventData.type.trim() !== '') {
    return eventData.type.trim();
  }

  return 'No definido';
}

function getEventDisplayDate(eventData) {
  if (!eventData || !eventData.date) {
    return 'No definida';
  }

  return eventData.date;
}

function getBudgetDisplay(budgetData) {
  if (!budgetData || !budgetData.amount) {
    return 'No definido';
  }

  return '$' + budgetData.amount;
}

function showEventData() {
  var organizer = getOrganizerData();
  var eventData = getEventData();
  var budget = getBudgetData();
  var participants = getParticipantsData();
  var exclusions = getExclusionsData();

  var box = document.getElementById('eventDataBox');
  var content = document.getElementById('eventDataContent');

  content.innerHTML = `
    <div class="data-item">
      <span class="data-label">Organizador</span>
      <div class="data-value">${organizer ? escapeHtml(organizer.name) : 'No definido'}</div>
    </div>

    <div class="data-item">
      <span class="data-label">Celebración</span>
      <div class="data-value">${escapeHtml(getEventDisplayName(eventData))}</div>
    </div>

    <div class="data-item">
      <span class="data-label">Fecha del evento</span>
      <div class="data-value">${escapeHtml(getEventDisplayDate(eventData))}</div>
    </div>

    <div class="data-item">
      <span class="data-label">Presupuesto</span>
      <div class="data-value">${escapeHtml(getBudgetDisplay(budget))}</div>
    </div>

    <div class="data-item">
      <span class="data-label">Participantes</span>
      <div class="data-value">${escapeHtml(formatParticipants(participants))}</div>
    </div>

    <div class="data-item">
      <span class="data-label">Exclusiones</span>
      <div class="data-value">${escapeHtml(formatExclusions(exclusions))}</div>
    </div>
  `;

  box.style.display = 'block';
}

function shuffleArray(array) {
  var copy = array.slice();

  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
}

function isValidAssignment(giver, receiver, exclusions) {
  if (giver.name === receiver.name) {
    return false;
  }

  var blocked = exclusions[giver.name] || [];
  if (blocked.includes(receiver.name)) {
    return false;
  }

  return true;
}

function generateSecretSantaResults() {
  var participants = getParticipantsData();
  var exclusions = getExclusionsData();

  if (participants.length < 2) {
    return null;
  }

  for (var shuffleAttempt = 0; shuffleAttempt < 100; shuffleAttempt++) {
    var receivers = shuffleArray(participants);
    var valid = true;

    for (var i = 0; i < participants.length; i++) {
      if (!isValidAssignment(participants[i], receivers[i], exclusions)) {
        valid = false;
        break;
      }
    }

    if (valid) {
      return participants.map(function(giver, index) {
        return {
          giver: giver.name,
          receiver: receivers[index].name
        };
      });
    }
  }

  return null;
}

function renderResults(results) {
  var box = document.getElementById('resultsBox');
  var content = document.getElementById('resultsContent');

  if (!results || !results.length) {
    content.innerHTML = '<p class="empty-text">No fue posible generar un sorteo válido con las exclusiones actuales.</p>';
    box.style.display = 'block';
    return;
  }

  var html = '<div class="result-list">';

  results.forEach(function(item) {
    html += `
      <div class="result-item">
        ${escapeHtml(item.giver)} le da a ${escapeHtml(item.receiver)}
      </div>
    `;
  });

  html += '</div>';

  content.innerHTML = html;
  box.style.display = 'block';
}

function startRaffleAnimation() {
  var participants = getParticipantsData();

  if (participants.length < 2) {
    showToast('Necesitas al menos 2 participantes para sortear');
    return;
  }

  var animationBox = document.getElementById('raffleAnimationBox');
  var status = document.getElementById('raffleStatus');
  var resultsBox = document.getElementById('resultsBox');

  animationBox.style.display = 'block';
  resultsBox.style.display = 'none';

  var messages = [
    'Mezclando participantes...',
    'Revisando exclusiones...',
    'Buscando combinaciones válidas...',
    'Asignando regalos...'
  ];

  var index = 0;
  status.textContent = messages[index];

  var interval = setInterval(function() {
    index = (index + 1) % messages.length;
    status.textContent = messages[index];
  }, 500);

  setTimeout(function() {
    clearInterval(interval);

    var results = generateSecretSantaResults();

    if (!results) {
      status.textContent = 'No se pudo completar el sorteo';
      renderResults(null);
      showToast('Revisa las exclusiones: no existe una combinación válida', 3500);
      return;
    }

    localStorage.setItem('ppc_results', JSON.stringify(results));
    status.textContent = '¡Sorteo completado!';
    renderResults(results);
  }, 2200);
}