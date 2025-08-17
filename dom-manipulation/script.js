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
