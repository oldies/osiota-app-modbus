<!--
Auto generated documentation:
  * Adapt schema.json and
  * Run npm run doc

Please edit schema.json or
	https://github.com/simonwalz/osiota-dev/blob/master/partials/main.md
-->
<a name="root"></a>
# osiota application modbus

*Osiota* is a software platform capable of running *distributed IoT applications* written in JavaScript to enable any kind of IoT tasks. See [osiota](https://github.com/osiota/osiota).

## Configuration: modbus


This application connects devices via Modbus.

**Additional Properties:** not allowed<br/>
<br>**Option 1 (alternative):** 
Modbus Serial Interface


**Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**connect\_type**<br/>(Connection Type)|`string`|Enum: `"RTU"`, `"C701"`, `"RTUBuffered"`, `"AsciiSerial"`<br/>|yes|
|**connect\_path**|`string`|i.e. device path<br/>|yes|
|[**connect\_options**](#option1connect_options)<br/>(Serial Connect Options)|`object`|Additional options for connecting to modbus, i.e. the baud rate settings<br/>|no|
|[**map**](#option1map)<br/>(Modbus devices)|`object[]`||no|

**Example**

```json
{
    "connect_type": "RTUBuffered",
    "connect_path": "/dev/ttyUSB0",
    "connect_options": {
        "baudRate": 9600
    }
}
```


<br>**Option 2 (alternative):** 
Modbus Network Interface


**Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**connect\_type**<br/>(Connection Type)|`string`|Enum: `"TCP"`, `"Telnet"`<br/>|yes|
|**connect\_path**<br/>(Host)|`string`|i.e. an IP address or host name<br/>|yes|
|[**connect\_options**](#option2connect_options)<br/>(Network Connect Options)|`object`|Additional options for connecting to modbus, i.e. the port settings<br/>|no|
|[**map**](#option2map)<br/>(Modbus devices)|`object[]`||no|

**Example**

```json
{
    "connect_type": "Telnet",
    "connect_path": "192.168.1.101",
    "connect_options": {
        "port": 1234
    }
}
```


<a name="option1connect_options"></a>
### Option 1: connect\_options: Serial Connect Options

Additional options for connecting to modbus, i.e. the baud rate settings

See [SerialPort options](https://serialport.io/docs/api-stream#openoptions)


**Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**baudRate**<br/>(Baud rate)|`number`||no|

<a name="option1map"></a>
### Option 1: map: Modbus devices

**Items: Modbus device**

**Item Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**node**<br/>(Node to map to)|`string`||no|
|**id**<br/>(Modbus Client ID)|`number`|Minimum: `0`<br/>|yes|
|**address**<br/>(Modbus Field Address)|`number`|Minimum: `0`<br/>|yes|
|**type**<br/>(Modbus Field Type)|`string`|Enum: `"input boolean"`, `"input register"`, `"output boolen"`, `"output register"`<br/>|no|
|**datatype**<br/>(Field Data Type)|`string`|Default: `"uint16"`<br/>Enum: `"boolean"`, `"uint16"`<br/>|yes|
|[**metadata**](#option1mapmetadata)<br/>(Node Metadata)|`object`||no|

**Example**

```json
[
    {
        "node": "/Lamp Switch",
        "id": 0,
        "address": 10,
        "type": "output boolean",
        "datatype": "boolean",
        "metadata": {
            "power": 60
        }
    }
]
```

<a name="option1mapmetadata"></a>
#### Option 1: map\.metadata: Node Metadata

**Additional Properties:** allowed<br/>
<a name="option2connect_options"></a>
### Option 2: connect\_options: Network Connect Options

Additional options for connecting to modbus, i.e. the port settings

See [Connect options](https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener)


**Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**port**|`number`|Modbus Port<br/>Default: `502`<br/>|no|

**Example**

```json
{
    "port": 502
}
```

<a name="option2map"></a>
### Option 2: map: Modbus devices

**Items: Modbus device**

**Item Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**node**<br/>(Node to map to)|`string`||no|
|**id**<br/>(Modbus Client ID)|`number`|Minimum: `0`<br/>|yes|
|**address**<br/>(Modbus Field Address)|`number`|Minimum: `0`<br/>|yes|
|**type**<br/>(Modbus Field Type)|`string`|Enum: `"input boolean"`, `"input register"`, `"output boolen"`, `"output register"`<br/>|no|
|**datatype**<br/>(Field Data Type)|`string`|Default: `"uint16"`<br/>Enum: `"boolean"`, `"uint16"`<br/>|yes|
|[**metadata**](#option2mapmetadata)<br/>(Node Metadata)|`object`||no|

**Example**

```json
[
    {
        "node": "/Lamp Switch",
        "id": 0,
        "address": 10,
        "type": "output boolean",
        "datatype": "boolean",
        "metadata": {
            "power": 60
        }
    }
]
```

<a name="option2mapmetadata"></a>
#### Option 2: map\.metadata: Node Metadata

**Additional Properties:** allowed<br/>

## How to setup

Add a configuration object for this application, see [osiota configuration](https://github.com/osiota/osiota/blob/master/doc/configuration.md):

```json
{
    "name": "modbus",
    "config": CONFIG
}
```

## License

Osiota and this application are released under the MIT license.

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/osiota/osiota/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
