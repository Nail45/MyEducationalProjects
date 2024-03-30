import { accounting } from 'accounting';
import { Chart } from 'chart.js/auto';

export function createGraph(canvas, array, mon, flag = false) {
  let arrayID = array;
  array = array.payload.transactions;
  let profitMonth = [];
  let fromCashArray = [];
  let labels = [];
  const date = new Date();
  const ctx = canvas.getContext('2d');
  let numMonth = date.getMonth() + 1;
  const arrayMonthName = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  if (mon < 12 && numMonth <= 6) {
    numMonth = 12 + (numMonth - 6);
  }

  for (let i = 0; i < mon; i++) {
    let profit = 0;
    let toCash = 0;
    let fromCash = 0;
    if (numMonth === 12) {
      numMonth = 0;
    }

    labels.push(arrayMonthName[numMonth]);

    let result = null;
    if (flag) {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (numMonth + 1 === Number(item.date.substr(5, 2))) {
          if (arrayID.payload.account !== item.from) {
            toCash += item.amount;
          } else {
            fromCash += item.amount;
          }
        }
      }
      profitMonth.push(toCash);
      fromCashArray.push(fromCash);
      numMonth++;
      result = true;
    } else {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (numMonth + 1 === Number(item.date.substr(5, 2))) {
          if (arrayID.payload.account !== item.from) {
            profit += item.amount;
          } else {
            profit -= item.amount;
          }
        }
      }
      profitMonth.push(profit);
      numMonth++;
      result = true;
    }

    if (!result) {
      profitMonth.push(0);
      fromCashArray.push(0);
      numMonth++;
    }
  }

  if (!flag) {
    for (let i = 0; i < mon; i++) {
      profitMonth[i + 1] = profitMonth[i] + profitMonth[i + 1];
    }
  }

  console.log(profitMonth);
  console.log(numMonth);
  let data = null;

  if (flag) {
    data = {
      labels: labels,
      datasets: [
        {
          label: 'Пополнения',
          data: profitMonth,
          backgroundColor: 'rgba(118, 202, 102, 1)',
        },
        {
          label: 'Транзакции',
          data: fromCashArray,
          backgroundColor: 'rgba(253, 78, 93, 1)',
        },
      ],
    };
  } else {
    data = {
      labels: labels,
      datasets: [
        {
          label: 'Баланс',
          data: profitMonth,
          backgroundColor: ['rgba(17, 106, 204, 1)'],
          borderColor: ['rgba(17, 106, 204, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }

  const config = {
    type: 'bar',
    data: data,
    options: {
      scaleStepWidth: 500000,
      responsive: true,
      scaleStartValue: 0,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          position: 'right',
          ticks: {
            callback: function (value) {
              return accounting.formatMoney(
                value,
                '\u20bd',
                2,
                ' ',
                ',',
                '%v %s',
              );
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += accounting.formatMoney(
                context.parsed.y,
                '\u20bd',
                2,
                ' ',
                ',',
                '%v %s',
              );
            }
            return label;
          },
        },
      },
    },
  };

  Chart.defaults.font.size = 16;
  Chart.defaults.font.weight = 700;
  Chart.defaults.borderColor = 'transparent';
  Chart.defaults.color = '#000';

  const myChart = new Chart(ctx, config);
}
