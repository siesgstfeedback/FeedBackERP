import { saveAs } from 'file-saver'; // Install this library: npm install file-saver
import supabase from '../config/SupabaseClient';
const Backup = async (tableName) => {
  try {
    const allData = [];
    const pageSize = 1000; // Supabase's limit for rows per fetch
    let from = 0; // Start index
    let to = pageSize - 1; // End index
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .range(from, to); // Fetch records in the range [from, to]

      if (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        return;
      }

      if (data.length > 0) {
        allData.push(...data); // Append fetched data to allData array
        from += pageSize; // Move to the next batch
        to += pageSize;
      } else {
        hasMore = false; // Stop if no more data is returned
      }
    }

    if (allData.length === 0) {
      console.log(`No data found in table ${tableName}.`);
      return;
    }

    // Convert allData to CSV format
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      Object.keys(allData[0]).join(',') + '\n' + // Headers
      allData.map((row) => Object.values(row).join(',')).join('\n'); // Data rows

    // Trigger file download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tableName}_backup.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`${tableName} backed up successfully.`);
  } catch (err) {
    console.error("Unexpected error in backup:", err);
  }
};

// Call the function with the table name
export default Backup;
