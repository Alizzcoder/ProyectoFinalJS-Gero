//*************************** AGENDA DE TURNOS **************************
// El trabajo final consta de una agenda de turnos en la cual es posible loguearse, ver los turnos disponibles, agendar los mismo 
// y tambien eliminarlos desde la opción turnos agendados.
//Para realizar la llamada fetch se utilizo un archivo .json como "base de datos" de los horarios disponibles. 

///*****IMPORTANTE **** Para ver los turnos agendados, una vez desplegado el modal, hacer click sobre el mismo (se explica el detalle más adelante)

//Objeto usuario
class Usuario {
	constructor (nombre, email, password)
     {
	this.nombre = nombre;
	this.email = email;  
	this.password = password;
    // Para un futuro poder asociar los turnos elegidos con el usuario.
	    //this.horarioElegido = horarioElegido;	
	    //this.id = id;
	}
     //asignarId (objeto){
	    //this.id = objeto.length;
	}


// Array de  los usarios ya creados
const usuarios = [
    new Usuario ("Flor", "flor@gmail.com", "florencia" ),
    new Usuario ("Julian", "julian@gmail.com", "julieta" ),
    new Usuario ("Leo", "leo@gmail.com", "leonel", )
    ]

class Turnos{
        constructor(id, dia, turno){
            this.id = id,
            this.dia = dia,
            this.turno = turno
                
        }    
    }


// DOM
const inputMailLogin = document.getElementById('emailLogin'),
    inputPassLogin = document.getElementById('passwordLogin'),
    inputMailRegistro = document.getElementById('emailRegistro'),
    inputPassRegistro = document.getElementById('passwordRegistro'),
    inputNombreRegistro =document.getElementById ('nombreRegistro'),
    checkRecordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    btnRegistro = document.getElementById ('btnRegistro'),
    contDispo = document.getElementById('tarjetas'),
    modalLogin = document.getElementById('modalLogin'),
    modalRegistro = document.getElementById ('modalRegistro'),
    modal = new bootstrap.Modal(modalLogin),
    botonDispo = document.getElementById('disponibilidad'),
    modalBody = document.getElementById('modal-body'),
    btnTurnosAgendados= document.getElementById ('botonTurnosAgendados')
    resTurnos = document.getElementById ('resumenTurnos'),
    btnConfirmar= document.getElementById ('botonConfirmar'),
    disposToggleables = document.querySelectorAll('.toggeable');
    

// Traigo con fetch horarios.json al array horarios   
let horarios = []
fetch("horarios.json")
    .then(response => response.json())
    .then(data =>{
         for(let dispo of data){
        let horarioNuevo = new Turnos(dispo.id, dispo.dia, dispo.turno)
        horarios.push(horarioNuevo)
        }
    }
    )    

// Los turnos seleccionados/ agendados 
let turnosAgendados = JSON.parse(localStorage.getItem("agenda"))

// Función validacion de usuarios existentes (todas las funciones que dependen del logueo son similares a los ejemplos mostrados en las clases, solo hay algunas pequeñas variaciones en las funciones para registrarse)
function validarUsuario(usuariosBD, user, pass) {
        let encontrado = usuariosBD.find((usuariosBD) => usuariosBD.email == user);
          if (typeof encontrado === 'undefined') {
            return false;
        } else {
             if (encontrado.password!= pass) {
                return false;
            } else {
                return encontrado;
            }
        }
 }

 // Para guardar el registro.
 function registrar(nombre, correo, contrasena, arrayBaseDatos) {
         const usuario = new Usuario(nombre, correo, contrasena);
         arrayBaseDatos.push(usuario);
            return usuario
          }
 
 // Funcion para verificar si el usuario ya existe, me retorna true para continuar con la registracion y si existe false (valida solo el mail)
function validarRegistracion (correo, arrayBaseDatos) {
    let validar = arrayBaseDatos.find ((arrayBaseDatos)=> arrayBaseDatos.email == correo)
             if (typeof validar === 'undefined'){ 
                return true 
                }else{
                    return false
                    }  
        }   


 //Guardo el logueo en el storage.
function guardarDatos(usuarioBD, storage) {
    const usuario = {
        'name': usuarioBD.nombre,
        'user': usuarioBD.email,
        'pass': usuarioBD.password
    }

    storage.setItem('usuario', JSON.stringify(usuario));
}

//Funcion para limpiar el storage
function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}

//Recupero los datos que se guardaron en el storage y los retorno
function recuperarUsuario(storage) {
    return JSON.parse(storage.getItem('usuario'));
}


//Cambio el DOM para mostrar el nombre del usuario logueado, usando los datos del storage
function saludar(usuario) {
    nombreUsuario.innerHTML = `Bienvenid@ ${usuario.name}`
}

//Funcion para intercambiar la vista de los dispos del DOM, agregando o sacando la clase d-none.
function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

//Funcion que revisa si hay un usuario guardado en el storage, y en ese caso evita todo el proceso de login 
function estaLogueado(usuario) {
    if (usuario) {
        saludar(usuario);
        presentarInfo(disposToggleables, 'd-none');
    }
}


btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    if (!inputMailLogin.value || !inputPassLogin.value) {
        Swal.fire('Todos los campos son requeridos');
    } else {
        let data = validarUsuario(usuarios, inputMailLogin.value, inputPassLogin.value);
        if (!data) {
            Swal.fire (`Usuario y/o contraseña erróneos`);
        } else {
             if (checkRecordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));
            }
            modal.hide();
            //Muestro la info para usuarios logueados
            presentarInfo(disposToggleables, 'd-none');
        }
    }
});


// Registración
btnRegistro.addEventListener('click', (e) => {
 e.preventDefault()
     if (!inputNombreRegistro.value || !inputMailRegistro.value || !inputPassRegistro.value ) {
        Swal.fire('Todos los campos son requeridos');
        }else{
            let info = validarRegistracion (inputMailRegistro.value, usuarios)
            if (info){
                 registrar(inputNombreRegistro.value, inputMailRegistro.value, inputPassRegistro.value, usuarios);
                Swal.fire ({
                        icon: "success",
                        title: "Usuario registrado con exito Vuelva al login para ingresar",
                        timer: 4000,
                        showConfirmaButton: false,
                        confirmButtonText : "Aceptar"
                         })
                 
           } else {
                     Swal.fire ({
                    title: "El usuario ya existe",
                    text: `Ingrese otro mail para registrarse o vuelva al login`,
                    icon: 'error',
                    timer: 3000,
                    showConfirmaButton: false,
                    confirmButtonText : "Aceptar"
                    })
           }
        }
        
    }) 
    
   

//Funcion para mostrar los horarios de agenda
function mostrarHorarios(array) {
    contDispo.innerHTML = '';
    array.forEach((dispo) => {
        let tarjeta = document.createElement ("div")
        tarjeta.innerHTML=`<div class="card cardHorario" id="dispo${dispo.dia}">
                        <h3 class="card-header" id="nombreDia">Día: ${dispo.dia}</h3>
                        <div class="card-body">
                        <p class="card-text" id="horarioTurno1">Horario: ${dispo.turno}.</p>
                        <button id="btnAgendar${dispo.id}" class="btn btn-outline-success me-2" type="button">Agendar</button>
                        </div>`;
            contDispo.appendChild (tarjeta)            
            // Me traigo el btnAgendar
            let agendarBtn = document.getElementById (`btnAgendar${dispo.id}`)
            // Llamo a la funcion para sumar a la agenda
            agendarBtn.addEventListener ("click", ()=>{agendarHorario (dispo)});
})
}

// Funcion para agendar un turno, se verifica antes si ya se agendo ese horario para que no se duplique
function agendarHorario (dispo){
    let turnoAgendado = turnosAgendados.find ((elem)=> (elem.id == dispo.id))
             if (turnoAgendado == undefined) {
                        turnosAgendados.push (dispo);
                        localStorage.setItem ("agenda", JSON.stringify (turnosAgendados))
                        Swal.fire ({
                                   title: "Turno agendado",
                                   text: `Se ha reservado el turno del día ${dispo.dia} en el horario de las ${dispo.turno}`,
                                   icon: "success",
                                   timer: 3000,
                                   showConfirmaButton: false,
                                   confirmButtonText : "Aceptar"
                        })
                }else{
                        Swal.fire ({
                        title: "Turno duplicado",
                        text: `El turno del día ${dispo.dia} en el horario de las ${dispo.turno} ya se encuentra agendado`,
                        icon: "error",
                        timer: 3000,
                        confirmButtonText : "Aceptar"
                        })
                    }
     }

// Funcion para ver los turnos agendados. Aclaración: por algún motivo que no pude resolver una vez desplegado el modal de la agenda hay que hacer un click sobre el mismo para que se muestren los turnos agendados. 
function visualizarTurnosAgendados (turnosDelStorage){
    modalBody.innerHTML = " ";
    turnosDelStorage.forEach ((turnoTomado)=> {
        modalBody.innerHTML += `<div class="card border-primary mb-3" id ="turnoTomado${turnoTomado.id}" style="max-width: 300px;">
         <div class="card-body">
        <h4 class="card-title">${turnoTomado.dia}</h4>
        <p class="card-text">${turnoTomado.turno}</p> 
        <button class= "btn btn-danger" id="botonEliminar${turnoTomado.id}" style='font-size:16px'> Eliminar <i class="fas fa-trash-alt"></i></button>
        </div>    
        </div>` ;
          })

 // Como el boton eliminar está dentro del modal, también sume la función para eliminar los turnos dentro de la funcion VisualizarTurnosAgendados 
    turnosDelStorage.forEach ((turnoTomado, indice)=> { 
         document.getElementById (`botonEliminar${turnoTomado.id}`).addEventListener ('click', ()=>{
            Swal.fire ({
                title: "Turno eliminado",
                text: `Se ha eliminado el turno del día ${turnoTomado.dia} en el horario de las ${turnoTomado.turno}`,
                icon: "info",
                timer: 3000,
                showConfirmaButton: false,
                confirmButtonText : "Aceptar"
                })
              // Elimino el turno de la agenda (del modal Dom) 
                let cardAgenda = document.getElementById (`turnoTomado${turnoTomado.id}`);
                cardAgenda.remove ()
                // Elimino el turno del array turnosAgendados en el storage
                turnosAgendados.splice (indice, 1);
                localStorage.setItem ("agenda", JSON.stringify (turnosAgendados));

                // Vuelvo a cargar la agenda
                visualizarTurnosAgendados (turnosAgendados);
                }
             )
            })   
     }




botonDispo.addEventListener('click', () => {
     mostrarHorarios(horarios);
    });

btnSalir.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(disposToggleables, 'd-none');
});

btnTurnosAgendados.addEventListener('click', () => {
    visualizarTurnosAgendados(turnosAgendados)
})

window.onload =()=> {
estaLogueado(recuperarUsuario(localStorage));
}



    
 
    




   