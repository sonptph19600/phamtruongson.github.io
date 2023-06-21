// var app = angular.module("homeApp", []);
window.homeController = function ($scope, $http, $location, $route) {
    //Calendar config
    var calendarEl = document.getElementById('calendar');
    window.calendar = new FullCalendar.Calendar(calendarEl, {

        themeSystem: 'bootstrap5',
        headerToolbar: {
            left: 'prev,next, today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        initialDate: new Date(),
        navLinks: true, // can click day/week names to navigate views
        eventClick: function (arg) {
            $http.get(homeAPI + "/detail-event/" + arg.event.id)
                .then(function (res) {
                    let result = res.data.data;
                    $scope.detailTitle = result.name
                    $scope.detailFormality = result.formality == 0 ? "Online" : "Offline";
                    $scope.detailTime = new Date(result.startTime).toLocaleDateString('vi-VN', { hour12: false });
                    $scope.detailOrganizer = result.organizerName;
                    $scope.eventIdDetail = result.id;
                }, function (err) {

                });
            $('#eventDetail').modal('show');
        },
        locale: 'vi',
        selectMirror: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: [
            {
                title: "Làm quen với Git và cách làm việc nhóm",
                start: "2023-04-25 16:00",
                end: "2023-04-25 18:00"
            },
            {
                title: "Review nhóm DATN trước khi bảo vệ",
                start: "2023-04-24 18:00",
                end: "2023-04-24 20:00"
            },
            {
                title: "Nâng cao bài toán nghiệp vụ dự án",
                start: "2023-04-22 21:00",
                end: "2023-04-22 23:00"
            },
            {
                title: "Coding convention",
                start: "2023-04-25 20:00",
                end: "2023-04-25 22:00"
            }
        ]
    });
    calendar.render();

    $http.get(homeAPI + "/get-all").then(function (res) {
        res.data.data.forEach(e => {
            window.calendar.addEvent({
                title: e.name,
                start: e.startTime,
                end: e.endTime,
                id: e.id
            });
        });

    }, function (err) {
        console.log(err);
    })
    
    $scope.openDetailPage = function () {
        var id = $scope.eventIdDetail;
        $location.path("/event-detail/" + id);
    }

    $scope.scrollToElement = function (id) {
        var element = document.getElementById(id);
        element.scrollIntoView({ behavior: "smooth" });
    };

    //UI Function
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }


    const on = (type, el, listener, all = false) => {
        let selectEl = $(el)
        if (selectEl.length) {
            if (all) {
                selectEl.each(function () {
                    $(this).on(type, listener)
                })
            } else {
                selectEl.on(type, listener)
            }
        }
    }

    const onscroll = (el, listener) => {
        $(el).scroll(listener);
    }

    let navbarlinks = $('.scrollto');
    navbarlinks.each(function () {
        $(this).on('click', function (event) {
            event.preventDefault();
        });
    });
    const navbarlinksActive = () => {
        let position = $(window).scrollTop() + 200;
        navbarlinks.each(function () {
            if (!this.hash) return;
            let section = $(this.hash);
            if (!section.length) return;
            if (position >= section.offset().top && position <= (section.offset().top + section.outerHeight())) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    };
    $(window).on('load', navbarlinksActive);
    $(document).on('scroll', navbarlinksActive);
    onscroll(document, navbarlinksActive);

    const scrollto = (el) => {
        let elementPos = $(el).offset().top
        $('html, body').animate({
            scrollTop: elementPos
        }, 800, 'easeInOutExpo')
    }

    let backtotop = $('.back-to-top');
    if (backtotop.length) {
        const toggleBacktotop = () => {
            if ($(window).scrollTop() > 100) {
                backtotop.addClass('active');
            } else {
                backtotop.removeClass('active');
            }
        }
        $(window).on('load', toggleBacktotop);
        $(document).on('scroll', toggleBacktotop);
    }

    $(document).on('click', '.mobile-nav-toggle', function () {
        $('body').toggleClass('mobile-nav-active');
        $(this).toggleClass('bi-list bi-x');
    });

    $(document).on('click', '.scrollto', function (e) {
        if ($(this.hash).length) {
            e.preventDefault();

            let body = $('body');
            if (body.hasClass('mobile-nav-active')) {
                body.removeClass('mobile-nav-active');
                let navbarToggle = $('.mobile-nav-toggle');
                navbarToggle.toggleClass('bi-list');
                navbarToggle.toggleClass('bi-x');
            }
            scrollto(this.hash);
        }
    });

    $(window).on('load', function () {
        let preloader = $('#preloader');
        if (preloader.length) {
            preloader.remove();
        }
    });

    const typed = $('.typed');
    if (typed.length) {
        let typed_strings = typed.attr('data-typed-items');
        typed_strings = typed_strings.split(',');
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000
        });
    }

    $(window).on('load', function () {
        AOS.init({
            duration: 2000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    });

    $(document).ready(function () {
        var offset = 300;
        var duration = 500;

        $(window).scroll(function () {
            if ($(this).scrollTop() > offset) {
                $('.back-to-top').fadeIn(duration);
            } else {
                $('.back-to-top').fadeOut(duration);
            }
        });

        $('.back-to-top').click(function (event) {
            event.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, duration);
            return false;
        })
    });

};