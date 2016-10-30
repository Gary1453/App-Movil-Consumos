<?php


//http://localhost/App Consumos.php

putenv('ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
$opcion=$_GET['opcion'];

switch ($opcion) {


			case 0:

			$valor=0;
			
			
			$usuario = $_POST['usuario'];
			$tipodocumento = $_POST['tipodocumento'];			
			$password = $_POST['password']; 
						
			$resultado=array();
			
			session_start();		
			$conn = oci_connect("natan","nisekoi","localhost/XE");

			$sql="
						Select

						Val.Clienteid,
						initcap( Val.NombreCliente )  as Nombre,
						count(1) as cantidad

						from 
						natan.gc_validacion Val

						where

						Val.password ='$password' and
						Val.TipoDocumento = '$tipodocumento' and 
						Val.NumeroDocumento = '$usuario'

						group by
						Val.Clienteid,
						Val.NombreCliente";		
	
			$parse = oci_parse($conn, $sql);
			$res = oci_execute($parse);

			while( oci_fetch($parse) )
			{

			

				$valor = oci_result ( $parse , 'CANTIDAD');
				$nombre = oci_result ( $parse , 'NOMBRE' );
				$clienteid = oci_result ( $parse , 'CLIENTEID' );

				//$_SESSION['nombre'] = $nombre;
				//$_SESSION['clienteid'] = $clienteid;




			};

			if($valor == 1)
			{
				
				$resultado["exito"] = "OK";
				
			}
			else
			{
			
				$resultado["exito"] = "NO OK";
				

			};

			$resultado["clienteid"] = $clienteid;
			$resultado["nombre"] = $nombre;
			

			header('Content-type: application/json; charset=utf-8');
			$response = json_encode($resultado);			
			echo $response;			
			oci_close($conn); 
		
			break;

			//Nos retorna los gastos dados por familia 

			case 1:
		
			//http://localhost/App Consumos.php?opcion=1&callback=?
			session_start();
			$clienteid = $_GET['clienteid'];
			$_SESSION['clienteid'] = $clienteid;
			$conn=oci_connect("natan","nisekoi","localhost/XE");												

			$sql = "
						Select

						Con.FamiliaGeneral as Familia,
						sum( ImporteSoles ) as Importe

						from 
						Natan.Gc_Consumos Con

						where
						Con.clienteid='$clienteid' and 
						Con.tipo in ('CARGOS') and
						Con.MesId = '201606'

						group by 

						Con.FamiliaGeneral ";

			$parse=oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response=$_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;
			 oci_close($conn);


			 break;

			 //Nos retorna los gastos segun el tipo de gasto

			 case 2:
		
			//http://localhost/App Consumos.php?opcion=2&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_GET['clienteid'];
			$_SESSION['clienteid'] = $clienteid;
			$sql = "
					Select
					*
					from
					(
						Select

						Con.MesId,
						Con.Tipo as TipoCargo,
						nvl( sum( ImporteSoles ) , 0 )  as Importe

						from 
						Natan.Gc_Consumos Con

						where
						Con.clienteid='$clienteid'and				
						to_char( add_months( sysdate , -10 ) , 'YYYYMM' ) < mesid

						group by 

						Con.MesId,
						Con.Tipo  )

					pivot 
					(
						sum(Importe) for 
						TipoCargo in ('CARGOS' as Cargos,'ABONOS' as Abonos) 
					)

					order by mesid";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response = $_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;


			 break;


			 //Nos devuelve los ultimos 6 meses de gastos segun una familia dada

			 case 3:
		
			//http://localhost/App Consumos.php?opcion=3&famila=SALUD&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_SESSION['clienteid'];			
			$familia = $_GET['familia'];

			$sql = "
						Select

						Con.MesId,					
						sum( ImporteSoles ) as Importe

						from 
						Natan.Gc_Consumos Con

						where
						Con.clienteid='$clienteid'and				
						to_char( add_months( sysdate , -10 ) , 'YYYYMM' ) < mesid and 
						Con.Tipo in upper('Cargos') and 
						Con.FamiliaGeneral in upper('$familia')

						group by 

						Con.MesId						

						order by 
						Con.mesid";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response = $_GET["callback"]."(".json_encode($lista).")";

			 echo $response;


			 break;


			 //Nos devuelve el resumen de gastos del ultimo mes de una familia dada 

			 case 4:
		
			//http://localhost/App Consumos.php?opcion=4&familia=RESTAURANTES&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_SESSION['clienteid'];
			$familia = $_GET['familia'];
			$sql = "
					Select 

					Con.MesId,
					Con.Fecha,
					Con.Descripcion,
					Con.Tipo,
					Con.Familia,
					Con.SubFamilia,
					Con.Producto,
					Con.Canal,
					Con.ImporteSoles

					from 
					gc_consumos Con

					where
					Con.clienteid='$clienteid' and				
					Con.MesId = (select max(mesid) from gc_consumos) and 
					Con.Tipo in upper('Cargos') and 
					Con.FamiliaGeneral in upper('$familia')";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response = $_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;


			 break;


			 //Nos devuelve el resumen de gastos de un mes seleccionado y de una familia dada 

			 case 5:
		
			//http://localhost/App Consumos.php?opcion=5&familia=ESTACIONES DE SERVICIO&mesid=201510&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_SESSION['clienteid'];
			$familia = $_GET['familia'];
			$mesid=$_GET['mesid'];
			$sql = "
					Select 

					Con.MesId,
					Con.Fecha,
					Con.Descripcion,
					Con.Tipo,
					Con.Familia,
					Con.SubFamilia,
					Con.Producto,
					Con.Canal,
					Con.ImporteSoles

					from 
					gc_consumos Con

					where
					Con.clienteid='$clienteid' and				
					Con.MesId = '$mesid' and 
					Con.Tipo in upper('Cargos') and 
					Con.FamiliaGeneral in upper('$familia')";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response = $_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;


			 break;



			 //Nos devuelve el acumulado de  tranferencias realizadas a un cliente en los ultimos 6 meses 

			 case 6:
		
			//http://localhost/App Consumos.php?opcion=6&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_SESSION['clienteid'];

			$sql = "

						Select 

						Con.MesId,
						sum( Con.ImporteSoles ) as Importe

						from 
						gc_consumos Con 

						where 
						Con.tipo in upper('abonos') and
						Con.ClienteIdAbonado ='$clienteid' and
						Con.TransaccionPropia !='1' and 
						to_char( add_months( sysdate , -10 ) , 'YYYYMM' ) < mesid 

						group by 
						Con.MesId

						order by
						Con.MesId";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);

			 $response = $_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;


			 break;


			 //Nos devuelve el detalle de las transferencias realizadas a un cliente en los ultimos 6 meses 

			 case 7:
		
			//http://localhost/App Consumos.php?opcion=7&mesid=201603&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_SESSION['clienteid'];
			$mesid = $_GET['mesid'];
			$sql = "
						Select 

						Con.Clienteid,
						Con.MesId,
						Con.Fecha,
						Con.Descripcion,
						Con.Producto,
						Con.Canal,
						Con.ImporteSoles

						from 
						gc_consumos Con 

						where 
						Con.tipo in upper('abonos') and
						Con.ClienteIdAbonado ='$clienteid' and
						Con.TransaccionPropia !='1' and 
						mesid='$mesid'


						order by
						Con.MesId";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response = $_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;


			 break;

			 //Nos devuelve los depositos a planilla realizados en los ultimos 6 meses a un cliente

			 case 8:
		
			//http://localhost/App Consumos.php?opcion=8&mesid=201603&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_SESSION['clienteid'];
			$sql = "
						Select 

						Con.MesId,
						sum( Con.ImporteSoles ) as Importe

						from 
						gc_consumos Con 

						where 
						Con.tipo in upper('abono planillas') and
						Con.ClienteIdAbonado ='$clienteid' and
						Con.TransaccionPropia !='1' and 
						to_char( add_months( sysdate , -10 ) , 'YYYYMM' ) < Con.mesid 

						group by 
						Con.MesId

						order by
						Con.MesId";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response = $_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;


			 break;

			 //Nos devuelve el detalle de un abono realizado a una planilla de un  cliente 

			 case 9:
		
			//http://localhost/App Consumos.php?opcion=9&mesid=201602&callback
			
			$conn=oci_connect("natan","nisekoi","localhost/XE");
			session_start();
			$clienteid = $_SESSION['clienteid'];
			$mesid = $_GET['mesid'];
			$sql = "
						Select 

						Con.Clienteid,
						Con.MesId,
						Con.Fecha,
						Con.Descripcion,
						Con.Producto,
						Con.Canal,
						Con.ImporteSoles

						from 
						gc_consumos Con 

						where 
						Con.tipo in upper('abono planillas') and
						Con.ClienteIdAbonado ='$clienteid' and
						Con.TransaccionPropia !='1' and 
						mesid='$mesid'

						order by
						Con.MesId";

			$parse = oci_parse($conn,$sql);
			$res = oci_execute($parse);
			$lista = array();
			while( ($row = oci_fetch_object ( $parse ) ) != false )
			{
			  
			  $lista[] = $row;  			  

			}

			 utf8_encode_deep($lista);


			 $response = $_GET["callback"]."(".json_encode($lista).")";
			

			 echo $response;


			 break;


			 //Este metodo permite cerrar sesion

			 case 10:					
			

			session_start();
			session_unset();
			session_destroy();

			header("Location: http://192.168.1.7:8000/login.html");


			 break;


}


//Metodos de Apoyo 


//Este metodo permite codificar a UTF8 todos lo valores de un object 

 function utf8_encode_deep(&$input){


		if(is_string($input)){

			$input=utf8_encode($input);
			//echo 'deberia salir';

		}else if(is_array($input)){

			foreach ($input as &$value) {

				utf8_encode_deep($value);			
			}

			unset($value);

		}else if(is_object($input)){

			$vars=array_keys(get_object_vars($input));

			foreach ($vars as $var) {
			  utf8_encode_deep($input->$var);
			}

		}



	}



?>