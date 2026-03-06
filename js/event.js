let selectedEvent=null

document.querySelectorAll(".event-btn").forEach(function(btn){

  btn.addEventListener("click",function(){

    document.querySelectorAll(".event-btn").forEach(b=>b.classList.remove("btn-accent"))

    btn.classList.add("btn-accent")

    selectedEvent=btn.innerText

    saveEvent()

  })

})

function showCustomEvent(){

  document.getElementById("customEventName").style.display="block"

}

function generateDates(){

  const container=document.getElementById("dateOptions")

  const today=new Date()

  for(let i=1;i<=3;i++){

    const d=new Date()

    d.setDate(today.getDate()+i)

    const date=d.toISOString().split("T")[0]

    const btn=document.createElement("button")

    btn.className="btn btn-outline-light me-2 mb-2"

    btn.innerText=date

    btn.onclick=function(){

    document.querySelectorAll("#dateOptions button").forEach(function(b){
        b.classList.remove("btn-accent")
        b.classList.add("btn-outline-light")
    })

    btn.classList.remove("btn-outline-light")
    btn.classList.add("btn-accent")

    document.getElementById("customDate").value=date

    saveEvent()

    }

    container.appendChild(btn)

  }

}

function saveEvent(){

  const customName=document.getElementById("customEventName").value

  const date=document.getElementById("customDate").value

  const eventData={
    type:selectedEvent,
    customName:customName,
    date:date
  }

  localStorage.setItem("ppc_event",JSON.stringify(eventData))

}

generateDates()

document.getElementById("customEventName").addEventListener("input", saveEvent);
document.getElementById("customDate").addEventListener("input", saveEvent);