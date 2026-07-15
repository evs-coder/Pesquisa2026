const botao = document.getElementById("botaoProximo");
const botaoFinalizar = document.getElementById("botaoFinalizar");

let valorEquipe;
let valorMunicipio;
let valorNome;
let valorSobrenome;
let valorTelefone;
let valorConheceA;
let valorConheceR;
let valorApoiarA;
let valorApoiarR;
let valorApoioConhecidoA;
let valorApoioConhecidoR;

let mensagemErro = "Campo obrigatório!";
let formularioValidado;

function validarCampo(idCampo, idErro){
    const valor = document.getElementById(idCampo).value;
    if(valor === ""){
        document.getElementById(idErro).textContent = mensagemErro;
        formularioValidado = false;
        return "";
    } else {
        document.getElementById(idErro).textContent = "";
        return valor;
    }
}

function validarRadio(atributoName, idErro){
    const valor = document.querySelector(`input[name=${atributoName}]:checked`);
    if(valor === null){
        document.getElementById(idErro).textContent = mensagemErro;
        formularioValidado = false;
        return "";
    } else {
        document.getElementById(idErro).textContent = "";
        return valor.value;
    }
}

function resetarRadios(atributoName){
    const todosOsRadios = document.querySelectorAll(`input[name=${atributoName}]`);

    for(let i = 0; i < todosOsRadios.length; i++){
        todosOsRadios[i].checked = false;
    }
}

async function enviarPesquisa(dados){
    try{
        const resposta = await fetch("https://script.google.com/macros/s/AKfycbyT0jag8PBnQENRYKo-dRj4FNXsTTX9eWSSDh9ogJxJ1kXYer3sq5NvgJhaqi0bgoN1/exec", {
            method: "POST",
            body: JSON.stringify(dados),
        });

        if(!resposta.ok){
            throw new Error("Servidor respondeu com erro");
        }

        return true;
    } catch (erro) {
        adicionarNaFila(dados);
        return false;
    }
}

function adicionarNaFila(dados){
    const fila = JSON.parse(localStorage.getItem("filaPendente")) || [];
    fila.push(dados);
    localStorage.setItem("filaPendente", JSON.stringify(fila));
}

async function tentarReenviarFila(){
    const fila = JSON.parse(localStorage.getItem("filaPendente")) || [];

    if (fila.length === 0){
        return;
    }

    const filaRestante = [];

    for (let i = 0; i < fila.length; i++){
        try{
            const resposta = await fetch("https://script.google.com/macros/s/AKfycbyT0jag8PBnQENRYKo-dRj4FNXsTTX9eWSSDh9ogJxJ1kXYer3sq5NvgJhaqi0bgoN1/exec", {
                method: "POST",
                body: JSON.stringify(fila[i])
            });

            if(!resposta.ok){
            throw new Error("Servidor respondeu com erro");
            }
        } catch (erro) {
            filaRestante.push(fila[i]);
        }
    }

    localStorage.setItem("filaPendente", JSON.stringify(filaRestante));
}

tentarReenviarFila();

window.addEventListener("online", function() {
    tentarReenviarFila();
});

botao.addEventListener("click", function(){

    valorEquipe = validarCampo("equipe", "erroEquipe");
    valorMunicipio = validarCampo("municipio", "erroMunicipio");

    if(valorEquipe !== "" && valorMunicipio !== ""){
        document.getElementById("pagina1").style.display="none";
        document.getElementById("pagina2").style.display="block";
        document.getElementById("displayEquipe").style.display="block";
        document.getElementById("displayMunicipio").style.display="block";
    }

    document.getElementById("spanDisplayEquipe").textContent = valorEquipe;
    document.getElementById("spanDisplayMunicipio").textContent = valorMunicipio;
});

document.getElementById("nome").addEventListener("input", function() {
    this.value = this.value.toUpperCase();
})

document.getElementById("sobrenome").addEventListener("input", function() {
    this.value = this.value.toUpperCase();
})

document.getElementById("telefone").addEventListener("input", function() {
    let valor = this.value.replace(/\D/g, ""); // remove tudo que não é dígito
    valor = valor.substring(0, 11); // limita a 11 dígitos (DDD + 9 do celular)
    
    if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        valor = valor.replace(/^(\d*)/, "($1");
    }
    
    this.value = valor;
});

botaoFinalizar.addEventListener("click", async function(){
    formularioValidado = true;

    valorNome = validarCampo("nome", "erroNome");
    valorSobrenome = validarCampo("sobrenome", "erroSobrenome");
    valorTelefone = validarCampo("telefone", "erroTelefone");
    valorConheceA = validarRadio("conheciaCandidatoA", "erroConheceA");
    valorConheceR = validarRadio("conheciaCandidatoR", "erroConheceR");
    valorApoiarA = validarRadio("apoiarCandidatoA", "erroApoiarA");
    valorApoiarR = validarRadio("apoiarCandidatoR", "erroApoiarR");
    valorApoioConhecidoA = validarRadio("apoioConhecidoA", "erroApoioConhecidoA");
    valorApoioConhecidoR = validarRadio("apoioConhecidoR", "erroApoioConhecidoR");

    if(formularioValidado){

    const dadosParaEnviar = {
    nome: valorNome + " " + valorSobrenome,
    telefone: valorTelefone,
    conheceA: valorConheceA,
    conheceR: valorConheceR,
    apoiarA: valorApoiarA,
    apoiarR: valorApoiarR,
    apoioConhecidoA: valorApoioConhecidoA,
    apoioConhecidoR: valorApoioConhecidoR,
    municipio: valorMunicipio,
    equipe: valorEquipe
    };

    if(formularioValidado){
        fetch("https://script.google.com/macros/s/AKfycbyT0jag8PBnQENRYKo-dRj4FNXsTTX9eWSSDh9ogJxJ1kXYer3sq5NvgJhaqi0bgoN1/exec", {
        method: "POST",
        body: JSON.stringify(dadosParaEnviar)
        });
        const querRepetir = confirm(`Pesquisa realizada com sucesso! Prosseguir para uma nova pesquisa em ${valorMunicipio}?`);
        if(querRepetir){
            document.getElementById("nome").value = "";
            document.getElementById("sobrenome").value = "";
            document.getElementById("telefone").value = "";

            resetarRadios("conheciaCandidatoA");
            resetarRadios("conheciaCandidatoR");
            resetarRadios("apoiarCandidatoA");
            resetarRadios("apoiarCandidatoR");
            resetarRadios("apoioConhecidoA");
            resetarRadios("apoioConhecidoR");

        } else{
            document.getElementById("equipe").value = "";
            document.getElementById("municipio").value = "";
            document.getElementById("pagina1").style.display="block";
            document.getElementById("pagina2").style.display="none";
        }
    }

})

    function esperar(millisegundos) {
        return new Promise(function(resolve) {
            setTimeout(resolve, millisegundos);
        });
    }

    async function testeAsync() {
        alert("Começando...");
        await esperar(2000);
        alert("Passaram 2 segundos!");
    }
