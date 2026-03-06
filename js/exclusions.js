function disableExclusions(){
  localStorage.removeItem("ppc_exclusions")
  document.getElementById("exclusionsContainer").innerHTML=""
}

function enableExclusions(){
  const participants = JSON.parse(localStorage.getItem("ppc_participants")) || []
  const container = document.getElementById("exclusionsContainer")

  let html=""

  participants.forEach(function(p){

    html+=`<div class="gift-card mb-2">
      <strong>${p.name}</strong>
      <div>`

    participants.forEach(function(other){

      if(p.name!==other.name){
        html+=`
        <div class="form-check">
            <input class="form-check-input exclusion-check" type="checkbox" data-person="${p.name}" value="${other.name}">
            <label class="form-check-label">${other.name}</label>
        </div>`
      }

    })

    html+=`</div></div>`
  })

  container.innerHTML=html

  document.querySelectorAll(".exclusion-check").forEach(function(check){

    check.addEventListener("change",saveExclusions)

  })
}

function saveExclusions(){

  const exclusions={}

  document.querySelectorAll(".exclusion-check:checked").forEach(function(check){

    const person=check.dataset.person
    const excluded=check.value

    if(!exclusions[person]) exclusions[person]=[]

    exclusions[person].push(excluded)

  })

  localStorage.setItem("ppc_exclusions",JSON.stringify(exclusions))
}