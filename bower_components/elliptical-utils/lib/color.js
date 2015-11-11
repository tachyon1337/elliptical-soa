
let color={};

color.rgb2hex=function(rgb){
    if (  rgb.search("rgb") == -1 ) {
        return rgb;
    }
    else if ( rgb == 'rgba(0, 0, 0, 0)' ) {
        return 'transparent';
    }
    else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
};

export default color;
