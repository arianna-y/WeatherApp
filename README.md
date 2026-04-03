# 🌤 Weather App

A full-stack weather forecasting web application built with **Angular** and **Node.js**, featuring real-time weather data, interactive charts, Google Maps integration, and a favorites system.

## Features

- **City autocomplete**: powered by Google Places API with real-time suggestions
- **Current & forecast weather**: temperature, humidity, wind speed, UV index, and more
- **Interactive charts**: hourly and multi-day forecast visualizations
- **Google Maps integration**: location-aware display
- **Favorites system**: save and revisit frequently searched locations
- **Responsive design**: works across desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 18, TypeScript, Angular Material |
| Backend | Node.js, Express |
| APIs | Tomorrow.io Weather API, Google Maps/Places API |
| Charts | Chart.js |
| Styling | CSS3, Angular Animations |

## Getting Started

### Prerequisites
- Node.js v18+
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
# Clone the repo
git clone https://github.com/arianna-y/weather-app.git
cd weather-app/angular

# Install dependencies
npm install

# Start dev server
ng serve
```

Navigate to `http://localhost:4200`

### Backend

```bash
cd server
npm install
node server.js
```

## Project Structure

```
angular/
├── src/app/
│   ├── app.component.ts       # Main component — search, state, routing
│   ├── weather/               # Current weather display
│   └── weather-details/       # Detailed forecast + charts
├── public/
│   └── Images/WeatherIcons/   # Custom weather icon set
└── server.ts                  # Express backend
```

## Screenshots

> _Coming soon_

## Notes

Built as part of a full-stack web development course. Demonstrates async API integration, reactive forms, component-based architecture, and third-party service orchestration.
