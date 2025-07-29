 async function checkUserLocation() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      const country = data.country_name;
      const ip = data.ip;

      console.log("User IP:", ip);
      console.log("Country:", country);

      if (country !== "United States" && country !== "United Kingdom") {
        document.body.innerHTML = `
          <div style="text-align:center;padding:50px;font-family:sans-serif">
            <h1>Access Denied</h1>
            <p>Sorry, this website is only accessible from the United States or United Kingdom.</p>
            <p>Your country: ${country}</p>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      document.body.innerHTML = `
        <div style="text-align:center;padding:50px;font-family:sans-serif">
          <h1>Error</h1>
          <p>Could not verify your location. Please try again later.</p>
        </div>
      `;
    }
  }

  checkUserLocation();