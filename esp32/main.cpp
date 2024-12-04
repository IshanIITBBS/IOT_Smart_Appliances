#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

// Replace with your network credentials
const char* ssid = "iQOO Z7 5G";
const char* password = "iqooz7123";

// Replace with your WebSocket details
#define WS_HOST "n9qrkhsl-5000.inc1.devtunnels.ms"
#define WS_PORT 443
#define WS_URL "/"

// Device hardware configurations
const int LEDpin = 5;    
const int FanPin = 18;   
const int sensorPin = 2; 

// Constants
const int FAN_OFF = 90;
const int FAN_LOW = 105;
const int FAN_MEDIUM = 145;
const int FAN_HIGH = 180;

int motionState = 0;
unsigned long lastMotionTime = 0;
unsigned long timerDuration = 20000; 
const unsigned long minDetectionPeriod = 500;  // Minimum detection period
bool isLEDOn = false;
bool isFanOn = false;

const int strobeDelay = 100;
static unsigned long lastStrobeTime = 0;
static int strobeCount = 0;
static bool strobeOn = false;

int Mode = 0; // 0: Manual, 1: Automatic, 2: Security
Servo myservo;

void nonBlockingStrobeLED() {
    if (strobeCount < 20) { 
        if (millis() - lastStrobeTime >= strobeDelay) {
            lastStrobeTime = millis();
            strobeOn = !strobeOn;
            digitalWrite(LEDpin, strobeOn ? HIGH : LOW);
            if (!strobeOn) strobeCount++;
        }
    } else {
        digitalWrite(LEDpin, LOW);
        strobeCount = 0; 
    }
}

void resetLEDAndFan() {
    if (isLEDOn) {
        digitalWrite(LEDpin, LOW);
        isLEDOn = false;
        sendStatusMessage("LED turned OFF");
    }
    if (isFanOn) {
        myservo.write(FAN_OFF);
        isFanOn = false;
        sendStatusMessage("Fan turned OFF");
    }
}

// WebSocket client
WebSocketsClient wsClient;

// Function to send a JSON message
void sendStatusMessage(const char* status) {
    StaticJsonDocument<128> doc;
    doc["status"] = status; // Add status message
    doc["LED"] = isLEDOn;
    doc["Fan"] = isFanOn;
    doc["Mode"] = Mode;

    String jsonString;
    serializeJson(doc, jsonString);

    wsClient.sendTXT(jsonString);
}

void handleWebSocketMessage(uint8_t* payload, size_t length) {
    String message = String((char*)payload);
    Serial.print("Message received: ");
    Serial.println(message);

    if (message == "Mode_1") {
        Mode = 1;
        sendStatusMessage("Switched to Automatic mode");
    } else if (message == "Mode_2") {
        Mode = 2;
        sendStatusMessage("Switched to Security mode");
    } else if (message == "Mode_0") {
        Mode = 0;
        sendStatusMessage("Switched to Manual mode");
    } else if (Mode == 0) {
        if (message == "LightOn") {
            digitalWrite(LEDpin, HIGH);
            isLEDOn = true;
            sendStatusMessage("LED turned ON");
        } else if (message == "LightOff") {
            digitalWrite(LEDpin, LOW);
            isLEDOn = false;
            sendStatusMessage("LED turned OFF");
        } else if (message == "Fan_1") {
            myservo.write(FAN_LOW);
            isFanOn = true;
            sendStatusMessage("Fan speed set to Low");
        } else if (message == "Fan_2") {
            myservo.write(FAN_MEDIUM);
            isFanOn = true;
            sendStatusMessage("Fan speed set to Medium");
        } else if (message == "Fan_3") {
            myservo.write(FAN_HIGH);
            isFanOn = true;
            sendStatusMessage("Fan speed set to High");
        } else if (message == "FanOff") {
            myservo.write(FAN_OFF);
            isFanOn = false;
            sendStatusMessage("Fan turned OFF");
        }
    }
}

// WebSocket event handler
void onWSEvent(WStype_t type, uint8_t* payload, size_t length) {
    switch (type) {
        case WStype_DISCONNECTED:
            Serial.println("WebSocket Disconnected");
            break;
        case WStype_CONNECTED:
            Serial.println("WebSocket Connected");
            sendStatusMessage("ESP32 Connected");
            break;
        case WStype_TEXT:
            handleWebSocketMessage(payload, length);
            break;
        default:
            break;
    }
}

void setup() {
    Serial.begin(115200);
    pinMode(LEDpin, OUTPUT);
    digitalWrite(LEDpin, LOW);
    pinMode(sensorPin, INPUT);

    myservo.attach(FanPin);
    myservo.write(FAN_OFF);

    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting...");
    }
    Serial.println("Connected to WiFi!");

    wsClient.beginSSL(WS_HOST, WS_PORT, WS_URL, "", "wss");
    wsClient.onEvent(onWSEvent);
}

void loop() {
    wsClient.loop();

    if (Mode == 1) {
      
        if ( millis() - lastMotionTime >= minDetectionPeriod) {
            motionState = digitalRead(sensorPin);
            if (motionState == HIGH ){
            lastMotionTime = millis();
            if (!isLEDOn) digitalWrite(LEDpin, HIGH);
            if (!isFanOn) myservo.write(FAN_HIGH);
            isLEDOn = true;
            isFanOn = true;
            sendStatusMessage("Auto On");
            }
        }

        if (millis() - lastMotionTime >= timerDuration) {
            sendStatusMessage("Auto Off");
            resetLEDAndFan();
        }
    }
    
    if (Mode == 2) {
        motionState = digitalRead(sensorPin);
        if (motionState == HIGH && millis() - lastMotionTime >= minDetectionPeriod) {
            sendStatusMessage("Intruder Alert");
            lastMotionTime = millis();
            nonBlockingStrobeLED();

        }
        resetLEDAndFan();
    }

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected. Reconnecting...");
        WiFi.begin(ssid, password);
        while (WiFi.status() != WL_CONNECTED) {
            delay(1000);
            Serial.println("Reconnecting...");
        }
        Serial.println("Reconnected to WiFi!");
    }
}