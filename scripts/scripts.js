$(function () {
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

    const my_projects = $("#my-projects");
    const right_arrow_projects = $("#right-indicator img");
    const right_arrow_projects_container = $("#right-indicator");
    const left_arrow_projects = $("#left-indicator img");
    const left_arrow_projects_container = $("#left-indicator");
    const my_projects_height = $(my_projects).outerHeight();

    $(right_arrow_projects_container).css(
        {
            "height": my_projects_height,
            "width": my_projects_height
            
        }
    );

    const my_projects_label = $("#my-projects-label");
    const my_projects_label_width = $(my_projects_label).outerWidth();

    $(left_arrow_projects_container).css(
        {
            "height": my_projects_height,
            "width": my_projects_height,
            "left": my_projects_label_width + 6
        }
    );

    const project_tabs = $("#project-tabs");
    const overflowing = project_tabs[0].scrollWidth - 1 > $(project_tabs).width();
    if (overflowing) {
        right_arrow_projects_container.css({
            "opacity": "1"
        });
    } else {
        right_arrow_projects_container.css({
            "opacity": "0"
        });
        
    }

    $(project_tabs).css(
        {
            "margin-left": $(left_arrow_projects).outerWidth() + 12,
            "margin-right": $(right_arrow_projects).outerWidth() + 12
        }
    );
    

    let hasReachedEnd;
    let hasReachedStart = true;


    project_tabs.scroll(function () {
        let reachedEnd = project_tabs[0].scrollWidth - project_tabs[0].scrollLeft === project_tabs[0].clientWidth;
        if (reachedEnd) {
            right_arrow_projects_container.css({
                "opacity": "0"
            });
            hasReachedEnd = true;
            
        }

        let notAtEnd = project_tabs[0].scrollWidth - project_tabs[0].scrollLeft > project_tabs[0].clientWidth;
        if (notAtEnd && hasReachedEnd) {
            hasReachedEnd = false;
            right_arrow_projects_container.css({
                "opacity": "1"
            });
        }

        let reachedStart = project_tabs[0].scrollLeft === 0;
        if (reachedStart) {
            left_arrow_projects_container.css({"visibility": "hidden"}
            );
            hasReachedStart = true;
        }

        let notAtStart = project_tabs[0].scrollLeft > 0;
        if (notAtStart && hasReachedStart) {
            left_arrow_projects_container.css({"visibility": "visible"}
            );
            hasReachedStart = false;
        }
    });

    

    right_arrow_projects_container.on("click", function () {
        $(project_tabs).animate({
            scrollLeft: '+=135px'
        });
    });

    left_arrow_projects_container.on("click", function () {
        $(project_tabs).animate({
            scrollLeft: '-=135px'
        });
    });

    const new_project_name = $("#new-project-name");

    $("#btn-add-project").on("click", function () {
        if (new_project_name.val() == "") {
            new_project_name.val("New Project");
        };

        $(`<div>${new_project_name.val()}</div>`).insertBefore("#my-projects #project-tabs #left-indicator")
        if($(project_tabs)[0].scrollWidth > $(project_tabs)[0].clientWidth) {
            right_arrow_projects_container.css(
                {
                    "opacity": "1"
                }
            )
        }
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

    $("#btn-create-project").on("click", function () {
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