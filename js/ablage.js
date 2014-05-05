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


$('#new_widget').append('<svg width="100%" height="100%"><path id="hallo" stroke="blue" stroke-width="2" d="M380,170 L380.00,70.00 A100,100 0 0,1 438.78,89.10 Z" fill="red"/></svg>')
$('#new_widget').draggable({
    helper: "none",

    start: function () {
        $(document).bind("mousemove", function (event) {
            x = event.clientX;
            y = event.clientY;
        })
    },
    drag: function (event, ui) {
//                console.log(ui);
        var winkel = Math.atan2(y - 300, x - 300) ;
        var x2 = 380 + 100 * Math.sin(winkel);
        var y2 = 170 - 100 * Math.cos(winkel);

//                console.log((winkel* 180 / Math.PI))
        if (((winkel* 180 / Math.PI)+180) > 180 ){
            console.log(">")
            $("#hallo").attr("d", "M380,70 A100,100 0 0,1 "+ x2 + ","+y2+ "  ");
        }else{
            console.log("<")
            $("#hallo").attr("d", "M380,70 A100,100 0 1,1 "+ x2 + ","+y2+ "  ");
        }