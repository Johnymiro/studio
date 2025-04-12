# **App Name**: ExcelBill

## Core Features:

- Excel Upload & Parse: Upload and parse Excel files (.xls, .xlsx) to extract data.
- Dynamic Table Generation: Dynamically render a table based on the column headers in the uploaded Excel file.
- Table Search & Filtering: Implement a search input field to filter the table data based on user input.
- Print Action Button: Add an 'Action' column to each row with a print icon. Clicking the icon opens a modal.
- Print Selection Modal: The modal lets users select which fields from the row to include in the billing printout, then opens the browser's print dialog.

## Style Guidelines:

- Primary color: Use a calming blue (#2563EB) as the primary color for headers and prominent elements.
- Secondary color: Use a light gray (#F3F4F6) for the table background and other supporting elements.
- Accent: Green (#16A34A) for the print action button to indicate a positive action.
- Clean and readable sans-serif font for the table data and UI elements.
- Simple and recognizable icons for the print action (e.g., a printer icon).
- Use a responsive layout to ensure the table is displayed correctly on different screen sizes.
- Subtle hover effects on table rows and buttons to provide visual feedback.

## Original User Request:
Create an app that has a purpose of uploading the excel file, and display the excel in table with dynamically created columns according to excel file columns. There must be 1 search input that searches and filters the table. Each row of the table must print action with icon. After clicking the icon/button it will pop up modal to show to select which fields to be printed and after it will open print popup to print the row. The purpose of printing is for the billing purposes, each row will contain person name and other billing info. Use tailwind for for styling, the app has 1 home page. Use Next.js framework.
  