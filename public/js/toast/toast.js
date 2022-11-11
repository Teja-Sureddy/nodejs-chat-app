const toastElement = document.querySelector('#toast')

export default function toast(message) {
    toastElement.innerHTML = message.split(":").at(-1)
    setTimeout(() => {
        toastElement.innerHTML = ''
    }, 3000);
}