const listaDeUsuarios = document.getElementById('listaDeUsuarios');
const URLBaseCrud = 'https://crudcrud.com/api/5223af35d6b34caba8f43661fe3c0867/usuarios';

class CriacaoBotoesEElementos {

    //construtor
    constructor(conteudoNome, conteudoEmail, conteudoDescricao, id) {

        //propriedades

        this.conteudoNome = conteudoNome;
        this.conteudoEmail = conteudoEmail;
        this.conteudoDescricao = conteudoDescricao;
        this.id = id;
        this.elementoLiDoUl = document.createElement('li');

    }

    //metodos

    criacaoDoElementoLi(resultadoDaAPI) {

        //cria o elemento <li> com a classe 'usuario'
        this.elementoLiDoUl.classList.add('usuario');

        //cria paragrafo do nome do usuario
        const paragrafoUsuario = document.createElement('p');
        paragrafoUsuario.classList.add('nomeUsuario');
        paragrafoUsuario.textContent = `Usuario: ${resultadoDaAPI.conteudoNome}`;

        //cria paragrafo do email do usuario
        const paragrafoEmail = document.createElement('p');
        paragrafoEmail.classList.add('emailUsuario');
        paragrafoEmail.textContent = `email: ${resultadoDaAPI.conteudoEmail}`;

        //cria paragrafo da descricao
        const paragrafoDaDescricao = document.createElement('p');
        paragrafoDaDescricao.classList.add('descricao');
        paragrafoDaDescricao.textContent = `Descrição: ${resultadoDaAPI.conteudoDescricao}`;

        //cria botao delete
        const deletaBotao = document.createElement('button');
        deletaBotao.classList.add('deletar');
        deletaBotao.textContent = 'Deletar';
        deletaBotao.dataset.id = resultadoDaAPI._id;

        //cria botao editar
        const editaBotao = document.createElement('button');
        editaBotao.classList.add('editar');
        editaBotao.textContent = 'Editar';
        editaBotao.dataset.id = resultadoDaAPI._id;

        //adicionar dentro do <li>

        this.elementoLiDoUl.appendChild(paragrafoUsuario);
        this.elementoLiDoUl.appendChild(paragrafoEmail);
        this.elementoLiDoUl.appendChild(paragrafoDaDescricao);
        this.elementoLiDoUl.appendChild(editaBotao);
        this.elementoLiDoUl.appendChild(deletaBotao);
    }

    renderizaUsuario(resultadoDaAPI) {

        this.criacaoDoElementoLi(resultadoDaAPI);
        listaDeUsuarios.appendChild(this.elementoLiDoUl);

    }

}

class MetodoGet {

    //metodos

    BuscaCadastro() {

        fetch(URLBaseCrud)
        .then(response => response.json())
        .then(bancoDeDadosUsuarios => {
            bancoDeDadosUsuarios.forEach(resultadoDaAPI => {
                const varedura = new CriacaoBotoesEElementos(
                    resultadoDaAPI.conteudoNome, 
                    resultadoDaAPI.conteudoEmail, 
                    resultadoDaAPI.conteudoDescricao, 
                    resultadoDaAPI._id
                );
                varedura.renderizaUsuario(resultadoDaAPI);

                const botaoEditar = varedura.elementoLiDoUl.querySelector('.editar');
                const botaoDeletar = varedura.elementoLiDoUl.querySelector('.deletar');

                const editaUsuario = new MetodoPut();
                editaUsuario.atualizarUsuario(botaoEditar, varedura.elementoLiDoUl,resultadoDaAPI);

                const deletaUsuario = new MetodoDelete();
                deletaUsuario.apagarUsuario(varedura.elementoLiDoUl, botaoDeletar);
            });
        })

        .catch(erro => console.error('Erro ao buscar usuarios:', erro));
    }
}

class MetodoPost{

    //metodos

    cadastrarNovoUsuario() {
        
        document.getElementById('cadastrar').addEventListener('click', ()=> {

            const conteudoDoNome = document.getElementById('nome').value.trim();
            const conteudoDoEmail = document.getElementById('email').value.trim();
            const conteudoDaDescricao= document.getElementById('descricao').value.trim();

            if(!(conteudoDoNome && conteudoDoEmail && conteudoDaDescricao)) return;
            console.log('Cadastro realizado com sucesso!!!');

            console.log(JSON.stringify({
                conteudoNome: conteudoDoNome,
                conteudoEmail: conteudoDoEmail,
                conteudoDescricao: conteudoDaDescricao
            }));


            fetch(URLBaseCrud, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({conteudoNome: conteudoDoNome, 
                    conteudoEmail: conteudoDoEmail, 
                    conteudoDescricao: conteudoDaDescricao,
                })

            })

            .then(response => response.json())
            .then(resultadoDaAPI => {
                const cadastroNovo = new CriacaoBotoesEElementos(
                    resultadoDaAPI.conteudoNome, 
                    resultadoDaAPI.conteudoEmail, 
                    resultadoDaAPI.conteudoDescricao, 
                    resultadoDaAPI._id
                );
                cadastroNovo.renderizaUsuario(resultadoDaAPI);

                const botaoEditar = cadastroNovo.elementoLiDoUl.querySelector('.editar');
                const botaoDeletar = cadastroNovo.elementoLiDoUl.querySelector('.deletar');

                const editaUsuario = new MetodoPut();
                editaUsuario.atualizarUsuario(botaoEditar, cadastroNovo.elementoLiDoUl, resultadoDaAPI);

                const deletaUsuario = new MetodoDelete();
                deletaUsuario.apagarUsuario(cadastroNovo.elementoLiDoUl, botaoDeletar);

            })

            .catch(erro => console.log('Erro no POST', erro));

            document.getElementById('nome').value = '';
            document.getElementById('email').value = '';
            document.getElementById('descricao').value = '';
        });
    }
}

class MetodoPut{

    //metodos

    atualizarUsuario(editaBotao, elementoLiDoUl, resultadoDaAPI) {

        editaBotao.addEventListener('click', ()=> {

            elementoLiDoUl.innerHTML = '';

            const inputNovoNome = document.createElement('input');
            inputNovoNome.type = 'text';
            inputNovoNome.value = resultadoDaAPI.conteudoNome;
            inputNovoNome.classList.add('inputEditaNome');


            const inputNovoEmail = document.createElement('input');
            inputNovoEmail.type = 'text';
            inputNovoEmail.value = resultadoDaAPI.conteudoEmail;
            inputNovoEmail.classList.add('inputEditaEmail');

            const inputNovoDescricao = document.createElement('textarea');
            inputNovoDescricao.cols = '40';
            inputNovoDescricao.rows = '5';
            inputNovoDescricao.value = resultadoDaAPI.conteudoDescricao;
            inputNovoDescricao.classList.add('inputEditaDescricao');

            const botaoSalvarEdicao = document.createElement('button');
            botaoSalvarEdicao.textContent = 'Salvar';
            botaoSalvarEdicao.classList.add('salvarEdicao');

            elementoLiDoUl.appendChild(inputNovoNome);
            elementoLiDoUl.appendChild(inputNovoEmail);
            elementoLiDoUl.appendChild(inputNovoDescricao);
            elementoLiDoUl.appendChild(botaoSalvarEdicao);

            botaoSalvarEdicao.addEventListener('click', ()=> {

                const novoConteudoNome = inputNovoNome.value.trim();
                const novoConteudoEmail = inputNovoEmail.value.trim();
                const novoConteudoDescricao = inputNovoDescricao.value.trim();

                if(!(novoConteudoNome && novoConteudoEmail && novoConteudoDescricao)) return;

                fetch(`${URLBaseCrud}/${resultadoDaAPI._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'

                    },

                    body: JSON.stringify({conteudoNome: novoConteudoNome, conteudoEmail: novoConteudoEmail, conteudoDescricao: novoConteudoDescricao})

                })

                .then(response => {
                    if(response.ok) {

                        const novoParagrafoUsuario = document.createElement('p');
                        novoParagrafoUsuario.classList.add('nomeUsuario');
                        novoParagrafoUsuario.textContent = `Usuario: ${novoConteudoNome}`;

                        const novoParagrafoEmail = document.createElement('p');
                        novoParagrafoEmail.classList.add('emailUsuario');
                        novoParagrafoEmail.textContent = `email: ${novoConteudoEmail}`;

                        const novoParagrafoDescricao = document.createElement('p');
                        novoParagrafoDescricao.classList.add('descricao');
                        novoParagrafoDescricao.textContent = `Descrição: ${novoConteudoDescricao}`;

                        const botaoEditaNovo = document.createElement('button');
                        botaoEditaNovo.textContent = 'Editar';
                        botaoEditaNovo.classList.add('editar');
                        botaoEditaNovo.dataset.id = resultadoDaAPI._id;

                        const botaoDeletaNovo = document.createElement('button');
                        botaoDeletaNovo.textContent = 'Deletar';
                        botaoDeletaNovo.classList.add('deletar');
                        botaoDeletaNovo.dataset.id = resultadoDaAPI._id;

                        elementoLiDoUl.innerHTML = '';

                        elementoLiDoUl.appendChild(novoParagrafoUsuario);
                        elementoLiDoUl.appendChild(novoParagrafoEmail);
                        elementoLiDoUl.appendChild(novoParagrafoDescricao);
                        elementoLiDoUl.appendChild(botaoEditaNovo);
                        elementoLiDoUl.appendChild(botaoDeletaNovo);

                        const resultadoAtualizadoDaAPI = {

                            _id: resultadoDaAPI._id,
                            conteudoNome: novoConteudoNome,
                            conteudoEmail: novoConteudoEmail,
                            conteudoDescricao: novoConteudoDescricao,
                        };

                        new MetodoPut().atualizarUsuario(botaoEditaNovo, elementoLiDoUl, resultadoAtualizadoDaAPI);

                        new MetodoDelete().apagarUsuario(elementoLiDoUl, botaoDeletaNovo);

                    }
                })

                .catch(erro => console.error('Erro ao editar usuario', erro));

            });
        });

    }
}

class MetodoDelete {

    //metodos

    apagarUsuario(elementoLiDoUl, deletaBotao) {

        deletaBotao.addEventListener('click', ()=> {

            const idDoDeletaBotao = deletaBotao.dataset.id;

            fetch(`${URLBaseCrud}/${idDoDeletaBotao}`, {
                method: 'DELETE',

            })

            .then(response => {
                if(response.ok) {
                    elementoLiDoUl.remove();
                }
            });
        });
    }
}

//instancias

window.addEventListener('DOMContentLoaded', ()=> {

    const chamaOGet = new MetodoGet();
    chamaOGet.BuscaCadastro();

    const chamaOPost = new MetodoPost();
    chamaOPost.cadastrarNovoUsuario();

});