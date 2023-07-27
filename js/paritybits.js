var data = [], 
	data_length = 9, 
	parity_type = 0, 
	choice = 0,
	time_start,
	time_end,
	time_remain = 60,
	score = 0,
	protect = false;

function initgame () {
	$("#timer").html(time_remain);

	$("#start").click(function() {
		$("#startpanel").fadeOut("slow", function() {
			$("#gamefield").fadeIn("slow", function () {
				startgame();
			});
		});
	});
	
	$(".ans").click(function() {
		if (time_remain <= 0) endgame();
		if (!protect && time_remain > 0) {
			protect = true;
			
			var now = new Date();
			time_end = now.getTime();
			time_diff = time_end - time_start;
			
			if ($(this).attr("id") == "zero") choice = 0;
			else choice = 1;
			
			
			$(this).transfer({
				to: $("#blank"),
				duration: "fast"
			}, function() {
				$("#answers").hide();
				protect = false;
				
				$("#blank").text(choice);
				
				sum = 0;
				for (i=0; i<data.length; i++) sum += data[i];
				parity = sum%2;
				if ((parity + parity_type)%2 == choice) {
					score += Math.floor((2000+Math.max(8000-time_diff, 0))*(data_length+1)/10);
					$("#score").text(score);
					$("#question").animate({"background-color": "rgba(62, 211, 50, 0.5)"}, 100).delay(200).animate({"background-color": "rgba(0, 0, 0, 0.1)"}, 200, function() {showquestion();});
				}
				else {
					score -= 5000;
					$("#score").text(score);
					$("#question").animate({"background-color": "rgba(211, 50, 50, 0.5)"}, 100).delay(200).animate({"background-color": "rgba(0, 0, 0, 0.1)"}, 200, function() {showquestion();});
				}
			});
		}
	});
};

function startgame() {
	showquestion();
	setTimeout(timer, 1000);
}

function endgame() {
	$("#gamefield").fadeOut(function() {$("#user").fadeIn();});
	$("#final-score").html(score);
	
}

function timer() {
	time_remain--;
	$("#timer").html(time_remain);
	
	if (time_remain > 0) {
		setTimeout(timer, 1000);
	}
	else {
		endgame();
	}
}

function showquestion() {
	// Assign data
	data_length = 5+Math.floor(Math.random()*5);
	data.length = 0;
	for (i=0; i<data_length; i++) {
		digit = Math.floor(Math.random() + 0.5);
		data.push(digit);
	}
	parity_type = Math.floor(Math.random() + 0.5);
	
	// Select type
	$("#types div").removeClass("active");
	$("#types div:nth-child("+(parity_type+1)+")").addClass("active");
	
	// Show data
	$("#question").html("");
	var counter = 0;
	for (var i=0; i<data.length; i++) {
		$("#question").queue(function (next) {
			$("#question").append($("<span class='data'>" + data[counter++] + "</span>").hide().fadeIn(500));
			next();
		}).delay(100);
	}
	$("#question").queue(function (next) {
		$("#question").append($("<span id='blank' class='data'>?</span>").hide().fadeIn(500));
		next();
		$("#answers").fadeIn(500);
		var now = new Date();
		time_start = now.getTime();
		console.log(time_start);
	}).delay(100);
}