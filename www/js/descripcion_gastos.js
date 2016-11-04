
// Variables locales 

	var urlSearch = window.location.search;
	var mesid = urlSearch.substring( urlSearch.indexOf('&') + 7 , urlSearch.lastIndexOf('&') );
	var tipo = urlSearch.substring( urlSearch.lastIndexOf('=') + 1 , urlSearch.length );
	var familia = urlSearch.substring( urlSearch.indexOf('=') + 1  , urlSearch.indexOf('&') );
	var url = "http://192.168.1.7:80/App Consumos/logica.php";


$(document).on('ready',function(){


	cargDatList();

	var opcion ={"CARGOS" : 5  , "ABONOS": 7 , "ABONOS_PLANILLA": 9 };
	url = url + "?opcion=" + opcion[tipo] + "&mesid=" + mesid + "&familia=" + familia + "&callback=?";

	var inicio = $.getJSON( url , cargarLista );	


//Manipulacion de eventos

$("#regresarId").on("click",function(){

	var url = "gastos_mensuales.html" + "?tipo=" + tipo + "&familia=" + familia;
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


	 $("#gastodId").html(lista);
	 $("#ProgBarrId").hide();
	 $("#ProgCirId").hide(); 


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

