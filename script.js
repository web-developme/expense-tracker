// script.js 

// Get form, expense list, and total amount elements 
const expenseForm = document.getElementById("expense-form"); 
const expenseList = document.getElementById("expense-list"); 
const totalAmountElement = document.getElementById("total-amount"); 
const expenseChartElement = document.getElementById("expense-chart");

// Initialize expenses array from localStorage 
let expenses = JSON.parse(localStorage.getItem("expenses")) || []; 

// Function to render expenses in tabular form 
function renderExpenses() { 
    // Clear expense list 
    expenseList.innerHTML = ""; 
    // Initialize total amount 
    let totalAmount = 0; 
    // Loop through expenses array and create table rows 
    for (let i = 0; i < expenses.length; i++) { 
        const expense = expenses[i]; 
        const expenseRow = document.createElement("tr"); 
        expenseRow.innerHTML = ` 
            <td>${expense.name}</td> 
            <td>₹${expense.amount}</td> 
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.paymentMethod}</td>
            <td class="delete-btn" data-id="${i}">Delete</td> 
        `; 
        expenseList.appendChild(expenseRow); 
        // Update total amount 
        totalAmount += expense.amount; 
    } 
    // Update total amount display 
    totalAmountElement.textContent = totalAmount.toFixed(2); 
    // Save expenses to localStorage 
    localStorage.setItem("expenses", JSON.stringify(expenses)); 
    // Render chart 
    renderChart(); 
}

// Function to add expense 
function addExpense(event) { 
    event.preventDefault(); 
    // Get expense name and amount from form 
    const expenseNameInput = document.getElementById("expense-name"); 
    const expenseAmountInput = document.getElementById("expense-amount"); 
    const expenseDateInput = document.getElementById("expense-date"); 
    const expenseCategoryInput = document.getElementById("expense-category"); 
    const paymentMethodInput = document.getElementById("payment-method");
    const expenseName = expenseNameInput.value; 
    const expenseAmount = parseFloat(expenseAmountInput.value); 
    const expenseDate = expenseDateInput.value;
    const expenseCategory = expenseCategoryInput.value;
    const paymentMethod = paymentMethodInput.value;
    // Clear form inputs 
    expenseNameInput.value = ""; 
    expenseAmountInput.value = ""; 
    expenseDateInput.value = "";
    expenseCategoryInput.value = "";
    paymentMethodInput.value = "";
    // Validate inputs 
    if (expenseName === "" || isNaN(expenseAmount) || expenseDate === "" || expenseCategory === "" || paymentMethod === "") { 
        alert("Please enter valid expense details."); 
        return; 
    } 
    // Create new expense object 
    const expense = { 
        name: expenseName, 
        amount: expenseAmount, 
        date: expenseDate,
        category: expenseCategory,
        paymentMethod: paymentMethod
    }; 
    // Add expense to expenses array 
    expenses.push(expense); 
    // Render expenses 
    renderExpenses(); 
}

// Function to delete expense 
function deleteExpense(event) { 
    if (event.target.classList.contains("delete-btn")) { 
        // Get expense index from data-id attribute 
        const expenseIndex = parseInt(event.target.getAttribute("data-id")); 
        // Remove expense from expenses array 
        expenses.splice(expenseIndex, 1); 
        // Render expenses 
        renderExpenses(); 
    } 
}

// Function to render chart 
function renderChart() {
    const ctx = expenseChartElement.getContext("2d");
    const expenseNames = expenses.map(expense => expense.name);
    const expenseAmounts = expenses.map(expense => expense.amount);

    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: expenseNames,
            datasets: [{
                label: 'Expenses',
                data: expenseAmounts,
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Add event listeners 
expenseForm.addEventListener("submit", addExpense); 
expenseList.addEventListener("click", deleteExpense); 
// Render initial expenses on page load 
renderExpenses();