/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */

var wid_id = "W00001";

var elements = {

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
        });

        $("#backcolor_var")
            .change(function () {
                $("#prg_panel").css({"background-color": $(this).css("background-color")})
            });

        $("#backcolor_black,#backcolor_white, #backcolor_var ").click(function () {
            $("#prg_panel").css({"background-color": $(this).css("background-color")})
        })
    },

    add_knob_bar: function (container, _nr) {

        WF.add_widget_elem_settings("knob_bar");

        elements[_nr] = {};
        elements[_nr]["type"] = "knob_bar";
        elements[_nr]["nr"] = _nr;
        elements[_nr]["name"] = wid_id + '_' + _nr + "_knob_bar";
        elements[_nr]["elem_settings"] = {};
        var elem_settings = {
            parrent: elements[_nr].elem_settings.parrent || "new_widget_x",
            stroke_w: elements[_nr].elem_settings.stroke_w || 100,
            stroke_mode: elements[_nr].elem_settings.stroke_w || 100,
            stroke_color: elements[_nr].elem_settings.stroke_w || 100,
            stroke_url: elements[_nr].elem_settings.stroke_w || 100,
            stroke_gard1: elements[_nr].elem_settings.stroke_w || 100,
            stroke_gard2: elements[_nr].elem_settings.stroke_w || 100,
            start_winkel: elements[_nr].elem_settings.start_winkel || 0,
            stop_winkel: elements[_nr].elem_settings.stop_winkel || 180,
            size: elements[_nr].elem_settings.size || 300,
            max: elements[_nr].elem_settings.max || 100,
            min: elements[_nr].elem_settings.min || 0,
            val: elements[_nr].elem_settings.val || 100,
            nr: elements[_nr].elem_settings.nr || _nr,
            left: elements[_nr].elem_settings.left || 0,
            top: elements[_nr].elem_settings.top || 0,
            glow: elements[_nr].elem_settings.glow || 0,
            glow_intent: elements[_nr].elem_settings.glow_intent || 0,
            glow_color: elements[_nr].elem_settings.glow_color || 808080

        };

        elements[_nr]["elem_settings"] = elem_settings;

        function paint() {

            var elem_settings = elements[_nr]["elem_settings"];
            var _turn_winkel = elem_settings.start_winkel * Math.PI / 180;
            var r = 500 - (parseInt(elem_settings.stroke_w) / 2) - (elem_settings.glow * 2);
            var x1 = 500 + r * Math.sin(_turn_winkel);
            var y1 = 500 - r * Math.cos(_turn_winkel);
            var winkel_max = (elem_settings.start_winkel - elem_settings.stop_winkel) * -1;
            var winkel = (winkel_max / (elem_settings.max - elem_settings.min) * (elem_settings.val - elem_settings.min));
            var x2 = 500 + r * Math.sin((winkel + parseInt(elem_settings.start_winkel)) * Math.PI / 180);
            var y2 = 500 - r * Math.cos((winkel + parseInt(elem_settings.start_winkel)) * Math.PI / 180);

            var _defs = "";
            var _g = "";
            if (elem_settings.glow > 0) {
                _defs += '<filter id="theBlur' + elem_settings.nr + '"' +
                    'filterUnits="userSpaceOnUse"' +
                    'x="0" y="0" width="1000" height="1000">' +
                    '<feGaussianBlur in="SourceGraphic" stdDeviation="' + elem_settings.glow + '" />' +
                    '</filter>'

                for (var i = 0; i < elem_settings.glow_intent; i++) {

                    _g += '<use xlink:href="#svg_knob_bar' + elem_settings.nr + '" style="stroke:#' + elem_settings.glow_color + '" filter="url(#theBlur' + elem_settings.nr + ')"/> '
                }

            }


            $(container).append('<div style="position:absolute; top:' + elem_settings.top + 'px; left:' + elem_settings.left + 'px; border: 1px solid transparent;width:' + elem_settings.size + 'px; height:' + elem_settings.size + 'px" id="' + wid_id + '_' + elem_settings.nr + '_knob_bar">\
            <svg \
                viewBox="0 0 1000 1000"\
                width="100%" \
                height="100%"\
            >\
            <defs>\
            <path id="svg_knob_bar' + elem_settings.nr + '" stroke-width=' + elem_settings.stroke_w + ' fill="none"/>\
          ' + _defs + '\
            </defs>\
            <g id="blurred">\
                 ' + _g + '\
                <use xlink:href="#svg_knob_bar' + elem_settings.nr + '" style="stroke:red" " />\
            </g>\
            </svg>\
            </div>');

            $('#' + wid_id + '_' + elem_settings.nr + '_knob_bar')


                .click(function () {
                    $(".set").hide();
                    $("#set" + elem_settings.nr).show();
                    $(".element_selected")
                        .removeClass("element_selected")
                        .draggable("destroy")
                        .resizable("destroy");
                    $(this)
                        .addClass("element_selected")
                        .draggable({
                            containment: container,
                            stop: function (event, ui) {
                                elements[_nr].elem_settings.top = ui.position.top;
                                elements[_nr].elem_settings.left = ui.position.left;
                                add_settings()

                            }
                        })
                        .resizable({
                            aspectRatio: true,
                            handles: "se",
                            stop: function (event, ui) {
                                elements[_nr].elem_settings.size = ui.size.width;

                                add_settings()

                            }
                        });
                });


            if (winkel < 180) {

                $('[id="svg_knob_bar' + elem_settings.nr + '"]').attr("d", "M" + x1 + "," + y1 + " A" + r + "," + r + " 0 0,1 " + x2 + "," + y2 + "  ");
            } else {
                $('[id="svg_knob_bar' + elem_settings.nr + '"]').attr("d", "M" + x1 + "," + y1 + " A" + r + "," + r + " 0 1,1 " + x2 + "," + y2 + "  ");
            }

        }


        function add_settings() {
            $("#set" + elem_settings.nr).remove();
            $("#wgs_content").append('' +
                    '<div id="set' + elem_settings.nr + '" class="set">' +
                    '<hr>' +
                    '<table>' +
                    '<tr>' +
                    '<td width="100px">id_type</td>' +
                    '<td><select class="id_type" id="id_type' + elem_settings.nr + '">' +
                    '<option value="hmid">ID</option>' +
                    '<option value="child">Verärbung</option>' +
                    '<option value="var">Variable</option>' +
                    '</select></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stroke_w</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.stroke_w + '" class="element_elem_settings" id="' + elem_settings.nr + '-stroke_w"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stroke_Mode</td>' +
                    '<td><select value="' + elements[_nr].elem_settings.stroke_w + '" class="element_elem_settings" id="' + elem_settings.nr + '-stroke_mode">' +
                    '<option value="color">color</option>' +
                    '<option value="img">image</option>' +
                    '<option value="gard">Farbverlauf</option>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stroke_color</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.stroke_w + '" class="color element_elem_settings" id="' + elem_settings.nr + '-stroke_color"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stroke_url</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.stroke_w + '" class="color element_elem_settings" id="' + elem_settings.nr + '-stroke_url"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stroke_gard1</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.stroke_w + '" class="color element_elem_settings" id="' + elem_settings.nr + '-stroke_gard1"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stroke_gard2</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.stroke_w + '" class="color element_elem_settings" id="' + elem_settings.nr + '-stroke_gard2"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>start_winkel</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.start_winkel + '"  class="element_elem_settings" id="' + elem_settings.nr + '-start_winkel"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>stop_winkel</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.stop_winkel + '"  class="element_elem_settings" id="' + elem_settings.nr + '-stop_winkel"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Größe</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.size + '"  class="element_elem_settings" id="' + elem_settings.nr + '-size"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Links</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.left + '"   class="element_elem_settings" id="' + elem_settings.nr + '-left"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Oben</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.top + '"  class="element_elem_settings" id="' + elem_settings.nr + '-top"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>max</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.max + '" class="element_elem_settings" id="' + elem_settings.nr + '-max"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>min</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.min + '" class="element_elem_settings" id="' + elem_settings.nr + '-min"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>val</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.val + '" class="element_elem_settings" id="' + elem_settings.nr + '-val"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Glow</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.glow + '" class="element_elem_settings" id="' + elem_settings.nr + '-glow"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Glow intent</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.glow_intent + '" class="element_elem_settings" style="width:30px" type="number" max=9 min=0 id="' + elem_settings.nr + '-glow_intent"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Glow color</td>' +
                    '<td><input value="' + elements[_nr].elem_settings.glow_color + '"class="color element_elem_settings" id="' + elem_settings.nr + '-glow_color"></td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>'
            );
            new jscolor.init();
            $('#id_type' + elem_settings.nr).selectBoxIt({
                theme: "jqueryui",
            });

            $(".element_elem_settings").change(function () {
                var _element = $(this).attr("id").split("-");

                elements[_element[0]].elem_settings[_element[1]] = $(this).val();

                $('#' + wid_id + '_' + elem_settings.nr + '_knob_bar').remove();
                paint();
            });
        }

        paint();
        add_settings();

    },

    add_new_widget: function () {

        $("#prg_panel").append('<div id="new_widget_body" style="position:relative; border: 1px solid yellow"><div id="new_widget" style="width:500px; height:500px;   border: 1px dashed red"> </div></div>')

        $('#new_widget').resizable({

        })
    },

    add_widget_elem_settings: function (type) {


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
stroke_w: ' + this.elem_settings.stroke_w + ',\n\
start_winkel:  ' + this.elem_settings.start_winkel + ',\n\
stop_winkel:  ' + this.elem_settings.stop_winkel + ',\n\
w:  "' + this.elem_settings.w + '",\n\
h:  "' + this.elem_settings.h + '",\n\
max:  ' + this.elem_settings.max + ',\n\
min:  ' + this.elem_settings.min + ',\n\
val:  ' + this.elem_settings.val + ',\n\
nr:  ' + this.elem_settings.nr + ',\n\
left:' + this.elem_settings.left + ',\n\
top:' + this.elem_settings.top + ',\n\
 };\n\
 var _turn_winkel = elem_settings.start_winkel * Math.PI / 180;\n\
 var r = 500 - (parseInt(elem_settings.stroke_w)/2);\n\
 var x1 = 500 + r * Math.sin(_turn_winkel);\n\
 var y1 = 500 - r * Math.cos(_turn_winkel);\n\
 var winkel_max = (elem_settings.start_winkel - elem_settings.stop_winkel) * -1;\n\
 var winkel = (winkel_max / (elem_settings.max - elem_settings.min) * (elem_settings.val - elem_settings.min));\n\
 var x2 = 500 + r * Math.sin((winkel + parseInt(elem_settings.start_winkel)) * Math.PI / 180);\n\
 var y2 = 500 - r * Math.cos((winkel + parseInt(elem_settings.start_winkel)) * Math.PI / 180);\n\
$("#new_widget_x").prepend(\'<div style="position:absolute; top:' + this.elem_settings.top + 'px; left:' + this.elem_settings.left + 'px; border: 1px solid green;width:' + this.elem_settings.w + '; height:' + this.elem_settings.h + ' " id="' + wid_id + '_' + this.elem_settings.nr + '_knob_bar"><svg viewBox="0 0 1000 1000" width="100%" height="100%"><path name="svg_knob_bar' + this.elem_settings.nr + '" stroke="blue" stroke-width=' + this.elem_settings.stroke_w + ' fill="none"/></svg></div>\'); \n\
\
if ((winkel * 180 / Math.PI) - elem_settings' + this.nr + '.start_winkel > 180) {\n\
$(\'[name="svg_knob_bar' + this.elem_settings.nr + '"]\').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 0,1 " + x2 + "," + y2 + "  ");\n\
} else {\n\
$(\'[name="svg_knob_bar' + this.elem_settings.nr + '"]\').attr("d", "M" + x1 + "," + y1 + " A"+r+","+r+" 0 1,1 " + x2 + "," + y2 + "  ");\n\
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

