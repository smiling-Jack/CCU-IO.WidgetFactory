/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */

var wid_id = "W00001";


var wid = {
    name: "hallo",
    width: "x",
    height: 0,
    ids: [65000],
    ids_name: ["Master"],
    elements: ko.observable ({})

};

var WF = {
    socket: {},
    elem_settings: {},

    theme: "",


    str_theme: "WidgetFactory_Theme",
    str_elem_settings: "WidgetFactory_elem_settings",
    str_tollbox: "WidgetFactory_Toolbox",

    elem_nr: 1,
    key: "",

    hoverEleme: undefined,

    Setup: function () {

        ko.applyBindings(wid);

        // slider XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        $("#sim_output").prepend("<tr><td style='width: 100px'>Script Log</td><td></td></tr>");

        $("#prg_body").perfectScrollbar({
            wheelSpeed: 60,
            top: "50%",
            left: "50%"
        });

        $("#wgs_body").perfectScrollbar({
            suppressScrollX: true,
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


        $("#wgs_add_select").selectBoxIt({
            theme: "jqueryui"
        });

        $("#wgs_add_select_container").xs_combo({
            data: ["Main"],
            val: "",
            addcssMenu: "xs_combo_menu",
            addcssButton: "xs_combo_button"
        });

        $("#wgs_add_btn")
            .button()
            .click(function () {

                WF[$("#wgs_add_select option:selected").val()]($("#new_widget"), WF.elem_nr);
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
        });

        $("#backcolor_var")
            .change(function () {
                $("#prg_panel").css({"background-color": $(this).css("background-color")})
            });

        $("#backcolor_black,#backcolor_white, #backcolor_var ").click(function () {
            $("#prg_panel").css({"background-color": $(this).css("background-color")})
        })
    },

    add_knob: function (container, _nr) {

        elements[_nr] = {};
        elements[_nr]["type"] = "knob";
        elements[_nr]["nr"] = _nr;
        elements[_nr]["name"] = wid_id + '_' + _nr + "_knob";
        elements[_nr]["elem_settings"] = {};

        var elem_settings = {
            parrent: elements[_nr].es.parrent || "new_widget_x",
            size: elements[_nr].es.size || 300,
            left: elements[_nr].es.left || 0,
            top: elements[_nr].es.top || 0,
            max: elements[_nr].es.max || 100,
            min: elements[_nr].es.min || 0,
        };
        elements[_nr]["elem_settings"] = elem_settings;

        function paint() {

            var _defs = "";
            var _g = "";
            $(container).append('<div style="position:absolute; top:' + es.top + 'px; left:' + es.left + 'px; border: 1px solid transparent;width:' + es.size + 'px; height:' + es.size + 'px" id="' + wid_id + '_' + es.nr + '_knob">\
            <svg \
                viewBox="0 0 1000 1000"\
                width="100%" \
                height="100%"\
            >\
            <defs>\
            <circle id="svg_knob' + es.nr + '" cx="500" cy="500" r="500" stroke="black" stroke-width="1" fill="blue" />\
          ' + _defs + '\
            </defs>\
            <g id="blurred">\
                 ' + _g + '\
                <use xlink:href="#svg_knob' + es.nr + '" style="stroke:red" " />\
            </g>\
            </svg>\
            </div>');


            $('#' + wid_id + '_' + es.nr + '_knob').click(function () {
                $(".set").hide();
                $("#set" + es.nr).show();
                $(".element_selected")
                    .removeClass("element_selected")
                    .draggable("destroy")
                    .resizable("destroy");
                $(this)
                    .addClass("element_selected")
                    .draggable({
                        containment: container,
                        stop: function (event, ui) {
                            elements[_nr].es.top = ui.position.top;
                            elements[_nr].es.left = ui.position.left;


                        }
                    })
                    .resizable({
                        aspectRatio: true,
                        handles: "se",
                        stop: function (event, ui) {
                            elements[_nr].es.size = ui.size.width;


                        }
                    });
            });
        }

        paint();
    },

    add_knob_bar: function (container, _nr) {

        var es = {
            std: {
                id: ["Master"],
                parrent: "new_widget_x",
                h: 100,
                w: 100,
                left: 0,
                top: 0,
                nr: _nr,
                opa: 1
            },

            start_winkel: 0,
            stop_winkel: 180,
            max: 100,
            min: 0,
            val: 100,

            glow: {
                mode: 0,
                width: 100,
                intent: 0,
                color: ""
            },
            str: {
                width: 100,
                mode: "color",
                color: 100,
                url: 100,
                opa: 1,
            },
            grad: {
                pos: [],
                color: [],
                opa: []
            }
        };

        wid.elements[_nr] = {};
        wid.elements[_nr] = es;


        function paint(_nr) {

            var es = wid.elements[_nr];
            var _es = "elements["+_nr+"].std.";

            var _turn_winkel = es.start_winkel * Math.PI / 180;
            var r = 500 - (parseInt(es.str.width) / 2) - (es.glow * 2);
            var x1 = 500 + r * Math.sin(_turn_winkel);
            var y1 = 500 - r * Math.cos(_turn_winkel);
            var winkel_max = (es.start_winkel - es.stop_winkel) * -1;
            var winkel = (winkel_max / (es.max - es.min) * (es.val - es.min));
            var x2 = 500 + r * Math.sin((winkel + parseInt(es.start_winkel)) * Math.PI / 180);
            var y2 = 500 - r * Math.cos((winkel + parseInt(es.start_winkel)) * Math.PI / 180);

            var _defs = "";
            var _g = "";
            if (es.glow.width > 0) {
                _defs += '<filter id="theBlur' + es.nr + '"' +
                    'filterUnits="userSpaceOnUse"' +
                    'x="0" y="0" width="1000" height="1000">' +
                    '<feGaussianBlur in="SourceGraphic" stdDeviation="' + es.glow.width + '" />' +
                    '</filter>'

                for (var i = 0; i < es.glow.intent; i++) {

                    _g += '<use xlink:href="#svg_knob_bar' + es.std.nr + '" style="stroke:#' + es.glow.color + '" filter="url(#theBlur' + es.std.nr + ')"/> '
                }

            }

            $(container).append('<div data-bind="style:{ left: '+_es+'left+\'px\' }"  style="position:absolute; border: 1px solid transparent;width:' + es.std.w + 'px; height:' + es.std.h + 'px" id="' + wid_id + '_' + es.std.nr + '_knob_bar">\
            <svg \
                viewBox="0 0 1000 1000"\
                width="100%" \
                height="100%"\
            >\
            <defs>\
            <path id="svg_knob_bar' + es.std.nr + '" stroke-width=' + es.str.width + ' fill="none"/>\
             ' + _defs + '\
            </defs>\
            <g id="blurred">\
                 ' + _g + '\
                <use xlink:href="#svg_knob_bar' + es.std.nr + '" style="stroke:red" " />\
            </g>\
            </svg>\
            </div>');
            ko.applyBindings(wid, document.getElementById(wid_id + '_' + es.std.nr + '_knob_bar'));



            $('#' + wid_id + '_' + es.std.nr + '_knob_bar').click(function () {
                $(".set").hide();
                $("#set" + es.std.nr).show();
                $(".element_selected")
                    .removeClass("element_selected")
                    .draggable("destroy")
                    .resizable("destroy");
                $(this)
                    .addClass("element_selected")
//                    .draggable({
//                        containment: container,
//                        stop: function (event, ui) {
//                            wid.elements[_nr].std.left(ui.position.left);
//                            wid.elements[_nr].std.top(ui.position.top);
//                        }
//                    })
//                    .resizable({
//                        aspectRatio: true,
//                        handles: "se",
//                        stop: function (event, ui) {
//                            wid.elements[_nr].std.width = ui.size.width;
//                            wid.elements[_nr].std.height = ui.size.height;
//
//
//                        }
//                    });
            });


            if (winkel < 180) {

                $('[id="svg_knob_bar' + es.std.nr + '"]').attr("d", "M" + x1 + "," + y1 + " A" + r + "," + r + " 0 0,1 " + x2 + "," + y2 + "  ");
            } else {
                $('[id="svg_knob_bar' + es.std.nr + '"]').attr("d", "M" + x1 + "," + y1 + " A" + r + "," + r + " 0 1,1 " + x2 + "," + y2 + "  ");
            }

        }


        $("#wgs_content").append('<div id="set' + es.std.nr + '" class="set"></div>');


        WF.add_es_std(_nr);
        WF.add_es_knobbar(_nr);
        WF.add_es_str(_nr);
        WF.add_es_glow(_nr);
        WF.add_es_grad(_nr);

        ko.applyBindings(wid, document.getElementById("set" + _nr));

//            new jscolor.init();

        stroke_opt();


        function stroke_opt() {
//            if (wid.elements[es.std.nr].es.stroke_mode == "color") {
//                $('#' + es.std.nr + '-stroke_color').parent().parent().show();
//
//                $('#' + es.std.nr + '-stroke_gard1').parent().parent().hide();
//                $('#' + es.std.nr + '-stroke_gard2').parent().parent().hide();
//                $('#' + es.std.nr + '-stroke_url').parent().parent().hide()
//            }
//            if (wid.elements[es.std.nr].es.stroke_mode == "img") {
//                $('#' + es.std.nr + '-stroke_url').parent().parent().show();
//
//                $('#' + es.std.nr + '-stroke_gard1').parent().parent().hide();
//                $('#' + es.std.nr + '-stroke_gard2').parent().parent().hide();
//                $('#' + es.std.nr + '-stroke_color').parent().parent().hide();
//
//            }
//            if (wid.elements[es.std.nr].es.stroke_mode == "gard") {
//                $('#' + es.std.nr + '-stroke_gard1').parent().parent().show();
//                $('#' + es.std.nr + '-stroke_gard2').parent().parent().show();
//
//                $('#' + es.std.nr + '-stroke_color').parent().parent().hide();
//                $('#' + es.std.nr + '-stroke_url').parent().parent().hide();
//            }
        }

        paint(_nr);
    },

    add_new_widget: function () {

        $("#prg_panel").append('<div id="new_widget_body" style="position:relative; border: 1px solid yellow"><div id="new_widget" style="width:500px; height:500px;   border: 1px dashed red"> </div></div>');

        $('#new_widget').resizable({

        })
    },

    add_es_knobbar: function (nr) {
        var es = 'elements[' + nr + '].';
        var data = '<div>' +
            '<button class="set_btn" id="' + nr + '_spec-btn">Spezifisch:</button><br>' +
            '<table style="display: none">' +
            '<td>Start Winkel</td>' +
            '<td><input type="number" data-bind="value: ' + es + 'start_winkel"   class="es_spec es_number"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Stop Winkel</td>' +
            '<td><input type="number" data-bind="value: ' + es + 'stop_winkel"   class="es_spec es_number"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Max</td>' +
            '<td><input type="number" data-bind="value: ' + es + 'max" class="es_spec es_number""></td>' +
            '</tr>' +
            '<tr>' +
            '<td>MIN</td>' +
            '<td><input type="number" data-bind="value: ' + es + 'min" class="es-spec es_number"></td>' +
            '</tr>' +
            '</table>' +
            '<hr>' +
            '</div>';

        $("#set" + nr).append(data);

        $('#' + nr + '_spec-btn')
            .button()
            .click(function () {
                $(this).next().next().toggle();
                $(this).removeClass("ui-state-focus")
            });

    },

    add_es_std: function (nr) {

        var es = 'elements[' + nr + '].std.';
        var data = '<div>' +
            '<button class="set_btn" id="' + nr + '_std-btn">Standart:</button><br>' +
            '<table style="display: none">' +
            '<tr>' +
            '<td width="100px">id</td>' +
            '<td><select data-bind="value: ' + es + 'id" class="id_type" id="' + nr + '_std-id">' +
            '</select></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Höhe</td>' +
            '<td><input type="number"  data-bind="value: ' + es + 'h"   class="es_std es_number"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Breite</td>' +
            '<td><input type="number"  data-bind="value: ' + es + 'w"  class="es_std es_number"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Oben</td>' +
            '<td><input type="number"  data-bind="value: ' + es + 'top" class="es_std es_number""></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Links</td>' +
            '<td><input type="number"  data-bind="value: ' + es + 'left" class="es_std es_number"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Transparens</td>' +
            '<td><input type="number" min="0.0" max="1.0" step="0.1" data-bind="value: ' + es + 'opa"  class="es_std es_number"></td>' +
            '</tr>' +
            '</table>' +
            '<hr>' +
            '</div>';

        $("#set" + nr).append(data);

        $("#" + nr + "_std-id").selectBoxIt({
            theme: "jqueryui",
            populate: wid.elements[nr].std.id
        });

        $('#' + nr + '_std-btn')
            .button()
            .click(function () {
                $(this).next().next().toggle();
                $(this).removeClass("ui-state-focus")
            });
    },
    add_es_str: function (nr) {

        var es = 'elements[' + nr + '].str.';
        var data = '<div>' +
            '<button class="set_btn" id="' + nr + '_str-btn">Stroke:</button><br>' +
            '<table style="display: none">' +
            '<tr>' +
            '<td>Breite</td>' +
            '<td><input data-bind="value: ' + es + 'width" class="es_str' + nr + '"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Transparens</td>' +
            '<td><input data-bind="value: ' + es + 'opa" class="es_str' + nr + '"></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="100px">Mode</td>' +
            '<td><select data-bind="value: ' + es + 'mode" class="id_type es_str' + nr + '" id="' + nr + '_str-mode" >' +
            '</select></td>' +
            '</tr>' +
            '<tr>' +
            '<td>color</td>' +
            '<td><input data-bind="value: ' + es + 'color" class="color es_str' + nr + '"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Image</td>' +
            '<td><input data-bind="value: ' + es + 'img" class="es_str' + nr + '"></td>' +
            '</tr>' +
            '</table>' +
            '<hr>' +
            '</div>';

        $("#set" + nr).append(data);

        $("#" + nr + "_str-mode").selectBoxIt({
            theme: "jqueryui",
            populate: ["Color", "Image", "Farbverlauf"]
        });

        $('#' + nr + '_str-btn')
            .button()
            .click(function () {
                $(this).next().next().toggle();
                $(this).removeClass("ui-state-focus")
            });


    },
    add_es_glow: function (nr) {

        var es = 'elements["' + nr + '"].glow.';
        var data = '<div>' +
            '<button class="set_btn" id="' + nr + '_glow-btn">Glow:</button><br>' +
            '<table style="display: none">' +
            '<td width="100px">Mode</td>' +
            '<td><select data-bind="value: ' + es + 'mode" class="id_type" id="' + nr + '_glow-mode">' +
            '</select></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Weite:</td>' +
            '<td><input data-bind="value: ' + es + 'width" type="number" class="es_number es_glow" id="' + nr + '_glow-width"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Stärke</td>' +
            '<td><input data-bind="value: ' + es + 'intent"  type="number" min="1" max="10" class="es_number es_glow" id="' + nr + '_glow-intent"></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Farbe</td>' +
            '<td><input data-bind="value: ' + es + 'color" class="color es_glow" id="' + nr + '_glow-Color"></td>' +
            '</tr>' +
            '</table>' +
            '<hr>' +
            '</div>';

        $("#set" + nr).append(data);

        $('#' + nr + '_glow-btn')
            .button()
            .click(function () {
                $(this).next().next().toggle();
                $(this).removeClass("ui-state-focus")
            });

        $("#" + nr + "_glow-mode").selectBoxIt({
            theme: "jqueryui",
            populate: ["Grafik", "Stroke"]
        });

    },
    add_es_grad: function (nr) {

        var es = wid.elements[nr];
        var data = '<div>' +
            '<button class="set_btn" id="' + nr + '_grad-btn">Farbverlauf:</button><br>' +
            '<table style="display: none">' +
            '</table>' +
            '<hr>' +
            '</div>';

        $("#set" + nr).append(data);

        $('#' + nr + '_grad-btn')
            .button()
            .click(function () {
                $(this).next().next().toggle();
                $(this).removeClass("ui-state-focus")
            });

        $(".es_grad").change(function () {
            var nr = $(this).attr("id").split("_")[0];

            elements[nr].grad[attr] = $(this).val()
        })

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
var elem_settings' + this.nr + ' = {\n\
 parrent: "new_widget_x",\n\
stroke_w: ' + this.es.stroke_w + ',\n\
start_winkel:  ' + this.es.start_winkel + ',\n\
stop_winkel:  ' + this.es.stop_winkel + ',\n\
w:  "' + this.es.w + '",\n\
h:  "' + this.es.h + '",\n\
max:  ' + this.es.max + ',\n\
min:  ' + this.es.min + ',\n\
val:  ' + this.es.val + ',\n\
nr:  ' + this.es.std.nr + ',\n\
left:' + this.es.left + ',\n\
top:' + this.es.top + ',\n\
 };\n\
 var _turn_winkel = es.start_winkel * Math.PI / 180;\n\
 var r = 500 - (parseInt(es.stroke_w)/2);\n\
 var x1 = 500 + r * Math.sin(_turn_winkel);\n\
 var y1 = 500 - r * Math.cos(_turn_winkel);\n\
 var winkel_max = (es.start_winkel - es.stop_winkel) * -1;\n\
 var winkel = (winkel_max / (es.max - es.min) * (es.val - es.min));\n\
 var x2 = 500 + r * Math.sin((winkel + parseInt(es.start_winkel)) * Math.PI / 180);\n\
 var y2 = 500 - r * Math.cos((winkel + parseInt(es.start_winkel)) * Math.PI / 180);\n\
$("#new_widget_x").prepend(\'<div style="position:absolute; top:' + this.es.top + 'px; left:' + this.es.left + 'px; border: 1px solid green;width:' + this.es.w + '; height:' + this.es.h + ' " id="' + wid_id + '_' + this.es.std.nr + '_knob_bar"><svg viewBox="0 0 1000 1000" width="100%" height="100%"><path name="svg_knob_bar' + this.es.std.nr + '" stroke="blue" stroke-width=' + this.es.stroke_w + ' fill="none"/></svg></div>\'); \n\
\
if ((winkel * 180 / Math.PI) - elem_settings' + this.nr + '.start_winkel > 180) {\n\
$(\'[name="svg_knob_bar' + this.es.std.nr + '"]\').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 0,1 " + x2 + "," + y2 + "  ");\n\
} else {\n\
$(\'[name="svg_knob_bar' + this.es.std.nr + '"]\').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 1,1 " + x2 + "," + y2 + "  ");\n\
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

