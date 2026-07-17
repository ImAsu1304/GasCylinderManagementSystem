# QuickCylinder Full Deployment Guide

Because QuickCylinder is a full-stack application, the deployment is split into three main components:
1. **The Database** (MySQL/MariaDB) - Hosted online
2. **The Backend** (Java Spring Boot) - Hosted on Render
3. **The Frontend** (React/Vite) - Hosted on Vercel

Follow these exact steps in order.

---

## Part 1: Push Your Code to GitHub
Both Vercel and Render deploy directly from your GitHub repositories.
1. Create a free account on [GitHub](https://github.com/).
2. Create a new repository for your project (e.g., `quickcylinder-gas-booking`).
3. Open your terminal in the root of your project and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/quickcylinder-gas-booking.git
   git push -u origin main
   ```

---

## Part 2: Host Your Database Online
*Render no longer offers free MySQL databases, so we recommend Aiven for a free, reliable database.*

1. Create a free account at [Aiven.io](https://aiven.io/).
2. Click **Create Service** and select **MySQL** (the free Hobbyist plan).
3. Once the database is running, copy the **Host**, **Port**, **User**, and **Password** from the overview page.
4. Open your project's `backend/src/main/resources/application.properties` file and update it with the live database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://<YOUR_AIVEN_HOST>:<PORT>/defaultdb?sslMode=REQUIRED
   spring.datasource.username=<YOUR_AIVEN_USER>
   spring.datasource.password=<YOUR_AIVEN_PASSWORD>
   spring.jpa.hibernate.ddl-auto=update
   ```
5. Commit and push these changes to GitHub so Render can see them.

---

## Part 3: Deploy Backend (Spring Boot) to Render

1. Create a free account at [Render.com](https://render.com).
2. On the Dashboard, click **New** -> **Web Service**.
3. Connect your GitHub account and select your `quickcylinder-gas-booking` repository.
4. Configure the settings carefully:
   - **Name**: `quickcylinder-api`
   - **Root Directory**: `backend` *(Crucial: This tells Render to only look inside the backend folder!)*
   - **Language/Environment**: `Docker` *(I have just created a `Dockerfile` for you in the backend folder that handles everything!)*
   - **Instance Type**: Free
5. Click **Create Web Service**.
6. Render will automatically detect the `Dockerfile` in your backend folder, build the Java app, and deploy it. This usually takes 5-10 minutes.
7. **Add your Database Credentials to Render:**
   - On your Render Web Service page, click **Environment** in the left sidebar.
   - Click **Add Environment Variable** and add these exactly:
     - Key: `DB_URL` | Value: `jdbc:mysql://mysql-108d568f-myproject1304.f.aivencloud.com:18415/defaultdb?sslMode=REQUIRED`
     - Key: `DB_USER` | Value: `avnadmin`
     - Key: `DB_PASSWORD` | Value: `<YOUR_AIVEN_PASSWORD_HERE>`
   - Click **Save Changes**. Render will automatically redeploy with the correct live database!
8. Once it says "Live", copy the URL provided at the top left (e.g., `https://quickcylinder-api.onrender.com`).
9. **Important**: Add `/api` to the end of this URL. Your final backend URL is: `https://quickcylinder-api.onrender.com/api`

---

## Part 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create an account using GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `quickcylinder-gas-booking` repository.
4. Configure the settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` *(Crucial: Click Edit and select the frontend folder!)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** section:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://quickcylinder-api.onrender.com/api` *(Paste the Render URL you copied in Part 3)*
6. Click **Deploy**. Vercel will build your frontend and give you a live URL for your app!

---

## Part 5: How to Change the Backend URL in Vercel Later

If your Render backend URL ever changes, you **do not** need to change the code. You simply update the environment variable directly in Vercel:

1. Go to your Vercel Dashboard and click on your project.
2. Click the **Settings** tab at the top.
3. In the left sidebar, click **Environment Variables**.
4. Scroll down to find `VITE_API_URL`.
5. Click the three dots (`...`) next to it and select **Edit**.
6. Paste your new backend URL (making sure it ends in `/api`) and click **Save**.
7. **CRUCIAL STEP**: Environment variables are baked into the frontend during the build process. Just saving is not enough! 
   - Click the **Deployments** tab at the top.
   - Click the three dots (`...`) next to your most recent deployment.
   - Click **Redeploy**. Once the redeploy finishes, your app will start talking to the new backend!
