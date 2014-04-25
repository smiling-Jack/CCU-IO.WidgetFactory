/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */



var WF = {
    socket: {},
    settings: {},

    theme: "",


    str_theme: "WidgetFactory_Theme",
    str_settings: "WidgetFactory_Settings",
    str_tollbox: "WidgetFactory_Toolbox",


    key: "",

    hoverEleme: undefined,

    Setup: function () {



        // slider XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        $("#sim_output").prepend("<tr><td style='width: 100px'>Script Log</td><td></td></tr>");


        $("#prg_body").perfectScrollbar({
            wheelSpeed: 60,
            top: "50%",
            left: "50%"
        });

        $("#wgs_body").perfectScrollbar({
            wheelSpeed: 60
        });


        // WGS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        $("#wgs_general_head")
            .button()
            .click(function () {

                $("#wgs_general_content").toggle();
                $(this).removeClass('ui-state-focus')
            });

        $("#wgs_add_head")
            .button()
            .click(function () {

                $("#wgs_add_content").toggle();
                $(this).removeClass('ui-state-focus')
            });


        $("#wgs_add_select").xs_combo({
            data: ["Knob_bar"],
            val: ""
        }),

            $("#wgs_add_select_container").xs_combo({
                data: ["Main"],
                val: ""
            }),


            // Toolbox XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


            $(document).keydown(function (event) {
//            console.log(event.keyCode)
                WF.key = event.keyCode;


            });

        $(document).keyup(function () {
            if (WF.key == 17) {
                $("body").css({cursor: "default"});
            }
            WF.key = "";
        });

        $("body").css({visibility: "visible"});

        WF.menu_iconbar();
        WF.context_menu();

        WF.add_new_widget();
        WF.add_knob_bar();
    },

    add_knob_bar: function (container) {

        WF.add_widget_settings("knob")


        var stroke_w = 100;
        var start_winkel = 0;
        var stop_winkel = 90;

        var max = 100
        var min = 0

        var val = 100

        var _turn_winkel = start_winkel * Math.PI / 180;

        var x1 = 500 + 450 * Math.sin(_turn_winkel);
        var y1 = 500 - 450 * Math.cos(_turn_winkel);

        var winkel_max = (start_winkel - stop_winkel) * -1;
        var winkel = winkel_max / (max - min) * val + start_winkel;

        var x2 = 500 + 450 * Math.sin(winkel * Math.PI / 180);
        var y2 = 500 - 450 * Math.cos(winkel * Math.PI / 180);

        console.log(winkel)

        $(container).append('<svg \
           viewBox="0 0 1000 1000"\
            width="100%" \
            height="100%">\
            <path name="hallo" stroke="blue" stroke-width=' + stroke_w + ' fill="none"/></svg>');

        $('#new_widget_body').resizable({
            aspectRatio: true,
        })
            .draggable();


        if ((winkel * 180 / Math.PI) - start_winkel > 180) {

            $('[name="hallo"]').attr("d", "M" + x1 + "," + y1 + " A450,450 0 0,1 " + x2 + "," + y2 + "  ");
        } else {
            $('[name="hallo"]').attr("d", "M" + x1 + "," + y1 + " A450,450 0 1,1 " + x2 + "," + y2 + "  ");
        }


    },

    add_new_widget: function () {

        $("#prg_panel").append('<div id="new_widget_body" style=" width500px; height:500px; border: 1px solid yellow"><div id="new_widget" style="width:100%; height: 100%;  border: 1px dashed red"> </div></div>')


    },

    add_widget_settings: function (type) {


    },


};


//var homematic = {
//    uiState: new can.Observe({"_65535": {"Value": null}}),
//    setState: new can.Observe({"_65535": {"Value": null}}),
//    regaIndex: {},
//    regaObjects: {},
//    setStateTimers: {}
//};


(function () {
    $(document).ready(function () {
        // Lade Theme XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        WF.theme = storage.get("ScriptGUI_Theme");
        if (WF.theme == undefined) {
            WF.theme = "dark-hive"
        }
        $("#theme_css").remove();
        $("head").append('<link id="theme_css" rel="stylesheet" href="css/' + WF.theme + '/jquery-ui.min.css"/>');


        // Lade ccu.io Daten XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//        try {
//            WF.socket = io.connect($(location).attr('protocol') + '//' + $(location).attr('host') + "?key=" + socketSession);
//
//            WF.socket.on('event', function (obj) {
//                if (homematic.uiState["_" + obj[0]] !== undefined) {
//                    var o = {};
//                    o["_" + obj[0] + ".Value"] = obj[1];
//                    o["_" + obj[0] + ".Timestamp"] = obj[2];
//                    o["_" + obj[0] + ".Certain"] = obj[3];
//                    homematic.uiState.attr(o);
//                }
//            });
//
//            WF.socket.emit("getIndex", function (index) {
//                homematic.regaIndex = index;
////                WF.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/regaIndex.json", JSON.stringify(index));
//
//                WF.socket.emit("getObjects", function (obj) {
//
//                    homematic.regaObjects = obj;
//
////                    $.each(obj, function (index) {
////
////                    });
//                    //                    WF.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/Objects.json", JSON.stringify(obj));
//
//                    WF.socket.emit("getDatapoints", function (data) {
////                        WF.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/Datapoints.json", JSON.stringify(data));
//
//                        for (var dp in data) {
//                            homematic.uiState.attr("_" + dp, { Value: data[dp][0], Timestamp: data[dp][1], LastChange: data[dp][3]});
//                        }
//
//
//                    });
//                });
//            });
//        }
//        catch (err) {
//
//            $.getJSON("sim_store/regaIndex.json", function (index) {
//                homematic.regaIndex = index;
//            });
//            $.getJSON("sim_store/Objects.json", function (obj) {
//                homematic.regaObjects = obj;
//                $.getJSON("sim_store/Datapoints.json", function (data) {
//                    for (var dp in data) {
//                        homematic.uiState.attr("_" + dp, { Value: data[dp][0], Timestamp: data[dp][1], LastChange: data[dp][3]});
//                    }
//                });
//            });
//        }

        WF.Setup();

    });
})(jQuery);

