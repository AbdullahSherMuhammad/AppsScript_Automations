function main() {
  // Spreadsheet URL - Update with your own Google Sheet URL
  var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit';
  
  // Open the Google Sheet
  var sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getActiveSheet();
  
  // Clear previous data in the sheet
  sheet.clear();
  
  // Set header row in the Google Sheet
  sheet.appendRow([
    'Campaign Name',
    'Impressions',
    'Clicks',
    'Cost',
    'Conversions',
    'CTR (%)'
  ]);
  
  // Create a report query to fetch campaign performance data
  var report = AdsApp.report(
    "SELECT CampaignName, Impressions, Clicks, Cost, Conversions, Ctr " +
    "FROM CAMPAIGN_PERFORMANCE_REPORT " +
    "DURING LAST_30_DAYS"
  );
  
  // Parse the report and log results to the spreadsheet
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    
    // Append each row of data to the Google Sheet
    sheet.appendRow([
      row['CampaignName'],
      row['Impressions'],
      row['Clicks'],
      row['Cost'] / 1000000,  // Google Ads reports cost in micros, divide by 1,000,000
      row['Conversions'],
      row['Ctr']
    ]);
  }
  
  Logger.log('Data has been successfully exported to the Google Sheet!');
}
