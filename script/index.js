// CONFIGURAR A URL PADRÃO DE REQUISIÇÕES
const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
});

// CONTROLE DE PAGINA E DADOS DE PERSONAGENS
let paginaAtual = 1
let totalPaginas = 0
let personagens = []

// INFOS DE QUANTIDADES
const qtdPersonagens = document.getElementById('qtd-personagens')
const qtdLocalizacoes = document.getElementById('qtd-localizacoes')
const qtdEpisodios = document.getElementById('qtd-episodios')

// BOTOES PAGINAÇÃO
const buttonPrev = document.getElementById('btn-prev')
const buttonActual = document.getElementById('btn-actual')
const buttonNext = document.getElementById('btn-next')


const url = "https://rickandmortyapi.com/api/character"


const montarCards = async()=>{
    const apii = await fetch(url)
    const data= await apii.json()

    divRes = document.querySelector("#resultado")
    divRes.innerHTML = ""
    personagens.map(item=>{
        divItem = document.createElement('div')
        divItem.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${item.image}" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${cardStatus(item.status)}</p>
              <p class="card-text"><b>Espécie: </b>${item.species}</p>
              <p class="card-text"><b>Gênero: </b>${item.gender}</p>
            </div>
          </div>
        </div>
      </div>
    
      `
        divRes.appendChild(divItem);
    })

}

const cardStatus = (status) =>{

    switch (status) {
        case "Alive":
            return  `<span class="dot circle__green"></span> <b> Status: </b> Alive`
        case "Dead":
            return `<span class="dot circle__red"></span><b> Status: </b> Dead`
        default:
            return `<span class="dot circle__gray"></span> <b> Status: </b>Unknown`
    }

}

// É EXECUTADO AO CARREGAMENTO DA PÁGINA
document.addEventListener('DOMContentLoaded', async () => {

    const respostaPersonagens = await api.get('/character');
    qtdPersonagens.innerHTML = `Personagens: ${respostaPersonagens.data.info.count}`

    totalPaginas = respostaPersonagens.data.info.pages
    personagens = respostaPersonagens.data.results
    montarCards()

    const respostaLocalizacoes = await api.get('/location');
    qtdLocalizacoes.innerHTML = `Localizações: ${respostaLocalizacoes.data.info.count}`

    const respostaEspisodios = await api.get('/episode');
    qtdEpisodios.innerHTML = `Episódios: ${respostaEspisodios.data.info.count}`

    mudaBotoesPaginacao(respostaPersonagens.data.info.prev, respostaPersonagens.data.info.next)
});

async function buscaDadosPersonagens() {

    const respostaPersonagens = await api.get('/character', {
        params: {
            page: paginaAtual
        }
    });

    personagens = respostaPersonagens.data.results
    montarCards()

    mudaBotoesPaginacao(respostaPersonagens.data.info.prev, respostaPersonagens.data.info.next)
}
// LÓGICA PARA OS BOTOES DE PAGINAÇÃO
buttonPrev.addEventListener('click', async () => {
    if ((paginaAtual - 1) >= 1) {
        paginaAtual--
        await buscaDadosPersonagens()
    } else {
        buttonPrev.setAttribute('style', 'opacity: 0;')
    }
})

buttonNext.addEventListener('click', async () => {
    if ((paginaAtual + 1) <= totalPaginas) {
        paginaAtual++
        await buscaDadosPersonagens()
    } else {
        buttonNext.setAttribute('style', 'opacity: 0')
    }
})

function mudaBotoesPaginacao(prev, next) {
    buttonActual.innerText = `Página ${paginaAtual}`

    if (prev) {
        buttonPrev.setAttribute('style', 'opacity: 1')
    } else {
        buttonPrev.setAttribute('style', 'opacity: 0')
    }

    if (next) {
        buttonNext.setAttribute('style', 'opacity: 1')
    } else {
        buttonNext.setAttribute('style', 'opacity: 0')
    }
}

