const form = document.querySelector('form')
const nome = document.querySelector('#nome')
const email = document.querySelector('#email')
const numero = document.querySelector('#numero')

let exibicaoContatos = document.querySelector('.box3')

let indiceEditar = null

let buttonCadastrar = document.querySelector('.buttonCadastrar')

let inputBuscar = document.querySelector('#buscar')

let mensagem = document.querySelector('#mensagem')

const base_url = "https://6a994eef53c0481726b91e08.mockapi.io"

form.addEventListener('submit', adicionarContato)

exibicaoContatos.addEventListener('click', excluir)
exibicaoContatos.addEventListener('click', editar)

inputBuscar.addEventListener('input', buscar)

async function buscar(e) {
    exibicaoContatos.innerHTML = ''
    const resposta = await fetch(base_url+'/users')
    const contatos = await resposta.json()
    contatos.forEach((contato) => {
        if(contato.nome.toLowerCase().includes(inputBuscar.value.toLowerCase())){
            const p1 = document.createElement('p')
            criarLinha(contato, p1)
            p1.className = 'contato'
            exibicaoContatos.appendChild(p1)
        }
    });
}

async function excluir(e) {
    if(e.target.textContent == 'Excluir'){
        try{
            const resposta = await fetch(`${base_url}/users/${e.target.value}`, {
                method: "DELETE",
            })
            if(!resposta.ok){
                throw new Error("Algum erro aconteceu!")
            }
            read()
        }catch(error){
            console.log(error)
        }
    }
}

async function editar(e) {
    if(e.target.textContent == 'Editar'){
        try{
            const resposta = await fetch(`${base_url}/users/${e.target.value}`)
            if(!resposta.ok){
                throw new Error("Algum erro aconteceu!")
            }
            const contato = await resposta.json()

            nome.value = contato.nome
            email.value = contato.email
            numero.value = contato.numero

            indiceEditar = e.target.value

            buttonCadastrar.textContent = "Editar"
        }catch(error){
            console.log(error)
        }
    }
}

async function adicionarContato(e) {
    e.preventDefault()
    if(nome.value.trim() == '' || email.value == '' || numero.value.trim() == ''){
        mensagem.textContent = 'Preencha todos os campos!'
        mensagem.className = 'erro'
        setTimeout(() => {
            mensagem.textContent = ''
            mensagem.className = ''
        }, 3000)
        return
    }
    if(nome.value.length < 3){
        mensagem.textContent = 'O nome deve conter no mínimo 3 caracteres!'
        mensagem.className = 'erro'
        setTimeout(() => {
            mensagem.textContent = ''
            mensagem.className = ''
        }, 3000)
        return
    }

    if(isNaN(numero.value.trim())){
        mensagem.textContent = 'O número deve conter apenas números!'
        mensagem.className = 'erro'
        setTimeout(() => {
            mensagem.textContent = ''
            mensagem.className = ''
        }, 3000)
        return
    }

    let duplicado = false

    const resposta = await fetch(`${base_url}/users`)
    const contatos = await resposta.json()

    contatos.forEach(contato => {
        if(contato.id != indiceEditar){

            if(contato.email == email.value){
                mensagem.className = 'erro'
                mensagem.textContent = 'Email já existente!'
                duplicado = true
            }

            if(contato.numero == numero.value){
                mensagem.className = 'erro'
                mensagem.textContent = 'Número já existente!'
                duplicado = true
            }
        }
    })

    if(duplicado){
        setTimeout(() => {
            mensagem.textContent = ''
            mensagem.className = ''
        }, 3000)

        return
    }

    if(indiceEditar !== null){
        try{
            const resposta = await fetch(`${base_url}/users/${indiceEditar}`, {
                method: "PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    nome: nome.value,
                    numero: numero.value,
                    email: email.value
                })
            })
            if(!resposta.ok){
                throw new Error("Algum erro aconteceu!")
            }
            buttonCadastrar.textContent = 'Cadastrar'
            indiceEditar = null
        }catch(error){
            console.log(error)
        }
    }else{
        try{
            const resposta = await fetch(`${base_url}/users`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    nome: nome.value,
                    email: email.value,
                    numero: numero.value
                })
            })

            if(!resposta.ok){
                throw new Error("Algum erro aconteceu!")
            }
        }catch(error){
            console.log(error)
        }
    }
    
    setTimeout(() => {
        mensagem.textContent = ''
        mensagem.className = ''
    }, 3000)

    mensagem.textContent = 'Cadastro realizado!'
    mensagem.className = 'certo'

    read()
    zerar()
}

async function read() {
    try{
        const resposta = await fetch(base_url+"/users")

        const contatos = await resposta.json()

        if(!resposta.ok){
            throw new Error('Algum erro aconteceu!')
        }
        
        if(inputBuscar.value != ''){
            inputBuscar.value = ''
        }

        exibicaoContatos.innerHTML = ''
        contatos.forEach((contato) => {
            const p1 = document.createElement('p')
            criarLinha(contato, p1)
            p1.className = 'contato'
            exibicaoContatos.appendChild(p1)
        })
    }catch(error){
        console.log(error)
    }
}

read()

function zerar() {
    nome.value = ''
    email.value = ''
    numero.value = ''
}

function listar() {
    if(inputBuscar.value != ''){
        inputBuscar.value = ''
    }
    exibicaoContatos.innerHTML = ''
    listaContatos.forEach((contato, id) => {
        const p1 = document.createElement('p')
        criarLinha(contato, id, p1)
        p1.className = 'contato'
        exibicaoContatos.appendChild(p1)
    });
}

function criarLinha(contato, p1) {
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    criarDiv1(contato, div1)
    criarDiv2(contato, div2)
    p1.appendChild(div1)
    p1.appendChild(div2)
}

function criarDiv1(contato, div1) {
    const h2 = document.createElement('h2')
    criarH2(h2, contato)
    const p2 = document.createElement('p')
    criarP2(p2, contato)
    div1.appendChild(h2)
    div1.appendChild(p2)
    div1.className = 'informacoes'
}

function criarH2(h2, contato){
    h2.textContent = contato.nome
    h2.className = 'nome'
}

function criarP2(p2, contato){
    p2.textContent = `${contato.email} / ${contato.numero}`
    p2.className = 'emailNumero'
}

function criarDiv2(contato, div2) {
    const buttonExcluir = document.createElement('button')
    criarButtonExcluir(buttonExcluir, contato)
    const buttonEditar = document.createElement('button')
    criarButtonEditar(buttonEditar, contato)
    div2.appendChild(buttonExcluir)
    div2.appendChild(buttonEditar)
    div2.className = 'butoes'
}

function criarButtonExcluir(buttonExcluir, contato) {
    buttonExcluir.textContent = 'Excluir'
    buttonExcluir.className = 'buttonExcluir'
    buttonExcluir.value = contato.id
}

function criarButtonEditar(buttonEditar, contato) {
    buttonEditar.textContent = 'Editar'
    buttonEditar.className = 'buttonEditar'
    buttonEditar.value = contato.id
}