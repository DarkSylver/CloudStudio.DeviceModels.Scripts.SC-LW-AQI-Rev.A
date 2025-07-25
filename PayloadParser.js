function parseUplink(device, payload)
{
	// Esta función permite procesar un payload recibido, y almacenar los datos en los
	// endpoints respectivos. Más información enhttps://wiki.cloud.studio/page/200

	// Los parámetros de esta función, sin:
	// - device: objeto representando el dispositivo que produjo el
	//   payload. Puede usarse "device.endpoints" para acceder a la colección
	//   de endpoints contenidos en el dispositivo. Más información en
	//   https://wiki.cloud.studio/page/205
	// - payload: objeto que contiene el payload recibido del dispositivo. Más 
	//   información en https://wiki.cloud.studio/page/208.

	// Este ejemplo está escrito asumiendo un sensor de temperatura y humedad que 
	// envía un payload binario con temperatura en el primer byte, humedad en el 
	// segundo byte y porcentaje de batería en el tercer byte.

 

	// El payload es binario, así que es más sencillo manejarlo como array de bytes
	var bytes = payload.asBytes();
	
	// Verificar que el payload contiene exactamente 3 bytes
	if (bytes.length != 3)
		return;

	// Parsear y almacenar la temperatura
	var temperatureSensor = device.endpoints.byType(endpointType.temperatureSensor);
	if (temperatureSensor != null)
	{
		var temperature = bytes[0] & 0x7f;
		if (bytes[0] & 0x80)  // ¿Temperatura negativa?
			temperature -= 128;
		temperatureSensor.updateTemperatureSensorStatus(temperature);
	}

	// Parsear y almacenar la humedad
	var humiditySensor = device.endpoints.byType(endpointType.humiditySensor);
	if (humiditySensor != null)
	{
		var humidity = bytes[1];
		humiditySensor.updateHumiditySensorStatus(humidity);
	}	  
	
	// Parsear y almacenar el porcentahe de batería
	var batteryPercentage = bytes[2];
	device.updateDeviceBattery({ percentage: batteryPercentage });



}