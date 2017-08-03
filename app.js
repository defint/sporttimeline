var canv=document.getElementById("myCanvas");
var ctx=canv.getContext("2d");
let scale = 1;
let actions = [];
let lengthOfPeriodInSecondsValue = 30;
const periods = 10;
let width = 600;

window.addAction = (timeInSeconds, team) => {
	if(timeInSeconds < 0 || timeInSeconds > lengthOfPeriodInSecondsValue*periods) return;

	actions.push({
        'timeInSeconds': timeInSeconds,
        'team': team,
    });
  
  render();
};

const renderGroup = (item) => {
    ctx.beginPath();
    const yCordReact = item.team === 'HOME' ? 5 : 22;
    const yCord = item.team === 'HOME' ? 12 : 28;
    const xCord = item.timeInSeconds * scale;
    ctx.rect(xCord - 6,yCordReact,12,12);

    ctx.fillStyle = item.team === 'HOME' ? '#00A3A7' : '#D01D1A';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.fillText(item.text,xCord - 3,yCord + 3);
};

const renderAction = (item) => {
    if(item.text) {
        renderGroup(item);
        return;
    }
	ctx.beginPath();
    const yCord = item.team === 'HOME' ? 12 : 28;
    const xCord = item.timeInSeconds * scale;
    ctx.ellipse(xCord, yCord, 4, 8, 0, 0, 2 * Math.PI);
    ctx.fillStyle = item.team === 'HOME' ? '#00A3A7' : '#D01D1A';
    ctx.fill();
};

const addPeriod = (cord) => {
  ctx.beginPath();
  ctx.moveTo(cord,15);
  ctx.lineTo(cord,25);
  ctx.strokeStyle = 'black';
  ctx.lineWidth=1;
  ctx.stroke();
};

window.init = (lengthOfPeriodInSeconds) => {
	lengthOfPeriodInSecondsValue = lengthOfPeriodInSeconds;
	scale = (width / periods) / lengthOfPeriodInSeconds;
    render();
};

const calc = (team) => {
    let actionsToRender = [];
    let toGroup = 0;
    const actionsOwnUnsort = actions.filter(item => item.team == team);
    const actionsOwn = actionsOwnUnsort.sort((a,b) => a.timeInSeconds - b.timeInSeconds);
  
	for(let i=0; i<actionsOwn.length - 1; i++) {
        if(actionsOwn[i+1].timeInSeconds - actionsOwn[i].timeInSeconds > 8 / scale) {
            if(toGroup == 0) {
                actionsToRender.push(actionsOwn[i]);
            } else {
                actionsToRender.push({
                    'timeInSeconds': actionsOwn[i].timeInSeconds,
                    'team': actionsOwn[i].team,
                    'text': toGroup + 1
                });
                toGroup = 0;
            }
        } else {
            toGroup++;
        }
    }

    if(actionsOwn.length > 0) {
        if(toGroup > 0) {
            actionsToRender.push({
                'timeInSeconds': actionsOwn[actionsOwn.length - 1].timeInSeconds,
                'team': actionsOwn[actionsOwn.length - 1].team,
                'text': toGroup + 1
            });
        } else {
            actionsToRender.push(actionsOwn[actionsOwn.length - 1]);
        }
    }

    return actionsToRender;
};

const render = () => {
	ctx.clearRect(0, 0, canv.width, canv.height);
  
    ctx.beginPath();
    ctx.moveTo(0,20);
    ctx.lineTo(width,20);
    ctx.lineWidth=10;
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    for(let i=1; i<periods; i++) {
        addPeriod(i*width/periods);
    }

    const calcHome = calc('HOME');
    const calcAway = calc('AWAY');
    calcHome.forEach(renderAction);
    calcAway.forEach(renderAction);
};

const _test = () => {
    addAction(10,'HOME');
    addAction(25,'HOME');
    addAction(60,'HOME');
    addAction(78,'HOME');
    addAction(80,'HOME');
    addAction(170,'HOME');
    addAction(210,'HOME');

    addAction(160,'AWAY');
    addAction(170,'AWAY');
    addAction(174,'AWAY');
    addAction(180,'AWAY');
    addAction(182,'AWAY');
    addAction(190,'AWAY');
    addAction(220,'AWAY');
    addAction(35,'AWAY');
};

$(document).ready( function() {
    const c = $(canv);
    const container = $("body");

    function respondCanvas() {
        if(container.width() < 200) return;
        c.attr('width', container.width() ); 
        width = container.width();
        init(lengthOfPeriodInSecondsValue);
    }

    $(window).resize( respondCanvas );

    respondCanvas();
}); 


