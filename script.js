const menu = document.getElementById("menu")
const dateSpan = document.getElementById("date-span")

const cartBtn = document.getElementById("cart-btn")
const cartCounter = document.getElementById("cart-count")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const closeModalBtn = document.getElementById("close-modal-btn")
const confirmBtn = document.getElementById("confirm-modal-btn")

const addressModal = document.getElementById("address-modal")
const inputCep = document.getElementById("input-cep")
const inputStreet = document.getElementById("input-street")
const inputNumber = document.getElementById("input-number")
const inputComplement = document.getElementById("input-complement")
const inputNeighborhood = document.getElementById("input-neighborhood")
const inputCity = document.getElementById("input-city")
const inputState = document.getElementById("input-state")
const returnBtn = document.getElementById("return-modal-btn")
const checkoutBtn = document.getElementById("checkout-btn")

const addressWarn = document.getElementById("address-warn")

let cart = []
let cartTotalValue = 0; // Variável global para armazenar o total

// Abrir o modal carrinho // 
cartBtn.addEventListener("click", function(){
    updateCartModel();
    cartModal.style.display = "flex"
})

// Fechar o modal carrinho quando clicar no botão "Fechar" //
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Fechar o modal carrinho quando clicar fora //
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal)
    {cartModal.style.display = "none"}
})

// Abrir modal endereço ao clicar em confirmar //
confirmBtn.addEventListener("click", function(){
    // Caso não haja itens no carrinho, não há como avançar //
    if(cart.length === 0){
        Toastify({
            text: "Carrinho vazio!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
                background: "#EF4444",
            },
        }).showToast();
        return;
    }

    cartModal.style.display = "none"
    addressModal.style.display = "flex"
})

// Voltar para o carrinho quando clicar no botão "Voltar" //
returnBtn.addEventListener("click", function(){
    addressModal.style.display = "none"
    cartModal.style.display = "flex"
})

// Fechar o modal endereço quando clicar fora //
addressModal.addEventListener("click", function(event){
    if(event.target === addressModal)
    {addressModal.style.display = "none"}
})

// Buscar endereço via CEP //
inputCep.addEventListener("blur", () => {
    const cep = inputCep.value;

    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
            if (!data.erro) {
                inputStreet.value = data.logradouro;
                inputNeighborhood.value = data.bairro;
                inputCity.value = data.localidade;
                inputState.value = data.uf;
            }
            else {
                Toastify({
                    text: "CEP não encontrado!",
                    duration: 5000,
                    close: true,
                    gravity: "top", 
                    position: "center", 
                    stopOnFocus: true, 
                    style: {
                        background: "#EF4444",
                    },
                }).showToast();
            }
            })
            .catch(() => Toastify({
                text: "Erro ao buscar CEP. Verifique sua conexão!",
                duration: 5000,
                close: true,
                gravity: "top", 
                position: "center", 
                stopOnFocus: true, 
                style: {
                    background: "#EF4444",
                },
            }).showToast());
        } 
        else {
            Toastify({
                text: "CEP inválido! O CEP deve conter 8 dígitos!",
                duration: 5000,
                close: true,
                gravity: "top", 
                position: "center", 
                stopOnFocus: true, 
                style: {
                    background: "#EF4444",
                },
            }).showToast();
        }
});

// Permitir apenas números e limitar a 8 caracteres //
inputCep.addEventListener("input", () => {
    inputCep.value = inputCep.value.replace(/\D/g, "").slice(0, 8);
});


// Pegando o nome e valor do item clicado //    
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price")).toFixed(2)
        addToCart(name, price)}
    })

// Função para adicionar no carrinho //
function addToCart(name, price){
    // Verificando se o item clicado ja está no carrinho //
    const existingItem = cart.find(item => item.name === name)

    // Se o item já existe, aumenta 1 na quantidade //
    if (existingItem){
        existingItem.quantity += 1;
        return;}
    else{
    // Adiciona ao array Cart, que é o carrinho //
        cart.push({
            name, 
            price, 
            quantity: 1})}

    updateCartModel()
}


// Atualiza o carrinho
function updateCartModel() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p class="mt-2">Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price}</p>
                </div>
                
                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;

    // Atualiza a variável global com o valor total
    cartTotalValue = total;
}


// Função para remover item do carrinho //
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModel();
            return
        }

        cart.splice(index, 1);
        updateCartModel();
    }
}

// Ao clicar no botão remover, aciona a função de remover item //
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

// Função para verificar se o local está aberto //
function checkOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 0 && hora < 23;
}

const isOpen = checkOpen();

// Se estiver aberto o DateSpan fica verde, se não, fica vermelho //
if(isOpen){
    dateSpan.classList.remove("bg-red-500")
    dateSpan.classList.add("bg-green-500")
}
else{
    dateSpan.classList.remove("bg-green-500")
    dateSpan.classList.add("bg-red-500")
}


// Função de validação de campos obrigatórios
function validateAddressFields() {
    let isValid = true;

    // Função auxiliar para verificar e destacar campos vazios
    function checkField(field) {
        if (field.value.trim() === "") {
            field.classList.add("border-red-500"); // Adicionar borda vermelha para destacar erro
            const warning = field.nextElementSibling;
            if (warning && warning.classList.contains("text-red-500")) {
                warning.classList.remove("hidden"); // Mostrar aviso de campo obrigatório
            }
            isValid = false;
        } else {
            field.classList.remove("border-red-500");
            const warning = field.nextElementSibling;
            if (warning && warning.classList.contains("text-red-500")) {
                warning.classList.add("hidden"); // Ocultar aviso se o campo estiver preenchido
            }
        }
    }

    // Validar cada campo obrigatório
    checkField(inputCep);
    checkField(inputStreet);
    checkField(inputNumber);
    checkField(inputNeighborhood);
    checkField(inputCity);
    checkField(inputState);

    return isValid;
}


// Função de finalizar o pedido
checkoutBtn.addEventListener("click", function() {
    // Caso o pedido for feito fora do horário de funcionamento, exibe a mensagem
    if (!isOpen) {
        Toastify({
            text: "Ops, no momento estamos fechados!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
                background: "#EF4444",
            },
        }).showToast();
        return;
    }

    // Validar campos de endereço
    if (!validateAddressFields()) {
        Toastify({
            text: "Por favor, preencha todos os campos obrigatórios!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#EF4444",
            },
        }).showToast();
        return;
    }

    // Montar mensagem de pedido
    const cartItems = cart.map((item) => {
        return `\n*${item.name}*\n*Quantidade:* ${item.quantity}\n*Preço:* R$${item.price}\n-------------------------------------------\n`;
    }).join("");

    // Adiciona o valor total no final da mensagem
    const totalMessage = `*VALOR TOTAL:* R$ ${cartTotalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;

    const addressMessage = `*ENDEREÇO DE ENTREGA:* ${inputStreet.value}, ${inputNumber.value}, ${inputComplement.value || "N/A"} - ${inputNeighborhood.value}, ${inputCity.value}-${inputState.value}, ${inputCep.value}`;
    
    const message = encodeURIComponent(`\n${cartItems}\n${totalMessage}\n${addressMessage}`);
    const phone = "+5585999062339";

    // Enviar mensagem pelo WhatsApp
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpar carrinho e atualizar
    cart = [];
    updateCartModel();
});

