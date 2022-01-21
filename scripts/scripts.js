$(function () {
    
    const nav = $("nav");
    const nav_button_wrapper = $(".nav-button-wrapper");
    const projects_desktop = $("#projects-desktop");
    const project_title = $("#current-project-title");

    const add_project_buttons = $("#add-project");
    const projects_tab = $("#projects-tab");
    const project_buttons = $("#project-buttons");
    const single_project_container = $(".single-project-container");
    let projects_open = false;
    let projectSelected;
    let firstContainer = undefined;

    let subtask_panel = $("#subtask-panel");
    let subtask_panel_init_height = 0;

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
    let langArray = ["html", "css", "javascript", "jquery", "sass", "less", "react.js", "angular", "vue.js", "mongodb", "localstorage", "postgresql", "other"];
    let selectChild = 0;
    let onlyOneChild = false;
    let selected;
    let languagesSelected = "";
    let myProjects_obj = {};
    let all_project_containers_array;

    let addTabContainer = $("#to-do-add");
    let firstTabContent = $("#to-do");
    let tabTitle = $(".tab-title");
    let allTabContents = document.querySelectorAll(".tab-content");
    let initialHeight = 0;
    
    
    let projectSelectedID = 0;
    let myTasks_obj = {};
    let mySubTasks_obj = {};
    let nextTaskNum = 0;
    
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
                opacity: 1
            }, 300
        );
        $("#projects-container, #projects-tab").css(
            {
                "display": "grid"
            }
        ),
        $("#project-buttons button").css(
            {
                "display": "flex"
            }
        )
        $("#current-project-window, #delete-confirm, #create-task-menu").css(
            {
                "display": "none",
                "opacity": 0
            }
        )
        projectSelected = undefined;
        firstContainer = undefined;
    }

    function projects_close_fn () {
        projects_open = false;
        projects_tab.animate(
            {
                opacity: 0
            }, 200
        );
        $("#projects-container, #project-buttons button, #projects-tab").css(
            {
                "display": "none"
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
                    projectSelectedID = Object.keys(myProjects_obj).find(key => myProjects_obj[key]["title"] == projectSelected.text());
                    for (let j = 0; j < all_project_containers_array.length; j++) {
                        $(all_project_containers_array[j]).removeClass("selected2");
                        $(all_project_containers_array[j]).removeClass("selected");
                    }
                    $("#project-buttons div:nth-child(2) button").css(
                        {
                            "opacity": "0.2"
                        }
                    )
                    $("#current-project-window").animate
                    (
                        { 
                            opacity: 1
                        }, 500
                    );
                    fetchTasks();
                    $("#current-project-window").css({ "display": "grid" });
                    $("#current-project-title div").text(projectSelected.text());
                }
            });
        };
    };

    setTimeout(() => {
        $("#current-project-window").css({ display: "none" })
    }, 5);

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

    project_title.css(
        {
            "top": -(project_title.height() * 2),
        }
    )


    addTabContainer.css(
        {
            "top": tabTitle.outerHeight() + firstTabContent.outerHeight() - 2,
            "width": tabTitle.width()
        }
    )

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

    let thisText;

    $(document).on({
        mouseenter: function () {
            thisLangCont = $(this);
            thisText = $(this).text();
            $(this).css({
                "background-color": "red"
            });
            $(this).text("DELETE?");
        },
        mouseleave: function () {
            $(this).css({
                "background-color": "rgba(0,0,0,0.2)"
            });
            $(this).text(thisText);
            thisText = undefined;
            thisLangCont = undefined;
        }
    }, ".single-lang-container");

    $(document).on("click", ".single-lang-container", function () {
        if ($(thisLangCont).index() == 0 && new_project_lang_container.children().length > 1) {
            languagesSelected = languagesSelected.replace(`${thisText},`, "");
        } else if ($(thisLangCont).index() > 0 ) {
            languagesSelected = languagesSelected.replace(`,${thisText}`, "");
        } else if (new_project_lang_container.children().length == 1) {
            languagesSelected = languagesSelected.replace(`${thisText}`, "");
        }
        $(thisLangCont).remove();
    })

    $("#btn-add-project").on("click", function () {
        if ($(this).text() == "Create") {
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
                    projectSelectedID = Object.keys(myProjects_obj).find(key => myProjects_obj[key]["title"] == projectSelected.text());
                    for (let j = 0; j < all_project_containers_array.length; j++) {
                        $(all_project_containers_array[j]).removeClass("selected2");
                        $(all_project_containers_array[j]).removeClass("selected");
                    }
                    $("#project-buttons div:nth-child(2) button").css(
                        {
                            "opacity": "0.2"
                        }
                    )
                    $("#current-project-window").animate
                    (
                        { 
                            opacity: 1
                        }, 500
                    );
                    fetchTasks();
                    $("#current-project-window").css({ "display": "grid" });
                    $("#current-project-title div").text(projectSelected.text());
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
                "languages": languagesSelected,
                "nextTaskNum": 1,
                "tasks": { "to-do": {}, "in-progress": {}, "to-review": {}, "completed": {}}
            };
            window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
            new_project_lang_container.empty();
            new_project_description.val("");
            new_project_startdate.val("");
            languagesSelected = "";
            nextProjNum++;
            console.log(myProjects_obj);
        }
        else if ($(this).text() == "OK") {
            for (let key in myProjects_obj) {
                if (myProjects_obj[key]["title"] == projectSelected.text()) {
                    const thisKey = myProjects_obj[key];
                    thisKey["title"] = new_project_name.val();
                    thisKey["description"] = new_project_description.val();
                    thisKey["startDate"] = new_project_startdate.val();
                    thisKey["languages"] = languagesSelected;
                    window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
                    projectSelected.text(new_project_name.val());
                    new_project_lang_container.empty();
                    new_project_description.val("");
                    new_project_startdate.val("");
                    languagesSelected = "";
                    create_project_menu.css({
                        display: "none"
                    })
                    return;
                }
            }
        }
        
    });

    $("#btn-create-project, #add-project").on("click", function () {
        new_project_name.val("");
        create_project_menu.css(
            {
                "display": "block"
            }
        );
        $("#create-proj-desktop-title").text("Create New Project");
        $("#btn-add-project").text("Create");
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
                    if (new_project_lang_predict.children().length > 0) {
                        for (let i = 1; i <= new_project_lang_predict.children().length; i++) {
                            new_project_lang_predict.children(`:nth-child(${i})`).on("click", function () {
                                new_project_lang_predict.empty();
                                selectChild = 0;
                                new_project_lang.val("");
                                if (new_project_lang_container.children().length == 0) {
                                    new_project_lang_container.html("");
                                }
                                const thisAppend = `<div class="single-lang-container">${$(this).text()}</div>`;
                                new_project_lang_container.append(thisAppend);
                                if (languagesSelected == "") {
                                    languagesSelected = $(this).html();
                                } else {
                                    languagesSelected += "," + $(this).html();
                                }
                                selected = undefined;
                                firstMarked = false;
                            })
                            
                        }
                    }
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
                new_project_lang_container.append(`<div class="single-lang-container">${selected}</div>`);
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
            $("#delete-confirm-container div:nth-child(2)").text(`Deleting "${projectSelected.text().toUpperCase()}" project is an irreversible action`);
            delete_confirm_proj.css(
                {
                    display: "flex",
                    opacity: 1
                }
            )
        } else if ($(this).text() == "Edit" && projectSelected != undefined) {
            create_project_menu.css(
                {
                    display: "block"
                }
            )
            $("#create-proj-desktop-title").text("Edit Project");
            new_project_name.val(projectSelected.text());
            $("#btn-add-project").text("OK");
            for (let key in myProjects_obj) {
                if (myProjects_obj[key]["title"] == projectSelected.text()) {
                    const thisKey = myProjects_obj[key];
                    new_project_description.val(thisKey["description"]);
                    new_project_startdate.val(thisKey["startDate"]);
                    const oldLanguages = thisKey["languages"].split(",");
                    languagesSelected = thisKey["languages"];
                    if (oldLanguages.length > 0 && oldLanguages[0] != "") {
                        for (let i = 0; i < oldLanguages.length; i++) {
                            new_project_lang_container.append($(`<div class="single-lang-container">${oldLanguages[i]}</div>`));
                        }
                    }
                    return;
                }
            }
        }
    })

    $("#deleteConfirm").on("click", function () {
        for (let key in myProjects_obj) {
            if (myProjects_obj[key]["title"] == projectSelected.text()) {
                delete myProjects_obj[key];
                window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
                projectSelected.remove();
                projectSelected = undefined;
                firstContainer = undefined;
                delete_confirm_proj.css(
                    {
                      display: "none"
                    }
                )
                return;
            }
        }
    })

    $("#deleteCancel").on("click", function () {
        delete_confirm_proj.css({
            display: "none"
        })
    })


    function adjustTaskTabs () {
        for (let n = 0; n < allTabContents.length; n++) {
            for (let m = 0; m < $(allTabContents[n]).children().length; m++) {
                initialHeight += $(allTabContents[n]).children(`:nth-child(${m+1})`).outerHeight();
            }
            if (initialHeight >= $(window).outerHeight() * 0.55) {
             
                $(allTabContents[n]).css({
                    "height": "90%",
                    "grid-template-rows": "repeat(auto-fill, minmax(min-content, max-content))",
                    "grid-auto-rows": "minmax(min-content, max-content)",
                    "overflow-y": "scroll"
                })
            } else {
                $(allTabContents[n]).css({
                    "display": "grid",
                    "height": "max-content",
                    "grid-template-rows": "",
                    "grid-auto-rows": "",
                    "overflow-y": "",
                })
            }
            initialHeight = 0;
        }
    }

    $(function () {

        adjustTaskTabs();
        

        $("#to-do, #in-progress, #to-review, #completed").sortable(
            {
                connectWith: ".tab-content",
                placeholder: "ui-state-highlight",
                cancel: "#to-do-add",
                start: function (e, ui) {
                    addTabContainer.hide();
                    $(ui.item).css({ "transform": "rotate(" + 3 + "deg)"})
                    $(".ui-state-highlight").css({
                        "height": $(ui.item).height()
                    })
                },
                stop: function (e, ui) {
                    addTabContainer.show();
                    addTabContainer.css(
                        {
                            "top": tabTitle.outerHeight() + firstTabContent.outerHeight() - 2
                        }
                    )
                    $(ui.item).css({ "transform": "rotate(" + 0 + "deg)"})
                },
                update: function (e, ui) {
                    const windowHeight = $(window).outerHeight();
                    let receiverHeight = 0;
                    let senderHeight = 0;
                    for (let p = 0; p < $(ui.item).parent().children().length; p++) {
                        receiverHeight += $(ui.item).parent().children(`:nth-child(${p+1})`).outerHeight();
                    }
                    for (let k = 0; k < $(ui.sender).children().length; k++) {
                        senderHeight += $(ui.sender).children(`:nth-child(${k+1})`).outerHeight();
                    }
                    if (receiverHeight >= windowHeight * 0.55) {
                        $(ui.item).parent().css({
                            "height": "90%",
                            "grid-template-rows": "repeat(auto-fill, minmax(min-content, max-content))",
                            "grid-auto-rows": "minmax(min-content, max-content)",
                            "overflow-y": "scroll",
                        })
                    } else {
                        $(ui.item).parent().css({
                            "display": "grid",
                            "height": "max-content",
                            "grid-template-rows": "",
                            "grid-auto-rows": "",
                            "overflow-y": "",
                        })
                    }
                    if (senderHeight >= windowHeight * 0.55) {
                        $(ui.sender).css({
                            "height": "90%",
                            "grid-template-rows": "repeat(auto-fill, minmax(min-content, max-content))",
                            "grid-auto-rows": "minmax(min-content, max-content)",
                            "overflow-y": "scroll",
                        })
                    } else {
                        $(ui.sender).css({
                            "display": "grid",
                            "height": "max-content",
                            "grid-template-rows": "",
                            "grid-auto-rows": "",
                            "overflow-y": "",
                        })
                    }
                },
                over: function (e, ui) {
                    let placeholder = $(".ui-state-highlight");
                    let bgColor = placeholder.parent().css("border-color");
                    placeholder.css({
                        "background-color": bgColor
                    })
                },
                receive: function (e, ui) {
                    myTasks_obj[$(ui.item).parent().attr("id")][$(ui.item).attr("data-task-id")] = myTasks_obj[$(ui.sender).attr("id")][$(ui.item).attr("data-task-id")];
                    delete myTasks_obj[$(ui.sender).attr("id")][$(ui.item).attr("data-task-id")];
                    let movedID = $(ui.item).attr("data-task-id");

                    let receiverChildren;
                    let movedArray = [];
                    receiverChildren = Number($(ui.item).parent().children().length);
                    for (let o = 0; o < receiverChildren; o++) {
                        if ($(ui.item).parent().children(`:nth-child(${o+1})`).attr("id") !== "to-do-add") {
                            let eachID = $(ui.item).parent().children(`:nth-child(${o+1})`);
                            movedArray.push(eachID.attr("data-task-id"));
                            
                        }
                    }
                    let insertAfter = "";
                    for (let i = 0; i < movedArray.length; i++) {
                        if (movedArray[i] == movedID && i != 0) {
                            insertAfter = movedArray[i-1];
                        }
                    }
                    let testContainer = $(ui.item).parent().attr("id");
                    let testObj = [];
                    for (let k = 0; k < movedArray.length; k++) {
                        console.log(movedArray[k]);
                        testObj[k] = myTasks_obj[testContainer][movedArray[k]];
                    }
                    // console.log
                    // testObj = myTasks_obj[testContainer];
                    
                    console.log(testObj);
                    myProjects_obj[projectSelectedID]["tasks"] = myTasks_obj;
                    // testObj[testContainer] = testObj2;
                    // myTasks_obj[testContainer] = testObj;
                    // console.log(testObj[testContainer] = {1: "123"});
                    window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
                }
            }
        ).disableSelection();
    });

    function moveObjectElement(currentKey,afterKey,obj) {
        var result = {};
        console.log("///");
        console.log(currentKey);
        console.log(afterKey);
        console.log(obj);
        console.log("///");
        var val = obj[currentKey];
        delete obj[currentKey];
        var next = -1;
        var i = 0;
        if(typeof afterKey == "undefined" || afterKey == null) {
            afterKey = "";
        }
        $.each(obj, function (k, v) {
            if ((afterKey = "" && i == 0) || next == 1) {
                result[currentKey] = val;
                next = 0;
            }
            if (k == afterKey) {
                next = 1;
            }
            result[k] = v;
            ++i;
        });
        if (next == 1) {
            result[currentKey] = val;
        }
        if (next !== -1) {
            return result;
        } else {
            return obj;
        }
    
    }

    const add_task_btn = $("#to-do-add");
    const create_task_menu = $("#create-task-menu");

    //Add Task Button Show Task Creation Window
    add_task_btn.on("click", function () {
        create_task_menu.css(
            { 
                display: "flex" ,
                opacity: 1
            }
        );
        if (subtask_panel.children().length > 0) {
            $("#subtask-title").css({ display: "block" });
            isSubtaskPanelScroll();
        } else {
            $("#subtask-title").css({ display: "none" });
            subtask_panel.css({ display: "none" })
        }
    })

    

    const create_create_task_menu = $(".btn-create-task");
    //Create Button Task Window
    create_create_task_menu.on("click", function () {
        create_task_menu.css({ display: "none" });
        subtask_panel.empty();
        
        myTasks_obj["to-do"][`${nextTaskNum}a`] = {
            "taskID": `${nextTaskNum}a`,
            "title": $("#task-title-input").val(),
            "status": "to-start",
            "subtasks": mySubTasks_obj
        };
        myProjects_obj[projectSelectedID]["tasks"] = myTasks_obj;
        //window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
        mySubTasks_obj = {};
        $("#to-do").prepend(`<div data-task-id="${nextTaskNum}a">
        <div class="subtask-helper">5/23</div>
        ${$("#task-title-input").val()}
        <img src="imgs/trash.png" alt="">
        </div>`)
        adjustTaskTabs();
        addTabContainer.css(
            {
                "top": tabTitle.outerHeight() + firstTabContent.outerHeight() - 2,
                "width": tabTitle.width()
            }
        )
        $("#task-title-input").val("");
        nextTaskNum++;
        myProjects_obj[projectSelectedID]["nextTaskNum"] = nextTaskNum;
        window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
    })


    //Delete the task
    $(document).on("click", "[data-task-id] img", function () {
        const thisProjID = $(this).parent().attr("data-task-id");
        const thisProjSTAT = $(this).parent().parent().attr("id");
        delete myProjects_obj[projectSelectedID]["tasks"][thisProjSTAT][thisProjID];
        window.localStorage.setItem("Projects", JSON.stringify(myProjects_obj));
        $(this).parent().remove();

        setTimeout(() => {
            adjustTaskTabs();
            addTabContainer.css(
                {
                    "top": tabTitle.outerHeight() + firstTabContent.outerHeight() - 2,
                    "width": tabTitle.width()
                }
            )
        }, 10);
    })

    function fetchTasks() {
        if (fetchProjects != null) {
            myProjects_obj = fetchProjects;
        }
        console.log(myProjects_obj);
        $("#to-do, #in-progress, #to-review, #completed").children().filter(function () {
            return !$(this).is("#to-do-add");
        }).remove();
        if (projectSelectedID != null) {
            myTasks_obj = { "to-do": {}, "in-progress": {}, "to-review": {}, "completed": {}};
            for (let key = 0; key < Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-do"]).length; key++) {
                $("#to-do").append(`<div data-task-id="${myProjects_obj[projectSelectedID]["tasks"]["to-do"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-do"])[key]]["taskID"]}">
                <div class="subtask-helper">5/23</div>
                ${myProjects_obj[projectSelectedID]["tasks"]["to-do"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-do"])[key]]["title"]}
                <img src="imgs/trash.png" alt="">
                </div>`);
            myTasks_obj["to-do"][myProjects_obj[projectSelectedID]["tasks"]["to-do"][Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-do"])[key]]["taskID"]] = myProjects_obj[projectSelectedID]["tasks"]["to-do"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-do"])[key]];
            }
            for (let key = 0; key < Object.keys(myProjects_obj[projectSelectedID]["tasks"]["in-progress"]).length; key++) {
                $("#in-progress").append(`<div data-task-id="${myProjects_obj[projectSelectedID]["tasks"]["in-progress"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["in-progress"])[key]]["taskID"]}">
                    <div class="subtask-helper">5/23</div>
                    ${myProjects_obj[projectSelectedID]["tasks"]["in-progress"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["in-progress"])[key]]["title"]}
                    <img src="imgs/trash.png" alt="">
                    </div>`);
                myTasks_obj["in-progress"][myProjects_obj[projectSelectedID]["tasks"]["in-progress"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["in-progress"])[key]]["taskID"]] = myProjects_obj[projectSelectedID]["tasks"]["in-progress"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["in-progress"])[key]];
            }
            for (let key = 0; key < Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-review"]).length; key++) {
                $("#to-review").append(`<div data-task-id="${myProjects_obj[projectSelectedID]["tasks"]["to-review"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-review"])[key]]["taskID"]}">
                    <div class="subtask-helper">5/23</div>
                    ${myProjects_obj[projectSelectedID]["tasks"]["to-review"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-review"])[key]]["title"]}
                    <img src="imgs/trash.png" alt="">
                    </div>`);
                myTasks_obj["to-review"][myProjects_obj[projectSelectedID]["tasks"]["to-review"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-review"])[key]]["taskID"]] = myProjects_obj[projectSelectedID]["tasks"]["to-review"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["to-review"])[key]];
            }
            for (let key = 0; key < Object.keys(myProjects_obj[projectSelectedID]["tasks"]["completed"]).length; key++) {
                $("#completed").append(`<div data-task-id="${myProjects_obj[projectSelectedID]["tasks"]["completed"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["completed"])[key]]["taskID"]}">
                    <div class="subtask-helper">5/23</div>
                    ${myProjects_obj[projectSelectedID]["tasks"]["completed"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["completed"])[key]]["title"]}
                    <img src="imgs/trash.png" alt="">
                    </div>`);
                myTasks_obj["completed"][myProjects_obj[projectSelectedID]["tasks"]["completed"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["completed"])[key]]["taskID"]] = myProjects_obj[projectSelectedID]["tasks"]["completed"][ Object.keys(myProjects_obj[projectSelectedID]["tasks"]["completed"])[key]];
            }
            // dobavi FOR za drugite 3 durveta 
            
            let movedArray;


            nextTaskNum = myProjects_obj[projectSelectedID]["nextTaskNum"]; 
        }
        setTimeout(() => {
            adjustTaskTabs();
            addTabContainer.css(
                {
                    "top": tabTitle.outerHeight() + firstTabContent.outerHeight() - 2,
                    "width": tabTitle.width()
                }
            )
        }, 10);
        
    }

    const close_create_task_menu = $(".btn-cancel-task");
    //Close Creation Window Button
    close_create_task_menu.on("click", function () {
        create_task_menu.css({ display: "none" });
        subtask_panel.empty();
        $("#task-title-input").val("");
    })

    //Show Subtask Options on Hover
    let delay = 500;
    let setTimeoutConst;
    $(document).on("mouseenter", ".subtask-container",function () {
        setTimeoutConst = setTimeout(() => {
            if ($(this).children(":nth-child(1)").children(":nth-child(1)").attr("data-active") == "false") {
                $(this).children(":nth-child(2)").css(
                    {
                        display: "grid"
                    }
                );
                $(this).children(":nth-child(1)").css({
                    display: "none"
                })
            }
        }, delay);
    });

    //Hide Subtask Options on Hover
    $(document).on("mouseleave", ".subtask-container",function () {
        clearTimeout(setTimeoutConst);
        $(this).children(":nth-child(2)").css(
            {
                display: "none"
            }
        );
        $(this).children(":nth-child(1)").css({
            display: "flex"
        })
    })

    //Subtask complete/pending button
    $(document).on("click", ".subtask-container div:nth-child(2) button:nth-child(2)", function () {
        if ($(this).attr("value") == "not-complete") {
            $(this).attr("value", "complete");
            $(this).text("Mark as Pending");
            $(this).parent().parent().css(
                {
                    "background-color": "chartreuse",
                    "color": "black"
                }
            )
            $(this).next().css(
                {
                    display: "none"
                }
            )
        } else {
            $(this).attr("value", "not-complete");
            $(this).text("Mark as Complete");
            $(this).parent().parent().css(
                {
                    "background-color": "crimson",
                    "color": "white"
                }
            )
            $(this).next().css(
                {
                    display: "block"
                }
            )
        }
    })

    //Subtaask delete button
    $(document).on("click", ".subtask-container div:nth-child(2) button:nth-child(3)", function () {
        $(this).parent().parent().remove();
        if (subtask_panel.children().length == 0) {
            $("#subtask-title").css({ display: "none" });
        }
        isSubtaskPanelScroll();
    })

    const subtask_div = '<div class="subtask-container"><div><input type="text" data-active="true" placeholder="Name this subtask and press Enter..." id="single-subtask-title-input"></div><div><button id="single-subtask-rename-btn">Rename</button><button value="not-complete">Mark as Complete</button><button>Delete</button></div></div>';

    //Subtask add button
    $(document).on("click", "#want-subtasks-question", function () {
        let thisAppend = $(subtask_div).appendTo("#subtask-panel");
        setTimeout(() => {
            $(thisAppend).find("input").focus();
        }, 250);
        $("#subtask-title").css({ display: "block" });
        isSubtaskPanelScroll();
    })

    //Subtask title input ENTER
    $(document).on("keyup", "#single-subtask-title-input", function (e) {
        if (e.key == "Enter" && $(this).val() != "") {
            $(this).parent().prepend($(this).val());
            $(this).parent().css({
                "justify-content": "start"
            })
            $(this).css({ display: "none" });
            $(this).attr("data-active", "false");
            mySubTasks_obj[$(this).val()] = "false";
        }
    })

    //rename subtask button
    $(document).on("click", "#single-subtask-rename-btn", function () {
        let theParent = $(this).parent().parent().children(":nth-child(1)");
        const oldName = theParent.text();
        theParent.text("");
        const thisAppend = $(`<input type="text" value="${oldName}" data-active="true" placeholder="Name this subtask and press Enter..." id="single-subtask-title-input">`).prependTo(theParent);
        setTimeout(() => {
            $(thisAppend).focus();
        }, 250);
        $(this).parent().css({ display: "none" });
    })


    function isSubtaskPanelScroll() {
        subtask_panel_init_height = 0;
        for (let i = 0; i < subtask_panel.children().length; i++) {
            subtask_panel_init_height += subtask_panel.children(`:nth-child(${i+1})`).outerHeight();
        }
        if (subtask_panel_init_height >= $(window).outerHeight() * 0.28) {
            $(subtask_panel).css({
                "height": "30vh",
                "grid-template-rows": "repeat(auto-fill, minmax(min-content, max-content))",
                "grid-auto-rows": "minmax(min-content, max-content)",
                "overflow-y": "scroll",
                "scrollbar-width": "none"
            })
        } else {
            $(subtask_panel).css({
                "display": "grid",
                "height": "max-content",
                "grid-template-rows": "",
                "grid-auto-rows": "",
                "overflow-y": "",
            })
        };
        if (subtask_panel_init_height <= 0) {
            subtask_panel.css({ display: "none" })
        }
    };

    isSubtaskPanelScroll();

});