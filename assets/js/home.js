// (function() {
//   "use strict";

//   /**
//    * Easy selector helper function
//    */
//   const select = (el, all = false) => {
//     el = el.trim()
//     if (all) {
//       return [...document.querySelectorAll(el)]
//     } else {
//       return document.querySelector(el)
//     }
//   }

//   /**
//    * Easy event listener function
//    */
//   const on = (type, el, listener, all = false) => {
//     let selectEl = select(el, all)
//     if (selectEl) {
//       if (all) {
//         selectEl.forEach(e => e.addEventListener(type, listener))
//       } else {
//         selectEl.addEventListener(type, listener)
//       }
//     }
//   }

//   /**
//    * Easy on scroll event listener 
//    */
//   const onscroll = (el, listener) => {
//     el.addEventListener('scroll', listener)
//   }

//   /**
//    * Navbar links active state on scroll
//    */
//   let navbarlinks = select('#navbar .scrollto', true)
//   const navbarlinksActive = () => {
//     let position = window.scrollY + 200
//     navbarlinks.forEach(navbarlink => {
//       if (!navbarlink.hash) return
//       let section = select(navbarlink.hash)
//       if (!section) return
//       if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
//         navbarlink.classList.add('active')
//       } else {
//         navbarlink.classList.remove('active')
//       }
//     })
//   }
//   window.addEventListener('load', navbarlinksActive)
//   onscroll(document, navbarlinksActive)

//   /**
//    * Scrolls to an element with header offset
//    */
//   const scrollto = (el) => {
//     let elementPos = select(el).offsetTop
//     window.scrollTo({
//       top: elementPos,
//       behavior: 'smooth'
//     })
//   }

//   /**
//    * Back to top button
//    */
//   let backtotop = select('.back-to-top')
//   if (backtotop) {
//     const toggleBacktotop = () => {
//       if (window.scrollY > 100) {
//         backtotop.classList.add('active')
//       } else {
//         backtotop.classList.remove('active')
//       }
//     }
//     window.addEventListener('load', toggleBacktotop)
//     onscroll(document, toggleBacktotop)
//   }

//   /**
//    * Mobile nav toggle
//    */
//   on('click', '.mobile-nav-toggle', function(e) {
//     select('body').classList.toggle('mobile-nav-active')
//     this.classList.toggle('bi-list')
//     this.classList.toggle('bi-x')
//   })

//   /**
//    * Scrool with ofset on links with a class name .scrollto
//    */
//   on('click', '.scrollto', function(e) {
//     if (select(this.hash)) {
//       e.preventDefault()

//       let body = select('body')
//       if (body.classList.contains('mobile-nav-active')) {
//         body.classList.remove('mobile-nav-active')
//         let navbarToggle = select('.mobile-nav-toggle')
//         navbarToggle.classList.toggle('bi-list')
//         navbarToggle.classList.toggle('bi-x')
//       }
//       scrollto(this.hash)
//     }
//   }, true)

//   /**
//    * Scroll with ofset on page load with hash links in the url
//    */
//   window.addEventListener('load', () => {
//     if (window.location.hash) {
//       if (select(window.location.hash)) {
//         scrollto(window.location.hash)
//       }
//     }
//   });

//   /**
//    * Preloader
//    */
//   let preloader = select('#preloader');
//   if (preloader) {
//     window.addEventListener('load', () => {
//       preloader.remove()
//     });
//   }

//   /**
//    * Hero type effect
//    */
//   const typed = select('.typed')
//   if (typed) {
//     let typed_strings = typed.getAttribute('data-typed-items')
//     typed_strings = typed_strings.split(',')
//     new Typed('.typed', {
//       strings: typed_strings,
//       loop: true,
//       typeSpeed: 100,
//       backSpeed: 50,
//       backDelay: 2000
//     });
//   }

//   /**
//    * Animation on scroll
//    */
//   window.addEventListener('load', () => {
//     AOS.init({
//       duration: 2000,
//       easing: 'ease-in-out',
//       once: true,
//       mirror: false
//     })
//   });

// })()
$(document).ready(function() {
  // Easy selector helper function
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...$(el)]
    } else {
      return $(el)
    }
  }

  // Easy event listener function
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.each(function() {
          $(this).on(type, listener)
        })
      } else {
        selectEl.on(type, listener)
      }
    }
  }

  // Easy on scroll event listener 
  const onscroll = (el, listener) => {
    $(el).scroll(listener)
  }

  // Navbar links active state on scroll
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = $(window).scrollTop() + 200
    navbarlinks.each(function() {
      if (!this.hash) return
      let section = select(this.hash)
      if (!section) return
      if (position >= section.offset().top && position <= (section.offset().top + section.outerHeight())) {
        $(this).addClass('active')
      } else {
        $(this).removeClass('active')
      }
    })
  }
  $(window).on('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  // Scrolls to an element with header offset
  const scrollto = (el) => {
    let elementPos = select(el).offset().top
    $('html, body').animate({
      scrollTop: elementPos
    }, 1000, 'easeInOutExpo')
  }

  // Back to top button
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if ($(window).scrollTop() > 100) {
        backtotop.addClass('active')
      } else {
        backtotop.removeClass('active')
      }
    }
    $(window).on('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  // Mobile nav toggle
  on('click', '.mobile-nav-toggle', function(e) {
    $('body').toggleClass('mobile-nav-active')
    $(this).toggleClass('bi-list')
    $(this).toggleClass('bi-x')
  })

  // Scroll with ofset on links with a class name .scrollto
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.hasClass('mobile-nav-active')) {
        body.removeClass('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.toggleClass('bi-list')
        navbarToggle.toggleClass('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  // Scroll with ofset on page load with hash links in the url
  $(window).on('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  // Preloader
  let preloader = select('#preloader');
  if (preloader);
});