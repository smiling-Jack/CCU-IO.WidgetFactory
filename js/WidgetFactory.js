/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */

var wid_id = "W00001";

var elements = {

};

var WF = {
    socket: {},
    settings: {},

    theme: "",


    str_theme: "WidgetFactory_Theme",
    str_settings: "WidgetFactory_Settings",
    str_tollbox: "WidgetFactory_Toolbox",

    elem_nr: 1,
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
            val: "",
            addcssMenu: "xs_combo_menu",
            addcssButton: "xs_combo_button"
        }),

            $("#wgs_add_select_container").xs_combo({
                data: ["Main"],
                val: "",
                addcssMenu: "xs_combo_menu",
                addcssButton: "xs_combo_button"
            }),

            $("#wgs_add_btn")
                .button()
                .click(function () {

                    WF.add_knob_bar($("#new_widget"), WF.elem_nr);
                    WF.elem_nr++;

                });

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

        $("#test").click(function () {
            wid_builder.build();
        })
    },

    add_knob_bar: function (container, _nr) {

        WF.add_widget_settings("knob_bar");

        var settings = {
            parrent: "new_widget_x",
            stroke_w: 100,
            start_winkel: 0,
            stop_winkel: 180,

            w: "300px",
            h: "300px",
            max: 100,
            min: 0,

            val: 100,
            nr: _nr,
            left:0,
            top:0
        };
        elements[_nr] = {};
        elements[_nr]["type"] = "knob_bar";
        elements[_nr]["nr"] = _nr;
        elements[_nr]["name"] = wid_id + '_' + settings.nr + "_knob_bar";
        elements[_nr]["settings"] = settings;

function paint () {

    var settings = elements[_nr]["settings"];
    var _turn_winkel = settings.start_winkel * Math.PI / 180;
    var r = 500 - (parseInt(settings.stroke_w)/2);
    var x1 = 500 + r * Math.sin(_turn_winkel);
    var y1 = 500 - r * Math.cos(_turn_winkel);
    var winkel_max = (settings.start_winkel - settings.stop_winkel) * -1;
    var winkel = (winkel_max / (settings.max - settings.min) * (settings.val - settings.min));
    var x2 = 500 + r * Math.sin((winkel + parseInt(settings.start_winkel)) * Math.PI / 180);
    var y2 = 500 - r * Math.cos((winkel + parseInt(settings.start_winkel)) * Math.PI / 180);


    $(container).append('<div style="position:absolute; top:' + settings.top + 'px; left:' + settings.left + 'px; border: 1px solid green;width:' + settings.w + '; height:' + settings.h + ' " id="' + wid_id + '_' + settings.nr + '_knob_bar"><svg \
           viewBox="0 0 1000 1000"\
            width="100%" \
            height="100%">\
            <path name="svg_knob_bar' + settings.nr + '" stroke="blue" stroke-width=' + settings.stroke_w + ' fill="none"/>\
            </svg>\
            </div>');

    $('#' + wid_id + '_' + settings.nr + '_knob_bar').resizable({
        aspectRatio: true,
    })
        .draggable({
            containment:container,
            stop: function(event,ui){
                elements[_nr].settings["top"] = ui.position.top;
                elements[_nr].settings["left"] = ui.position.left;
                console.log($(this).position())
            }
        }
    );


    if (winkel < 180) {

        $('[name="svg_knob_bar' + settings.nr + '"]').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 0,1 " + x2 + "," + y2 + "  ");
    } else {
        $('[name="svg_knob_bar' + settings.nr + '"]').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 1,1 " + x2 + "," + y2 + "  ");
    }

}
        paint()
// Setting
        $("#wgs_content").append('' +
            '<div id="set'+ settings.nr + '">' +
                '<hr>' +
                '<table>' +
                    '<tr>' +
                    '<td>stroke_w</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-stroke_w"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>start_winkel</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-start_winkel"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stop_winkel</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-stop_winkel"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>w</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-w"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>h</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-h"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>max</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-max"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>min</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-min"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>val</td>' +
                    '<td><input class="element_settings" id="'+ settings.nr + '-val"></td>' +
                    '</tr>' +
                '</table>' +
            '</div>'

        );

        $(".element_settings").change(function(){
            var _element = $(this).attr("id").split("-");

            elements[_element[0]].settings[_element[1]]= $(this).val();

            $('#' + wid_id + '_' + settings.nr + '_knob_bar').remove();
            paint();
            });


    },

    add_new_widget: function () {

        $("#prg_panel").append('<div id="new_widget_body" style="position:relative; border: 1px solid yellow"><div id="new_widget" style="width:500px; height:500px;   border: 1px dashed red"> </div></div>')

        $('#new_widget').resizable({

        })
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
//};webstorm


var wid_builder = {
    _script: "",
    build: function () {

        var _html = "";

        $.each(elements, function () {

            if (this.type == "knob_bar")

                wid_builder._script += ' \n\
var settings' + this.nr + ' = {\n\
 parrent: "new_widget_x",\n\
stroke_w: ' + this.settings.stroke_w + ',\n\
start_winkel:  ' + this.settings.start_winkel + ',\n\
stop_winkel:  ' + this.settings.stop_winkel + ',\n\
w:  "' + this.settings.w + '",\n\
h:  "' + this.settings.h + '",\n\
max:  ' + this.settings.max + ',\n\
min:  ' + this.settings.min + ',\n\
val:  ' + this.settings.val + ',\n\
nr:  ' + this.settings.nr + ',\n\
left:' + this.settings.left + ',\n\
top:' + this.settings.top + ',\n\
 };\n\
 var _turn_winkel = settings.start_winkel * Math.PI / 180;\n\
 var r = 500 - (parseInt(settings.stroke_w)/2);\n\
 var x1 = 500 + r * Math.sin(_turn_winkel);\n\
 var y1 = 500 - r * Math.cos(_turn_winkel);\n\
 var winkel_max = (settings.start_winkel - settings.stop_winkel) * -1;\n\
 var winkel = (winkel_max / (settings.max - settings.min) * (settings.val - settings.min));\n\
 var x2 = 500 + r * Math.sin((winkel + parseInt(settings.start_winkel)) * Math.PI / 180);\n\
 var y2 = 500 - r * Math.cos((winkel + parseInt(settings.start_winkel)) * Math.PI / 180);\n\
$("#new_widget_x").prepend(\'<div style="position:absolute; top:' + this.settings.top + 'px; left:' + this.settings.left + 'px; border: 1px solid green;width:' + this.settings.w + '; height:' + this.settings.h + ' " id="' + wid_id + '_' + this.settings.nr + '_knob_bar"><svg viewBox="0 0 1000 1000" width="100%" height="100%"><path name="svg_knob_bar' + this.settings.nr + '" stroke="blue" stroke-width=' + this.settings.stroke_w + ' fill="none"/></svg></div>\'); \n\
\
if ((winkel * 180 / Math.PI) - settings' + this.nr + '.start_winkel > 180) {\n\
$(\'[name="svg_knob_bar' + this.settings.nr + '"]\').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 0,1 " + x2 + "," + y2 + "  ");\n\
} else {\n\
$(\'[name="svg_knob_bar' + this.settings.nr + '"]\').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 1,1 " + x2 + "," + y2 + "  ");\n\
}\n\
            ';

        });


        $("body").append('<div id="new_widget_x"></div><script>' + wid_builder._script + '</script>')
        $("#new_widget_x").dialog();
    }
};

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

