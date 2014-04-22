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

        $("#toolbox_body").perfectScrollbar({
            wheelSpeed: 60
        });

        $("#sim_output_body").perfectScrollbar({
            wheelSpeed: 20
        });


        // Toolbox XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $(".toolbox").hide();


        var box_init = storage.get(WF.str_tollbox) || ["Allgemain", "alg"];
        // Make btn Toolboxauswahl
        $("#toolbox_select").xs_combo({
            addcssButton: "xs_button_toolbox",
            addcssMenu: "xs_menu_toolbox",
            addcssFocus: "xs_focus_toolbox",
            cssText: "xs_text_toolbox item_font",
            time: 750,
            val: box_init[0],
            data: [
                "Allgemein",
                "Programme",
                "Logic",
                "Listen Filter",
                "Get Set Var",
                "Math.",
                "Singel Trigger",
                "Zeit Trigger",
                "Trigger Daten",
                "Expert"
            ]

        });


        $("#toolbox_" + box_init[1]).show();

        // Toolboxauswahl
        $("#toolbox_select").change(function () {
            var val = $("#toolbox_select").xs_combo();
            var box = "";

            if (val == "Allgemein") {
                box = "alg"
            }
            if (val == "Programme") {
                box = "prog"
            }
            if (val == "Logic") {
                box = "logic"
            }
            if (val == "Listen Filter") {
                box = "filter"
            }
            if (val == "Get Set Var") {
                box = "io"
            }
            if (val == "Singel Trigger") {
                box = "s_trigger"
            }
            if (val == "Zeit Trigger") {
                box = "t_trigger"
            }
            if (val == "Trigger Daten") {
                box = "trigger_daten"
            }
            if (val == "Expert") {
                box = "expert"
            }
            if (val == "Math.") {
                box = "math"
            }
//            if(val ==""){box = ""}
//            if(val ==""){box = ""}
//            if(val ==""){box = ""}
            $(".toolbox").hide();
            $("#toolbox_" + box).show();
            storage.set(WF.str_tollbox, [val, box]);
        })


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
    },




};


var homematic = {
    uiState: new can.Observe({"_65535": {"Value": null}}),
    setState: new can.Observe({"_65535": {"Value": null}}),
    regaIndex: {},
    regaObjects: {},
    setStateTimers: {}
};

var Compiler = {

    script: "",

    make_prg: function (sim) {

        Compiler.trigger = "// Trigger\n";
        Compiler.obj = "// CCU.IO Objekte\n";
        Compiler.script = "";

        WF.make_struc();

        $.each(PRG.struck.trigger, function () {
            var $trigger = this.mbs_id;

            var targets = "";
            $.each(this.target, function () {
                if (this[1] == 0) {
                    targets += " " + this[0] + "(data);\n"
                } else
                    targets += " setTimeout(function(){ " + this[0] + "(data)}," + this[1] * 1000 + ");\n"
            });


            if (PRG.mbs[$trigger].type == "trigger_valNe") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger = 'subscribe({id: ' + this + ' , valNe:false}, function (data){\n' + targets + ' }); \n' + Compiler.script;
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_event") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger += 'subscribe({id: ' + this + '}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_EQ") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger += 'subscribe({id: ' + this + ' , change:"eq"}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_NE") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger += 'subscribe({id: ' + this + ' , change:"ne"}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_GT") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger += 'subscribe({id: ' + this + ' , change:"gt"}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_GE") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger += 'subscribe({id: ' + this + ' , change:"ge"}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_LT") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger += 'subscribe({id: ' + this + ' , change:"lt"}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_LE") {

                $.each(PRG.mbs[$trigger].hmid, function () {
                    Compiler.trigger += 'subscribe({id: ' + this + ' , change:"le"}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_val") {

                $.each(PRG.mbs[$trigger].hmid, function (index) {
                    Compiler.trigger += 'subscribe({id: ' + this + ' , ' + PRG.mbs[$trigger]["val"][index] + ':' + PRG.mbs[$trigger]["wert"][index] + '}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_time") {

                $.each(PRG.mbs[$trigger].time, function (index) {
                    var _time = this;

                    var m = this.split(":")[1];
                    var h = this.split(":")[0];

                    var day = "";
                    var _day = PRG.mbs[$trigger].day[index];

                    switch (_day) {
                        case "88":
                            day = "*";
                            break;
                        case "1":
                            day = "1";
                            break;
                        case "2":
                            day = "2";
                            break;
                        case "3":
                            day = "3";
                            break;
                        case "4":
                            day = "4";
                            break;
                        case "5":
                            day = "5";
                            break;
                        case "6":
                            day = "6";
                            break;
                        case "7":
                            day = "7";
                            break;
                        case "8":
                            day = "1-5";
                            break;
                        case "9":
                            day = "6-7";
                            break;

                    }
                    Compiler.trigger += 'schedule("' + m + ' ' + h + ' * * ' + day + '", function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_astro") {

                $.each(PRG.mbs[$trigger].astro, function (index) {

                    Compiler.trigger += 'schedule({astro:"' + this + '", shift:' + PRG.mbs[$trigger].minuten[index] + '}, function (data){\n' + targets + ' }); \n'
                });
            }
            if (PRG.mbs[$trigger].type == "trigger_zykm") {

                Compiler.trigger += 'schedule(" */' + PRG.mbs[$trigger].time + ' * * * * ", function (data){\n' + targets + ' }); \n'

            }
            if (PRG.mbs[$trigger].type == "trigger_vartime") {
                var n = PRG.mbs[$trigger].hmid.length;
                Compiler.trigger += 'schedule(" * * * * * ", function (data){';
                Compiler.trigger += 'var d = new Date();';
                Compiler.trigger += 'var h = (d.getHours() < 10) ? "0"+d.getHours() : d.getHours();';
                Compiler.trigger += 'var m = (d.getMinutes() < 10) ? "0"+d.getMinutes() : d.getMinutes();';
                Compiler.trigger += 'var now = h.toString() + ":" + m.toString() +":00";';
                Compiler.trigger += 'if('
                $.each(PRG.mbs[$trigger].hmid, function (index, obj) {
                    console.log(n)
                    Compiler.trigger += 'homematic.uiState["_"+' + this + '] == now';
                    if (index + 1 < n) {
                        Compiler.trigger += ' || ';
                    }
                });
                Compiler.trigger += '){' + targets + '});'

            }
            if (PRG.mbs[$trigger].type == "scriptobj") {

                Compiler.obj += 'var ' + PRG.mbs[$trigger].name + '; \n';

            }
            if (PRG.mbs[$trigger].type == "ccuobj") {

                Compiler.obj += 'setObject(' + PRG.mbs[$trigger].hmid + ', { Name: "' + PRG.mbs[$trigger]["name"] + '", TypeName: "VARDP"}); \n'

            }
            if (PRG.mbs[$trigger].type == "ccuobjpersi") {

                Compiler.obj += 'setObject(' + PRG.mbs[$trigger].hmid + ', { Name: "' + PRG.mbs[$trigger]["name"] + '", TypeName: "VARDP" , _persident:true}); \n'

            }
            if (PRG.mbs[$trigger].type == "trigger_start") {

                $.each(this.target, function () {
                    if (this[1] == 0) {
                        Compiler.trigger += 'var start_data =';
                        Compiler.trigger += '{';
                        Compiler.trigger += '    id:0,';
                        Compiler.trigger += '    name:"Engine_Start",';
                        Compiler.trigger += '    newState: {';
                        Compiler.trigger += '        value:0,';
                        Compiler.trigger += '        timestamp:0,';
                        Compiler.trigger += '        ack:0,';
                        Compiler.trigger += '        lastchange:0,';
                        Compiler.trigger += '    },';
                        Compiler.trigger += '    oldState: {';
                        Compiler.trigger += '            value:0,';
                        Compiler.trigger += '            timestamp:0,';
                        Compiler.trigger += '            ack:0,';
                        Compiler.trigger += '            lastchange:0,';
                        Compiler.trigger += '    },';
                        Compiler.trigger += '    channel: {';
                        Compiler.trigger += '            id:0,';
                        Compiler.trigger += '            name:"Engine_Start",';
                        Compiler.trigger += '            type:"Engine_Start",';
                        Compiler.trigger += '            funcIds:"Engine_Start",';
                        Compiler.trigger += '            roomIds:"Engine_Start",';
                        Compiler.trigger += '            funcNames:"Engine_Start",';
                        Compiler.trigger += '            roomNames:"Engine_Start",';
                        Compiler.trigger += '    },';
                        Compiler.trigger += '    device: {';
                        Compiler.trigger += '            id:0,';
                        Compiler.trigger += '            name:"Engine_Start",';
                        Compiler.trigger += '            type:"Engine_Start",';
                        Compiler.trigger += '    }';
                        Compiler.trigger += '};';
                        Compiler.trigger += " " + this[0] + "(start_data);\n"
                    } else
                        Compiler.trigger += " setTimeout(function(start_data){ " + this[0] + "()}," + this[1] * 1000 + ");\n"
                });
            }
        });
        Compiler.script += Compiler.obj;
        Compiler.script += Compiler.trigger;

        Compiler.script += '\n';

        $.each(PRG.struck.codebox, function (idx) {
            Compiler.script += '//' + PRG.mbs[idx].titel + '\n';
            Compiler.script += 'function ' + idx + '(data){ \n';
            $.each(this[0], function () {
                var $fbs = this.fbs_id;

                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "input") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= getState(' + PRG.fbs[$fbs].hmid + ');\n';
                }
                if (this["type"] == "inputlocal") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= ' + this.hmid + ';\n';
                }
                if (this["type"] == "output") {
                    Compiler.script += 'setState(' + this.hmid + ',' + this["input"][0]["herkunft"] + ');\n';
                }
                if (this["type"] == "outputlocal") {
                    Compiler.script += this.hmid + ' = ' + this["input"][0]["herkunft"] + ' ;\n';
                }
                if (this["type"] == "debugout") {
                    Compiler.script += 'log("' + WF.file_name + ' -> ' + PRG.mbs[PRG.fbs[$fbs]["parent"].split("prg_")[1]].titel + ' -> " + ' + this["input"][0]["herkunft"] + ');\n';
                }
                if (this["type"] == "pushover") {
                    Compiler.script += 'pushover({message:' + this["input"][0]["herkunft"] + '});\n';
                }
                if (this["type"] == "mail") {
                    var n = this["input"].length;

                    function SortByName(a, b) {
                        var aName = a.eingang;
                        var bName = b.eingang;
                        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                    }

                    this["input"].sort(SortByName);
                    Compiler.script += 'email({to: ' + this["input"][0].herkunft + ',subject: ' + this["input"][1].herkunft + ',text: ' + this["input"][2].herkunft + '});\n';
                }
                if (this["type"] == "true") {
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = true;\n';
                }
                if (this["type"] == "false") {
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = false;\n';
                }
                if (this["type"] == "zahl") {
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = ' + PRG.fbs[$fbs]["value"] + ' ;\n';
                }
                if (this["type"] == "string") {
                    var lines = PRG.fbs[$fbs]["value"].split("\n") || PRG.fbs[$fbs]["value"];
                    var daten = "";
                    $.each(lines, function () {
                        daten = daten + this.toString() + " ";
                    });
                    Compiler.script += 'var ' + this.output[0].ausgang + '= "' + daten.slice(0, -1) + '" ;\n';
                }

                if (this["type"] == "vartime") {
                    var d = new Date();
                    daten = "var d = new Date();\n";

                    if (PRG.fbs[$fbs]["value"] == "zeit_k") {
                        daten += 'var h = (d.getHours() < 10) ? "0"+d.getHours() : d.getHours();\n';
                        daten += 'var m = (d.getMinutes() < 10) ? "0"+d.getMinutes() : d.getMinutes();\n';

                        daten += 'var ' + this.output[0].ausgang + ' = h + ":" + m;\n';
                    } else if (PRG.fbs[$fbs]["value"] == "zeit_l") {
                        daten += 'var h = (d.getHours() < 10) ? "0"+d.getHours() : d.getHours();\n';
                        daten += 'var m = (d.getMinutes() < 10) ? "0"+d.getMinutes() : d.getMinutes();\n';
                        daten += 'var s = (d.getSeconds() < 10) ? "0"+d.getSeconds() : d.getSeconds();\n';

                        daten += 'var ' + this.output[0].ausgang + ' = h + ":" + m + ":" + s;\n';

                    } else if (PRG.fbs[$fbs]["value"] == "date_k") {
                        daten += 'var ' + this.output[0].ausgang + ' = ';
                        daten += 'd.getUTCDate() + "." + (d.getUTCMonth()+1) + "." + d.getFullYear();'

                    } else if (PRG.fbs[$fbs]["value"] == "date_l") {
                        daten += 'var ' + this.output[0].ausgang + ' = ';
                        daten += 'd.getUTCDate() + "." + (d.getUTCMonth()+1) + "." + d.getFullYear() + " " + d.getHours().toString() + ":" + d.getMinutes().toString();'
                    } else if (PRG.fbs[$fbs]["value"] == "mm") {
                        daten += 'var ' + this.output[0].ausgang + ' = ';
                        daten += 'd.getMinutes().toString();'

                    } else if (PRG.fbs[$fbs]["value"] == "hh") {
                        daten += 'var ' + this.output[0].ausgang + ' = ';
                        daten += 'd.getHours().toString();'

                    } else if (PRG.fbs[$fbs]["value"] == "WD") {
                        daten += ' var weekday=new Array();\n';
                        daten += ' weekday[0]="Sonntag";\n';
                        daten += ' weekday[1]="Montag";\n';
                        daten += ' weekday[2]="Dienstag";\n';
                        daten += ' weekday[3]="Mittwoch";\n';
                        daten += ' weekday[4]="Donnerstag";\n';
                        daten += ' weekday[5]="Freitag";\n';
                        daten += ' weekday[6]="Samstag";\n';
                        daten += 'var ' + this.output[0].ausgang + ' = ';

                        daten += 'weekday[d.getUTCDay()];'

                    } else if (PRG.fbs[$fbs]["value"] == "KW") {

                        daten += 'var KWDatum = new Date();\n';
                        daten += 'var DonnerstagDat = new Date(KWDatum.getTime() + (3-((KWDatum.getDay()+6) % 7)) * 86400000);\n';
                        daten += 'var KWJahr = DonnerstagDat.getFullYear();\n';
                        daten += 'var DonnerstagKW = new Date(new Date(KWJahr,0,4).getTime() +(3-((new Date(KWJahr,0,4).getDay()+6) % 7)) * 86400000);\n';
                        daten += 'var KW = Math.floor(1.5 + (DonnerstagDat.getTime() - DonnerstagKW.getTime()) / 86400000/7);\n';
                        daten += 'var ' + this.output[0].ausgang + ' = KW;\n';

                    } else if (PRG.fbs[$fbs]["value"] == "MM") {
                        daten += ' var month=new Array();\n';
                        daten += ' month[0]="Jannuar";\n';
                        daten += ' month[1]="Februar";\n';
                        daten += ' month[2]="März";\n';
                        daten += ' month[3]="April";\n';
                        daten += ' month[4]="Mai";\n';
                        daten += ' month[5]="Juni";\n';
                        daten += ' month[6]="Juli";\n';
                        daten += ' month[7]="August";\n';
                        daten += ' month[8]="September";\n';
                        daten += ' month[9]="Oktober";\n';
                        daten += ' month[10]="November";\n';
                        daten += ' month[11]="Dezember";\n';
                        daten += 'var ' + this.output[0].ausgang + ' = ';
                        daten += 'month[d.getUTCMonth()];'
                    } else if (PRG.fbs[$fbs]["value"] == "roh") {
                        daten += 'var ' + this.output[0].ausgang + ' = ';
                        daten += 'Date.now();'
                    }

                    daten += "\n";
                    Compiler.script += daten;
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "trigvalue") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.newState.value;\n';
                }
                if (this["type"] == "trigtime") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.newState.timestamp;\n';
                }
                if (this["type"] == "trigoldvalue") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.oldState.value;\n';
                }
                if (this["type"] == "trigoldtime") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.oldState.timestamp;\n';
                }
                if (this["type"] == "trigid") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.id;\n';
                }
                if (this["type"] == "trigname") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.name;\n';
                }
                if (this["type"] == "trigchid") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.channel.id;\n';
                }
                if (this["type"] == "trigchname") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.channel.name;\n';
                }
                if (this["type"] == "trigchtype") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.channel.type;\n';
                }
                if (this["type"] == "trigchfuncIds") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.channel.funcIds;\n';
                }
                if (this["type"] == "trigchroomIds") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.channel.roomIds;\n';
                }
                if (this["type"] == "trigchfuncNames") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.channel.funcNames;\n';
                }
                if (this["type"] == "trigchroomNames") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.channel.roomNames;\n';
                }
                if (this["type"] == "trigdevid") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.device.id;\n';
                }
                if (this["type"] == "trigdevname") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.device.name;\n';
                }
                if (this["type"] == "trigdevtype") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= data.device.type;\n';
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "oder") {
                    var n = this["input"].length;
                    Compiler.script += 'if(';
                    $.each(this["input"], function (index, obj) {
                        Compiler.script += obj.herkunft + ' == true';
                        if (index + 1 < n) {
                            Compiler.script += ' || ';
                        }
                    });
                    Compiler.script += '){\nvar ' + this.output[0].ausgang + ' = true;\n}else{\nvar ' + this.output[0].ausgang + ' = false;}\n'
                }
                if (this["type"] == "und") {
                    var n = this["input"].length;
                    Compiler.script += 'if(';
                    $.each(this["input"], function (index, obj) {
                        Compiler.script += obj.herkunft + ' == true';
                        if (index + 1 < n) {
                            Compiler.script += ' && ';
                        }
                    });
                    Compiler.script += '){\nvar ' + this.output[0].ausgang + ' = true;\n}else{\nvar ' + this.output[0].ausgang + ' = false;}\n'
                }
                if (this["type"] == "verketten") {
                    var n = this["input"].length;

                    function SortByName(a, b) {
                        var aName = a.eingang;
                        var bName = b.eingang;
                        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                    }

                    this["input"].sort(SortByName);
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = ';
                    $.each(this["input"], function (index, obj) {
                        Compiler.script += obj.herkunft;
                        if (index + 1 < n) {
                            Compiler.script += ' + ';
                        }
                    });
                    Compiler.script += ';\n';
                }

                if (this["type"] == "not") {
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = !' + this["input"][0]["herkunft"] + '\n';
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "inc") {
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = ' + this["input"][0]["herkunft"] + '+1;\n';
                }
                if (this["type"] == "dec") {
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = ' + this["input"][0]["herkunft"] + '-1;\n';
                }
                if (this["type"] == "summe") {
                    var n = this["input"].length;
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = ';

                    $.each(this["input"], function (index, obj) {
                        Compiler.script += obj.herkunft;
                        if (index + 1 < n) {
                            Compiler.script += ' + ';
                        }
                    });
                    Compiler.script += ';\n';
                }
                if (this["type"] == "differenz") {
                    var n = this["input"].length;
                    Compiler.script += 'var ' + this.output[0].ausgang + ' = ';

                    $.each(this["input"], function (index, obj) {
                        Compiler.script += obj.herkunft;
                        if (index + 1 < n) {
                            Compiler.script += ' - ';
                        }
                    });
                    Compiler.script += ';\n';
                }

                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "next") {
                    var targets = "";
                    $.each(this.target, function () {
                        if (this[1] == 0) {
                            targets += this[0] + "(data);\n"
                        } else if (sim) {
                            targets += 'setTimeout(function(){simout("' + $fbs + '","run");\n ' + this[0] + '(data)},' + this[1] * 1000 + ');\n';
                        } else {
                            targets += 'setTimeout(function(){ ' + this[0] + '(data)},' + this[1] * 1000 + ');\n';
                        }

                    });
                    Compiler.script += targets;
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "next1") {
                    var targets = "";
                    var $this = this;

                    $.each(this.target, function () {
                        if (this[1] == 0) {
                            targets += "if(" + $this["input"][0].herkunft + " == true){" + this[0] + " (data);}\n"
                        } else
                            targets += "if(" + $this["input"][0].herkunft + " == true){setTimeout(function(data){ " + this[0] + "()}," + this[1] * 1000 + ");}\n"
                    });
                    Compiler.script += targets;
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "wenn") {
                    Compiler.script += 'if(' + this["input"][0].herkunft + ' ' + PRG.fbs[this.fbs_id]["value"] + ' ' + this["input"][1].herkunft + '){\nvar ' + this.output[0].ausgang + ' = true;\n}else{\nvar ' + this.output[0].ausgang + ' = false;}\n';
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "expert") {

                    $.each(this["input"], function (id) {
                        Compiler.script += 'var in' + (id + 1) + ' = ' + this.herkunft + ' ;\n';
                    });
                    $.each(this["output"], function (id) {
                        Compiler.script += 'var out' + (id + 1) + ' = 0 ;\n';
                    });

                    if (PRG.fbs[this.fbs_id]["value"] != 0) {
                        Compiler.script += PRG.fbs[this.fbs_id]["value"] + "\n";
                    }

                    this["output"].sort(function (a, b) {
                        return a.ausgang > b.ausgang;
                    });

                    var last = "";
                    var index = 0;
                    $.each(this["output"], function () {
                        if (this.ausgang != last) {
                            last = this.ausgang;
                            index++;
                            Compiler.script += 'var ' + this.ausgang + ' = out' + (index) + ' ;\n';
                        }
                    });
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "linput") {
                    Compiler.script += 'var ' + this.output[0].ausgang + '= regaObjects[' + this.hmid + ']["Channels"];\n';
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "lfdevice") {

                    var data = "";
                    for (var i = 0; i < this.hmid.length; i++) {
                        data += 'regaObjects[regaObjects[' + this["input"][0].herkunft + '[i]]["Parent"]]["HssType"] == "' + this.hmid[i] + '" ';

                        if (i + 1 < this.hmid.length) {
                            data += '|| '
                        }
                    }

                    Compiler.script += 'var ' + this.output[0].ausgang + '= [];\n';
                    Compiler.script += 'for(var i = 0;i<' + this["input"][0].herkunft + '.length;i++){\n';
                    Compiler.script += '  if(regaObjects[' + this["input"][0].herkunft + '[i]]["Parent"] != undefined){;\n';
                    Compiler.script += '    if (' + data + '){\n';
                    Compiler.script += ' ' + this.output[0].ausgang + '.push(' + this["input"][0].herkunft + '[i]);\n';
                    Compiler.script += '    }\n';
                    Compiler.script += '    }\n';
                    Compiler.script += '}\n';
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "lfchannel") {

                    var data = "";
                    for (var i = 0; i < this.hmid.length; i++) {
                        data += 'regaObjects[' + this["input"][0].herkunft + '[i]]["ChnLabel"] == "' + this.hmid[i] + '" ';
                        if (i + 1 < this.hmid.length) {
                            data += '|| '
                        }
                    }

                    Compiler.script += 'var ' + this.output[0].ausgang + '= [];\n';
                    Compiler.script += 'for(var i = 0;i<' + this["input"][0].herkunft + '.length;i++){\n';
                    Compiler.script += '    if (' + data + '){\n';
                    Compiler.script += ' ' + this.output[0].ausgang + '.push(' + this["input"][0].herkunft + '[i]);\n';
                    Compiler.script += '    }\n';
                    Compiler.script += '};\n';
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "lfdp") {

                    var data = "";
                    for (var i = 0; i < this.hmid.length; i++) {
                        data += 'property == "' + this.hmid[i] + '" ';
                        if (i + 1 < this.hmid.length) {
                            data += '|| '
                        }
                    }

                    Compiler.script += 'var ' + this.output[0].ausgang + '= [];\n';
                    Compiler.script += 'for(var i = 0;i<' + this["input"][0].herkunft + '.length;i++){\n';
                    Compiler.script += 'var _dp = regaObjects[' + this["input"][0].herkunft + '[i]]["DPs"]\n';
                    Compiler.script += '    for(var property in _dp){\n';
                    Compiler.script += '        if(' + data + '){\n';
                    Compiler.script += '        ' + this.output[0].ausgang + '.push(_dp[property])\n';
                    Compiler.script += '        }\n';
                    Compiler.script += '    }\n';
                    Compiler.script += '};\n';
                }
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                if (this["type"] == "lfwert") {
                    Compiler.script += 'var _out1 = [];\n';
                    Compiler.script += 'var _out2 = [];\n';
                    Compiler.script += 'var _out3 = [];\n';

                    Compiler.script += 'for(var i = 0;i<' + this["input"][0].herkunft + '.length;i++){\n';
                    Compiler.script += 'if (regaObjects[' + this["input"][0].herkunft + '[i]]["ValueType"] == 4){\n';
                    Compiler.script += ' var val = getState(' + this["input"][0].herkunft + '[i]).toFixed(1) \n';
                    Compiler.script += '}else{\n';
                    Compiler.script += ' var val = getState(' + this["input"][0].herkunft + '[i]) \n';
                    Compiler.script += '}\n';
                    Compiler.script += '    if(val ' + PRG.fbs[this.fbs_id]["opt"] + ' ' + PRG.fbs[this.fbs_id]["opt2"].toString() + '  || ' + PRG.fbs[this.fbs_id]["opt2"].toString() + ' == ""){\n';
                    Compiler.script += '    _out1.push(val.toString());\n';
                    Compiler.script += '    _out2.push(regaObjects[regaObjects[' + this["input"][0].herkunft + '[i]]["Parent"]].Name);\n';
                    Compiler.script += '    _out3.push(regaObjects[regaObjects[regaObjects[' + this["input"][0].herkunft + '[i]]["Parent"]]["Parent"]].Name);\n';
                    Compiler.script += '    }\n';

                    this["output"].sort(function (a, b) {
                        return a.ausgang > b.ausgang;
                    });

                    var last = "";
                    var index = 0;
                    var id = this.fbs_id
                    $.each(this["output"], function () {
                        if (this.ausgang != last) {
                            last = this.ausgang;
                            index++;
                            Compiler.script += '    ' + this.ausgang + ' = _out' + index + '.join("' + PRG.fbs[id]["opt3"] + '");';
                        }
                    });
                    Compiler.script += '};\n';
                }

                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                console.log(this.force);
                if (sim && this.output.length > 0) {
                    $.each(this.output, function () {
                        Compiler.script += 'simout("' + this.ausgang + '",' + this.ausgang + ');\n';
                    });
                }
                if (sim && this.output.length > 0 && this.force != undefined) {
                    var force = this.force;
                    $.each(this.output, function () {

                        if (force != undefined) {


                            if (force == "true") {
                                Compiler.script += this.ausgang + '= 1;\n';
                            } else if (force == "false") {
                                Compiler.script += this.ausgang + '= 0;\n';
                            } else if (isNaN(force)) {
                                Compiler.script += this.ausgang + '="' + force + '";\n';
                            } else {
                                Compiler.script += this.ausgang + '=' + parseInt(force) + ';\n';
                            }
                        }

                    });
                }
            });
            Compiler.script += '};\n\n';
        });

        return (Compiler.script);
    }
};


(function () {
    $(document).ready(function () {
        // Lade Theme XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        theme = storage.get("ScriptGUI_Theme");
        if (theme == undefined) {
            theme = "dark-hive"
        }
        $("#theme_css").remove();
        $("head").append('<link id="theme_css" rel="stylesheet" href="css/' + theme + '/jquery-ui.min.css"/>');

        // Lade ID Select XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//        idjs = storage.get("ScriptGUI_idjs");
//        if (idjs == undefined) {
//            idjs = "new"
//        }
//
//        $("head").append('<script id="id_js" type="text/javascript" src="js/hmSelect_' + idjs + '.js"></script>');
//

        // Lade ccu.io Daten XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        try {
            WF.socket = io.connect($(location).attr('protocol') + '//' + $(location).attr('host') + "?key=" + socketSession);

            WF.socket.on('event', function (obj) {
                if (homematic.uiState["_" + obj[0]] !== undefined) {
                    var o = {};
                    o["_" + obj[0] + ".Value"] = obj[1];
                    o["_" + obj[0] + ".Timestamp"] = obj[2];
                    o["_" + obj[0] + ".Certain"] = obj[3];
                    homematic.uiState.attr(o);
                }
            });

            WF.socket.emit("getIndex", function (index) {
                homematic.regaIndex = index;
//                WF.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/regaIndex.json", JSON.stringify(index));

                WF.socket.emit("getObjects", function (obj) {

                    homematic.regaObjects = obj;

//                    $.each(obj, function (index) {
//
//                    });
                    //                    WF.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/Objects.json", JSON.stringify(obj));

                    WF.socket.emit("getDatapoints", function (data) {
//                        WF.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/Datapoints.json", JSON.stringify(data));

                        for (var dp in data) {
                            homematic.uiState.attr("_" + dp, { Value: data[dp][0], Timestamp: data[dp][1], LastChange: data[dp][3]});
                        }


                    });
                });
            });
        }
        catch (err) {

            $.getJSON("sim_store/regaIndex.json", function (index) {
                homematic.regaIndex = index;
            });
            $.getJSON("sim_store/Objects.json", function (obj) {
                homematic.regaObjects = obj;
                $.getJSON("sim_store/Datapoints.json", function (data) {
                    for (var dp in data) {
                        homematic.uiState.attr("_" + dp, { Value: data[dp][0], Timestamp: data[dp][1], LastChange: data[dp][3]});
                    }
                });
            });
        }

        WF.Setup();

    });
})(jQuery);

