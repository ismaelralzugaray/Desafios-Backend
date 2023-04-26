
const socket = io()
let user
const chatInput = document.getElementById("chatInput")



Swal.fire({
    icon: "info",
    title: "Ingrese su correo electronico",
    input: "text",
    inputValidator: (value) =>{
        if(!value){
            return "Debe ingresar su correo electronico"
        }else{
            socket.emit("usuarioConectado", {user:value} )
        }    
    },
    allowOutsideClick: false
}).then( result => {
    user = result.value
})


chatInput.addEventListener("keyup", evt => {
    if(evt.key === "Enter"){
        if (chatInput.value.trim().length > 0){
            socket.emit("mensaje", {user: user, message: chatInput.value})
            chatInput.value = ""
        }else{
            alert("No puede enviar un mensaje en blanco")
        }
    }
})

socket.on("historialDeMensajes", data => {
    const chatLog = document.getElementById("chatBox")
    let logs = ""
    data.forEach(log => {
        logs += `<strong>${log.user}:</strong> <em>${log.message} </em><br/>`
    });
    chatLog.innerHTML=logs
})


socket.on("usuarioConectado", data => {
    Toastify({
        text: `${data} ha entrado al chat`,
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
})

