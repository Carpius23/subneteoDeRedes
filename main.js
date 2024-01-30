const openModalDuda = document.querySelector('.modalButton');
const modalInfo = document.querySelector('.modalInfo');
const closeModalInfo = document.querySelector('.modalCerrar');

openModalDuda.addEventListener('click', (e)=>{
    e.preventDefault();
    modalInfo.classList.add('openModalInfo');
});

closeModalInfo.addEventListener('click', (e)=>{
    e.preventDefault();
    modalInfo.classList.remove('openModalInfo');
});