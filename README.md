# CardioSys Medical System

<img src="app/assets/demo/dp-1.webp" alt="Preview of the home page" style="max-width: 100%;" />
<img src="app/assets/demo/dp-2.webp" alt="Preview of the patients section" style="max-width: 100%;" />
<img src="app/assets/demo/dp-3.webp" alt="Preview of a patient information" style="max-width: 100%;" />

## Description

CardioSys is a web application designed to manage patient information and activities within a medical clinic. It offers a user-friendly interface for clinicians and medical staff to handle patients clinical data securely, track appointments, and monitor key statistics, all while improving the efficiency of medical office operations. The system is equipped with advanced features, making it an essential tool for better organization and patient care.

## Features

- **Dashboard**:  
  Visualize key clinic statistics, including the total number of patients, new patients for the current month, and total revenue. This central hub provides a quick overview of your clinic's operations.

- **Monthly Summary**:  
  Displays essential monthly metrics, such as the number of new patients, total revenue, and overall patient count, helping the clinic to track growth and performance.

- **Recent Visits**:  
  Provides a list of recent patient visits, enabling medical staff to quickly access information about past appointments, improving decision-making and workflow.

- **Today's Clinic**:  
  Showcases the current image of the clinic, adding a dynamic visual element to the system that updates throughout the day.

- **File Management**:  
  Securely upload and manage medical files and documents, giving users easy access to critical patient information.

- **Report Generation**:  
  Generate reports in PDF format for patient visits, revenue summaries, or any custom report needed, aiding in compliance and easy data sharing.

## Technologies Used

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Shadcn-UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcn&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![SQL](https://img.shields.io/badge/SQL-003B57?style=for-the-badge&logo=postgresql&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) ![Railway](https://img.shields.io/badge/Railway-000000?style=for-the-badge&logo=railway&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/agusalta/CardioSys](https://github.com/agusalta/Cardiosys.git)
2. Navigate to the project directory:
   ```bash
   cd sistema-medico
3. Install the dependencies:
   ```bash
   npm install
4. Configure the environment variables. 
   Create a *.env.local* file in the root of the project and add the following lines:
   ```bash
   NEXT_PUBLIC_BACKEND_URL=your_backend_url
   NEXT_PUBLIC_PASSWORD=your_auth_password
   NEXT_PUBLIC_USERNAME=your_auth_username
5. Clone the backend repository and start the server by following the steps in the repository:
   ([https://github.com/agusalta/CardioSys-Back.git]).
6. Start the application:
    ```bash
   npm run dev
7. Open your browser and visit default host:
   **http://localhost:3001**

## Usage

Once the application is running, you can login using your .env credentials and then you can access the dashboard where the clinic statistics are displayed. 
You can interact with the buttons to toggle the visibility of total revenue and navigate to the patients section.

## Contributions

Contributions are welcome. If you wish to contribute, please follow these steps:

1. Fork the project.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push your changes (`git push origin feature/new-feature`).
5. Open a Pull Request.

## Contact

For more information, you can contact [agustinaltamirano2024@gmail.com](mailto:agustinaltamirano2024@gmail.com).
