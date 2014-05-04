/**
 * Created by admin on 02.05.2014.
 */
es = {
    std: {
        parrent:    es.std.parrent || "new_widget_x",
        h:          es.std.h || 100,
        w:          es.std.w || 100,
        left:       es.std.left || 0,
        top:        es.std.top || 0,
        nrnr:         es.std.nr || _nr,
        opa:        es.std.nr
    },

    start_winkel:   es.start_winkel || 0,
    stop_winkel:    es.stop_winkel || 180,
    max:            es.max || 100,
    min:            es.min || 0,
    val:            es.val || 100,

    glow: {
        mode:       es.glow.mode || 0,
        width:      es.glow.width || 0,
        intent:     es.glow.intent || 0,
        color:      es.glow.color || ""
    },
    str:{
        width:      es.str.width || 100,
        mode:       es.str.mode || "color",
        color:      es.str.color || 100,
        url:        es.str.url || 100,
        opa:        es.str.opa || 1,
    },
    grad:{
        pos:        es.grad.pos || [],
        color:      es.grad.color || [],
        opa:        es.grad.opa || []
    }
};