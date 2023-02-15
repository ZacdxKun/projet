import Chart from "chart.js/auto";

let initialBalance = 0;
let balance = 0;
let totalTrades = 0;
let wins = 0;
let losses = 0;
let breakeven = 0;

let largestProfit = 0;
let largestLoss = 0;

let maxConsecWin = 0;
let maxConsecLoss = 0;

let averageWin = 0;
let averageLoss = 0;

const dataset = [];

function winrate() {
  let winrate = ((wins / (totalTrades == 0 ? 1 : totalTrades)) * 100).toFixed(2);
  return winrate;
}

function pnlPercent() {
  let pnlPercent = (((balance - initialBalance) / (initialBalance == 0 ? 1 : initialBalance)) * 100).toFixed(2);
  return pnlPercent;
}

function largestProfits(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].profit == null) {
      continue;
    } else if (data[i].profit == null) {
      continue;
    }
    if (data[i].profit > largestProfit) {
      largestProfit = data[i].profit;
    }
  }
}

function largestLosses(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].loss == null) {
      continue;
    } else if (data[i].profit == null) {
      continue;
    }
    if (data[i].profit > largestLoss) {
      largestLoss = data[i].profit;
    }
  }
}

function maxConsecWins(data) {
  let temp = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].loss == null) {
      continue;
    }
    if (data[i].loss == false) {
      temp += 1;
      if (temp > maxConsecWin) {
        maxConsecWin = temp;
      }
    } else {
      temp = 0;
    }
  }
}

function maxConsecLoses(data) {
  let temp = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].loss == null) {
      continue;
    }
    if (data[i].loss == true) {
      temp += 1;
      if (temp > maxConsecLoss) {
        maxConsecLoss = temp;
      }
    } else {
      temp = 0;
    }
  }
}

function averageWins(data) {
  let temp = 0;
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].loss == null) {
      continue;
    } else if (data[i].profit == null) {
      continue;
    }
    if (data[i].loss == false) {
      temp += data[i].profit;
      count += 1;
    }
  }
  let temp2 = Math.round(temp / count);
  if (isNaN(temp2)) {
    averageWin = 0;
  } else {
    averageWin = temp2;
  }
}

function averageLosses(data) {
  let temp = 0;
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].loss == null) {
      continue;
    } else if (data[i].profit == null) {
      continue;
    }
    if (data[i].loss == true) {
      temp += data[i].profit;
      count += 1;
    }
  }
  let temp2 = Math.round(temp / count);
  if (isNaN(temp2)) {
    averageLoss = 0;
  } else {
    averageLoss = temp2;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadSchema(dataset);
  loadData();
});

function loadData() {
  document.getElementById("winrate").innerHTML = `${winrate()}%`;
  document.getElementById("pnlPercent").innerHTML = `${pnlPercent()}%`;
  document.getElementById("pnlDollars").innerHTML = `$${(balance - initialBalance).toFixed(2)}`;
  document.getElementById("winLoss").innerHTML = `${wins}W / ${losses}L`;
  document.getElementById("totalTrades").innerHTML = `${totalTrades}`;
  document.getElementById("breakeven").innerHTML = `${breakeven}`;

  document.getElementById("profitTrade").innerHTML = `${largestProfit}%`;
  document.getElementById("lossTrade").innerHTML = `${largestLoss}%`;

  document.getElementById("consecWins").innerHTML = `${maxConsecWin}`;
  document.getElementById("consecLoss").innerHTML = `${maxConsecLoss}`;

  document.getElementById("averageWin").innerHTML = `${averageWin}%`;
  document.getElementById("averageLoss").innerHTML = `${averageLoss}%`;

  if (pnlPercent() > 0) {
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

  let newData = { totalTrades: totalTrades, balance: balance.toFixed(2), profit: null, loss: null };
  dataset.push(newData);

  initialBalance = balance;

  loadData();
  updateSchema(newData);
};

window.addProfitButton = function addProfitButton() {
  let data = Number(document.getElementById("buttonAddProfit").value);

  if (!balance) return;

  if (data == 0) {
    breakeven += 1;
    totalTrades += 1;
    wins += 1;
  } else {
    balance += Number(balance) * (data / 100);
    wins += 1;
    totalTrades += 1;
  }

  let newData = { totalTrades: totalTrades, balance: Number(balance).toFixed(2), profit: data, loss: false };
  dataset.push(newData);

  largestProfits(dataset);
  maxConsecWins(dataset);
  averageWins(dataset);

  loadData();
  updateSchema(newData);
};

window.addLossButton = function addLossButton() {
  let data = Number(document.getElementById("buttonAddLoss").value);

  if (!balance) return;

  if (data == 0) {
    breakeven += 1;
    totalTrades += 1;
    losses += 1;
  } else {
    balance -= Number(balance) * (data / 100);
    losses += 1;
    totalTrades += 1;
  }

  let newData = { totalTrades: totalTrades, balance: Number(balance).toFixed(2), profit: data, loss: true };
  dataset.push(newData);

  largestLosses(dataset);
  maxConsecLoses(dataset);
  averageLosses(dataset);

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

      dataset.pop();

      largestProfits(dataset);
      largestLosses(dataset);

      maxConsecLoses(dataset);
      maxConsecWins(dataset);

      averageLosses(dataset);
      averageWins(dataset);

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
      // animation: false,
      elements: {
        // point: {
        //   radius: 0,
        // },
      },
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
