$(function () {
    
    const nav = $("nav");
    const nav_button_wrapper = $(".nav-button-wrapper");
    const projects_desktop = $("#projects-desktop");

    const add_project_buttons = $("#add-project");
    const projects_tab = $("#projects-tab");
    const project_buttons = $("#project-buttons");
    const single_project_container = $(".single-project-container");
    let projects_open = false;
    let projectSelected;
    let firstContainer = undefined;

    const menuButton = $("#menu-button");
    const dropdownMenu = $("#dropdown-menu");
    const menuIcon = $("nav button:nth-child(1) img");
    let mouse_is_inside;
    let menuClicked = false;
    
    const new_project_name = $("#new-project-name");
    const new_project_startdate = $("#new-project-startdate");
    const new_project_description = $("#new-project-description");
    let nextProjNum = 1;

    const delete_confirm_proj = $("#delete-confirm");
    const create_project_menu = $("#create-project-menu");
    const create_project_close_desktop = $("#btn-close-create-proj");
    const new_project_lang = $("#new-project-lang");
    const new_project_lang_predict = $("#new-project-lang-predict-tab");
    const new_project_lang_container = $(".new-project-lang-container");
    const editDeleteProjectButtons = $("#project-buttons div:nth-child(2) button")
    let langArray = ["html", "css", "javascript", "jquery", "sass/scss", "less", "react.js", "angular", "vue.js", "mongodb", "localstorage", "postgresql", "other"];
    let selectChild = 0;
    let onlyOneChild = false;
    let selected;
    let languagesSelected = "";
    let myProjects_obj = {};
    let all_project_containers_array;
    
    // localStorage ######## GETTING PROJECTS FOR PROJECTS WINDOW
    const fetchProjects = JSON.parse(window.localStorage.getItem("Projects"));
    (function () {
        for (let id in fetchProjects) {
            $(`<div class="single-project-container">${fetchProjects[id]["title"]}</div>`).appendTo("#projects-container");
        }
        if (fetchProjects == null) {
            return;
        }
        nextProjNum = Number(Object.keys(fetchProjects)[Object.keys(fetchProjects).length-1]) + 1;
        myProjects_obj = fetchProjects;
    })();

    // only for testing purposes of localStorage. MUST BE DELETED AFTER THAT
    $(window).on("keyup", function (e) {
        if (e.key == "p") {
            console.log("Cleared");
            window.localStorage.clear();
        }
    })
    // end

    function projects_open_fn () {
        projects_open = true;
        projects_tab.animate(
            {
                opacity: 1,
                top: 20 + "vh"
            }, 300
        );
        $("#projects-container, #project-buttons button").css(
            {
                "visibility": "visible"
            }
        )
    }

    function projects_close_fn () {
        projects_open = false;
        projects_tab.animate(
            {
                opacity: 0,
                top: 25 + "vh"
            }, 200
        );
        $("#projects-container, #project-buttons button").css(
            {
                "visibility": "hidden"
            }
        )
    }

    function addEventListenerToFetchedProjects () {
        let all_project_containers = document.querySelectorAll(".single-project-container");
        all_project_containers_array = Array.prototype.slice.call(all_project_containers);
        for (let i = 0; i < all_project_containers_array.length; i++) {
            const thisContainer = all_project_containers_array[i];
            thisContainer.addEventListener("click", function () {
                for (let j = 0; j < all_project_containers_array.length; j++) {
                    $(all_project_containers_array[j]).removeClass("selected2");
                    $(all_project_containers_array[j]).removeClass("selected");
                }
                if (projectSelected != undefined) {
                    firstContainer = projectSelected;
                }
                if ($(this).is(":nth-child(2n)")) {
                    $(this).addClass("selected2");
                } else {
                    $(this).addClass("selected");
                };
                projectSelected = $(this);
                editDeleteProjectButtons.css(
                    {
                        "opacity": "1"
                    }
                )
                if (firstContainer != undefined && firstContainer.text() == projectSelected.text()) {
                    projects_close_fn();
                    for (let j = 0; j < all_project_containers_array.length; j++) {
                        $(all_project_containers_array[j]).removeClass("selected2");
                        $(all_project_containers_array[j]).removeClass("selected");
                    }
                    $("#project-buttons div:nth-child(2) button").css(
                        {
                            "opacity": "0.2"
                        }
                    )
                    projectSelected = undefined;
                    firstContainer = undefined;
                }
            });
        };
    };

    addEventListenerToFetchedProjects();

    projects_desktop.on("click", function () {
        if (!projects_open) {
            projects_open_fn();
        } else {
            projects_close_fn();
        }
    });

    project_buttons.css(
        {
            "top": -(add_project_buttons.height() * 2)
        }
    );

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

    $("#btn-add-project").on("click", function () {
        if (new_project_name.val() == "") {
            new_project_name.val("New Project");
        };
        const newProjectContainer = $(`<div class="single-project-container">${new_project_name.val()}</div>`);
        const thisProjectContainer = newProjectContainer.appendTo("#projects-container");
        all_project_containers_array.push(thisProjectContainer);
        thisProjectContainer.on("click", function () {
            for (let j = 0; j < all_project_containers_array.length; j++) {
                $(all_project_containers_array[j]).removeClass("selected2");
                $(all_project_containers_array[j]).removeClass("selected");
            }
            if (projectSelected != undefined) {
                firstContainer = projectSelected;
            }
            if ($(this).is(":nth-child(2n)")) {
                $(this).addClass("selected2");
            } else {
                $(this).addClass("selected");
            };
            projectSelected = $(this);
            editDeleteProjectButtons.css(
                {
                    "opacity": "1"
                }
            )
            if (firstContainer != undefined && firstContainer.text() == projectSelected.text()) {
                projects_close_fn();
                for (let j = 0; j < all_project_containers_array.length; j++) {
                    $(all_project_containers_array[j]).removeClass("selected2");
                    $(all_project_containers_array[j]).removeClass("selected");
                }
                $("#project-buttons div:nth-child(2) button").css(
                    {
                        "opacity": "0.2"
                    }
                )
                projectSelected = undefined;
                firstContainer = undefined;
            }
        });
        create_project_menu.css(
            {
                "display": "none"
            }
        )
        let newDate;
        if (new_project_startdate.val() == "") {
            let nowDate = new Date();
            newDate = (nowDate.getMonth() + 1 < 10) ? `${nowDate.getFullYear()}-0${nowDate.getMonth() + 1}-${nowDate.getDate()}` : `${nowDate.getFullYear()}-${nowDate.getMonth + 1}-${nowDate.getDate()}`
        } else {
            newDate = new_project_startdate.val();
        }
        myProjects_obj[nextProjNum] = {
            "title": new_project_name.val(),
            "description": new_project_description.val(),
            "startDate": newDate,
            "languages": languagesSelected
        };
        window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
        new_project_lang_container.empty();
        new_project_description.val("");
        new_project_startdate.val("");
        languagesSelected = "";
        nextProjNum++;
    });

    $("#btn-create-project, #add-project").on("click", function () {
        new_project_name.val("");
        create_project_menu.css(
            {
                "display": "block"
            }
        );
        if (window.innerWidth > 600) {
            new_project_name.focus();
        }
    });

    create_project_close_desktop.on("click", function () {
        create_project_menu.css(
            {
                "display": "none"
            }
        )
        new_project_lang.val("");
        new_project_lang_predict.empty();
        new_project_lang_container.empty();
        new_project_description.val("");
        new_project_startdate.val("");
        languagesSelected = "";

    });

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
        } 
        else if (e.key !== "ArrowUp") { 
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
        }
        
        if (new_project_lang.val().length == 0) {
            new_project_lang_predict.empty();
            selectChild = 0;
        } 
        
        if (e.key === "ArrowDown") {
            if (new_project_lang_predict.children().length > 0 && selectChild < new_project_lang_predict.children().length && new_project_lang.val().length <= 20) {
                ++selectChild;
                if (new_project_lang_predict.children(":first-child").hasClass(".predict-tab-hover")) {
                    onlyOneChild = true;
                }
                if (selected != new_project_lang_predict.children(":last-child").html()) {
                    new_project_lang_predict.children(`:nth-child(${selectChild})`).addClass("predict-tab-hover");
                    new_project_lang_predict.children(`:nth-child(${selectChild-1})`).removeClass("predict-tab-hover");    
                }
                selected = new_project_lang_predict.children(`:nth-child(${selectChild})`).html();
            }
        } 
        else if (e.key === "ArrowUp") {
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
                if (languagesSelected == "") {
                    languagesSelected = selected;
                } else {
                    languagesSelected += "," + selected;
                }
                selected = undefined;
                firstMarked = false;
            }
        }
    });

    editDeleteProjectButtons.on("click", function () {
        if ($(this).text() == "Delete" && projectSelected != undefined) {
            delete_confirm_proj.css(
                {
                    display: "flex"
                }
            )
        } else {
            console.log("Edit clicked");
        }
    })

    $("#deleteConfirm").on("click", function () {
        for (let key in myProjects_obj) {
            if (myProjects_obj[key]["title"] == projectSelected.text()) {
                delete myProjects_obj[key];
                window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
                projectSelected.remove();
                projectSelected = undefined;
                delete_confirm_proj.css(
                    {
                      display: "none"
                    }
                )
                return;
            }
        }
    })

});