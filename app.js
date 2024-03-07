// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(err) {
      console.log('Service Worker registration failed:', err);
    });
}

// Fetch stock data when the form is submitted
document.getElementById('stock-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var ticker = document.getElementById('ticker').value;
  var interval = document.getElementById('interval').value;
  var startDate = document.getElementById('start-date').value;
  var endDate = document.getElementById('end-date').value;

  fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + ticker + '&interval=' + interval + '&apikey=MD0ACNJ6QY9SQTZ0')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // TODO: Display the data with pagination
    });
});
