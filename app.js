// Simulação de Banco de Dados usando localStorage
const SUPABASE_URL = 'https://qvqdloqlicdoqevrtblr.supabase.co/rest/v1/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cWRsb3FsaWNkb3FldnJ0YmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MTY5MzgsImV4cCI6MjEwNjM5MjkzOH0.70vwMDIXAeM6bZHg-qzdcoLOq0pOkdlvH1pYsBKEFXw';

// Inicialização segura utilizando a biblioteca global importada no HTML
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Estado Global da Aplicação
let usuarioAtual = JSON.parse(localStorage.getItem('usuario')) || null;
let viagemAtual = null;

// ==========================================
// INICIALIZAÇÃO DOS EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    verificarLogin();

    // 1. FORMULÁRIO DE LOGIN / CADASTRO
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('u-nome').value.trim();
            const email = document.getElementById('u-email').value.trim();
            const btnSubmit = e.target.querySelector('button');
            
            if (!nome || !email) {
                alert('Por favor, preencha o nome e o e-mail.');
                return;
            }

            btnSubmit.innerText = 'Conectando...';

            try {
                // Procura utilizador existente pelo e-mail
                let { data: usuarioExistente, error: erroBusca } = await db
                    .from('Usuarios')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle();

                if (erroBusca) throw erroBusca;

                let dadosUsuario = usuarioExistente;

                // Se não existir na base de dados, realiza o registo
                if (!dadosUsuario) {
                    const { data: novoUsuario, error: erroInsert } = await db
                        .from('Usuarios')
                        .insert([{ nome: nome, email: email }])
                        .select()
                        .single();

                    if (erroInsert) throw erroInsert;
                    dadosUsuario = novoUsuario;
                }

                // Guarda a sessão localmente
                usuarioAtual = dadosUsuario;
                localStorage.setItem('usuario', JSON.stringify(usuarioAtual));
                verificarLogin();

            } catch (err) {
                console.error('Erro no Login:', err);
                alert('Erro ao autenticar: ' + err.message);
            } finally {
                btnSubmit.innerText = 'Entrar no Sistema';
            }
        });
    }

    // 2. FORMULÁRIO DE CRIAR VIAGEM
    const formCriar = document.getElementById('form-criar-viagem');
    if (formCriar) {
        formCriar.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const destino = document.getElementById('v-destino').value.trim();
            const horario = document.getElementById('v-horario').value;
            const origem = document.getElementById('v-origem')?.value.trim() || 'Não informada';
            const btnSubmit = e.target.querySelector('button');

            btnSubmit.innerText = 'A criar viagem...';

            try {
                // Gera um código de convite aleatório de 6 caracteres
                const codigoConvite = Math.random().toString(36).substring(2, 8).toUpperCase();

                // Insere a nova viagem na tabela Viagens
                const { data: novaViagem, error: erroViagem } = await db
                    .from('Viagens')
                    .insert([{
                        codigo_convite: codigoConvite,
                        destino: destino,
                        horario_chegada: horario
                    }])
                    .select()
                    .single();

                if (erroViagem) throw erroViagem;

                // Relaciona o utilizador criador como Organizador na tabela Viagem_Participantes
                const { error: erroPart } = await db
                    .from('Viagem_Participantes')
                    .insert([{
                        viagem_id: novaViagem.id,
                        usuario_id: usuarioAtual.id,
                        tipo_participante: 'Organizador',
                        origem: origem,
                        tempo_estimado_minutos: 0
                    }]);

                if (erroPart) throw erroPart;

                alert(`Viagem criada com sucesso! Código do grupo: ${codigoConvite}`);
                carregarLobbyViagem(novaViagem.id);

            } catch (err) {
                console.error('Erro ao criar viagem:', err);
                alert('Erro ao criar viagem: ' + err.message);
            } finally {
                btnSubmit.innerText = 'Criar Grupo';
            }
        });
    }

    // 3. FORMULÁRIO DE ENTRAR EM UMA VIAGEM
    const formEntrar = document.getElementById('form-entrar-viagem');
    if (formEntrar) {
        formEntrar.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const codigo = document.getElementById('v-codigo').value.trim().toUpperCase();
            const origem = document.getElementById('v-origem-participante')?.value.trim() || 'Não informada';
            const btnSubmit = e.target.querySelector('button');

            btnSubmit.innerText = 'A procurar...';

            try {
                // Procura a viagem pelo código de convite
                const { data: viagem, error: erroBusca } = await db
                    .from('Viagens')
                    .select('*')
                    .eq('codigo_convite', codigo)
                    .maybeSingle();

                if (erroBusca) throw erroBusca;
                if (!viagem) {
                    alert('Código de viagem inválido ou não encontrado.');
                    return;
                }

                // Insere o utilizador como Passageiro
                const { error: erroPart } = await db
                    .from('Viagem_Participantes')
                    .insert([{
                        viagem_id: viagem.id,
                        usuario_id: usuarioAtual.id,
                        tipo_participante: 'Passageiro',
                        origem: origem,
                        tempo_estimado_minutos: 0
                    }]);

                // Trata o erro caso o utilizador já faça parte da viagem
                if (erroPart && !erroPart.message.includes('duplicate key')) {
                    throw erroPart;
                }

                carregarLobbyViagem(viagem.id);

            } catch (err) {
                console.error('Erro ao entrar na viagem:', err);
                alert('Erro ao entrar na viagem: ' + err.message);
            } finally {
                btnSubmit.innerText = 'Entrar no Grupo';
            }
        });
    }

    // 4. LOGOUT
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            usuarioAtual = null;
            viagemAtual = null;
            localStorage.removeItem('usuario');
            verificarLogin();
        });
    }

    // 5. VOLTAR AO DASHBOARD
    const btnVoltar = document.getElementById('btn-voltar-dashboard');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            viagemAtual = null;
            verificarLogin();
        });
    }
});

// ==========================================
// FUNÇÕES DE NAVEGAÇÃO E INTERFACE
// ==========================================

function verificarLogin() {
    const telaLogin = document.getElementById('tela-login');
    const telaDashboard = document.getElementById('tela-dashboard');
    const telaLobby = document.getElementById('tela-lobby');

    if (usuarioAtual) {
        const userDisplay = document.getElementById('user-display-name');
        if (userDisplay) userDisplay.innerText = usuarioAtual.nome;

        if (viagemAtual) {
            telaLogin?.classList.add('hidden');
            telaDashboard?.classList.add('hidden');
            telaLobby?.classList.remove('hidden');
        } else {
            telaLogin?.classList.add('hidden');
            telaLobby?.classList.add('hidden');
            telaDashboard?.classList.remove('hidden');
        }
    } else {
        telaDashboard?.classList.add('hidden');
        telaLobby?.classList.add('hidden');
        telaLogin?.classList.remove('hidden');
    }
}

// Carrega os dados da viagem e a lista de participantes
async function carregarLobbyViagem(viagemId) {
    try {
        // Procura os dados da viagem
        const { data: viagem, error: erroV } = await db
            .from('Viagens')
            .select('*')
            .eq('id', viagemId)
            .single();

        if (erroV) throw erroV;

        // Procura os participantes e cruza com a tabela Usuarios
        const { data: participantes, error: erroP } = await db
            .from('Viagem_Participantes')
            .select(`
                tipo_participante,
                origem,
                Usuarios ( nome, email )
            `)
            .eq('viagem_id', viagemId);

        if (erroP) throw erroP;

        viagemAtual = viagem;
        verificarLogin();

        // Atualiza a interface da página
        const elDestino = document.getElementById('lobby-destino');
        const elHorario = document.getElementById('lobby-horario');
        const elCodigo = document.getElementById('lobby-codigo');
        const elLista = document.getElementById('lobby-lista-participantes');

        if (elDestino) elDestino.innerText = viagem.destino;
        if (elHorario) elHorario.innerText = new Date(viagem.horario_chegada).toLocaleString('pt-BR');
        if (elCodigo) elCodigo.innerText = viagem.codigo_convite;

        if (elLista) {
            elLista.innerHTML = participantes.map(p => `
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong>${p.Usuarios ? p.Usuarios.nome : 'Utilizador'}</strong> (${p.tipo_participante}) 
                    <br><small>Origem: ${p.origem}</small>
                </li>
            `).join('');
        }

    } catch (err) {
        console.error('Erro ao carregar lobby:', err);
        alert('Erro ao carregar os detalhes da viagem: ' + err.message);
    }
}
