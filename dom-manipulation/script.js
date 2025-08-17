// Load quotes from localStorage if available, otherwise use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Wisdom" }
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available. Please add one!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear display before adding
  quoteDisplay.innerHTML = "";

  // Create elements dynamically
  const quoteText = document.createElement("p");
  quoteText.classList.add("quote");
  quoteText.textContent = `"${randomQuote.text}"`;

  const categoryText = document.createElement("p");
  categoryText.classList.add("category");
  categoryText.textContent = `Category: ${randomQuote.category}`;

  // Append to display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(categoryText);
}

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote object to array
  quotes.push({ text, category });

  // Save to localStorage
  saveQuotes();

  // Clear input fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("New quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Show a quote on initial load
showRandomQuote();

// Function to export quotes as a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2); // Pretty print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary download link
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Add event listener
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

// Function to import quotes from a JSON file
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("Please select a file to import.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    } catch (error) {
      alert("Error reading file: " + error.message);
    }
  };
  reader.readAsText(file);
}
document.getElementById("importQuotes").addEventListener("change", importQuotes);

// Function to clear all quotes
function clearQuotes() {
  if (confirm("Are you sure you want to clear all quotes? This action cannot be undone.")) {
    quotes = [];
    saveQuotes();
    showRandomQuote();
    alert("All quotes cleared successfully!");
  }
}
document.getElementById("clearQuotes").addEventListener("click", clearQuotes);


// Function to populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // reset first

  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes(); // apply saved filter
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  // Save filter to localStorage
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  // If no quotes match, show message
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found in category "${selectedCategory}".</p>`;
    return;
  }

  // Pick random from filtered list
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  // Update DOM
  quoteDisplay.innerHTML = "";
  const quoteText = document.createElement("p");
  quoteText.classList.add("quote");
  quoteText.textContent = `"${randomQuote.text}"`;

  const categoryText = document.createElement("p");
  categoryText.classList.add("category");
  categoryText.textContent = `Category: ${randomQuote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(categoryText);
}

// Modify addQuote to refresh categories dynamically
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote
  quotes.push({ text, category });
  saveQuotes(); // save updated array

  // Refresh category dropdown
  populateCategories();

  // Clear inputs
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("New quote added successfully!");
}

// Initialize app
populateCategories();
showRandomQuote();

// Re-filter when dropdown changes
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API

// Fetch quotes from server (simulation)
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Simulate server returning quotes (just use first few posts as fake quotes)
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// Push new quotes to server (simulation)
async function syncQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const result = await response.json();
    console.log("Quote synced to server:", result);
  } catch (error) {
    console.error("Error syncing quote to server:", error);
  }
}

// Function to load quotes from server and merge with localStorage
async function loadServerQuotes() {
  const serverQuotes = await fetchServerQuotes();
  if (serverQuotes.length > 0) {
    quotes = [...quotes, ...serverQuotes];
    saveQuotes();
    populateCategories(); // refresh categories
    showRandomQuote(); // show a quote from the updated list
    alert("Server quotes loaded successfully!");
  } else {
    alert("No quotes available from server.");
  }
}
document.getElementById("loadServerQuotes").addEventListener("click", loadServerQuotes);

// Sync local quotes with server periodically
async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();

  if (serverQuotes.length > 0) {
    // Conflict resolution: server data takes precedence
    quotes = [...serverQuotes, ...quotes];
    saveQuotes();

    // Notify user about sync
    notifyUser("Quotes synced with server. Server data takes precedence.");
    populateCategories();
  }
}

// Run sync every 30 seconds
setInterval(syncWithServer, 30000);

// Show notifications in the UI
function notifyUser(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;

  // Auto-clear after 5 seconds
  setTimeout(() => {
    notification.textContent = "";
  }, 5000);
}
