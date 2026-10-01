// Simulação de Banco de Dados usando localStorage
const supabaseUrl = 'https://qvqdloqlicdoqevrtblr.supabase.co/rest/v1/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cWRsb3FsaWNkb3FldnJ0YmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MTY5MzgsImV4cCI6MjEwNjM5MjkzOH0.70vwMDIXAeM6bZHg-qzdcoLOq0pOkdlvH1pYsBKEFXw';
const supabase = window.supabase;
const db = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // Referências de Telas
    const telaLogin = document.getElementById('tela-login');
    const telaDashboard = document.getElementById('tela-dashboard');
    const telaLobby = document.getElementById('tela-lobby');
    const loading = document.getElementById('loading');

    // Inicialização
    verificarLogin();

    // --- 1. GESTÃO DE USUÁRIOS ---
   // Substitua APENAS o bloco do form-login no seu app.js
    document.getElementById('form-login').addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que a página recarregue
        
        const nome = document.getElementById('u-nome').value;
        const email = document.getElementById('u-email').value;
        const btnSubmit = e.target.querySelector('button');
        
        // Feedback visual (opcional)
        const textoOriginal = btnSubmit.innerText;
        btnSubmit.innerText = 'Conectando...';

        try {
            // 1. Verifica se o usuário já está cadastrado no banco pelo e-mail
            let { data: usuarioExistente, error: erroBusca } = await db
                .from('Usuarios')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            let dadosUsuario = usuarioExistente;

            // 2. Se não existir, faz o INSERT (cadastro) do novo usuário
            if (!dadosUsuario) {
                const { data: novoUsuario, error: erroInsert } = await db
                    .from('Usuarios')
                    .insert([{ nome: nome, email: email }])
                    .select()
                    .single();

                if (erroInsert) throw erroInsert;
                dadosUsuario = novoUsuario;
            }

            // 3. Salva a sessão localmente AGORA com o "id" oficial gerado pelo Supabase
            usuarioAtual = { 
                id: dadosUsuario.id, 
                nome: dadosUsuario.nome, 
                email: dadosUsuario.email 
            };
            localStorage.setItem('usuario', JSON.stringify(usuarioAtual));
            
            // 4. Libera o acesso para o Dashboard
            verificarLogin();

        } catch (error) {
            console.error("Erro ao realizar login:", error);
            alert("Erro ao conectar com o banco de dados. Verifique o console.");
        } finally {
            btnSubmit.innerText = textoOriginal;
        }
    });

    // --- 2. CRIAÇÃO DE GRUPO ---
    document.getElementById('form-criar').addEventListener('submit', (e) => {
        e.preventDefault();
        const destino = document.getElementById('c-destino').value;
        const horario = document.getElementById('c-horario').value;
        const origem = document.getElementById('c-origem').value;
        
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        dbViagens[codigo] = {
            destino,
            horarioChegada: horario,
            participantes: [
                { nome: usuarioAtual.nome, tipo: 'Organizador', origem }
            ]
        };
        salvarViagens();
        abrirLobby(codigo);
    });

    // --- 3 & 4. ENTRAR NO GRUPO E DEFINIR PARTIDA ---
    document.getElementById('form-entrar').addEventListener('submit', (e) => {
        e.preventDefault();
        const codigo = document.getElementById('e-codigo').value.toUpperCase();
        const origem = document.getElementById('e-origem').value;

        if (!dbViagens[codigo]) {
            alert('Código de viagem inválido ou não encontrado!');
            return;
        }

        // Evita duplicar o usuário se ele já estiver na viagem (simples validação)
        const jaEstaNaViagem = dbViagens[codigo].participantes.find(p => p.nome === usuarioAtual.nome);
        if (!jaEstaNaViagem) {
            dbViagens[codigo].participantes.push({
                nome: usuarioAtual.nome,
                tipo: 'Passageiro',
                origem
            });
            salvarViagens();
        }

        abrirLobby(codigo);
    });

    document.getElementById('btn-voltar').addEventListener('click', verificarLogin);

    // --- LÓGICA DE INTERFACE E CÁLCULO SIMULADO ---
    function salvarViagens() {
        localStorage.setItem('viagens', JSON.stringify(dbViagens));
    }

    function abrirLobby(codigo) {
        telaDashboard.classList.add('hidden');
        loading.classList.remove('hidden');

        setTimeout(() => {
            renderizarLobby(codigo);
            loading.classList.add('hidden');
            telaLobby.classList.remove('hidden');
        }, 1200);
    }

    function renderizarLobby(codigo) {
        const viagem = dbViagens[codigo];
        document.getElementById('l-codigo').innerText = codigo;
        document.getElementById('l-destino').innerText = viagem.destino;
        document.getElementById('l-horario').innerText = new Date(viagem.horarioChegada).toLocaleString('pt-BR');

        const lista = document.getElementById('lista-participantes');
        lista.innerHTML = '';
        const tempoChegada = new Date(viagem.horarioChegada).getTime();

        viagem.participantes.forEach((part, index) => {
            // Simula o Algoritmo de Encontro: Atribui um tempo de trajeto fictício baseado na ordem de entrada
            const minutosTrajeto = 20 + (index * 12); 
            const horaSaida = new Date(tempoChegada - (minutosTrajeto * 60000));

            const li = document.createElement('li');
            li.className = 'item-participante';
            li.innerHTML = `
                <div><strong>${part.nome}</strong> (${part.tipo})</div>
                <div style="font-size: 0.9rem; color: #555;">📍 Partindo de: ${part.origem}</div>
                <div class="saida-badge">Tempo de rota: ${minutosTrajeto} min ➔ Sair às: ${horaSaida.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
            `;
            lista.appendChild(li);
        });
    }
});
