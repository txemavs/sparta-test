
// <!-- app/js/lib/canvas.js -->

window.canvasSite = function (canvas, map, align='center', pad=5) {
        
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (canvas.width === 0 || canvas.height === 0) {
        console.log('canvasSite: canvas size is 0');
        return;
    }
    console.log(canvas.width + ' ' + canvas.height);
    let w = canvas.width-2*pad;
    let h = canvas.height-2*pad;
    let min_x = Infinity, max_x = -Infinity, min_y = Infinity, max_y = -Infinity;
    map.forEach(point => {
        min_x = Math.min(min_x, point.x);
        max_x = Math.max(max_x, point.x);
        min_y = Math.min(min_y, point.y);
        max_y = Math.max(max_y, point.y);
    });

    let scale = Math.min( w/(max_x - min_x), h/(max_y - min_y));
    let xo = (w - (max_x - min_x) * scale);
    let yo = (h - (max_y - min_y) * scale)/2;
    switch (align) {
        case 'center': xo=xo/2; break;
        case 'left': xo=0; break;
    }
    let points = map.map(point => ({
        "id": point.id, 
        "x": pad + xo + (point.x - min_x) * scale, 
        "y": pad + yo +(point.y - min_y) * scale, 
        "t": point.type 
    }));

    points.sort((a, b) => {
        if (a.t === 'TCU' && b.t !== 'TCU') return -1;
        if (a.t !== 'TCU' && b.t === 'TCU') return 1;
        return 0;
    });

    console.log('scale: ' + scale + ' xo: ' + xo + ' yo: ' + yo + ' min_x: ' + min_x + ' max_x: ' + max_x + ' min_y: ' + min_y + ' max_y: ' + max_y);
    points.forEach(point => {
        let size = w/256;
        switch (point.t) {
            case 'TCU':
                ctx.fillStyle = '#888';
                break;
            case 'NCU':
                ctx.fillStyle = '#3880ff';
                size = size * 3;
                break;
            case 'RSU':
                ctx.fillStyle = '#f40';
                break;
            case 'GW':
                ctx.fillStyle = '#0f0';
                size = size * 2;
                break;
            case 'TMU':
                ctx.fillStyle = '#f4f';
                size = size * 2;
            break;
            case 'MDU':
                ctx.fillStyle = '#ff4';
                size = size * 2;
                break;
            default:
                console.log('Unknown type: ' + point.t);
                ctx.fillStyle = '#0f0';
        }
        if (size<0) {console.log(size);size = 1;}
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
        ctx.fill(); 
    });
}





