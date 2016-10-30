
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
	 
	 lista+="<tr>";
	 
	 if(tipo != "CARGOS" )
	 {
	 
	 lista+="<td>" + presultado[i].CLIENTEID + "</td>";

	 }

	 lista+="<td>" + presultado[i].MESID + "</td>";
	 lista+="<td>" + presultado[i].FECHA + "</td>";

	 if( tipo == "CARGOS")
	 {

	 lista+="<td>" + presultado[i].FAMILIA + "</td>";
	 lista+="<td>" + presultado[i].SUBFAMILIA + "</td>";

	 }

	 else
	 {

	 lista+="<td>" + presultado[i].DESCRIPCION + "</td>";

	 } 

	 lista+="<td>" + presultado[i].PRODUCTO + "</td>";
	 lista+="<td>" + presultado[i].CANAL + "</td>";
	 lista+="<td>" + presultado[i].IMPORTESOLES + "</td>";
	 lista+="</tr>";

	 console.log(lista);
	 $("#gastodId").html(lista);


	}

}


// La siguiente funcion permite cargar la cabecera de la lista de gastos segun el tipo de gastos seleccioando

function cargDatList()
{
	var tipoGastos = "<tr>";

	if( tipo != "CARGOS" )
	{
		
		tipoGastos += "<th> Clienteid </th>";


	}	

	tipoGastos +="<th> MesId </th> <th> Fecha </th>";


	if( tipo == "CARGOS")
	{

		tipoGastos += "<th> Familia </th><th> SubFamilia </th>";

	}

	else
	{

		tipoGastos += "<th> Descripcion </th>";


	} 

    tipoGastos += "<th> Producto </th><th> Canal </th><th> ImporteSoles </th>";

	tipoGastos += "</tr>";

	$("#tipoGastos").html(tipoGastos);



}

