
// Variables locales 

	var urlSearch = window.location.search;
	var mesid = urlSearch.substring( urlSearch.lastIndexOf( 'mesid' ) + 6 , urlSearch.lastIndexOf( 'tipo' ) -1 );	
	var tipo = urlSearch.substring( urlSearch.lastIndexOf( 'tipo' ) + 5 , urlSearch.lastIndexOf( 'clienteid' ) -1 );	
	var familia = urlSearch.substring( urlSearch.lastIndexOf( 'familia' ) + 8 , urlSearch.lastIndexOf( 'mesid' ) -1 );	
	var clienteid = urlSearch.substring( urlSearch.lastIndexOf( 'clienteid' ) + 10 , urlSearch.length );	
	var url = "http://192.168.1.7:80/App Consumos/logica.php";

$(document).on('ready',function(){


	cargDatList();

	var opcion ={"CARGOS" : 5  , "ABONOS": 7 , "ABONOS_PLANILLA": 9 };
	url = url + "?opcion=" + opcion[tipo] + "&mesid=" + mesid + "&familia=" + familia + "&clienteid=" + clienteid + "&callback=?";

	var inicio = $.getJSON( url , cargarLista );	


//Manipulacion de eventos

$("#regresarId").on("click",function(){

	var url = "gastos_mensuales.html" + "?tipo=" + tipo + "&familia=" + familia + "&clienteid=" + clienteid;
	window.location.href = url;


});



});


//Metodos de apoyo 

function cargarLista(presultado)
{


	var lista="";

	for( var i=0 ; presultado.length ; i++ )
	{
	 
		 lista+="<ons-row width='50px'>";
		 
		 /*
		 if(tipo != "CARGOS" )
		 {
		 
		 	lista+="<ons-col align='center'>" + presultado[i].CLIENTEID + "</ons-col>";

		 }*/

		 lista+="<ons-col align='center'>" + presultado[i].FECHA + "</ons-col>";

		 if( tipo == "CARGOS")
		 {

			 lista+="<ons-col align='center'>" + presultado[i].FAMILIA + " </ons-col>";
			 //lista+="<ons-col align='center'>" + presultado[i].SUBFAMILIA + "</ons-col>";

		 }

		 else
		 {

		 	lista+="<ons-col>" + presultado[i].DESCRIPCION + "</ons-col>";

		 } 

		 lista+="<ons-col align='center'>" + presultado[i].CANAL + "</ons-col>";
		 lista+="<ons-col align='center'>" + presultado[i].IMPORTESOLES + "</ons-col>";
		 lista+="</ons-row>";


	 $("#gastodId").html(lista);
	 $("#ProgBarrId").hide();
	 $("#ProgCirId").hide(); 


	}

}


// La siguiente funcion permite cargar la cabecera de la lista de gastos segun el tipo de gastos seleccioando

function cargDatList()
{

	var tipoGastos = "<b> <ons-row width='50px'>";

/*
	if( tipo != "CARGOS" )
	{
		
		tipoGastos += "<ons-col align='center'> Clienteid </ons-col>";


	}	
*/
		//tipoGastos +="<ons-col> MesId </ons-col> <ons-col> Fecha </ons-col>";
		tipoGastos +="<ons-col align='center'> Fecha </ons-col>";


	if( tipo == "CARGOS")
	{

		tipoGastos += "<ons-col align='center' > Familia </ons-col>";
		//tipoGastos += "<ons-col align='center' > SubFamilia </ons-col>";

	}

	else
	{

		tipoGastos += "<ons-col align='center'> Resumen </ons-col>";


	} 

    //tipoGastos += "<ons-col align='center'>  Producto </ons-col>";
    tipoGastos +="<ons-col align='center'>  Canal </ons-col>";
    tipoGastos += "<ons-col align='center'>  ImporteSoles </ons-col>";

	tipoGastos += "</ons-row> </b>";


	$("#tipoGastos").html(tipoGastos);



}

