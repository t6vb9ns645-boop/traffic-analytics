# Verkehrsanalyse — Bewegungs-Heatmap (Entwicklungsversion)

Client-seitiger Prototyp zur Verkehrsanalyse per Bewegungserkennung (Frame-Differencing) im Browser — keine Serverkommunikation, keine trainierte KI.

## Live-Demo öffnen

Die App ist erreichbar unter:

`https://<dein-github-user>.github.io/traffic-analytics/`

Der Zugriff ist **passwortgeschützt**: Die veröffentlichte Seite (`public/index.html`) enthält nur eine per AES-256-GCM verschlüsselte Fassung der App (Schlüssel via PBKDF2-SHA256 aus dem Passwort abgeleitet, 250.000 Iterationen). Erst nach Eingabe des korrekten Passworts wird sie im Browser entschlüsselt und angezeigt. Das Passwort selbst wird nirgends im Repo gespeichert.

**Hinweis zur Sicherheit:** Das ist eine rein clientseitige Zugriffssperre ohne Server/Backend — sie verhindert zuverlässig das beiläufige Lesen des Inhalts ohne Passwort, ist aber kein Ersatz für echte Server-Authentifizierung (ein Angreifer könnte die Ciphertext herunterladen und das Passwort offline per Brute-Force angreifen, falls es schwach ist).

### Passwort ändern / Seite neu bauen

Die eigentliche App liegt unverschlüsselt in `src/app.html` (nur im privaten Repo sichtbar, wird nicht veröffentlicht). Um `public/index.html` mit einem neuen Passwort neu zu erzeugen:

```bash
node build.js 'NeuesPasswort'
# oder: SITE_PASSWORD='NeuesPasswort' node build.js
```

Anschließend `public/index.html` committen und pushen.

## Funktionen

- Quellen: Webcam, lokale Videodatei oder Stream-URL (mit CORS-Freigabe)
- Bewegungserkennung via adaptivem Hintergrundmodell + morphologischen Operationen
- Fahrzeug-Tracking mit Bestätigungslogik gegen Flacker-Fehltreffer
- Größen-/Form-Heuristik-Klassifizierung (Motorrad/Fahrrad, PKW, LKW/Bus, Person)
- Perspektivische Kalibrierung (4-Punkt-Homographie) für reale Geschwindigkeiten (m/s, km/h)
- Automatischer Fahrbahn-Kalibrierungsvorschlag aus Standbild (Sobel-Kantenerkennung + Hough-Transformation)
- Ansichten: Live + Erkennung, Dichte-Heatmap, Flow-Heatmap, Geschwindigkeits-Heatmap
- Export der Trajektorien als JSON

## Lokal ausführen

Die App ist eine einzelne statische HTML-Datei (`index.html`) ohne Build-Schritt. Einfach im Browser öffnen oder lokal servieren:

```bash
python3 -m http.server 8000
```

und dann `http://localhost:8000` aufrufen.

**Hinweis:** Kamerazugriff (`getUserMedia`) erfordert einen sicheren Kontext (HTTPS oder `localhost`) — auf GitHub Pages funktioniert das direkt.

## Einschränkungen (siehe Hinweise in der App)

Die Erkennung basiert auf klassischer Bildverarbeitung (Frame-Differencing, Sobel, Hough), nicht auf einem trainierten neuronalen Netz. Die Klassifizierung nach Fahrzeugtyp ist eine Heuristik anhand der Objektgröße/-form, keine echte KI-Bilderkennung.
