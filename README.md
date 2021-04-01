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

**Additional Properties:** `false`<br/>
<br>**Option 1 (alternative):** 
Modbus Serial Interface


**Properties**

|Name|Description|Type|
|----|-----------|----|
|connect\_type|Connection Type<br/><br/>Enum: `["RTU","C701","RTUBuffered","AsciiSerial"]`|string|
|connect\_path|Connect Path, i.e. device path<br/>|string|
|[connect\_options](#option1connect_options)|Connect Options (Serial)<br/>|object|
|[map](#definitionsmap)|Modbus devices<br/><br/>Format: `"tabs"`|object\[\]|

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

|Name|Description|Type|
|----|-----------|----|
|connect\_type|Connection Type<br/><br/>Enum: `["TCP","Telnet"]`|string|
|connect\_path|Host<br/>|string|
|[connect\_options](#option2connect_options)|Connect Options (Network)<br/>|object|
|[map](#definitionsmap)|Modbus devices<br/><br/>Format: `"tabs"`|object\[\]|

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
### Option 1: connect\_options: Connect Options \(Serial\)

**Properties**

|Name|Description|Type|
|----|-----------|----|
|baudRate|Baud rate<br/>|number|

<a name="definitionsmap"></a>
### definitions/map: Modbus devices

**Items**

**Item Properties**

|Name|Description|Type|
|----|-----------|----|
|node|Node to map to<br/>|string|
|id|Modbus Client ID<br/><br/>Minimum: `0`|number|
|address|Modbus Field Address<br/><br/>Minimum: `0`|number|
|type|Modbus Field Type<br/><br/>Enum: `["input boolean","input register","output boolen","output register"]`|string|
|datatype|Field Data Type<br/><br/>Default: `"uint16"`<br/>Enum: `["boolean","uint16"]`|string|
|[metadata](#definitionsmapmetadata)|Node Metadata<br/>|object|

**Item Required Properties:** id,address,datatype<br/>
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

<a name="definitionsmapmetadata"></a>
#### definitions/map\.metadata: Node Metadata

**Additional Properties:** `true`<br/>
<a name="option2connect_options"></a>
### Option 2: connect\_options: Connect Options \(Network\)

**Properties**

|Name|Description|Type|
|----|-----------|----|
|port|Port<br/>|number|


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
