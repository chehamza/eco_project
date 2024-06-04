const openMaterialModal = async (status,materialId = null)=>{
    let material;
    if(materialId){
        const response = await fetch('/material/'+materialId);
        material = await response.json()
        document.querySelector('#materialForm').action = "/updateMaterial/"+materialId
        document.querySelector('#nameContainer input').value = material.name
        document.querySelector('#priceContainer input').value = material.price
        document.querySelector('#descriptionContainer textarea').value = material.description
        document.querySelector('#qtyContainer input').value = material.quantity
        document.querySelector('#categoryContainer input').value = material.category
    }else{
        document.querySelector('#materialForm').action = "/addMaterial"
    }
    let option = document.querySelector("#option");
    if(!option){
        option = document.createElement("input")
        option.type = "hidden"
        option.name = "option"
        option.id = "option"
        document.querySelector('#materialForm').appendChild(option)
    }   
    document.querySelector("#materialModal").classList.add('open');
    
    if(status == "needed"){
        document.querySelector('#priceContainer').style.display = "none"
        document.querySelector('#descriptionContainer').style.display = "block"
        document.querySelector('#qtyContainer').style.display = "block"
        document.querySelector('#categoryContainer').style.display = "none"
        option.value = "needed"
    }else if (status =="wasted"){
        document.querySelector('#priceContainer').style.display = "block"
        document.querySelector('#descriptionContainer').style.display = "block"
        document.querySelector('#qtyContainer').style.display = "block"
        document.querySelector('#categoryContainer').style.display = "block"
        option.value = "wasted"
    }else{
        document.querySelector('#priceContainer').style.display = "none"
        document.querySelector('#descriptionContainer').style.display = "none"
        document.querySelector('#qtyContainer').style.display = "none"
        document.querySelector('#categoryContainer').style.display = "none"
        
        option.value = "material"
    }
}
let closeButton = document.querySelector('.remove');
closeButton?.addEventListener('click', function() {
    document.querySelector("#materialModal").classList.remove('open');
});
/****notification**/
const notification = document.querySelector('.notification');
setTimeout(() => {
    notification.classList.add('hidden'); 
  }, 2000);
  

/****Rview modal js*/
let openModalBtn = document.querySelector('#openModalBtn');
let modal = document.querySelector('#ReviewModal');
let closeModalBtn = modal.querySelector('.close');

function openReviewModal(compId) {
    modal.style.display = 'block';
    modal.querySelector('form').action = `/addReview/${compId}`  
}
function closeModal() {
    modal.style.display = 'none';
}
closeModalBtn?.addEventListener('click', closeModal);


/****Stars Rating js*****/
const stars = document.querySelectorAll(".star-rating .star");
const starsInput = document.getElementById("stars");
stars.forEach((star, index) => {
    star.addEventListener("click", function (e) {
        const rating = e.target.getAttribute('data-value')
        starsInput.value = rating;
        highlightStars(rating);
    });
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        console.log(rating, index);
        if (star.getAttribute('data-value') == rating) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }
    });
}




