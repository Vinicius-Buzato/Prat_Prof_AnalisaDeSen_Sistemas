// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================
window.SUPABASE_URL = window.SUPABASE_URL || 'https://qvqdloqlicdoqevrtblr.supabase.co';
window.SUPABASE_KEY = window.SUPABASE_KEY || 'sb_publishable_zWeHsS3rE1yMxIKROCnZ9Q_8e68WfuR';

const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);

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
            e.stopPropagation();
            
            const nome = document.getElementById('u-nome').value.trim();
            const email = document.getElementById('u-email').value.trim();
            const btnSubmit = formLogin.querySelector('button');
            
            if (!nome || !email) return alert('Preencha nome e e-mail.');
            if (btnSubmit) btnSubmit.innerText = 'Conectando...';

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
                        .insert([{ nome, email }])
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
                if (btnSubmit) btnSubmit.innerText = 'Entrar no Sistema';
            }
        });
    }

    // 2. FORMULÁRIO DE CRIAR VIAGEM
    const formCriar = document.getElementById('form-criar-viagem');
    if (formCriar) {
        formCriar.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const destino = document.getElementById('v-destino').value.trim();
            const horario = document.getElementById('v-horario').value;
            const origem = document.getElementById('v-origem')?.value.trim() || 'Não informada';
            const btnSubmit = formCriar.querySelector('button');

            if (!destino || !horario) return alert('Preencha destino e horário.');
            if (btnSubmit) btnSubmit.innerText = 'Criando grupo...';

            try {
                const codigoConvite = Math.random().toString(36).substring(2, 8).toUpperCase();
                const dataFormatada = new Date(horario).toISOString();

                // Insere a viagem
                const { data: novaViagem, error: erroViagem } = await db
                    .from('viagens')
                    .insert([{
                        codigo_convite: codigoConvite,
                        destino: destino,
                        horario_chegada: dataFormatada
                    }])
                    .select()
                    .single();

                if (erroViagem) throw erroViagem;

                // Vincula criador como Organizador
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

                await carregarLobbyViagem(novaViagem.id);

            } catch (err) {
                console.error('Erro ao criar viagem:', err);
                alert('Erro ao criar viagem: ' + err.message);
            } finally {
                if (btnSubmit) btnSubmit.innerText = 'Criar Grupo';
            }
        });
    }

    // 3. FORMULÁRIO DE ENTRAR EM VIAGEM
    const formEntrar = document.getElementById('form-entrar-viagem');
    if (formEntrar) {
        formEntrar.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const codigo = document.getElementById('v-codigo').value.trim().toUpperCase();
            const origem = document.getElementById('v-origem-participante')?.value.trim() || 'Não informada';
            const btnSubmit = formEntrar.querySelector('button');

            if (btnSubmit) btnSubmit.innerText = 'Procurando...';

            try {
                const { data: viagem, error: erroBusca } = await db
                    .from('viagens')
                    .select('*')
                    .eq('codigo_convite', codigo)
                    .maybeSingle();

                if (erroBusca) throw erroBusca;
                if (!viagem) return alert('Código de viagem inválido.');

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

                await carregarLobbyViagem(viagem.id);

            } catch (err) {
                console.error('Erro ao entrar na viagem:', err);
                alert('Erro ao entrar na viagem: ' + err.message);
            } finally {
                if (btnSubmit) btnSubmit.innerText = 'Entrar no Grupo';
            }
        });
    }

    // 4. LOGOUT
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        usuarioAtual = null;
        viagemAtual = null;
        localStorage.removeItem('usuario');
        verificarLogin();
    });

    // 5. VOLTAR AO DASHBOARD
    document.getElementById('btn-voltar-dashboard')?.addEventListener('click', () => {
        viagemAtual = null;
        verificarLogin();
    });
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
            carregarMinhasViagens(); // Carrega histórico na Dashboard
        }
    } else {
        telaDashboard?.classList.add('hidden');
        telaLobby?.classList.add('hidden');
        telaLogin?.classList.remove('hidden');
    }
}

// Carrega os detalhes completos do Lobby da Viagem
async function carregarLobbyViagem(viagemId) {
    try {
        // Busca a viagem
        const { data: viagem, error: erroV } = await db
            .from('viagens')
            .select('*')
            .eq('id', viagemId)
            .single();

        if (erroV) throw erroV;

        // Busca participantes + dados de usuarios
        const { data: participantes, error: erroP } = await db
            .from('viagem_participantes')
            .select(`
                tipo_participante,
                origem,
                usuarios:usuario_id ( nome, email )
            `)
            .eq('viagem_id', viagemId);

        if (erroP) throw erroP;

        viagemAtual = viagem;

        // Atualiza a interface
        const elDestino = document.getElementById('lobby-destino');
        const elHorario = document.getElementById('lobby-horario');
        const elCodigo = document.getElementById('lobby-codigo');
        const elLista = document.getElementById('lobby-lista-participantes');

        if (elDestino) elDestino.innerText = viagem.destino;
        if (elHorario) elHorario.innerText = new Date(viagem.horario_chegada).toLocaleString('pt-BR');
        if (elCodigo) elCodigo.innerText = `Código: ${viagem.codigo_convite}`;

        if (elLista) {
            elLista.innerHTML = participantes.map(p => `
                <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                    <strong>${p.usuarios ? p.usuarios.nome : 'Usuário'}</strong> 
                    <span style="font-size: 0.85em; color: #555;">(${p.tipo_participante})</span>
                    <br><small>Origem: ${p.origem}</small>
                </li>
            `).join('');
        }

        verificarLogin();

    } catch (err) {
        console.error('Erro ao carregar lobby:', err);
        alert('Erro ao carregar detalhes da viagem: ' + err.message);
    }
}

// Carrega a lista de viagens que o usuário faz parte no Dashboard
async function carregarMinhasViagens() {
    const elContainer = document.getElementById('minhas-viagens-lista');
    if (!elContainer || !usuarioAtual) return;

    try {
        const { data, error } = await db
            .from('viagem_participantes')
            .select(`
                tipo_participante,
                viagens:viagem_id ( id, destino, horario_chegada, codigo_convite )
            `)
            .eq('usuario_id', usuarioAtual.id);

        if (error) throw error;

        if (!data || data.length === 0) {
            elContainer.innerHTML = '<p style="color: #666; font-size: 0.9em;">Você ainda não participa de nenhuma viagem.</p>';
            return;
        }

        elContainer.innerHTML = data.map(item => {
            const v = item.viagens;
            if (!v) return '';
            return `
                <div style="background: #f8f9fa; border: 1px solid #e0e0e0; padding: 12px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>📍 ${v.destino}</strong><br>
                        <small>Chegada: ${new Date(v.horario_chegada).toLocaleString('pt-BR')}</small><br>
                        <small style="color: #0066cc;">Código: ${v.codigo_convite}</small>
                    </div>
                    <button onclick="carregarLobbyViagem(${v.id})" style="padding: 6px 12px; cursor: pointer; background: #0066cc; color: white; border: none; border-radius: 4px;">Acessar</button>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Erro ao carregar viagens:', err);
    }
}