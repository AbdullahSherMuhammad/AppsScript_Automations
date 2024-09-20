// Function to fetch Google Analytics data and populate Google Sheet
function fetchAnalyticsData() {
  // Google Analytics View ID
  const scriptProperties = PropertiesService.getScriptProperties();
  const viewId = scriptProperties.getProperty('ViewID');
  
  // Date range for the report (last 30 days)
  const startDate = '30daysAgo';
  const endDate = 'yesterday';

  // Request data from the Google Analytics API
  const response = Analytics.Data.Ga.get(
    'ga:' + viewId, // View ID
    startDate,      // Start Date
    endDate,        // End Date
    'ga:sessions,ga:users,ga:pageviews',  // Metrics
    {
      'dimensions': 'ga:date,ga:pagePath', // Dimensions (e.g., Date, Page Path)
      'sort': '-ga:date',                  // Sorting by date
      'max-results': 1000                  // Max results to fetch
    }
  );

  // Reference to the active spreadsheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Clear the sheet for fresh data
  sheet.clear();

  // Populate the header row in the Google Sheet
  sheet.appendRow(['Date', 'Page Path', 'Sessions', 'Users', 'Pageviews']);

  // Loop through the rows and populate data in the Google Sheet
  const rows = response.rows;
  if (rows && rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      sheet.appendRow([rows[i][0], rows[i][1], rows[i][2], rows[i][3], rows[i][4]]);
    }
  } else {
    Logger.log('No data found.');
  }

  Logger.log('Data fetched successfully!');
}
