<?
$result = array();

mysql_connect('localhost','root','');
mysql_select_db('test_phone');

switch($_SERVER['REQUEST_METHOD']){
	case 'GET':
		$query = "SELECT * FROM phones";
		$res = mysql_query($query);
		while($row = mysql_fetch_assoc($res))
		{
			$result[] = $row;
		}
		echo json_encode($result);

	break;
	
	case 'POST':
		{
			$arr = file_get_contents("php://input");
			$arr = json_decode($arr);
			$username = $arr->{'username'};
			$phoneNum = $arr->{'phoneNum'};
			
			$query = "INSERT INTO phones (username, phoneNum) VALUES('$username','$phoneNum')";
			if(mysql_query($query))
			{
				$query = "SELECT max(id) FROM phones";
				$res = mysql_query($query);
				$row = mysql_fetch_assoc($res);
				echo $row['max(id)'];
			}
		}
		
	break;
	
	case 'DELETE':
		$id = substr($_SERVER["PATH_INFO"],1);
		$query = "DELETE FROM phones WHERE id=$id";
		
		echo mysql_query($query);
	break;
	
	case 'PUT':
		$arr = file_get_contents("php://input");
		$arr = json_decode($arr);
		$username = $arr->{'username'};
		$phoneNum = $arr->{'phoneNum'};
		$id = $arr->{'id'};
		
		$query = "UPDATE phones SET username='$username', phoneNum='$phoneNum' WHERE id=$id";
		echo mysql_query($query);
	break;
}

?>