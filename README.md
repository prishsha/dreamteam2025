# DREAMTEAM

This is the auction portal used during the IPL Auction Simulation DreamTeam!

Meant to be used for audience


## 💻 Installation & Usage
### API
1. Copy the `api/configs/config.example.yml` file as `config.yml` in the same folder. Modify the necessary details.
1. Run Postgres and fill in the database connection details.
1. Get a Google Oauth Client ID and Client Secret from [Google Cloud Console](https://console.cloud.google.com/) and fill the details.
1. Get the required assets for the frontend and place them in a folder called `assets/` in the `api/` folder.


#### Docker Compose
1. Navigate to the `/api` folder and run `docker compose up`

#### Manually (Go)
1. Make sure you have Go 1.22 installed.
1. Run go run cmd/dreamteam/main.go
1. Server should start at port 8069 (default)

### Next.js
1. Install the dependencies using `npm install` or `yarn install` or `pnpm install` or `bun install`
1. Run the development server using `npm run dev` or `yarn dev` or `pnpm dev` or `bun dev`
1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
1. The easiest way to deploy the Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.



## ️️🛠️ Technologies Used
1. Golang
1. Postrges
1. Websockets
1. Next.js
1. Typescript

## Screenshots
