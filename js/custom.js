$(document).ready(function(){
	$('#colorSelector').ColorPicker({
		color: '#0000ff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#colorSelector div').css('backgroundColor', '#'+hex);
		}
	});
	var ids = [];
	$.ajax({
		url: 'ajax.php',
		method: 'GET',
		dataType: 'text',
		data: {
			key: 'get_all',
		}, success: function (response) {
			var data = $.parseJSON(response);	
			var i = 0;
			if (data) {
				while (data[i]) {
					$('table').append('<tr class=""><td><div class="delete_btn" id="'+data[i].id+'"></div></td><td class="model-cell">'+data[i].model+'</td><td class="marka-cell">'+data[i].marka+'</td><td class="year-cell">'+data[i].year+'</td><td class="type-cell">'+data[i].type+'</td><td class="engine-cell">'+data[i].engine+'</td><td class="color-cell color-col-'+i+'"></td><td class="cena-cell">'+data[i].cena+'</td></tr>' );
					$('.color-col-'+i+'').append('<div class="color-blck"></div>');
					var color = rgb2hex(data[i].color);
					$('.color-col-'+i+' .color-blck').css('backgroundColor', color);
					$("td:not(:first-child)").append("<img src='img/edit.png'>");
					ids[i]= data[i].id;
					i++;
				}
				$('#wrapper').css("opacity", "0");
			} else {
				$(".right-block").addClass ("empty-div" );
				$('table').after( '<p class="empty animated fadeIn">Поки що немає жодного автомобіля)</p>');
				$("#wrapper").css("opacity", "1");
			}
		}
	});

	$("input[name='save']").on("click", function() {
		manageData('addnew');
	})
	

	$("body").on("click", function(e) {
		if ($("input").is(":focus")) {
			$(".left-block form:not(.updated-form)").css('box-shadow', '0 0 40px -10px #000')
		} else {
			$(".left-block form").css('box-shadow', '')
		}
		if (($(e.target).closest("td:not(:first-child)").length > 0) || ($(e.target).closest("form.updated-form").length > 0) || ($(e.target).closest(".colorpicker").length > 0)) {
			return false;
		} else 	
		if ($("td:not(:first-child)").hasClass("update-cell")) {
			$("td:not(:first-child)").removeClass("update-cell");
			$("form.form").removeClass("updated-form");
			$("form.form input").not("input[name='save']").not("input[name='update']").val("");
			$("#colorSelector div").css("backgroundColor", "#fff");
			$("form input[name='update']").css({"opacity": "0", "z-index": "-11"});
			$("form input[name='save']").css({"opacity": "1", "z-index": "1"});
		} 
	})




	function rgb2hex(orig){
		var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
		return (rgb && rgb.length === 4) ? "#" +
		 ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		 ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		 ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
	   }
	
	

	function manageData(key) {
		var model = $("input[name='model']");
		var marka = $("input[name='marka']");
		var year = $("input[name='year']");
		var type = $("input[name='type']");
		var engine = $("input[name='engine']");
		var color = $("#colorSelector div").css("backgroundColor");
		var colorh = rgb2hex(color);
		var cena = $("input[name='cena']");
		if (isNotEmpty(model) && isNotEmpty(marka) && isNotEmpty(year) 
		&& isNotEmpty(type) && isNotEmpty(engine) && isNotEmpty(cena)) {
			$.ajax({
				url: 'ajax.php',
				method: 'POST',
				dataType: 'text',
				data: {
					key: key,
					model: model.val(),
					marka: marka.val(),
					year: year.val(),
					type: type.val(),
					engine: engine.val(),
					color: colorh,
					cena: cena.val()
				}, success: function (response) {
					var data = $.parseJSON(response);	
					var i =  $('table').children().length;	
					$('p.empty').css("display", "none");
					if (i == 1) {
						$('#wrapper').addClass("animated bounceOutLeft");
					}
					$(".right-block").removeClass("empty-div" );			
					$('table').append( '<tr class="animated fadeIn"><td><div class="delete_btn" id="'+data.id+'"></div></td><td class="model-cell">'+data.model+'</td><td class="marka-cell">'+data.marka+'</td><td class="year-cell">'+data.year+'</td><td class="type-cell">'+data.type+'</td><td class="engine-cell">'+data.engine+'</td><td class="color-cell color-col-'+i+'"></td><td class="cena-cell">'+data.cena+'</td></tr>' );
					setTimeout(function() {
						$('.color-col-'+i+'').append('<div class="color-blck"></div>');
						var colorh = rgb2hex(data.color);
						$('.color-col-'+i+' .color-blck').css('backgroundColor', colorh);
						$('.color-col-'+i+' .color-blck').addClass("animated jackInTheBox");
					}, 400);
					setTimeout(function() {
						location.reload();
					}, 1000);
					model.val('');
					marka.val('');
					year.val('');
					type.val('');
					engine.val('');
					$("#colorSelector div").css("backgroundColor", "#ffffff");
					// color.val('#ff0000');
					cena.val('');
 				}
			});
		}
	}

	function isNotEmpty(caller) {
		if (caller.val() == '' || caller.val() == 0) {
			caller.css('border-bottom', '2px solid #ff9b9b');
			caller.parent().addClass("animated pulse");
			window.setTimeout( function(){
                caller.parent().removeClass('animated pulse');
            }, 1500); 
			return false;
		} else {
			caller.css('border-bottom', '2px solid #bebed2');
			caller.parent().removeClass("animated pulse");
			return true;
		}
	}


	$("body").on("click", ".delete_btn", function() {
		var id= $(this).attr('id');
		var parent = $(this).parent().parent();
		$.ajax({
            type:'POST',
            url:'delete.php',
            data:{
				"del_id" : id
			},
            success: function(data){
                if ( data > ids[0] ) {
					parent.children('td')
						  .animate({ padding: 0 })
						  .wrapInner('<div />')
						  .children()
						  .slideUp(function() { $(this).closest('tr').remove(); });
                 } else { 
					parent.children('td')
						  .animate({ padding: 0 })
						  .wrapInner('<div />')
						  .children()
						  .slideUp(function() { $(this).closest('tr').remove(); });
					$(".right-block").addClass ("empty-div" );
					$('table').after( '<p class="empty animated fadeIn">Поки що немає жодного автомобіля)</p>');
					$("#wrapper").css({"left":"37%", "height":"50px", "opacity":"1"});
					$("#smoke").css("width", "0");
					$('#wrapper').addClass("animated bounceInRight");
				 };
             }
 
		});	

	});



	$("body").on("click", "td:not(:first-child)", function() {
		$("td:not(:first-child)").not(this).removeClass("update-cell");
		if ($(this).hasClass("update-cell")) {
			$(this).removeClass("update-cell");
			$("form.form input").not("input[name='save']").not("input[name='update']").val("");
			$("form input[name='update']").css({"opacity": "0", "z-index": "-11"});
			$("form input[name='save']").css({"opacity": "1", "z-index": "1"});
		} else {
		$(this).toggleClass("update-cell");
		var model = $(this).parent().find("td:nth-child(2)").text();
		var marka = $(this).parent().find("td:nth-child(3)").text();
		var year = $(this).parent().find("td:nth-child(4)").text();
		var type = $(this).parent().find("td:nth-child(5)").text();
		var engine = $(this).parent().find("td:nth-child(6)").text();
		var color = $(this).parent().find(".color-blck").css("backgroundColor");
		var cina = $(this).parent().find("td:nth-child(8)").text();
		var hex_color = rgb2hex(color);

		$("form.form").addClass("updated-form");
		$("form input[name='update']").css({"opacity": "1", "z-index": "1"});
		$("form input[name='save']").css({"opacity": "0", "z-index": "-10"});
		switch($(this).attr("class").split(' ')[0]) {
			case 'model-cell': 
				$("form.form").find("input[name='model']").focus().val(model);
				$("form.form").find("input[name='model']").focus().addClass("animated pulse");
				window.setTimeout( function(){
					$("form.form").find("input[name='model']").focus().removeClass('animated pulse');
				}, 1500); 
				break;

			case 'marka-cell': 
				$("form.form").find("input[name='marka']").focus().val(marka);
				$("form.form").find("input[name='marka']").focus().addClass("animated pulse");
				window.setTimeout( function(){
					$("form.form").find("input[name='marka']").focus().removeClass('animated pulse');
				}, 1500); 
				  break;
				
			case 'year-cell': 
				$("form.form").find("input[name='year']").focus().val(year);
				$("form.form").find("input[name='year']").focus().addClass("animated pulse");
				window.setTimeout( function(){
					$("form.form").find("input[name='year']").focus().removeClass('animated pulse');
				}, 1500); 
				break;

			case 'type-cell': 
				$("form.form").find("input[name='type']").focus().val(type);
				$("form.form").find("input[name='type']").focus().addClass("animated pulse");
				window.setTimeout( function(){
					$("form.form").find("input[name='type']").focus().removeClass('animated pulse');
				}, 1500); 
				break;

			case 'engine-cell': 
				$("form.form").find("input[name='engine']").focus().val(engine);
				$("form.form").find("input[name='engine']").focus().addClass("animated pulse");
				window.setTimeout( function(){
					$("form.form").find("input[name='engine']").focus().removeClass('animated pulse');
				}, 1500); 
				break;

			case 'color-cell': 
				$("form.form").find("#colorSelector div").css("backgroundColor", hex_color);
				$("form.form").find("#colorSelector").addClass("animated pulse");
				window.setTimeout( function(){
					$("form.form").find("#colorSelector").removeClass('animated pulse');
				}, 1500); 
				break;

			case 'cena-cell': 
				$("form.form").find("input[name='cena']").focus().val(cina);
				$("form.form").find("input[name='cena']").focus().addClass("animated pulse");
				window.setTimeout( function(){
					$("form.form").find("input[name='cena']").focus().removeClass('animated pulse');
				}, 1500); 
				break;
		  }

		$("form.form").find("input[name='model']").val(model);
		$("form.form").find("input[name='marka']").val(marka);
		$("form.form").find("input[name='year']").val(year);
		$("form.form").find("input[name='type']").val(type);
		$("form.form").find("input[name='engine']").val(engine);
		$("form.form").find("#colorSelector div").css("backgroundColor", hex_color);
		$("form.form").find("input[name='cena']").val(cina);
		}

	})


	$("body").on("click", "input[name='update']", function(event) {
		event.preventDefault();
		var id = $("td.update-cell").parent().find(".delete_btn").attr("id");
		var model = $("input[name='model']");
		var marka = $("input[name='marka']");
		var year = $("input[name='year']");
		var type = $("input[name='type']");
		var engine = $("input[name='engine']");
		var color = $("#colorSelector div").css("backgroundColor");
		var colorh = rgb2hex(color);
		var cena = $("input[name='cena']");

		if (isNotEmpty(model) && isNotEmpty(marka) && isNotEmpty(year) 
		&& isNotEmpty(type) && isNotEmpty(engine) && isNotEmpty(cena)) {
			$.ajax({
				url: 'update.php',
				method: 'POST',
				dataType: 'text',
				data: {
					id: id,
					model: model.val(),
					marka: marka.val(),
					year: year.val(),
					type: type.val(),
					engine: engine.val(),
					color: colorh,
					cena: cena.val()
				}, success: function (response) {
					var data = $.parseJSON(response);	
					console.log(data.model);
					$("#"+id).parent().parent().find(".model-cell").text(data.model).addClass("animated tada");
					$("#"+id).parent().parent().find(".model-cell").append("<img src='img/edit.png'>");
					$("#"+id).parent().parent().find(".marka-cell").text(data.marka).addClass("animated tada");
					$("#"+id).parent().parent().find(".marka-cell").append("<img src='img/edit.png'>");
					$("#"+id).parent().parent().find(".year-cell").text(data.year).addClass("animated tada");
					$("#"+id).parent().parent().find(".year-cell").append("<img src='img/edit.png'>");
					$("#"+id).parent().parent().find(".type-cell").text(data.type).addClass("animated tada");
					$("#"+id).parent().parent().find(".type-cell").append("<img src='img/edit.png'>");
					$("#"+id).parent().parent().find(".engine-cell").text(data.engine).addClass("animated tada");
					$("#"+id).parent().parent().find(".engine-cell").append("<img src='img/edit.png'>");
					$("#"+id).parent().parent().find(".color-blck").css("backgroundColor", data.color).addClass("animated tada");
					$("#"+id).parent().parent().find(".color-cell").append("<img src='img/edit.png'>");
					$("#"+id).parent().parent().find(".cena-cell").text(data.cena).addClass("animated tada");
					$("#"+id).parent().parent().find(".cena-cell").append("<img src='img/edit.png'>");
					window.setTimeout( function(){
						$("#"+id).parent().parent().find(".model-cell").removeClass('animated tada');
						$("#"+id).parent().parent().find(".marka-cell").removeClass('animated tada');
						$("#"+id).parent().parent().find(".year-cell").removeClass('animated tada');
						$("#"+id).parent().parent().find(".type-cell").removeClass('animated tada');
						$("#"+id).parent().parent().find(".engine-cell").removeClass('animated tada');
						$("#"+id).parent().parent().find(".color-cell").removeClass('animated tada');
						$("#"+id).parent().parent().find(".cena-cell").removeClass('animated tada');
					}, 1200); 

					model.val('');
					marka.val('');
					year.val('');
					type.val('');
					engine.val('');
					var color = $("#colorSelector div").css("backgroundColor", "#ffffff");
					// color.val('#ff0000');
					cena.val('');
					$("#"+id).parent().parent().find(".update-cell").removeClass("update-cell");
					$("form").removeClass("updated-form");	
					$("form input[name='update']").css({"opacity": "0", "z-index": "-11"});
					$("form input[name='save']").css({"opacity": "1", "z-index": "11"});
 				}
			});
		}
	})

})
