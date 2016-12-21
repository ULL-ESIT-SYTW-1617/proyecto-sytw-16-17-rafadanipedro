/* global $ */
//jquery para modificar un email al pulsar enter
$('.usuario').on('keydown', e => {
  if (e.which == 13) {
    cambiaCorreo(e.target, e.target.id, e.target.value)
    e.preventDefault();
  }
});

//jquery para añadir email al pulsar enter
$('#nuevousuario').on('keydown', e => {
  if (e.which == 13) {
    console.log('holaaaa')
    addUsuario(e.target,e.target.value)
  }
})

//jquery para eliminar email
$('.fa-trash').click(e =>{
    console.log('holaaaa')
    eliminaUsuario(e.target, e.target.id, e.target.value)
})

function cambiaCorreo(elemento, id, email) {
  $.post(`/api/users/${id}`, {
    email
  })
  .done(e => {
    console.log(e)
    alert('Email modificado correctamente!')
  })
  .fail(err => {
    alert('No se ha podido modificar ese email')
    console.error(err)
  })
}


function addUsuario(elemento,email){
  console.log(email)
  $.post('/api/users', {
    email
  })
  .done(e => {
    console.log(e)
    alert('Email añadido correctamente!')
  })
  .fail(err => {
    alert('No se ha podido añadir ese email')
    console.error(err)
  })
}




function eliminaUsuario(id){
  $.ajax({
    url: `/api/users/${id}`,
    type: 'DELETE'})
  .done(e => {
    console.log(e)
    alert('Usuario eliminado correctamente!')
  })
  .fail(err => {
    alert('No se ha podido eliminar ese email')
    console.error(err)
  })
}

