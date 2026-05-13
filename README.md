# SafeRoute College Park

SafeRoute College Park is a full stack web application that helps UMD students understand crime trends around College Park using maps, charts, and public safety data.

The application uses public crime incident data from Prince George’s County and displays it through an interactive map and visual dashboard. Users can also submit their own safety reports which are stored in Supabase.

## Technologies Used

- Node.js
- Express.js
- Supabase
- Leaflet.js
- Chart.js
- HTML
- CSS
- JavaScript
- Vercel

## Target Browsers

- Google Chrome
- Safari
- Firefox
- Microsoft Edge
- iOS Safari
- Android Chrome

## Live Links

GitHub Repository:

https://github.com/bocar2003/saferoute-college-park

Vercel Deployment:

https://saferoute-college-park.vercel.app

## Developer Manual

A separate copy of the Developer Manual is also located in:

```txt
docs/DeveloperManual.md
```

---

# Developer Manual

## Project Overview

SafeRoute College Park is a full stack web application built using Node.js and Express.js. The project uses Supabase as the database and Prince George’s County Open Data as the external API source for crime incident data.

The application includes:
- A home page
- An about page
- An interactive crime map
- A safety report submission system

The frontend uses Fetch API calls through the backend and includes Leaflet.js and Chart.js libraries.

## Installation

Clone the repository:

```bash
git clone https://github.com/bocar2003/saferoute-college-park
cd "inst377 project"
```

Install all dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory of the project.

Add the following variables:

```env
SUPABASE_URL=https://ofacuamvrwlhxmkpzcab.supabase.co
SUPABASE_KEY=sb_publishable_0uuchD1BLU-yytR6cdVPIQ_PO_fMDE1
```

The `.env` file should never be uploaded to GitHub.

## Running the Application

Start the Express server locally:

```bash
npm start
```

Open the application in the browser:

```txt
http://localhost:3000
```

## Testing

This project currently uses manual testing.

Testing process:
1. Run the project locally
2. Open the home page
3. Confirm the chart loads correctly
4. Open the crime map page
5. Confirm map markers appear
6. Open the report page
7. Submit a safety report
8. Confirm the report is saved and displayed
9. Confirm all navigation links work
10. Confirm the deployed Vercel application works online

## API Endpoints

### GET /api/external-crime

Retrieves crime incident data from the Prince George’s County Open Data API.

Purpose:
- Supplies crime information to the map and chart
- Used by frontend Fetch API calls

### GET /api/reports

Retrieves safety reports stored in the Supabase database.

Purpose:
- Displays previously submitted reports on the frontend

### POST /api/reports

Adds a new safety report into the Supabase database.

Example request body:

```json
{
  "location": "Near McKeldin Library",
  "description": "Poor lighting near sidewalk"
}
```

Purpose:
- Allows users to submit safety concerns through the frontend form

## Frontend Features

The frontend uses:
- Fetch API
- Leaflet.js
- Chart.js
- Responsive CSS styling

Pages included:
- Home Page
- About Page
- Crime Map Page
- Report Submission Page

## Known Bugs

Some public crime incidents do not include exact geographic coordinates. In those cases, fallback coordinates are used near College Park to ensure the map continues displaying markers.

Large crime datasets may slightly slow down loading times.

## Future Development Roadmap

Future improvements could include:
- Safer walking route recommendations
- User accounts and authentication
- Real-time safety alerts
- Better filtering tools
- Mobile-first optimization
- Heatmap crime visualization
- Emergency contact integration

## Deployment

This project is deployed using Vercel and connected to a public GitHub repository.

Environment variables added in Vercel:
- SUPABASE_URL
- SUPABASE_KEY