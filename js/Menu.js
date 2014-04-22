/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */

jQuery.extend(true, WF, {

    menu_iconbar: function () {
        $("#img_iconbar").tooltip();
        $("#menu").menu({position: {at: "left bottom"}});
        $("#m_neu").click(function () {
            WF.clear();
        });
        $("#m_save").click(function () {
            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {
                WF.save_ccu_io();
            }
        });
        $("#m_save_as").click(function () {
            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {
                WF.save_as_ccu_io();
            }
        });
        $("#m_open").click(function () {
            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {
                WF.open_ccu_io();
            }
        });
        $("#m_example").click(function () {
            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {
                WF.example_ccu_io();
            }
        });
        $("#ul_id_auswahl li a").click(function () {
            $("#id_js").remove();
            $("head").append('<script id="id_js" type="text/javascript" src="js/hmSelect_' + $(this).data('info') + '.js"></script>');

            storage.set("ScriptGUI_idjs", ($(this).data('info')));
        });
        $("#ul_theme li a").click(function () {
            $("#theme_css").remove();
            $("head").append('<link id="theme_css" rel="stylesheet" href="css/' + $(this).data('info') + '/jquery-ui.min.css"/>');

            //resize Event auslössen um Slider zu aktualisieren
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);

            storage.set(WF.str_theme, ($(this).data('info')));
            theme = $(this).data('info');
            WF.scrollbar_h("", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_h"));
            WF.scrollbar_v("", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_v"));
            WF.scrollbar_v("", $("#toolbox_body"), $(".toolbox"), $("#scroll_bar_toolbox"));
        });


        // Icon Bar XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        // Local
        $("#img_save_local").click(function () {
            data = WF.make_savedata();

            storage.set(WF.str_prog, data);
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_open_local").click(function () {
            var data = storage.get(WF.str_prog);

            WF.clear();
            WF.load_prg(data);

            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

    },

    context_menu: function () {

        $(document).on('mouseenter', ".context-menu-item", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".context-menu-item", function () {
            $(this).toggleClass("ui-state-focus")

        });

        $(document).on('mouseenter', ".div_hmid_font", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".div_hmid_font", function () {
            $(this).toggleClass("ui-state-focus")

        });

        $(document).on('mouseenter', ".div_hmid_filter_font", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".div_hmid_filter_font", function () {
            $(this).toggleClass("ui-state-focus")

        });

        $(document).on('mouseenter', ".div_hmid_val", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".div_hmid_val", function () {
            $(this).toggleClass("ui-state-focus")

        });

// Body zum debuggen auskommentieren  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        $.contextMenu({
            selector: 'body',
            items: {
                "body": {
                    name: "body"
                }
            }
        });
        $("body").contextMenu(false);


    },


});

