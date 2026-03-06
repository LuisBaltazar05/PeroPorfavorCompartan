let selectedBudget = null

// ── Botones de presupuesto predefinido ─────────────────────────────────────
document.querySelectorAll(".budget-btn").forEach(function(btn){
  btn.addEventListener("click", function(){

    // Resetear todos
    document.querySelectorAll(".budget-btn").forEach(function(b){
      b.classList.remove("btn-accent")
      b.classList.add("btn-outline-light")
    })

    // Marcar el seleccionado
    btn.classList.remove("btn-outline-light")
    btn.classList.add("btn-accent")

    selectedBudget = parseInt(btn.innerText.replace("$", "").trim())

    // Limpiar y ocultar el input personalizado
    document.getElementById("customBudget").value = ""
    document.getElementById("customBudget").style.display = "none"

    saveBudget()
  })
})

// ── Mostrar input personalizado ────────────────────────────────────────────
function showCustomBudget(){
  // Deseleccionar botones predefinidos
  document.querySelectorAll(".budget-btn").forEach(function(b){
    b.classList.remove("btn-accent")
    b.classList.add("btn-outline-light")
  })
  selectedBudget = null
  document.getElementById("customBudget").style.display = "block"
  document.getElementById("customBudget").focus()
}

// ── Input personalizado ────────────────────────────────────────────────────
document.getElementById("customBudget").addEventListener("input", function(){
  selectedBudget = parseInt(this.value)
  if (isNaN(selectedBudget)) selectedBudget = null
  saveBudget()
})

// ── Guardar en localStorage ────────────────────────────────────────────────
function saveBudget(){
  localStorage.setItem("ppc_budget", JSON.stringify({ amount: selectedBudget }))
}

// ── Restaurar estado al cargar ─────────────────────────────────────────────
function restoreBudget(){
  const saved = JSON.parse(localStorage.getItem("ppc_budget") || "null")
  if (!saved || !saved.amount) return

  selectedBudget = saved.amount
  let matched = false

  document.querySelectorAll(".budget-btn").forEach(function(b){
    if (parseInt(b.innerText.replace("$", "").trim()) === saved.amount) {
      b.classList.remove("btn-outline-light")
      b.classList.add("btn-accent")
      matched = true
    }
  })

  if (!matched) {
    document.getElementById("customBudget").value = saved.amount
    document.getElementById("customBudget").style.display = "block"
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
restoreBudget()