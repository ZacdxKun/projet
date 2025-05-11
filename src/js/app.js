"use strict";

/**
 * --------------------------------
 * 0. Disclaimer
 * --------------------------------
 */

const DISCLAIMER_TEXT = [
  `GitHub: https://github.com/Simon-Fontaine`,
  ``,
  `This is a free independent open source project, not affiliated with any financial institution.`,
  ``,
  `Disclaimer: This is not financial advice. May contain calculation errors. Use at your own risk.`,
].join("\n");

/**
 * --------------------------------
 * 1. Code variables
 * --------------------------------
 */

const decimalPlaces = 2;

let initialDeposit = 0;
let currentBalance = 0;

let totalProfit = 0;
let totalLoss = 0;

let currentProfit = 0;

let totalTrades = 0;

let totalWonTrades = 0;
let totalLostTrades = 0;
let totalBreakevenTrades = 0;

let totalWonAmount = 0;
let totalLostAmount = 0;

let totalWinPercent = 0;
let totalLossPercent = 0;

let winrate = 0;

let pnlPercent = 0;
let pnlDollars = 0;

let tradesDataset = [];

// --------------------------------

let averageWinPercent = 0;
let averageLossPercent = 0;

let maxConsecutiveWins = 0;
let maxConsecutiveLosses = 0;
let maxDrawdown = 0;

let largestWinPercent = 0;
let largestLossPercent = 0;

let moyenneWin = 0;
let moyenneLost = 0;

/**
 * --------------------------------
 * 2. Functions
 * --------------------------------
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log(DISCLAIMER_TEXT);
  
  // N'appelez pas createInitialChart() ici
  // mais seulement après avoir initialisé le dépôt
  
  displayAll();
  
  // Ajouter les event listeners
  document.querySelector(".buttonInitial").addEventListener("click", setInititalDeposit);
  document.querySelector(".buttonAddProfit").addEventListener("click", addProfitTrade);
  document.querySelector(".buttonAddLoss").addEventListener("click", addLossTrade);
  document.querySelector(".buttonUndo").addEventListener("click", undoLastTrade);
});

function displayHtmlElement(elementId, value) {
  document.getElementById(elementId).innerHTML = value;
}

function displayAll(undo) {
  calculateAllData();
  updateChart(undo);

  // Top table
  displayHtmlElement("winrate", `${winrate.toFixed(decimalPlaces)}%`);
  displayHtmlElement("pnlPercent", `${pnlPercent.toFixed(decimalPlaces)}%`);
  displayHtmlElement("pnlDollars", `$${pnlDollars.toFixed(decimalPlaces)}`);
  displayHtmlElement("totalTrades", totalTrades);
  displayHtmlElement("win/loss", `${totalWonTrades}W / ${totalLostTrades}L`);
  displayHtmlElement("breakeven", totalBreakevenTrades);

  // Bottom table
  displayHtmlElement("averageWinPercent", `${averageWinPercent.toFixed(decimalPlaces)}%`);
  displayHtmlElement("averageLossPercent", `${averageLossPercent.toFixed(decimalPlaces)}%`);
  displayHtmlElement("maxConsecutiveWins", `${maxConsecutiveWins}`);
  displayHtmlElement("maxConsecutiveLosses", `${maxConsecutiveLosses}`);
  displayHtmlElement("largestWinPercent", `${largestWinPercent.toFixed(decimalPlaces)}%`);
  displayHtmlElement("largestLossPercent", `${largestLossPercent.toFixed(decimalPlaces)}%`);
  displayHtmlElement("maxDrawdown", `${maxDrawdown.toFixed(decimalPlaces)}%`);
  displayHtmlElement("reward/risk", `${moyenneWin.toFixed(decimalPlaces)}:${moyenneLost.toFixed(decimalPlaces)}`);
  displayHtmlElement("AverageR/R", `${(moyenneWin / (moyenneLost === 0 ? 1 : moyenneLost)).toFixed(decimalPlaces)}`);

  colorDisplayElement();
}

function colorDisplayElement() {
  if (pnlPercent > 0) {
    document.getElementById("pnlPercent").style.color = "#10b981";
  } else {
    document.getElementById("pnlPercent").style.color = "#ef4444";
  }

  if (winrate >= 50) {
    document.getElementById("winrate").style.color = "#10b981";
  } else {
    document.getElementById("winrate").style.color = "#ef4444";
  }

  if (averageWinPercent > averageLossPercent) {
    document.getElementById("averageWinPercent").style.color = "#10b981";
    document.getElementById("averageLossPercent").style.color = "#10b981";
  } else {
    document.getElementById("averageWinPercent").style.color = "#ef4444";
    document.getElementById("averageLossPercent").style.color = "#ef4444";
  }

  if (maxConsecutiveWins > maxConsecutiveLosses) {
    document.getElementById("maxConsecutiveWins").style.color = "#10b981";
    document.getElementById("maxConsecutiveLosses").style.color = "#10b981";
  } else {
    document.getElementById("maxConsecutiveWins").style.color = "#ef4444";
    document.getElementById("maxConsecutiveLosses").style.color = "#ef4444";
  }

  if (largestWinPercent > largestLossPercent) {
    document.getElementById("largestWinPercent").style.color = "#10b981";
    document.getElementById("largestLossPercent").style.color = "#10b981";
  } else {
    document.getElementById("largestWinPercent").style.color = "#ef4444";
    document.getElementById("largestLossPercent").style.color = "#ef4444";
  }

  if (maxDrawdown > 20) {
    document.getElementById("maxDrawdown").style.color = "#ef4444";
  } else {
    document.getElementById("maxDrawdown").style.color = "#10b981";
  }

  if (moyenneWin > moyenneLost) {
    document.getElementById("reward/risk").style.color = "#10b981";
  } else {
    document.getElementById("reward/risk").style.color = "#ef4444";
  }

  if (moyenneWin / (moyenneLost === 0 ? 1 : moyenneLost) > 1) {
    document.getElementById("AverageR/R").style.color = "#10b981";
  } else {
    document.getElementById("AverageR/R").style.color = "#ef4444";
  }
}

function calculateAllData() {
  currentProfit = currentBalance - initialDeposit;
  totalProfit = totalWonAmount - totalLostAmount;

  winrate = (totalWonTrades / (totalTrades === 0 ? 1 : totalTrades)) * 100;

  pnlPercent = (currentProfit / (initialDeposit === 0 ? 1 : initialDeposit)) * 100;
  pnlDollars = currentProfit;

  averageWinPercent = getAverageWinPercent();
  averageLossPercent = getAverageLossPercent();

  maxConsecutiveWins = getMaxConsecutiveWins();
  maxConsecutiveLosses = getMaxConsecutiveLosses();

  largestWinPercent = getLargestWinPercent();
  largestLossPercent = getLargestLossPercent();

  maxDrawdown = getMaxDrawdown();

  getRiskRewardRatio();
}

function updateChart(undo) {
  let ctx = document.getElementById("chart").getContext("2d");
  let existingChart = Chart.getChart(ctx);

  if (!existingChart) {
    // Si le graphique n'existe pas encore, créez-le
    createInitialChart();
    return;
  }

  if (undo) {
    existingChart.data.labels.pop();
    existingChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    existingChart.update();
  } else {
    let newData = tradesDataset[tradesDataset.length - 1];

    if (!newData) return;

    existingChart.data.labels.push(newData.totalTrades);
    existingChart.data.datasets.forEach((dataset) => {
      dataset.data.push(newData.currentBalance);
    });
    existingChart.update();
  }
}

function getAverageWinPercent() {
  let temp = 0;
  let count = 0;

  tradesDataset.forEach((trade) => {
    if (trade.win && trade.win !== null) {
      count++;
      temp += trade.tradePercent;
    }
  });

  return temp / (count === 0 ? 1 : count);
}

function getAverageLossPercent() {
  let temp = 0;
  let count = 0;

  tradesDataset.forEach((trade) => {
    if (!trade.win && trade.win !== null) {
      count++;
      temp += trade.tradePercent;
    }
  });

  return temp / (count === 0 ? 1 : count);
}

function getMaxConsecutiveWins() {
  let max = 0;
  let temp = 0;

  tradesDataset.forEach((trade) => {
    if (trade.win && trade.win !== null) {
      temp++;
      if (temp > max) {
        max = temp;
      }
    } else {
      temp = 0;
    }
  });

  return max;
}

function getMaxConsecutiveLosses() {
  let max = 0;
  let temp = 0;

  tradesDataset.forEach((trade) => {
    if (!trade.win && trade.win !== null) {
      temp++;
      if (temp > max) {
        max = temp;
      }
    } else {
      temp = 0;
    }
  });

  return max;
}

function getLargestWinPercent() {
  let max = 0;

  tradesDataset.forEach((trade) => {
    if (trade.win && trade.tradePercent > max && trade.win !== null) {
      max = trade.tradePercent;
    }
  });

  return max;
}

function getLargestLossPercent() {
  let max = 0;

  tradesDataset.forEach((trade) => {
    if (!trade.win && trade.tradePercent > max && trade.win !== null) {
      max = trade.tradePercent;
    }
  });

  return max;
}

function getMaxDrawdown() {
  let highest = -Infinity;
  let lowest = Infinity;
  let temp = 0;

  tradesDataset.forEach((trade) => {
    if (trade.currentBalance > highest) {
      highest = trade.currentBalance;
    }
  });

  tradesDataset.forEach((trade) => {
    if (trade.currentBalance < lowest) {
      lowest = trade.currentBalance;
    }
  });

  if (highest === -Infinity || lowest === Infinity) return 0;
  if (lowest === initialDeposit) return 0;

  temp = highest - lowest;
  temp = temp / highest;
  temp = temp * 100;

  return temp;
}

function getRiskRewardRatio() {
  moyenneWin = totalWinPercent / (totalWonTrades === 0 ? 1 : totalWonTrades);
  moyenneLost = totalLossPercent / (totalLostTrades === 0 ? 1 : totalLostTrades);
}

/**
 * --------------------------------
 * 3. Main button functions
 * --------------------------------
 */

function setInititalDeposit() {
  if (tradesDataset.length > 0) {
    alert("Cannot change initial deposit after first trade !\n=> Refresh page to start over");
    return;
  }

  initialDeposit = Number(document.getElementById("initialDeposit").value);

  if (initialDeposit <= 0) {
    alert("Please enter a positive number");
    return;
  }

  currentBalance = initialDeposit;

  let newDataset = {
    totalTrades: totalTrades,
    tradePercent: null,
    tradeAmount: null,
    currentBalance: currentBalance,
    breakeven: null,
    win: null,
  };

  tradesDataset.push(newDataset);

  // Créer le graphique seulement après avoir défini le dépôt initial
  createInitialChart();
  displayAll();
}

function addProfitTrade() {
  if (tradesDataset.length === 0) {
    alert("Please set initial deposit first");
    return;
  }

  let tradePercent = Number(document.getElementById("buttonAddProfit").value);

  if (tradePercent < 0) {
    alert("Please enter a positive number");
    return;
  }

  let tradeAmount = currentBalance * (tradePercent / 100);

  currentBalance += tradeAmount;

  totalProfit += tradeAmount;
  totalWonAmount += tradeAmount;
  totalWinPercent += tradePercent;

  totalWonTrades++;
  totalTrades++;

  let breakeven = false;

  if (tradePercent === 0) {
    breakeven = true;
    totalBreakevenTrades++;
  }

  let newDataset = {
    totalTrades: totalTrades,
    tradePercent: tradePercent,
    tradeAmount: tradeAmount,
    currentBalance: currentBalance,
    breakeven: breakeven,
    win: true,
  };

  tradesDataset.push(newDataset);

  displayAll();
}

function addLossTrade() {
  if (tradesDataset.length === 0) {
    alert("Please set initial deposit first");
    return;
  }

  let tradePercent = Number(document.getElementById("buttonAddLoss").value);

  if (tradePercent < 0) {
    alert("Please enter a positive number");
    return;
  }

  let tradeAmount = currentBalance * (tradePercent / 100);

  currentBalance -= tradeAmount;

  totalLoss += tradeAmount;
  totalLostAmount += tradeAmount;
  totalLossPercent += tradePercent;

  totalLostTrades++;
  totalTrades++;

  let breakeven = false;

  if (tradePercent === 0) {
    breakeven = true;
    totalBreakevenTrades++;
  }

  let newDataset = {
    totalTrades: totalTrades,
    tradePercent: tradePercent,
    tradeAmount: tradeAmount,
    currentBalance: currentBalance,
    breakeven: breakeven,
    win: false,
  };

  tradesDataset.push(newDataset);

  displayAll();
}

function undoLastTrade() {
  if (tradesDataset.length > 0) {
    if (totalTrades > 0) {
      totalTrades--;

      let lastTrade = tradesDataset[tradesDataset.length - 1];

      if (lastTrade.win) {
        totalWonTrades--;
        totalProfit -= lastTrade.tradeAmount;
        totalWinPercent -= lastTrade.tradePercent;
      } else {
        totalLostTrades--;
        totalLoss -= lastTrade.tradeAmount;
        totalLossPercent -= lastTrade.tradePercent;
      }

      if (lastTrade.breakeven) {
        totalBreakevenTrades--;
      }

      if (tradesDataset.length > 1) {
        currentBalance = tradesDataset[tradesDataset.length - 2].currentBalance;
      } else if (tradesDataset.length === 1) {
        currentBalance = tradesDataset[tradesDataset.length - 1].currentBalance;
      } else {
        currentBalance = 0;
      }
    }

    tradesDataset.pop();
    displayAll(true);
  }
}

/**
 * --------------------------------
 * 4. Draw chart
 * --------------------------------
 */

function createInitialChart() {
  let ctx = document.getElementById("chart").getContext("2d");
  
  // Vérifier si un graphique existe déjà et le détruire si c'est le cas
  let existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  let upGradient = ctx.createLinearGradient(0, 0, 0, 300);
  upGradient.addColorStop(0, "rgb(74, 190, 236)");
  upGradient.addColorStop(1, "rgba(74, 190, 236, 0.01)");

  let downGradient = ctx.createLinearGradient(0, 0, 0, 300);
  downGradient.addColorStop(0, "rgb(192,75,75)");
  downGradient.addColorStop(1, "rgba(192,75,75, 0.01)");

  const down = (ctx, value) => (initialDeposit >= ctx.p1.parsed.y ? value : undefined);

  return new Chart(ctx, {
    type: "line",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {},
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
    data: {
      labels: tradesDataset.map((row) => row.totalTrades),
      datasets: [
        {
          label: "chart",
          data: tradesDataset.map((row) => row.currentBalance),
          tension: 0.2,
          borderColor: "rgb(74, 190, 236)",
          segment: {
            borderColor: (ctx) => down(ctx, "rgb(192,75,75)"),
            backgroundColor: (ctx) => down(ctx, downGradient),
          },
          backgroundColor: upGradient,
          fill: true,
        },
      ],
    },
  });
}
