const loginForm = document.querySelector('#loginForm');
const loginFormButton = document.querySelector('#loginFormButton');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    loginFormButton.disabled = true;
    const email = event.target.elements.email.value
    const password = event.target.elements.password.value
    console.log(email, password);

    const response = await fetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: new Headers({
            'Authorization': 'Bearer ',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    })
    const myJson = await response.json();
    if (myJson.error) {
        loginFormButton.disabled = false;
        return console.log(myJson.error);
    }

})