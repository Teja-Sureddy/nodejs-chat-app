const toastElement = document.querySelector('#toast')
toastElement.style.display = 'none';

export default function toast(message) {
    toastElement.innerHTML = message.split(":").at(-1)
    toastElement.style.display = 'block';
    setTimeout(() => {
        toastElement.innerHTML = '';
        toastElement.style.display = 'none';
    }, 5000);
}