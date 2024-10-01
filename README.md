# DREAMTEAM

This is the auction portal used during the IPL Auction Simulation DreamTeam!

Meant to be used for audience and admins.

![Dreamteam](https://github.com/user-attachments/assets/a607abd8-2a5f-40ad-8abc-31d776d7d848)


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

![Landing](https://github.com/user-attachments/assets/5df28007-0768-4665-9008-565067e27ba9)

![All Players](https://github.com/user-attachments/assets/0fd09d59-6f22-4830-bca4-336abcee2438)

![Auction Page](https://github.com/user-attachments/assets/b9ecf6b9-bd5b-45da-9284-5d89071dab25)

![Rule](https://github.com/user-attachments/assets/234f5db7-3e63-4cd7-9458-740a78b9ab57)

![My Team](https://github.com/user-attachments/assets/75552363-9caa-4a3f-8837-7a7441808418)

![Sold Page](https://github.com/user-attachments/assets/efcbb13b-6871-4c29-839b-e95f7982ff74)

![Admin Page](https://github.com/user-attachments/assets/eb78a4d7-2d1d-4517-8eb2-4c4eeb79f9d8)
