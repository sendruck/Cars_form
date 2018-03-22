$(document).ready(function(){
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
					$('table').append('<tr class=""><td><div class="delete_btn" id="'+data[i].id+'"></div></td><td>'+data[i].model+'</td><td>'+data[i].marka+'</td><td>'+data[i].year+'</td><td>'+data[i].type+'</td><td>'+data[i].engine+'</td><td class="color-col-'+i+'"></td><td>'+data[i].cena+'</td></tr>' );
					$('.color-col-'+i+'').append('<div class="color-blck"></div>');
					$('.color-col-'+i+' .color-blck').css('background', data[i].color);
					// $('.color-col-'+i+' .color-blck').addClass("animated jackInTheBox");
					ids[i]= data[i].id;
					i++;
				}
				$('#wrapper').css("display", "none");
			} else {
				$(".right-block").addClass ("empty-div" );
				$('table').after( '<p class="empty animated fadeIn">Поки що немає жодного автомобіля)</p>');
				$("#wrapper").css("display", "block");
			}
		}
	});

	$("input[type='button']").on("click", function() {
		manageData('addnew');
	})
	

	$("body").on("click", function() {
		if ($("input").is(":focus")) {
			$(".left-block form").css('box-shadow', '0 0 40px -10px #000')
		} else {
			$(".left-block form").css('box-shadow', '')
		}
	})
	
	

	function manageData(key) {
		var model = $("input[name='model']");
		var marka = $("input[name='marka']");
		var year = $("input[name='year']");
		var type = $("input[name='type']");
		var engine = $("input[name='engine']");
		var color = $("input[name='color']");
		var cena = $("input[name='cena']");
		if (isNotEmpty(model) && isNotEmpty(marka) && isNotEmpty(year) 
		&& isNotEmpty(type) && isNotEmpty(engine) && isNotEmpty(color) && isNotEmpty(cena)) {
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
					color: color.val(),
					cena: cena.val()
				}, success: function (response) {
					var data = $.parseJSON(response);	
					var i =  $('table').children().length;	
					$('p.empty').css("display", "none");
					$('#wrapper').addClass("animated bounceOutLeft");
					$(".right-block").removeClass("empty-div" );			
					$('table').append( '<tr class="animated fadeIn"><td><div class="delete_btn" id="'+data.id+'"></div></td><td>'+data.model+'</td><td>'+data.marka+'</td><td>'+data.year+'</td><td>'+data.type+'</td><td>'+data.engine+'</td><td class="color-col-'+i+'"></td><td>'+data.cena+'</td></tr>' );
					setTimeout(function() {
						$('.color-col-'+i+'').append('<div class="color-blck"></div>');
						$('.color-col-'+i+' .color-blck').css('background', data.color);
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
					color.val('#ff0000');
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
					$("#wrapper").css("display", "block");
				 };
             }
 
		});	

	})




})
