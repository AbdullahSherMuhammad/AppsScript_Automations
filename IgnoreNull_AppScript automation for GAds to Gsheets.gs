function main() {
  // Spreadsheet URL - Update with your own Google Sheet URL
  var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1SfY2Ry9hd7WJMm4r7qv3s1eIE-cjpXPNg6Z_Df7LZyg/edit?gid=186843512#gid=186843512';
 
  try {
    // Open the Google Sheet
    var sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getActiveSheet();
    Logger.log('Sheet opened successfully');
 
    // Clear previous data in the sheet
    sheet.clear();
    Logger.log('Sheet cleared successfully');
    
    // Set header row in the Google Sheet
    sheet.appendRow([
      'Campaign Name',
      'Impressions',
      'Clicks',
      'Cost (USD)',
      'Conversions',
      'CTR (%)'
    ]);
    Logger.log('Headers appended successfully');
    
    // Get yesterday's date and the date 30 days prior
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    var startDate = new Date(today);
    startDate.setDate(today.getDate() - 31);  // Yesterday + 30 days back
    
    // Use AdsApp's time zone
    var timeZone = AdsApp.currentAccount().getTimeZone();
    
    // Format the dates in YYYYMMDD format
    var formattedStartDate = Utilities.formatDate(startDate, timeZone, 'yyyyMMdd');
    var formattedEndDate = Utilities.formatDate(yesterday, timeZone, 'yyyyMMdd');
    Logger.log('Date range formatted successfully: ' + formattedStartDate + ' to ' + formattedEndDate);
    
    // Create a report query to fetch campaign performance data for the custom date range
    var report = AdsApp.report(
      "SELECT CampaignName, Impressions, Clicks, Cost, Conversions, Ctr " +
      "FROM CAMPAIGN_PERFORMANCE_REPORT " +
      "DURING " + formattedStartDate + "," + formattedEndDate
    );
    Logger.log('Report generated successfully');
    
    // Parse the report and log results to the spreadsheet
    var rows = report.rows();
    var rowCount = 0;
    while (rows.hasNext()) {
      var row = rows.next();
      
      // Check for null or undefined values and assign default values if necessary
      var campaignName = row['CampaignName'] || 'N/A';
      var impressions = row['Impressions'] || 0;
      var clicks = row['Clicks'] || 0;
      var cost = (row['Cost'] !== undefined && row['Cost'] !== null) ? row['Cost'] / 1000000 : 0;  // Cost in USD
      var conversions = row['Conversions'] || 0;
      var ctr = row['Ctr'] || 0;
      
      // Validation: Skip if Impressions, Clicks, Cost, and Conversions are all zero
      if (impressions == 0 && clicks == 0 && cost == 0 && conversions == 0) {
        Logger.log('Skipping campaign "' + campaignName + '" with all zero values.');
        continue;
      }
      
      // Append each row of data to the Google Sheet
      sheet.appendRow([
        campaignName,
        impressions,
        clicks,
        cost,
        conversions,
        ctr
      ]);
      rowCount++;
    }
    Logger.log(rowCount + ' rows appended to the sheet.');
  } catch (error) {
    Logger.log('Error: ' + error.message);
  }
  
  Logger.log('Data export complete.');
}
