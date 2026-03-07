const form = document.getElementById("form")
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const dados = new FormData(form);
    fetch("/depoimentos", {
        method: "POST",
        body: dados
    })
    alert("Formulário enviado com sucesso!");
});