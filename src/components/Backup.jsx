import { saveAs } from 'file-saver'; // Install this library: npm install file-saver
import supabase from '../config/SupabaseClient';
import { ToastContainer, toast } from 'react-toastify';
// const Backup = async (tableName) => {
//   try {
//     const allData = [];
//     const pageSize = 1000; // Supabase's limit for rows per fetch
//     let from = 0; // Start index
//     let to = pageSize - 1; // End index
//     let hasMore = true;

//     while (hasMore) {
//       const { data, error } = await supabase
//         .from(tableName)
//         .select('*')
//         .range(from, to); // Fetch records in the range [from, to]

//       if (error) {
//         console.error(`Error fetching data from ${tableName}:`, error);
//         return;
//       }

//       if (data.length > 0) {
//         allData.push(...data); // Append fetched data to allData array
//         from += pageSize; // Move to the next batch
//         to += pageSize;
//       } else {
//         hasMore = false; // Stop if no more data is returned
//       }
//     }

//     if (allData.length === 0) {
//       console.log(`No data found in table ${tableName}.`);
//       return;
//     }

//     // Convert allData to CSV format
//     const csvContent =
//       'data:text/csv;charset=utf-8,' +
//       Object.keys(allData[0]).join(',') + '\n' + // Headers
//       allData.map((row) => Object.values(row).join(',')).join('\n'); // Data rows

//     // Trigger file download
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', `${tableName}_backup.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     console.log(`${tableName} backed up successfully.`);
//   } catch (err) {
//     console.error("Unexpected error in backup:", err);
//   }
// };


const Backup = async (tableName) => {
  try {
    // Send request to backend to initiate backup
    const response = await fetch('http://localhost:5000/api/backup', { // Use the backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tableName }), // Send the table name to the backend
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get detailed error from backend
      throw new Error(`Failed to initiate backup: ${errorText}`);
    }

    // Trigger the file download when the backend responds
    const fileName = `${tableName}_backup.csv`; // The filename the backend suggests
    const blob = await response.blob(); // Get the response as a blob (binary data)
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); // Create an object URL for the blob
    link.download = fileName; // Suggested filename for download
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link);

    toast.success(`${tableName} backed up successfully.`);
  } catch (error) {
    console.error("Error initiating backup:", error);
    toast.error("Failed to initiate backup.");
  }
};


// Call the function with the table name
export default Backup;
