import supabase from "../config/SupabaseClient";

export const DeleteTable = async (tableName) => {
  try {
    // If no condition is provided, delete all rows
    // const query = supabase.from(tableName).delete();
    
    // Apply condition if provided
    // if (Object.keys(condition).length > 0) {
    //   Object.entries(condition).forEach(([key, value]) => {
    //     query.eq(key, value);
    //   });
    // }

    const { data, error } = await supabase
    .from(tableName)
    .delete()
    .neq('id','0')
    ;

    if (error) {
      console.error(`Error deleting rows from ${tableName}:`, error);
      return false; // Return false on failure
    }

    
    return true; // Return true on success
  } catch (err) {
    console.error("Unexpected error during deletion:", err);
    return false; // Return false on failure
  }
};
export default DeleteTable;
