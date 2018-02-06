// Initialize Firebase
  var config = {
      apiKey: "AIzaSyAtccnFIxn8-nlBgDe4kJLC_3f9deU1s_4",
      authDomain: "train-scheduler-122f0.firebaseapp.com",
      databaseURL: "https://train-scheduler-122f0.firebaseio.com",
      projectId: "train-scheduler-122f0",
      storageBucket: "train-scheduler-122f0.appspot.com",
      messagingSenderId: "66819977638"
  };

  firebase.initializeApp(config);

  // Create a variable for the firebase database
  var dataRef = firebase.database();

  // Capture the Submit button click to get user-input values and assign them to variables
  $("#submit-button").on("click", function(event) {
      event.preventDefault();

      var trainName = $("#name-input").val().trim();
      var destination = $("#destination-input").val().trim();
      var frequency = $("#frequency-input").val().trim();
      var firstTrainTime = $("#first-input").val().trim();

      // Push user input values to the firebase database
      dataRef.ref().push({
          trainName: trainName,
          destination: destination,
          frequency: frequency,
          firstTrainTime: firstTrainTime
      });

      // Reset the form after user input
      document.getElementById("form-input").reset();

  });

  // Retrieve user input values from the database and assign them to variables
  dataRef.ref().on("child_added", function(childSnapshot) {
      
      var trainNameVal = childSnapshot.val().trainName;
      var destinationVal = childSnapshot.val().destination;
      var frequencyVal = childSnapshot.val().frequency;
      var fristTrainTimeVal = childSnapshot.val().firstTrainTime;

      // Format the fields for first train time and frequency. These fields and the current time are used to calculate the minutes away and next arrival
      var now = moment().valueOf();
      var firstTrainTimeForatted = moment(fristTrainTimeVal).valueOf();
      var frequencyFormatted =  frequencyVal * 60000;
      var minutesAway;
      var nextArrival;

      // Calculate the minutes away variable and the next arrival variable when the first train time is earlier than the current time.
      if (firstTrainTimeForatted <= now) {
          minutesAway = parseInt((frequencyFormatted - ((now - firstTrainTimeForatted) % frequencyFormatted)) / 60000);
          nextArrival = moment(now + (minutesAway * 60000) + 60000).format('h:mm A');
      // Calculate the minutes away variable and the next arrival variable when the first train time is later than the current time.
      } else {
          minutesAway = parseInt((firstTrainTimeForatted - now) / 60000);
          nextArrival = moment(firstTrainTimeForatted).format('h:mm A');
      }
      // Convert the frequency from milliseconds to minutes for display
      frequencyFormatted /= 60000

      // Insert appropriate data into the html page
       $("#schedule-body").append("<tr id='schedule-line'><td id='train-name'> " + trainNameVal + "</td><td id='destination'> " + destinationVal + "</td><td id='frequency'> " + frequencyFormatted + "</td><td id='next-arrival'> " + nextArrival + "</td><td id='minutes-away'> " +minutesAway + "</td></tr>");
  });








