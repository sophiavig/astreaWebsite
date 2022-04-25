/*section for scripts*/
let isAccordionOpen = false;
function activeElement(idActive){
    var sezioni = document.getElementsByClassName('section');
    const attiva = document.getElementById(idActive);
    for(var i = 0; i < sezioni.length; i++){
        sezioni.classList.remove("active");
    }
    attiva.classList.add("active");
}
function runOnScroll() {
    let head = document.getElementsByTagName("header")[0];
    if (window.scrollY >= 100) {
        head.style.backgroundColor = "#0E0C1C";
    } else {
        head.style.backgroundColor = "transparent";
    }
}
window.addEventListener("scroll", runOnScroll);

function closeMenu() {
    let menuEl = document.getElementsByClassName("show")[0];
    menuEl.classList.remove("show");
}
function accordionOpen() {
    let accordionEl = document.getElementById("footer-description");
    let icon = document.getElementsByClassName("icon-chev")[0];
    if(window.screen.width <= 992) {
        isAccordionOpen = !isAccordionOpen;
        if(isAccordionOpen){
            accordionEl.style.display = "block";
            icon.classList.remove("bi-chevron-down");
            icon.classList.add("bi-chevron-up");
        } else {
            accordionEl.style.display = "none";
            icon.classList.remove("bi-chevron-up");
            icon.classList.add("bi-chevron-down");
        }
    } else {
        accordionEl.style.display = "block";
    }

}

/** fixed navbar on scroll for daily event */
$(document).ready(function() {
    const page = window.location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    if(page !== '4-free_page.html') return
    window.onscroll = function() {
        if (window.pageYOffset >= 548 - 66) {
            $('.nav-wrapper-astreafest').addClass('fixed').children('.nav-pills').addClass('container')
            $('#calendar').hide()
        } else {
            $('.nav-wrapper-astreafest').removeClass('fixed container').children('.nav-pills').removeClass('container')
            $('#calendar').show()
        }
    }

    $(document).on('click', 'a[href^="#"]', function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 120
        }, 500);
    });
})

/** fix arrow position in carousel */
let carouselControlHeight = $('#carouselSliderOrigins .carousel-item.active img').height()
$('#carouselSliderOrigins .carousel-control-next, #carouselSliderOrigins .carousel-control-prev').css({'maxHeight': carouselControlHeight})

window.addEventListener('resize', function() {
    carouselControlHeight = $('#carouselSliderOrigins .carousel-item.active img').height()
$('#carouselSliderOrigins .carousel-control-next, #carouselSliderOrigins .carousel-control-prev').css({'maxHeight': carouselControlHeight})
})

$("#form-newsletter").submit(function(e){
    if(e.target.checkValidity()){
        $('#modalNewsletter').modal('show');
        e.preventDefault();
    }
    return false;
});

function openSuccessModal(e){
    if(e.target.checkValidity()){
        $('#modalSuccess').modal('show');
    }
    return false;
}

$("#form-booking").submit(openSuccessModal);
$("#form-joinCommunity").submit(openSuccessModal);
