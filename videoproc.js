var samples = 12000;
var randomCoords = [];

var width = 0, height = 0;


function getRandomCoords(width,height){
	var randomCoords = [];
	for (var i = 0; i < samples; i++){
		var indexX = Math.floor((Math.random()+Math.random()+Math.random()) * width / 3);
		var indexY = Math.floor((Math.random()+Math.random()+Math.random()) * height / 3);
		var coords = {x:indexX,y:indexY};
		randomCoords[i] = coords;
	}
	return randomCoords;
}


function getColor(imgData){
	var color = {r:0,g:0,b:0};
	//self.postMessage({'response':'log','log': {'message':'Received imgData in color','objects':[imgData]}});

	//we use random pixel samples instead of a regular n pixel skip
	//var samples = 25620;

	for(var i = 0; i < samples; i++){
		var index = getIndex(randomCoords[i].x,randomCoords[i].y);
		color.r += imgData[index];
		color.g += imgData[index+1];
		color.b += imgData[index+2];
	}
	color.r = Math.floor(color.r / samples);
	color.g = Math.floor(color.g / samples);
	color.b = Math.floor(color.b / samples);

	return color;
}


function getIndex(x,y){
	return (y*(width*4)) + (x*4);;
}

var limit = 10; //Only respond every N ms
var startTime = 0;
var getColorThrottled = function(imgData){
	var currTime = new Date().getTime();

	if((currTime - startTime) > limit){
		//self.postMessage({'response':'log','log': {'message':'Time','objects':[(currTime-startTime)]}});
		startTime = currTime;
		return getColor(imgData);
	}
	else{
		return false;
	}
}

self.addEventListener('message', function(e){
	var data = e.data;
	var type = data.type;
	switch(type){
		case 'request':
			//self.postMessage({'response':'log','log': {'message':'Received Request','objects':[data]}});
			switch(data.request){
				case 'color':
					//var imgData = data['imgData'];
					//var drawColor = getColor(imgData);
					//imgData = null;
					var color = getColor(data['imgData']);
					if(color){
						self.postMessage({'response':'color', 'drawColor': color});
					}
					break;
				case 'exit':
					self.close();
					break;
				case 'init':
					width = data.init.width;
					height = data.init.height;
					randomCoords = getRandomCoords(width, height);
					startTime = new Date().getTime();
					/*self.postMessage({
										'response':'log','log': {
												'message':'Init complete',
												'objects':[randomCoords]
												}
									});
					*/
				default:
					self.postMessage({'response':'error', 'message':'Unknown Command'});
			}
			break;
		case 'response':
			switch(data.response){
				default:
					break;
			}
			break;
				
	}
}, false);

self.addEventListener('error', function(e){
	console.log("Error",e);
});