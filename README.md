# Verkehrsanalyse — Bewegungs-Heatmap (Entwicklungsversion)

Client-seitiger Prototyp zur Verkehrsanalyse per Bewegungserkennung (Frame-Differencing) im Browser — keine Serverkommunikation, keine trainierte KI.

## Live-Demo öffnen

Nach Aktivierung von GitHub Pages (siehe unten) ist die App erreichbar unter:

`https://<dein-github-user>.github.io/traffic-analytics/`

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
