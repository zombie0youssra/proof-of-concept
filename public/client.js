// laat datum zien

// Functie om de tijd sinds het inklokken te berekenen
function calculateTimeSince(timestamp) {
  const currentTime = new Date();
  const clockInTime = new Date(timestamp);
  const timeDifference = currentTime.getTime() - clockInTime.getTime();

  // Bereken het aantal minuten
  const minutes = Math.floor(timeDifference / 1000 / 60);

  return `${minutes} minuten geleden`;
}
