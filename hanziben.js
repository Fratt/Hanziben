function chineseCell(width, pinyin, characters) {
	var table = $('<table class="chinese">');
	for (var i=0; i<3; i++) {
		var row = $('<tr class="pinyin">')
		for (var j=0; j<width; j++) {
			var td = $('<td colspan="2">');
			if (i == 1) {
				td.append("<span>" + pinyin[j] + "</span>");
				td.addClass("pinyinText");
			}		
			row.append(td);
		}
		table.append(row);
	}
	for (var i=0; i<2;i++) {
		if (i == 0)
			var row = $('<tr class="hanzitop">');
		else
			var row = $('<tr class="hanzibottom">');
		for (var j=0; j<width*2; j++) {
			var cell = $('<td>');
			if (i == 0 && j%2 == 0) {
				var chineseCharacter = $('<div>');
				chineseCharacter.addClass('character');
				chineseCharacter.text(characters.substring(j/2, j/2 + 1));
				cell.append(chineseCharacter);
			}
			row.append(cell);
		}
		table.append(row);
	}
		
	return table;
}
	
function generateQuizz(quizzSize, lessons) {
	var allWords = [];
	var quizz = [];
	
	// We list all the possible pinyins
	hanziben.forEach(function(lesson) {
		if(jQuery.inArray(lesson.lesson, lessons) > -1) {
			lesson.words.forEach(function(word) {
				allWords.push(word);
			});
		}
	});
	
	if (quizzSize == 0)
		quizzSize = allWords.length;
	
	while(quizzSize > 0 && allWords.length > 0) {
		var idx = Math.floor(Math.random()*allWords.length);
		quizz.push(allWords[idx]);
		allWords.splice(idx, 1);
		quizzSize--;
	}
	
	return quizz;
}

function printQuizz(quizzSize, lessons, showPinyin, showCharacters) {
	if (lessons.length == 0) {
		alert("Tu as oublié de sélectionner une leçon!");
		return;
	}
	$("#quizz").empty();
	var quizz = generateQuizz(quizzSize, lessons);
	quizz.forEach(function(word) {
		
		var quizzEntry = $('<table class="quizz">');
		quizzEntry.append($('<tr>').append($('<td class="french">' + word.fr + '</td>')));
		quizzEntry.append($('<tr>').append($('<td>').append(chineseCell(word.pinyin.length, word.pinyin, word.zh))));
		
		$("#quizz").append(quizzEntry);
		
	});
	
	$("#afterQuizz").show();
	
	if (showPinyin)
		$(".pinyinText span").show();
	else
		$(".pinyinText span").hide();
	
	if (showCharacters)
		$("div.character").show();
	else
		$("div.character").hide();
		
	// We set the page title
	$("h2.title").text("Dictée Hanziben (leçon" + (lessons.length > 1 ? "s" : "") + " " + lessons.join(", ") + ")");
}

function generateLessonList() {
	hanziben.forEach(function(lesson) {
		var checked = lesson.checked ? 'checked="checked" ' : '';
		$("#lessonsDiv").append($('<li><input type="checkbox" name="lesson[]" value="' + lesson.lesson + '" ' + checked + '/> ' + lesson.lesson + '</li>'));
	});
}

function listLessons() {
	var lessons = [];
	$('#lessonsDiv :checked').each(function() {
	  lessons.push($(this).val());
	});
	return lessons;
}

$(function() {
	generateLessonList();
	$("#generateButton").click(function() {
		printQuizz($("#quizzSizeText option:selected").val(), listLessons(), $("#showPinyin:checked").length > 0, $("#showCharacters:checked").length > 0);
	});
	var all = true;
	$("#checkAllNoneLink").click(function(e) {
		$('input[name="lesson[]"]:checkbox').prop('checked',all);
		all = !all;
		e.preventDefault();
	});
	$("#showPinyin").click(function(e) {
		if ($(this).is(':checked'))
			$(".pinyinText span").show();
		else
			$(".pinyinText span").hide();
	});
	$("#showCharacters").click(function(e) {
		if ($(this).is(':checked'))
			$("div.character").show();
		else
			$("div.character").hide();
	});
});