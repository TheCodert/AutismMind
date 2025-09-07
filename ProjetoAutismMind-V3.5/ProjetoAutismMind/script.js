document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.querySelector(".main");
    const btnPlan = document.getElementById("bntPlan");
    const btnFav = document.getElementById("bntFav");
    const btnGlobal = document.getElementById("bntGlobal");
    const btnProfile = document.getElementById("bntProfile");
    const btnTrash = document.getElementById("bntTrash");

    const bntLogout = document.getElementById("bntLogout");
    // Recupere o nome de usuário do LocalStorage

    var username = localStorage.getItem("username");
    var novoUsername = username.replace(/ /g, "_");
    bntLogout.addEventListener("click", function () {
        window.location.href = "login.html";
    });

    btnPlan.addEventListener("click", function () {
        mainContent.innerHTML = `
        <h1>Planos</h1>
        <div class="container">
            <div class="laranja button" id="dxlaranja"><p>+</p></div>
            <div class="azul" id="bxblue"></div>
            <div class="verde" id="bxblue"></div>
            <h1 class="recentplans">Planos Recentes</h1> 
            <h2 class="warning">Você não tem planos recentes.</h2>
        </div>
    `;

        // Adicione um ouvinte de evento ao elemento com a ID 'dxlaranja' (caixa laranja) para realizar a ação desejada
        const laranjaButton = document.getElementById("dxlaranja");

        laranjaButton.addEventListener("click", function () {
            window.location.href = "creator.html";
        });
    });

    

    btnFav.addEventListener("click", function () {
        mainContent.innerHTML = `
            <h1>Favoritos</h1>
            <p>Você não possui favoritos.</p>
        `;
    });

    btnGlobal.addEventListener("click", function () {
        mainContent.innerHTML = `
            <h1>Global</h1>
            <p>Conteúdo global.</p>
        `;
    });

    btnProfile.addEventListener("click", function () {
        mainContent.innerHTML = `
        
            <h1>Olá @${novoUsername} </h1>
            <p>Conteúdo da sua conta.</p>
            <div class="box" id="profilebox">
            <div class="img-overlay">
            <img class="profilepic" src="img/profile.jpg" id="pfp">
            <div class="desc"><h1>${username}</h1></div>
            <div class="autor"><h1>@${novoUsername}<br>-GameDesign</h1></div>
            </div>
            </div>
            <h1>
            Estatísticas
            </h1>
            <p>
            20/40 Atividades feitas
            <br>
            Tipo de conta: Desenvolvedor
            <p>
        `;
        let profilePic = document.getElementById("pfp")  
        let inputFile = document.getElementById("pfpfile")     

        function checkImageAspectRatio(input) {
            const file = input.files[0];
            
            if (file) {
                const img = new Image();
                
                img.onload = function () {
                    const width = this.width;
                    const height = this.height;
        
                    // Verifica se a proporção é 1:1 (quadrada)
                    if (width === height) {
                        inputFile.onchange = function () {
                            profilePic.src  = URL.createObjectURL(inputFile.files[0])
                        }
                    } else {
                        alert("A imagem deve ter proporção 1:1 (quadrada).");
                        input.value = ""; // Limpa o input para que o usuário possa selecionar outra imagem
                    }
                };
                
                img.src = URL.createObjectURL(file);
            }
        }
        
    });

    btnTrash.addEventListener("click", function () {
        mainContent.innerHTML = `
            <h1>Lixeira</h1>
            <p>Sua lixeira está vazia!</p>
        `;
    });
    
       // Adicione um ouvinte de evento ao botão de classe "laranja" para realizar a ação desejada
// ...

// Adicione um ouvinte de evento ao elemento com a ID 'dxlaranja' (caixa laranja) para realizar a ação desejada
// Adicione um ouvinte de evento ao elemento com a classe "laranja" para realizar a ação desejada

// ...

});
