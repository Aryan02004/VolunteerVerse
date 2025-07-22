import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Check if volunteer_users table exists
    const { data: tableData, error: tableError } = await supabase
      .from('volunteer_users')
      .select('*')
      .limit(1);
    
    if (tableError) {
      return NextResponse.json({ error: tableError.message, details: 'Could not access volunteer_users table' }, { status: 500 });
    }

    // Get the column structure of the volunteer_users table
    const { data: columnData, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'volunteer_users' });
    
    // If RPC function doesn't exist, try with direct SQL via Edge Functions or return table data
    if (columnError) {
      return NextResponse.json({ 
        message: 'Table exists but could not get column details',
        tableData: tableData,
        error: columnError.message
      });
    }

    return NextResponse.json({ 
      message: 'Table structure retrieved successfully',
      columns: columnData,
      sampleData: tableData
    });
  } catch (error) {
    console.error('Error in debug-tables route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}