/**
 *  CCU-IO.ScripGUI
 *  http://github.com/smiling-Jack/CCU-IO.ScriptGUI
 *
 *  Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 *  MIT License (MIT)
 *
 */

WF = $.extend(true, WF, {

    translate: function (text) {
        if (!this.words) {
            this.words = {


                "Entferne Element" : {"de": "Entferne Element",         "en": "Del Element",                 "ru": ""},
                "ROOMS"            : {"de": "Räume",                    "en": "Rooms",                            "ru": ""},
                "FUNCTIONS"        : {"de": "Gewerk",                   "en": "Function",                            "ru": ""},
                "FAVORITE"         : {"de": "Favoriten",                "en": "Favorite",                            "ru": ""},
                ""                 : {"de": "",                         "en": "",                            "ru": ""}


            };
        }
        if (this.words[text]) {
            if (this.words[text][this.language])
                return this.words[text][this.language];
            else if (this.words[text]["de"])
                return this.words[text]["de"];
        }

        return text;
    }
});