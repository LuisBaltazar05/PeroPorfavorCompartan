let selectedBudget=null

document.querySelectorAll(".budget-btn").forEach(function(btn){

  btn.addEventListener("click",function(){

    document.querySelectorAll(".budget-btn").forEach(b=>b.classList.remove("btn-accent"))

    btn.classList.add("btn-accent")

    selectedBudget=parseInt(btn.innerText.replace("$",""))

    saveBudget()

  })

})

function showCustomBudget(){

  document.getElementById("customBudget").style.display="block"

}

document.getElementById("customBudget").addEventListener("input", function() {
  selectedBudget = parseInt(this.value);

  if (isNaN(selectedBudget)) {
    selectedBudget = null;
  }

  saveBudget();
});

function saveBudget() {
  localStorage.setItem("ppc_budget", JSON.stringify({
    amount: selectedBudget
  }));
}