// ================= IMPORTS =================
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <U8g2lib.h>
#include <ArduinoJson.h>
#include <time.h>

// ================= WIFI =================
const char* ssid = "POCOC75";
const char* password = "50505050";

// ================= API =================
const char* serverUrl = "https://diario-classe.onrender.com/rfid/leitura";
const char* apiKey = "abc123rfidseguro456";

// ================= RFID =================
#define SS_PIN 5
#define RST_PIN 4
MFRC522 mfrc522(SS_PIN, RST_PIN);

// ================= DISPLAY =================
U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0);

// ================= LED + BUZZER =================
#define BUZZER 14
#define LED_R 25
#define LED_G 26
#define LED_B 27 // LED azul para processamento

// ================= CONTROLE =================
String lastUID = "";
unsigned long lastReadTime = 0;
const unsigned long debounce = 3000;
unsigned long ultimoUso = 0;
bool aguardandoRemover = false;

// ================= BLOQUEIO UID INVÁLIDO =================
String uidBloqueado = "";
unsigned long ultimoUIDFalha = 0;
const unsigned long bloqueioUIDTempo = 5000; // 5s bloqueio

// ================= TIME =================
const char* ntpServer = "pool.ntp.org";

// ================= FILA OFFLINE =================
struct Registro {
  String uid;
  String timestamp;
};
Registro fila[30];
int filaSize = 0;
unsigned long ultimoEnvio = 0;
const unsigned long intervaloEnvio = 2000;

// ================= ESTADOS DISPLAY =================
enum EstadoDisplay { STANDBY, ENTRADA, SAIDA, ERRO, PROCESSANDO };
EstadoDisplay estadoAtual = STANDBY;
String msgDisplay = "";

// =================================================
// 🎨 DISPLAY
// =================================================
void desenharWifi() {
  int rssi = WiFi.RSSI();
  int barras = 0;

  if (rssi >= -50) barras = 4;
  else if (rssi >= -60) barras = 3;
  else if (rssi >= -70) barras = 2;
  else if (rssi >= -80) barras = 1;
  else barras = 0;

  int x = 100; // canto direito
  int y = 0;

  for (int i = 0; i < barras; i++) {
    u8g2.drawBox(x + i*3, y + (4-i), 2, i+1);
  }
}

void atualizarDisplay(EstadoDisplay estado, String nome = "") {
  estadoAtual = estado;
  msgDisplay = nome;

  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB08_tr);

  switch (estado) {
    case STANDBY:
      u8g2.drawStr(10, 35, "Aproxime o cartao");
      break;

    case PROCESSANDO:
      u8g2.drawStr(10, 35, "Processando...");
      break;

    case ENTRADA:
      u8g2.drawStr(10, 20, "BEM-VINDO");
      u8g2.drawStr(10, 40, nome.c_str());
      break;

    case SAIDA:
      u8g2.drawStr(10, 30, "ATÉ BREVE");
      break;

    case ERRO:
      u8g2.drawStr(10, 20, "ACESSO NEGADO");
      u8g2.drawStr(10, 40, nome.c_str());
      break;
  }

  desenharWifi();
  u8g2.sendBuffer();
}

// =================================================
// 🔊 FEEDBACK
// =================================================
void beep(int tempo) {
  digitalWrite(BUZZER, LOW);
  delay(tempo);
  digitalWrite(BUZZER, HIGH);
}

void acessoPermitido(String nome) {
  atualizarDisplay(ENTRADA, nome);
  digitalWrite(LED_G, HIGH);
  beep(150);
  delay(1200);
  digitalWrite(LED_G, LOW);
}

void acessoNegado(String nome) {
  atualizarDisplay(ERRO, nome);
  digitalWrite(LED_R, HIGH);
  beep(500);
  delay(1200);
  digitalWrite(LED_R, LOW);
}

void processando() {
  atualizarDisplay(PROCESSANDO);
  digitalWrite(LED_B, HIGH);
}

// =================================================
// 🔐 CARTÃO NÃO CADASTRADO
// =================================================
void mostrarUIDNaoCadastrado(String uid) {
  atualizarDisplay(ERRO, "UID: " + uid);
  digitalWrite(LED_R, HIGH);
  beep(500);

  unsigned long inicio = millis();
  while (millis() - inicio < 4000) {  // 4 segundos
    desenharWifi();
    u8g2.sendBuffer();
    delay(200);
  }

  digitalWrite(LED_R, LOW);
  atualizarDisplay(STANDBY);
}

// =================================================
// 🌐 WIFI
// =================================================
void conectarWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  WiFi.disconnect(true);
  delay(500);
  WiFi.begin(ssid, password);

  int tentativas = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    tentativas++;
    if (tentativas > 20) {
      ESP.restart();
    }
  }
  delay(2000);
  Serial.println("WiFi conectado!");
}

// =================================================
// ⏱ TIME
// =================================================
void configurarTempo() {
  configTime(0, 0, ntpServer);
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    delay(500);
  }
}

String getTimestampISO() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "";
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

// =================================================
// 💾 CACHE OFFLINE
// =================================================
void addFila(String uid) {
  if (filaSize >= 30) return;
  fila[filaSize++] = {uid, getTimestampISO()};
}

void processarFila() {
  if (filaSize == 0) return;
  if (millis() - ultimoEnvio < intervaloEnvio) return;
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  Registro r = fila[0];
  String json = "{\"uid\":\"" + r.uid + "\",\"timestamp\":\"" + r.timestamp + "\"}";

  https.begin(client, serverUrl);
  https.addHeader("Content-Type", "application/json");
  https.addHeader("x-api-key", apiKey);
  int code = https.POST(json);

  if (code > 0) {
    String response = https.getString();
    DynamicJsonDocument doc(512);
    if (deserializeJson(doc, response) == DeserializationError::Ok) {
      String status = doc["status"] | "erro";
      String nome = doc["nome"] | "Desconhecido";

      if (status == "ok") acessoPermitido(nome);
      else {
        uidBloqueado = r.uid;
        ultimoUIDFalha = millis();
        mostrarUIDNaoCadastrado(r.uid);
      }
    }
  } else {
    Serial.println("Erro ao enviar fila: " + String(code));
  }

  https.end();
  for (int i = 0; i < filaSize - 1; i++) fila[i] = fila[i + 1];
  filaSize--;
  ultimoEnvio = millis();
  digitalWrite(LED_B, LOW); // apaga LED azul após processamento
}

// =================================================
// 🔧 UTIL
// =================================================
String lerUID() {
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
    uid += String(mfrc522.uid.uidByte[i], HEX);
  uid.toUpperCase();
  return uid;
}

// =================================================
// 💻 TELA DE BOOT
// =================================================
void telaBoot(int duracaoSegundos = 5) {
  int tempoFim = millis() + duracaoSegundos * 1000;
  int ponto = 0;

  u8g2.setFont(u8g2_font_ncenB14_tr); // fonte maior
  while (millis() < tempoFim) {
    u8g2.clearBuffer();

    int x = (128 - u8g2.getStrWidth("Dia A+")) / 2;
    u8g2.drawStr(x, 25, "Dia A+");

    u8g2.setFont(u8g2_font_ncenB08_tr);
    String msg = "Iniciando";
    for (int i = 0; i <= ponto; i++) msg += ".";
    u8g2.drawStr(30, 50, msg.c_str());

    desenharWifi();
    u8g2.sendBuffer();

    ponto++;
    if (ponto > 3) ponto = 0;
    delay(500);
  }
}

// =================================================
// 🚀 SETUP
// =================================================
void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();
  Wire.begin(21, 22);
  u8g2.begin();

  pinMode(BUZZER, OUTPUT);
  digitalWrite(BUZZER, HIGH);
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);

  telaBoot(5);         // tela de boot animada
  conectarWiFi();
  configurarTempo();
  atualizarDisplay(STANDBY);
}

// =================================================
// 🔁 LOOP
// =================================================
void loop() {
  if (millis() - ultimoUso > 4000 && estadoAtual != STANDBY) atualizarDisplay(STANDBY);

  conectarWiFi();
  processarFila();

  if (aguardandoRemover) {
    if (!mfrc522.PICC_IsNewCardPresent()) aguardandoRemover = false;
    return;
  }

  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String uid = lerUID();

  if (uid == lastUID && millis() - lastReadTime < debounce) return;
  if (uid == uidBloqueado && millis() - ultimoUIDFalha < bloqueioUIDTempo) return;

  lastUID = uid;
  lastReadTime = millis();
  ultimoUso = millis();
  aguardandoRemover = true;

  processando();       // LED azul + display processando
  addFila(uid);        // adiciona à fila offline
}