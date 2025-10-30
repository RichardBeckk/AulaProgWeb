document.addEventListener('DOMContentLoaded', () =>{

    const toogleMenu = () =>{
        const menu = document.getElementById('navMenu');
        if(menu)menu.classList.toogle('active');
    };
    window.toogleMenu = toogleMenu;

    const scrollToSection = (sectionId) =>{
        const section = document. getElementById(sectionId);

        if(!section) return;

        const headerHeight = 70;

        const sectionPosition = section.offsetTop - headerHeight;
        window.scrollTo({top: sectionPosition, behavior:'smooth'});

        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('active');
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        const form = document.getElementById('volunteerForm');
        if(!form) return;

        if(form.dataset.submiting === 'true') return;
        form.dataset.submiting = 'true';

        const nome = form.nome.value.trim();
        const email = form.email.value.trim();

        if(!nome || !email){
            alert('Por favor, preencha os campos');
            form.dataset.submiting = 'false';
            return;
        }

        const formData ={
            nome,
            email,
            cpf: form.cpf.value.trim(),
            cep: form.cep.value.trim(),
            endereco: form.endereco.value.trim(),
            cidade: form.cidade.value.trim(),
            estado: form.estado.value.trim(),
            pais: form.pais.value.trim(),
            telefone: form.telefone.value.trim(),
            idade: form.idade.value.trim(),
            genero: form.genero.value.trim(),
            disponibilidade: form.disponibilidade.value.trim(),
            areaInteresse: form.areaInteresse.value.trim(),
            experiencia: form.experiencia.value.trim(),
            motivacao: form.motivacao.value.trim(),
            dataCadastro: new Date().toLocaleString()

        };

        let voluntarios = JSON.parse(localStorage.getItem('voluntarios') || []);
        voluntarios.push(formData);
        localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

        const successMessage = document.getElementById('sucessMessage');
        if(successmessage){
            successMessage.classList.add('show');
            successMessage.scrollIntoView({behavior: "smooth", block:'center'});

        }

        setTimeout(() => sucessMessage.classList.remove('show'), 5000);

        setTimeout(() =>{
            form.reset();
            form.dataset.submiting ='false';
        }, 2000);

        exibirVoluntarios();


    };

    const form = document.getElementById('volunteerForm');
    if(form) form.addEventListener('submit', handleSubmit);

    const exibirVoluntarios = () => {
        const voluntarios= JSON.parse(localStorage.getItem('voluntarios') || '[]');

        const tabelaContainer = document.getElementById('tabelaVoluntarios');
        
        if(!tabelaContainer) return;

        if(tabelaContainer.length ===0){
            tabelaContainer.innerHTML ='<p>Ninguém Cadastrado!</p>'
            return;
        }

        let html = '<table border="1" cellpadding="5" cellspacing="0">';
        html += '<tr><th>Nome</th></tr><tr><th>Email</th></tr><tr><th>Telefone</th></tr><tr><th>Genero</th></tr><tr><th>Disponibilidade</th></tr>';

        voluntarios.forEach((v) => {
            html += `
        <tr>
            <td>${v.nome}</td>
            <td>${v.idade}</td>
            <td>${v.email}</td>
            <td>${v.cpf}</td>
            <td>${v.telefone}</td>
            <td>${v.CEP}</td>
            <td>${v.endereco}</td>
            <td>${v.cidade}</td>
            <td>${v.estado}</td>
            <td>${v.pais}</td>
            <td>${v.genero}</td>
            <td>${v.disponibilidade}</td>`
            
        });
    }





        
        });