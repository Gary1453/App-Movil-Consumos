
// Variables globales

var urlSearch = window.location.search;
var tipo = urlSearch.substring( urlSearch.indexOf('=') +1 , urlSearch.indexOf('&') );
var familia = urlSearch.substring( urlSearch.lastIndexOf( '=' ) + 1 , urlSearch.length );	
var url = "http://192.168.1.7:80/App Consumos/logica.php";

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback( function(){


	cargDatList();

    var arreglo = cargarArreglo();	

	setTimeout( function()
	{

	drawChart(arreglo);

	}, 2000); 

	cargarGastos();


// Manipulacion de eventos

$("#regresarId").on("click",function(){

	window.location.href = "bienvenido.html";


});


});


function drawChart(arreglo) {

var data = google.visualization.arrayToDataTable(arreglo);

var options = 
{

width: 500,
height: 300, 
title: 'Mis Consumos Mensuales'

};

var chart = new google.visualization.ColumnChart(document.getElementById('columnbar'));

	function selectHandler() 
	{

	  var selectedItem = chart.getSelection()[0];


		if (selectedItem) 

		{
			var mesid = data.getValue(selectedItem.row, 0);
			var url = "descripcion_gastos.html";		 	
		 	window.location.href= url + "?familia=" + familia + "&mesid=" + mesid + "&tipo=" + tipo;
			

		}

	}
	

google.visualization.events.addListener(chart, 'select', selectHandler);
chart.draw(data, options);

}



function cargarGastos()

{
	
	var opcion ={"CARGOS" : 5  , "ABONOS": 7 , "ABONOS_PLANILLA": 9 };
	url = url + "?opcion=" + opcion[tipo] + "&familia=" + familia + "&mesid=" + "201606" + "&callback=?";
	var inicio = $.getJSON( url , cargGasUltMes);


}


// El siguiente metodo nos permite obtener un arreglo de los consumos de un cliente dado

function cargarArreglo()

{

	var opcion ={"CARGOS" : 3  , "ABONOS": 6 , "ABONOS_PLANILLA": 8 };
	var url1 = url + "?opcion=" +  opcion[tipo] + "&familia=" + familia + "&callback=?";
    var arreglo = [ [ "MesId" , "ImporteSoles" ] ];
    
    var prueba = $.getJSON( url1, function(presultado)
    {                
    	
		for(i=0 ; i< presultado.length ; i++)
		{
 			
 			arreglo.push( [ presultado[i].MESID , parseInt( presultado[i].IMPORTE ) ] );

		}			

		if( arreglo.length == 1 )
		{

			arreglo.push(0,0);
			alert('Usted no presenta con este tipo de transacciones en el ultimo semestre');
			window.location.href = "bienvenido.html";


		}	

    });
		  
return arreglo;		

}


//Este metodo lista los consumos del ultimo mes 

function cargGasUltMes(presultado)
{

	var lista="";

	for( var i=0 ; presultado.length ; i++ )
	{
	 
		 lista+="<ons-row width='50px'>";
		 
		 if(tipo != "CARGOS" )
		 {
		 
		 	lista+="<ons-col>" + presultado[i].CLIENTEID + "</ons-col>";

		 }

		 lista+="<ons-col>" + presultado[i].MESID + "</ons-col>";
		 lista+="<ons-col>" + presultado[i].FECHA + "</ons-col>";

		 if( tipo == "CARGOS")
		 {

			 lista+="<ons-col>" + presultado[i].FAMILIA + "</ons-col>";
			 lista+="<ons-col>" + presultado[i].SUBFAMILIA + "</ons-col>";

		 }

		 else
		 {

		 	lista+="<ons-col>" + presultado[i].DESCRIPCION + "</ons-col>";

		 } 

		 lista+="<ons-col>" + presultado[i].PRODUCTO + "</ons-col>";
		 lista+="<ons-col>" + presultado[i].CANAL + "</ons-col>";
		 lista+="<ons-col>" + presultado[i].IMPORTESOLES + "</ons-col>";
		 lista+="</ons-row>";

		 console.log(lista);
		 $("#gastodId").html(lista);


	}	


}

// La siguiente funcion permite cargar la cabecera de la lista de gastos segun el tipo de gastos seleccioando

function cargDatList()
{

	var tipoGastos = "<b> <ons-row width='50px'>";

	if( tipo != "CARGOS" )
	{
		
		tipoGastos += "<ons-col> Clienteid </ons-col>";


	}	

		tipoGastos +="<ons-col> MesId </ons-col> <ons-col> Fecha </ons-col>";


	if( tipo == "CARGOS")
	{

		tipoGastos += "<ons-col> Familia </ons-col><ons-col> SubFamilia </ons-col>";

	}

	else
	{

		tipoGastos += "<ons-col> Descripcion </ons-col>";


	} 

    tipoGastos += "<ons-col> Producto </ons-col> <ons-col> Canal </ons-col><th> ImporteSoles </ons-col>";

	tipoGastos += "</ons-row> </b>";


	$("#tipoGastos").html(tipoGastos);



}


function nvl ( valor1 , valor2)
{

	if( valor1 == null )
	{
		return valor2;

	}
	else
	{

		return valor1;
	}

}