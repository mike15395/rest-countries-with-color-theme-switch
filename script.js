const filterButton = document.querySelector(".filter-trigger");
const filterOptions = document.querySelector(".filter-options");
const countriesContainer = document.querySelector(".countries-grid");
const loader = document.getElementById("loader");
const searchInput = document.querySelector(".search-input");
const themeToggleButton = document.querySelector(".dark-mode-toggle");
const themeIcon = document.querySelector(".dark-mode-icon");
const [...regionOptions] = document.querySelector(".filter-options").children;
const searchIcon = document.querySelector(".search-icon");
const filterTrigger = document.querySelector(".filter-trigger");
const filterArrow = document.querySelector(".filter-arrow");
const container = document.querySelector(".countries-section");
const controlsSections = document.querySelector(".controls-section");
const header = document.querySelector("header");

let countriesData = [];
let currentTheme = "light";

//dark and light mode toggle
themeToggleButton.addEventListener("click", function () {
  const themeText = document.querySelector(".dark-mode-text");
  const backButton = document.querySelector(".back-button");
  const borderTags = document.querySelectorAll(".tag");
  const countryCard = document.querySelectorAll(".country-card");

  const isDark = themeIcon.src.includes("darkModeIcon");

  if (isDark) {
    themeIcon.src = themeIcon.src.replace("darkModeIcon", "LightModeIcon");
    themeText.textContent = "Light Mode";
    themeText.style.color = "white";
    searchIcon.style.filter = " invert(1)";
    filterArrow.style.filter = "invert(1)";
    currentTheme = "dark";
  } else {
    themeIcon.src = themeIcon.src.replace("LightModeIcon", "darkModeIcon");
    themeText.textContent = "Dark Mode";
    themeText.style.color = "black";
    searchIcon.style.filter = " invert(0)";
    filterArrow.style.filter = "invert(0)";
    currentTheme = "light";
  }

  const headerBar = document.querySelector(".header-bar");
  headerBar.classList.toggle("dark");
  searchInput.classList.toggle("dark");
  filterOptions.classList.toggle("dark");
  filterTrigger.classList.toggle("dark");
  countryCard.forEach((ele) => ele.classList.toggle("dark"));
  container.classList.toggle("dark");
  controlsSections.classList.toggle("dark");
  header.classList.toggle("dark");
  backButton.classList.toggle("dark");
  borderTags.forEach((ele) => ele.classList.toggle("dark"));
});

//filter out countries based on region
regionOptions.map((ele) =>
  ele.addEventListener("click", function () {
    const selectedRegion = ele.innerHTML.toLowerCase();
    const filteredCountries = countriesData.filter((ele) =>
      ele.region.toLowerCase().includes(selectedRegion)
    );
    renderCountriesData(filteredCountries);
    applyDarkModeToDynamicElements();
  })
);

//hide unhide regions list
filterButton.addEventListener("click", function () {
  filterOptions.classList.toggle("hide");
});

//filter out countries based on country name
searchInput.addEventListener("input", function () {
  const enteredInput = this.value.toLowerCase().trim();
  console.log(enteredInput, "enter input data");
  const filteredData = countriesData?.filter((item) =>
    item?.name?.toLowerCase().includes(enteredInput)
  );
  filteredData.length
    ? renderCountriesData(filteredData)
    : (countriesContainer.innerHTML = `<h2>Please Check Country Name and Try Again!</h2>`);
  applyDarkModeToDynamicElements(); // RE-APPLY DARK TO NEW ELEMENTS
});

// FUNCTION TO APPLY DARK MODE CSS TO DYNAMICALLY RENDERED ELEMENTS
function applyDarkModeToDynamicElements() {
  if (currentTheme === "dark") {
    document.querySelectorAll(".country-card").forEach((card) => {
      card.classList.add("dark");
    });
    document.querySelectorAll(".tag").forEach((tag) => {
      tag.classList.add("dark");
    });

    const backButton = document.querySelector(".back-button");
    if (backButton) backButton.classList.add("dark");
  }
}

//load country data intially
function fetchCountriesData() {
  loader.style.display = "block";

  fetch("./data.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP Error, ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      countriesData = data;
      console.log("countries data", countriesData);
      renderCountriesData(data);
      loader.style.display = "none";
    });
}

//render all country data based on input data recieved
function renderCountriesData(inputData) {
  countriesContainer.innerHTML = "";

  inputData.forEach((item) => {
    const countryCard = document.createElement("a");
    countryCard.href = "#";
    countryCard.innerHTML = `
      <article class="country-card">
        <img src=${item?.flags?.png} alt="Country-Flag" class="country-flag">
        <div class="card-content">
          <h2 class="country-name">${item?.name}</h2>
          <p class="country-detail"><strong>Population:</strong> <span>${numberWithCommas(
            item?.population
          )}</span></p>
          <p class="country-detail"><strong>Region:</strong> <span>${
            item?.region
          }</span></p>
          <p class="country-detail"><strong>Capital:</strong> <span>${
            item?.capital
          }</span></p>
        </div>
      </article>
    `;

    countryCard.addEventListener("click", (e) => {
      e.preventDefault();

      // Pass data using history state
      onNavigate("/country-details", item);
    });

    countriesContainer.appendChild(countryCard);
  });
}

//add commas in hundred,thousand format
function numberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//display details on each country on click
function renderCountryDetail(country) {
  // Fallback if country not available
  if (!country) {
    return `<p>Country data not found.</p>`;
  }

  // Convert lists to comma separated string
  const languages =
    country.languages?.map((lang) => lang.name).join(", ") || "";
  const currencies =
    country.currencies?.map((cur) => cur.name).join(", ") || "";

  const borderCountries = country?.borders?.length
    ? country.borders.map((code) => `<span class="tag">${code}</span>`).join("")
    : `<span class="tag">None</span>`;

  return `
<section id="details">
  <main class="main-content">
    <div class="container">
      <a href="#" class="back-button" onClick="onNavigate('/'); ">
        <img src="./assets/backArrow.png" alt="back-arrow" class="back-arrow" onClick="onNaviagte('/'); return false">
        <span>Back</span>
      </a>

      <article class="country-details-grid">
        <div class="flag-container">
          <img src="${country?.flag}" alt="Flag of ${
    country?.name
  }" class="flag-image">
        </div>
        <div class="info-container">
          <h2 class="country-name">${country?.name}</h2>
          <div class="stats-columns">
            <div class="stats-column">
              <p><strong>Native Name:</strong>${country?.nativeName}</p>
              <p><strong>Population:</strong>${numberWithCommas(
                country?.population
              )}</p>
              <p><strong>Region:</strong>${country?.region}</p>
              <p><strong>Sub Region:</strong>${country?.subregion}</p>
              <p><strong>Capital:</strong>${country?.capital}</p>
            </div>
            <div class="stats-column">
              <p><strong>Top Level Domain:</strong>${
                country?.topLevelDomain
              }</p>
              <p><strong>Currencies:</strong>${currencies}</p>
              <p><strong>Languages:</strong>${languages}</p>
            </div>
          </div>
          <div class="border-countries-container">
            <h3 class="border-title">Border Countries:</h3>
            <div class="border-tags">
              ${borderCountries}
            </div>
          </div>
        </div>
      </article>
    </div>
  </main>
</section>
  `;
}

fetchCountriesData();

//routing for displaying country details
const routes = {
  "/": () => {
    renderCountriesData(countriesData);
    applyDarkModeToDynamicElements();
  },
  "/country-details": (countryData) => {
    countriesContainer.innerHTML = renderCountryDetail(countryData);
    applyDarkModeToDynamicElements();
  },
};

const onNavigate = (pathname, state = {}) => {
  window.history.pushState(state, pathname, window.location.origin + pathname);

  countriesContainer.innerHTML = "";

  if (routes[pathname]) {
    routes[pathname](state);
  }
};

window.onpopstate = (event) => {
  const path = window.location.pathname;
  countriesContainer.innerHTML = "";

  if (routes[path]) {
    routes[path](event.state); // Use the stored country data
  }
};
