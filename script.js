const name_input = document.getElementById('name_input')

name_input.addEventListener('blur', function() {
    if (/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/.test(name_input.value)) {
        let name = name_input.value
        name_input.classList.remove('invalid_field')
        console.log(name)
    } else {
        console.log('Erro')
        name_input.classList.add('invalid_field')
        name_input.value = ""
    }
})