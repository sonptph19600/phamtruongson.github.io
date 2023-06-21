// var app = angular.module("detailApp", []);
window.detailController = function ($scope, $http, $routeParams) {
    const regEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    $scope.register = {
        emailRegister: "",
        classNameRegister: "",
        questionRegister: ""
    }

    $scope.newComment = {
        eventId: "",
        participantId: "",
        comment: ""
    }

    $scope.eventStatus = -1;

    var id = $routeParams.id;

    $http.get(detailAPI + "/get-detail/" + id).then(
        function (res) {
            $scope.eventStatus = res.data.data.status;
            $scope.eventDetail = res.data.data;
            var startTime = new Date(res.data.data.startTime)
            $scope.eventDetail.startTime = startTime.toLocaleTimeString() + ", Ngày: " + startTime.toLocaleDateString();
            $scope.eventDetail.endTime = new Date(res.data.data.endTime).toLocaleTimeString() + ", Ngày: " + new Date(res.data.data.endTime).toLocaleDateString();
            $http.get(detailAPI + "/get-detail-organizer/" + id).then(
                function (res) {
                    $scope.lstOrganizer = res.data.data;
                }, function (err) {
                    console.log(err);
                }
            )
            $http.get(detailAPI + "/get-detail-resource/" + id).then(
                function (res) {
                    $scope.lstResource = res.data.data;
                }, function (err) {
                    console.log(err);
                }
            )
        }, function (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không tìm thấy sự kiện. Vui lòng liên hệ nhà phát triển để được hỗ trợ',

            });
        }
    )

    $scope.eventRegister = function () {
        var email = $scope.register.emailRegister;
        var className = null;
        var question = $scope.register.questionRegister;
        var eventId = $scope.eventIdRegister;
        if (email.trim() == "") {
            $scope.errEmailRegister = "Vui lòng nhập email";
        }
        else if (!regEmail.test(email)) {
            $scope.errEmailRegister = "Sai định dạng Email";
        }
        else {
            $scope.errEmailRegister = "";
            $http.post(detailAPI + "/register-event", {
                email,
                className,
                question,
                eventId
            }).then(function (res) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Chúc mừng bạn đã đăng ký tham sự kiện thành công',
                });
            }, function (err) {
                console.log(err.data.statusCode);
            });
        }
    }

    $scope.postComment = function () {
        if ($scope.newComment.comment == "") {
            toastr["warning"]("Vui lòng nhập nội dung", "Warning")
        }
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        $http.post(`${homeAPI}/post-comment`, {
            email,
            className,
            question,
            eventId
        }).then(function (res) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Chúc mừng bạn đã đăng ký tham sự kiện thành công',
            });
        }, function (err) {
            console.log(err.data.statusCode);
        });
    }

    $scope.attendanceForm = {
        feedback: "",
        rate: -1
    }
    $scope.checkRatting = false;

    $scope.openModalAttendance = function () {
        $("#star-5").prop("checked", false);
        $("#star-4").prop("checked", false);
        $("#star-3").prop("checked", false);
        $("#star-2").prop("checked", false);
        $("#star-1").prop("checked", false);
        $('#attendanceModal').modal('show');
    }

    $scope.ratting = function (numberStar) {
        $scope.attendanceForm.rate = numberStar;
    }

    $scope.sendAttendance = function () {
        if ($scope.attendanceForm.rate == -1) {
            $scope.checkRatting = true;
        } else {
            $scope.checkRatting = false;
        }
    }

    //UI Function
    $scope.scrollToElement = function (id) {
        var element = document.getElementById(id);
        element.scrollIntoView({ behavior: "smooth" });
    };

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

