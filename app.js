const SUPABASE_URL = 'https://qvqdloqlicdoqevrtblr.supabase.co/rest/v1/';
const SUPABASE_KEY = 'sb_publishable_zWeHsS3rE1yMxIKROCnZ9Q_8e68WfuR';
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
                let { data: usuarioExistente, error: erroBusca } = await db
                    .from('usuarios')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle();

                if (erroBusca) throw erroBusca;

                let dadosUsuario = usuarioExistente;

                if (!dadosUsuario) {
                    const { data: novoUsuario, error: erroInsert } = await db
                        .from('usuarios')
                        .insert([{ nome: nome, email: email }])
                        .select()
                        .single();

                    if (erroInsert) throw erroInsert;
                    dadosUsuario = novoUsuario;
                }

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
                const codigoConvite = Math.random().toString(36).substring(2, 8).toUpperCase();

                const { data: novaViagem, error: erroViagem } = await db
                    .from('viagens')
                    .insert([{
                        codigo_convite: codigoConvite,
                        destino: destino,
                        horario_chegada: horario
                    }])
                    .select()
                    .single();

                if (erroViagem) throw erroViagem;

                const { error: erroPart } = await db
                    .from('viagem_participantes')
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
                const { data: viagem, error: erroBusca } = await db
                    .from('viagens')
                    .select('*')
                    .eq('codigo_convite', codigo)
                    .maybeSingle();

                if (erroBusca) throw erroBusca;
                if (!viagem) {
                    alert('Código de viagem inválido ou não encontrado.');
                    return;
                }

                const { error: erroPart } = await db
                    .from('viagem_participantes')
                    .insert([{
                        viagem_id: viagem.id,
                        usuario_id: usuarioAtual.id,
                        tipo_participante: 'Passageiro',
                        origem: origem,
                        tempo_estimado_minutos: 0
                    }]);

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

async function carregarLobbyViagem(viagemId) {
    try {
        const { data: viagem, error: erroV } = await db
            .from('viagens')
            .select('*')
            .eq('id', viagemId)
            .single();

        if (erroV) throw erroV;

        const { data: participantes, error: erroP } = await db
            .from('viagem_participantes')
            .select(`
                tipo_participante,
                origem,
                usuarios ( nome, email )
            `)
            .eq('viagem_id', viagemId);

        if (erroP) throw erroP;

        viagemAtual = viagem;
        verificarLogin();

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
                    <strong>${p.usuarios ? p.usuarios.nome : 'Utilizador'}</strong> (${p.tipo_participante}) 
                    <br><small>Origem: ${p.origem}</small>
                </li>
            `).join('');
        }

    } catch (err) {
        console.error('Erro ao carregar lobby:', err);
        alert('Erro ao carregar os detalhes da viagem: ' + err.message);
    }
}
