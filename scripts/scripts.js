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
    console.log($(project_tabs)[0].scrollWidth + " / " + $(project_tabs).outerWidth());
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

    $("#btn-add-project").on("click", function () {
        $("<div>New Project</div>").insertBefore("#my-projects #project-tabs #left-indicator")
        if($(project_tabs)[0].scrollWidth > $(project_tabs)[0].clientWidth) {
            right_arrow_projects_container.css(
                {
                    "opacity": "1"
                }
            )
        }
    });

    const create_project_menu = $("#create-project-menu");

    $("#btn-create-project").on("click", function () {
        create_project_menu.css(
            {
                "display": "block"
            }
        )
    });




});