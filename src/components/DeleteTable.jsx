export const DeleteTable = async (tableName) => {
  try {
    const response = await fetch("http://localhost:5000/delete-table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableName }),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      return true; // Deletion succeeded
    } else {
      console.error(`Error deleting from ${tableName}:`, result.error);
      return false; // Deletion failed
    }
  } catch (err) {
    console.error("Network error during deletion:", err);
    return false; // Network or other error
  }
};

export default DeleteTable;