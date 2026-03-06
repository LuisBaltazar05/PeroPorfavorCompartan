let selectedEvent = null

// ── Botones de tipo de evento ──────────────────────────────────────────────
document.querySelectorAll(".event-btn").forEach(function(btn){
  btn.addEventListener("click", function(){

    // Resetear todos
    document.querySelectorAll(".event-btn").forEach(function(b){
      b.classList.remove("btn-accent")
      b.classList.add("btn-outline-light")
    })

    // Marcar el seleccionado
    btn.classList.remove("btn-outline-light")
    btn.classList.add("btn-accent")

    selectedEvent = btn.innerText.trim()

    // Limpiar el nombre personalizado para que no pise al tipo seleccionado
    document.getElementById("customEventName").value = ""
    document.getElementById("customEventName").style.display = "none"

    saveEvent()
  })
})

// ── Mostrar campo de evento personalizado ──────────────────────────────────
function showCustomEvent(){
  // Deseleccionar botones de evento predefinido
  document.querySelectorAll(".event-btn").forEach(function(b){
    b.classList.remove("btn-accent")
    b.classList.add("btn-outline-light")
  })
  selectedEvent = null
  document.getElementById("customEventName").style.display = "block"
  document.getElementById("customEventName").focus()
}

// ── Mostrar input de fecha manual ──────────────────────────────────────────
function showCustomDate(){
  // Deseleccionar botones de fecha
  document.querySelectorAll("#dateOptions button").forEach(function(b){
    b.classList.remove("btn-accent")
    b.classList.add("btn-outline-light")
  })
  document.getElementById("customDate").value = ""
  document.getElementById("customDate").style.display = "block"
  document.getElementById("customDate").focus()
}

// ── Generar botones de fechas ──────────────────────────────────────────────
function generateDates(){
  const container = document.getElementById("dateOptions")
  const today = new Date()

  for(let i = 1; i <= 3; i++){
    const d = new Date()
    d.setDate(today.getDate() + i)
    const date = d.toISOString().split("T")[0]

    const btn = document.createElement("button")
    btn.className = "btn btn-outline-light"
    btn.innerText = date

    btn.onclick = function(){
      // Resetear todos los botones de fecha
      document.querySelectorAll("#dateOptions button").forEach(function(b){
        b.classList.remove("btn-accent")
        b.classList.add("btn-outline-light")
      })

      // Marcar este
      btn.classList.remove("btn-outline-light")
      btn.classList.add("btn-accent")

      // Setear valor y ocultar el input manual
      document.getElementById("customDate").value = date
      document.getElementById("customDate").style.display = "none"

      saveEvent()
    }

    container.appendChild(btn)
  }
}

// ── Guardar en localStorage ────────────────────────────────────────────────
function saveEvent(){
  const customName = document.getElementById("customEventName").value.trim()
  const date = document.getElementById("customDate").value

  localStorage.setItem("ppc_event", JSON.stringify({
    type: selectedEvent,
    customName: customName,
    date: date
  }))
}

// ── Restaurar estado al cargar ─────────────────────────────────────────────
function restoreEvent(){
  const saved = JSON.parse(localStorage.getItem("ppc_event") || "null")
  if (!saved) return

  // Restaurar tipo de evento
  if (saved.type) {
    document.querySelectorAll(".event-btn").forEach(function(b){
      if (b.innerText.trim() === saved.type) {
        b.classList.remove("btn-outline-light")
        b.classList.add("btn-accent")
        selectedEvent = saved.type
      }
    })
  }

  // Restaurar nombre personalizado
  if (saved.customName && saved.customName !== "") {
    document.getElementById("customEventName").value = saved.customName
    document.getElementById("customEventName").style.display = "block"
  }

  // Restaurar fecha
  if (saved.date) {
    document.getElementById("customDate").value = saved.date

    let matched = false
    document.querySelectorAll("#dateOptions button").forEach(function(b){
      if (b.innerText.trim() === saved.date) {
        b.classList.remove("btn-outline-light")
        b.classList.add("btn-accent")
        matched = true
      }
    })

    if (!matched) {
      document.getElementById("customDate").style.display = "block"
    }
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
generateDates()
restoreEvent()

document.getElementById("customEventName").addEventListener("input", saveEvent)
document.getElementById("customDate").addEventListener("input", saveEvent)