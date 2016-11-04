


			$(document).on( 'ready', function(){

				$("#loginid").on("click",function(){

				var usuario = $("#userid").val();
				var password = $("#passid").val();
				var tipodocumento = $('input:radio[name=tipo]:checked').val();

 				$.ajax({

 					url: "http://192.168.1.7:80/App Consumos/logica.php?opcion=0",
 					type:"post",
 					crossDomain: true,
 					dataType:"json",
 					data:
 						{  
							"usuario" : usuario, 
							"password" : password, 
							"tipodocumento" : tipodocumento 
 						} 					

 				})
 				.done(function(data)
 				{

 					
 					console.log("respuesta exitosa");


 					if( data.exito == "OK" )
 					{

 						window.location.href = "http://192.168.1.7:8000/bienvenido.html?nombre=" + data.nombre + 
 												"&clienteid=" + data.clienteid;

 					}
 					else
 					{

 						alert("login Incorrecto");
 						window.location.href = "http://127.0.0.1:8000/login.html";
 					}

 					console.log(data.exito);

 				})
 				.fail(function( jqXHR, textStatus, errorThrown )
 				{

					  if (jqXHR.status === 0) {

					    alert('Not connect: Verify Network.');

					  } else if (jqXHR.status == 404) {

					    alert('Requested page not found [404]');

					  } else if (jqXHR.status == 500) {

					    alert('Internal Server Error [500].');

					  } else if (textStatus === 'parsererror') {

					    alert('Requested JSON parse failed.');

					  } else if (textStatus === 'timeout') {

					    alert('Time out error.');

					  } else if (textStatus === 'abort') {

					    alert('Ajax request aborted.');

					  } else {

					    alert('Uncaught Error: ' + jqXHR.responseText);

					  }



 				}); 


				});	




				$("#resetid").on("click",function(w){

				$("#userid").val('');
				$("#passid").val('');


				});	


			}
			
			);