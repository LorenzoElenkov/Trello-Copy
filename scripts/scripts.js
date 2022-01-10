$(function () {


    const nav = $("nav");
    const nav_button_wrapper = $(".nav-button-wrapper");
    const projects_desktop = $("#projects-desktop");

    const add_project_buttons = $("#add-project");
    const projects_tab = $("#projects-tab");
    const project_buttons = $("#project-buttons");
    const single_project_container = $(".single-project-container");
    let projects_open = false;

    function projects_open_fn () {
        projects_open = true;
        projects_tab.animate(
            {
                opacity: 1,
                top: 20 + "vh"
            }, 300
        );
        $("#projects-tab div button").prop("disabled", false);
    }

    function projects_close_fn () {
        projects_open = false;
        projects_tab.animate(
            {
                opacity: 0,
                top: 25 + "vh"
            }, 200
        );
        $("#projects-tab div button").prop("disabled", true);
    }

    single_project_container.on("click", function () {
        $(this).prop("active", true);
    })

    projects_desktop.on("click", function () {
        if (!projects_open) {
            projects_open_fn();
        } else {
            projects_close_fn();
        }
    })

    project_buttons.css(
        {
            "top": -(add_project_buttons.height() * 2)
        }
    );

    const menuButton = $("#menu-button");
    const dropdownMenu = $("#dropdown-menu");
    const menuIcon = $("nav button:nth-child(1) img");
    let mouse_is_inside;
    let menuClicked = false;

    $(menuButton).on('click', function () {
        
        $(menuIcon).toggleClass("isClicked");
        $(dropdownMenu).slideDown(250);
        $(dropdownMenu).css(
            {
                "display": "grid",
                "grid-template-columns": "3vh 1fr",
                 
            }
        )
        let yPos = $("nav").outerHeight();
        $(dropdownMenu).css("top", `${yPos}px`);
        menuClicked = true;

    });

    $(dropdownMenu, menuButton).hover(function(){ 
        mouse_is_inside = true; 
    }, function(){ 
        mouse_is_inside = false;
    });

    $(document).mouseup(function(){ 
        if(!mouse_is_inside) {
            if (menuClicked) {
                $(menuIcon).toggleClass("isClicked");
                $(dropdownMenu).slideUp(250);
                menuClicked = false;
            }
        }
    });

    dropdownMenu.each(function () {
        $(this).on("click", function () {
            dropdownMenu.slideUp();
            menuIcon.toggleClass("isClicked");
            menuClicked = false;
        });
    });

    const new_project_name = $("#new-project-name");

    $("#btn-add-project").on("click", function () {
        if (new_project_name.val() == "") {
            new_project_name.val("New Project");
        };

        $(`<div class="single-project-container">${new_project_name.val()}</div>`).appendTo("#projects-container");
        create_project_menu.css(
            {
                "display": "none"
            }
        )
    });

    const create_project_menu = $("#create-project-menu");
    const create_project_close_desktop = $("#btn-close-create-proj");
    const new_project_lang = $("#new-project-lang");
    const new_project_lang_predict = $("#new-project-lang-predict-tab");
    const new_project_lang_container = $(".new-project-lang-container");

    $("#btn-create-project, #add-project").on("click", function () {
        new_project_name.val("");
        create_project_menu.css(
            {
                "display": "block"
            }
        );
        new_project_name.focus();
    });

    create_project_close_desktop.on("click", function () {
        create_project_menu.css(
            {
                "display": "none"
            }
        )
        new_project_lang.val("");
        new_project_lang_predict.empty();
    })

    let langArray = ["html", "css", "javascript", "jquery", "sass/scss", "less", "react.js", "angular", "vue.js", "mongodb", "localstorage", "postgresql", "other"];
    let selectChild = 0;
    let onlyOneChild = false;
    let selected;

    
    
    new_project_lang.on("keyup", function (e) {
        if (e.key !== "ArrowDown") {
            if (new_project_lang.val().length <= 20 && new_project_lang.val().length > 0) {
                if (selected == undefined || (selected != undefined && selected != new_project_lang_predict.children(":last-child").html()) || (selected != undefined && new_project_lang_predict.children(":first-child").hasClass("predict-tab-hover") && !onlyOneChild)) {
                
                
                    new_project_lang_predict.empty();  
                    for (i = 0; i < langArray.length; i++) {
                        if (langArray[i].includes(new_project_lang.val())) {
                            new_project_lang_predict.append(`<div>${langArray[i]}</div>`);
                        }
                    };
                }
            } 
        } else if (e.key !== "ArrowUp") { 
            if (new_project_lang.val().length <= 20 && new_project_lang.val().length > 0) {
                if (selected == undefined || (selected != undefined && selected != new_project_lang_predict.children(":last-child").html()) || (selected != undefined && new_project_lang_predict.children(":first-child").hasClass("predict-tab-hover") && !onlyOneChild)) {
                
                
                    new_project_lang_predict.empty();  
                    for (i = 0; i < langArray.length; i++) {
                        if (langArray[i].includes(new_project_lang.val())) {
                            new_project_lang_predict.append(`<div>${langArray[i]}</div>`);
                        }
                    };
                }
            } 
        } else if (new_project_lang.val().length == 0) {
            new_project_lang_predict.empty();
            selectChild = 0;
        } 
        
        if (e.key === "ArrowDown") {
            if (new_project_lang_predict.children().length > 0 && selectChild < new_project_lang_predict.children().length && new_project_lang.val().length <= 20) {
                ++selectChild;
                
                if (new_project_lang_predict.children(":first-child").hasClass(".predict-tab-hover")) {
                    onlyOneChild = true;
                    console.log("ONLY ONE CHILD TRUE");
                }

                if (selected != new_project_lang_predict.children(":last-child").html()) {
                    new_project_lang_predict.children(`:nth-child(${selectChild})`).addClass("predict-tab-hover");
                    new_project_lang_predict.children(`:nth-child(${selectChild-1})`).removeClass("predict-tab-hover");    
                }
                selected = new_project_lang_predict.children(`:nth-child(${selectChild})`).html();
    
            }
        } else if (e.key === "ArrowUp") {
            if (new_project_lang_predict.children().length > 0 && selectChild > 1 && new_project_lang.val().length <= 20) {
                --selectChild;
                if (selected != new_project_lang_predict.children(":first-child")) {
                    new_project_lang_predict.children(`:nth-child(${selectChild})`).addClass("predict-tab-hover");
                    new_project_lang_predict.children(`:nth-child(${selectChild+1})`).removeClass("predict-tab-hover");    
                }
                selected = new_project_lang_predict.children(`:nth-child(${selectChild})`).html();
            
            }
        }
        if (e.key === "Enter") {
            if (new_project_lang_predict.children().length > 0 && selected != undefined) {
                new_project_lang_predict.empty();
                selectChild = 0;
                new_project_lang.val("");
                if (new_project_lang_container.children().length == 0) {
                    new_project_lang_container.html("");
                }
                new_project_lang_container.append(`<div>${selected}</div>`);
                selected = undefined;
                firstMarked = false;
            }
        }
    });


    



});