const botao = document.getElementById("botaoProximo");
const botaoFinalizar = document.getElementById("botaoFinalizar");

let valorEquipe;
let valorMunicipio;
let valorNome;
let valorSobrenome;
let valorDDD;
let valorTelefone;
let valorConheceA;
let valorConheceR;
let valorApoiarA;
let valorApoiarR;
let valorApoioConhecidoA;
let valorApoioConhecidoR;

let mensagemErro = "Este campo precisa ser preenchido!";
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

botao.addEventListener("click", function(){

    valorEquipe = validarCampo("equipe", "erroEquipe");
    valorMunicipio = validarCampo("municipio", "erroMunicipio");

    if(valorEquipe !== "" && valorMunicipio !== ""){
        document.getElementById("pagina1").style.display="none";
        document.getElementById("pagina2").style.display="block";
    }
});

botaoFinalizar.addEventListener("click", function(){
    formularioValidado = true;

    valorNome = validarCampo("nome", "erroNome");
    valorSobrenome = validarCampo("sobrenome", "erroSobrenome");
    valorDDD = validarCampo("telDDD", "erroDDD");
    valorTelefone = validarCampo("telefone", "erroTelefone");
    valorConheceA = validarRadio("conheciaCandidatoA", "erroConheceA");
    valorConheceR = validarRadio("conheciaCandidatoR", "erroConheceR");
    valorApoiarA = validarRadio("apoiarCandidatoA", "erroApoiarA");
    valorApoiarR = validarRadio("apoiarCandidatoR", "erroApoiarR");
    valorApoioConhecidoA = validarRadio("apoioConhecidoA", "erroApoioConhecidoA");
    valorApoioConhecidoR = validarRadio("apoioConhecidoR", "erroApoioConhecidoR");

    const dadosParaEnviar = {
    nome: valorNome + " " + valorSobrenome,
    telefone: valorDDD + valorTelefone,
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
            document.getElementById("telDDD").value = "";
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
