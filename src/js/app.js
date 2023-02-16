import Chart from "chart.js/auto";

const virgules = 1;

let initialBalance = 0;
let balance = 0;
let totalTrades = 0;
let wins = 0;
let losses = 0;
let breakeven = 0;
let winrate = 0;
let pnlPercent = 0;
let pnlDollars = 0;
let lastMaxDrawdown = 0;

let largestProfit = [];
let lastLargestProfit = 0;

let largestLoss = [];
let lastLargestLoss = 0;

let maxConsecWin = [];
let lastMaxConsecWin = 0;

let maxConsecLoss = [];
let lastMaxConsecLoss = 0;

let averageWin = [];
let lastAverageWin = 0;

let averageLoss = [];
let lastAverageLoss = 0;

let dataset = [];

function updateLastValues() {
  lastLargestProfit = largestProfit[largestProfit.length - 1] || 0;
  lastLargestLoss = largestLoss[largestLoss.length - 1] || 0;
  lastMaxConsecWin = maxConsecWin[maxConsecWin.length - 1] || 0;
  lastMaxConsecLoss = maxConsecLoss[maxConsecLoss.length - 1] || 0;
  lastAverageWin = averageWin[averageWin.length - 1] || 0;
  lastAverageLoss = averageLoss[averageLoss.length - 1] || 0;
}

function calculateAllData(data) {
  getWinrate();
  getPnlPercent();
  getPnlDollars();
  maxDrawdownPercent();
  getLargestProfits(data);
  getLargestLosses(data);
  getMaxConsecWins(data);
  getMaxConsecLoses(data);
  getAverageWins(data);
  getAverageLosses(data);
}

function getWinrate() {
  let newWinrate = ((wins / (totalTrades == 0 ? 1 : totalTrades)) * 100).toFixed(2);

  winrate = newWinrate;
}

function getPnlPercent() {
  let newPnlPercent = (((balance - initialBalance) / (initialBalance == 0 ? 1 : initialBalance)) * 100).toFixed(2);

  pnlPercent = newPnlPercent;
}

function getPnlDollars() {
  let newPnlDollars = (balance - initialBalance).toFixed(2);

  pnlDollars = newPnlDollars;
}

function getMaxDrawdown() {
  let maxDrawdown = 0;

  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i].profit === null) {
      continue;
    }

    if (dataset[i].loss === false) {
      continue;
    }

    if (dataset[i].balance > initialBalance) {
      continue;
    }

    let maxLost = initialBalance - dataset[i].balance;

    if (maxLost > maxDrawdown) {
      maxDrawdown = maxLost;
    }
  }

  return maxDrawdown;
}

function maxDrawdownPercent() {
  let newMaxDrawdown = getMaxDrawdown();

  lastMaxDrawdown = (newMaxDrawdown / (initialBalance == 0 ? 1 : initialBalance)) * 100;
}

function getLargestProfits(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].profit === null || data[i].loss === true || data[i].loss === null) {
      continue;
    }

    if (data[i].profit > lastLargestProfit) {
      largestProfit.push(data[i].profit);
    }
  }
}

function getLargestLosses(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].profit === null || data[i].loss === false || data[i].loss === null) {
      continue;
    }

    if (data[i].profit > lastLargestLoss) {
      largestLoss.push(data[i].profit);
    }
  }
}

function getMaxConsecWins(data) {
  let temp = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].loss === null) {
      continue;
    }

    if (data[i].loss === false) {
      temp += 1;

      if (temp > lastMaxConsecWin) {
        maxConsecWin.push(temp);
      }
    } else {
      temp = 0;
    }
  }
}

function getMaxConsecLoses(data) {
  let temp = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].loss === null) {
      continue;
    }

    if (data[i].loss === true) {
      temp += 1;

      if (temp > lastMaxConsecLoss) {
        maxConsecLoss.push(temp);
      }
    } else {
      temp = 0;
    }
  }
}

function getAverageWins(data) {
  let temp = 0;
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].loss === null) {
      continue;
    } else if (data[i].profit === null) {
      continue;
    }

    if (data[i].loss === false) {
      temp += data[i].profit;
      count += 1;
    }
  }

  if (isNaN(temp)) {
    averageWin.push(0);
  } else {
    averageWin.push(temp / count);
  }
}

function getAverageLosses(data) {
  let temp = 0;
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].loss === null) {
      continue;
    } else if (data[i].profit === null) {
      continue;
    }

    if (data[i].loss === true) {
      temp += data[i].profit;
      count += 1;
    }
  }

  if (isNaN(temp)) {
    averageLoss.push(0);
  } else {
    averageLoss.push(temp / count);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadSchema(dataset);
  loadData();
});

function loadData() {
  calculateAllData(dataset);
  updateLastValues(dataset);

  document.getElementById("winrate").innerHTML = `${winrate}%`;
  document.getElementById("pnlPercent").innerHTML = `${pnlPercent}%`;
  document.getElementById("pnlDollars").innerHTML = `$${pnlDollars}`;
  document.getElementById("winLoss").innerHTML = `${wins}W / ${losses}L`;
  document.getElementById("totalTrades").innerHTML = `${totalTrades}`;
  document.getElementById("breakeven").innerHTML = `${breakeven}`;

  document.getElementById("profitTrade").innerHTML = `${lastLargestProfit.toFixed(virgules)}%`;
  document.getElementById("lossTrade").innerHTML = `${lastLargestLoss.toFixed(virgules)}%`;

  document.getElementById("consecWins").innerHTML = `${lastMaxConsecWin.toFixed(virgules)}`;
  document.getElementById("consecLoss").innerHTML = `${lastMaxConsecLoss.toFixed(virgules)}`;

  document.getElementById("averageWin").innerHTML = `${lastAverageWin.toFixed(virgules)}%`;
  document.getElementById("averageLoss").innerHTML = `${lastAverageLoss.toFixed(virgules)}%`;

  document.getElementById("maxDrawdown").innerHTML = `${lastMaxDrawdown.toFixed(virgules)}%`;

  if (pnlPercent > 0) {
    document.getElementById("pnlPercent").style.color = "#10b981";
  } else {
    document.getElementById("pnlPercent").style.color = "#ef4444";
  }

  if (wins > losses) {
    document.getElementById("totalTrades").style.color = "#10b981";
  } else {
    document.getElementById("totalTrades").style.color = "#ef4444";
  }

  document.getElementById("profitTrade").style.color = "#10b981";
  document.getElementById("lossTrade").style.color = "#ef4444";

  document.getElementById("consecWins").style.color = "#10b981";
  document.getElementById("consecLoss").style.color = "#ef4444";

  document.getElementById("averageWin").style.color = "#10b981";
  document.getElementById("averageLoss").style.color = "#ef4444";

  document.getElementById("rewardRisk").style.color = "#10b981";
  document.getElementById("maxDrawdown").style.color = "#ef4444";
}

function updateSchema(newData) {
  let ctx = document.getElementById("schema").getContext("2d");

  let newSchema = Chart.getChart(ctx);

  newSchema.data.labels.push(newData.totalTrades);
  newSchema.data.datasets.forEach((dataset) => {
    dataset.data.push(newData.balance);
  });
  newSchema.update();
}

window.initialBalanceButton = function initialBalanceButton() {
  balance = Number(document.getElementById("buttonInitial").value);

  totalTrades = 0;
  wins = 0;
  losses = 0;
  breakeven = 0;
  winrate = 0;
  pnlPercent = 0;
  pnlDollars = 0;

  largestProfit = [];
  largestLoss = [];
  maxConsecWin = [];
  maxConsecLoss = [];
  averageLoss = [];
  averageWin = [];

  lastAverageWin = 0;
  lastAverageLoss = 0;
  lastMaxConsecLoss = 0;
  lastMaxConsecWin = 0;
  lastLargestLoss = 0;
  lastLargestProfit = 0;

  let newData = { totalTrades: totalTrades, balance: balance, profit: null, loss: null, breakeven: null };

  dataset = [];
  dataset.push(newData);

  initialBalance = balance;

  calculateAllData(dataset);
  updateLastValues(dataset);

  loadData();
  updateSchema(newData);
};

window.addProfitButton = function addProfitButton() {
  let data = Number(document.getElementById("buttonAddProfit").value);

  if (balance === 0) return;

  let isBreakeven = false;

  if (data === 0) {
    isBreakeven = true;
    breakeven += 1;
    totalTrades += 1;
    wins += 1;
  } else {
    balance += balance * (data / 100);
    wins += 1;
    totalTrades += 1;
  }

  let newData = { totalTrades: totalTrades, balance: balance, profit: data, loss: false, breakeven: isBreakeven };

  dataset.push(newData);

  calculateAllData(dataset);
  updateLastValues(dataset);

  loadData();
  updateSchema(newData);
};

window.addLossButton = function addLossButton() {
  let data = Number(document.getElementById("buttonAddLoss").value);

  if (balance === 0) return;

  let isBreakeven = false;

  if (data == 0) {
    isBreakeven = true;
    breakeven += 1;
    totalTrades += 1;
    losses += 1;
  } else {
    balance -= balance * (data / 100);
    losses += 1;
    totalTrades += 1;
  }

  let newData = { totalTrades: totalTrades, balance: balance, profit: data, loss: true, breakeven: isBreakeven };

  dataset.push(newData);

  calculateAllData(dataset);
  updateLastValues(dataset);

  loadData();
  updateSchema(newData);
};

window.undoButton = function undoButton() {
  let ctx = document.getElementById("schema").getContext("2d");

  let newSchema = Chart.getChart(ctx);

  newSchema.data.labels.pop();
  newSchema.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  newSchema.update();

  if (dataset.length > 0) {
    if (totalTrades > 0) {
      totalTrades -= 1;

      let lastData = dataset[dataset.length - 1];

      if (lastData.loss) {
        losses -= 1;
      } else {
        wins -= 1;
      }

      if (dataset.length > 1) {
        balance = dataset[dataset.length - 2].balance;
      } else if (dataset.length > 0) {
        balance = dataset[dataset.length - 1].balance;
      } else {
        balance = 0;
      }

      largestProfit.pop();
      largestLoss.pop();
      maxConsecWin.pop();
      maxConsecLoss.pop();
      averageWin.pop();
      averageLoss.pop();

      dataset.pop();

      calculateAllData(dataset);
      updateLastValues(dataset);

      loadData();
    }
  }
};

function loadSchema(data) {
  let ctx = document.getElementById("schema").getContext("2d");

  let upGradient = ctx.createLinearGradient(0, 0, 0, 300);
  upGradient.addColorStop(0, "rgb(74, 190, 236)");
  upGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  let downGradient = ctx.createLinearGradient(0, 0, 0, 300);
  downGradient.addColorStop(0, "rgb(192,75,75)");
  downGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  const down = (ctx, value) => (initialBalance >= ctx.p1.parsed.y ? value : undefined);

  new Chart(ctx, {
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
      labels: data.map((row) => row.totalTrades),
      datasets: [
        {
          label: "Schema",
          data: data.map((row) => row.balance),
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
