//Pseudo code
//Step 1: Define chart properties.
//Step 2: Create the chart with defined properties and bind it to the DOM element.
//Step 3: Add the CandleStick Series.
//Step 4: Set the data and render.
//Step5 : Plug the socket to the chart

//Code
const log = console.log;

const chartProperties = {
  width: 1500,
  height: 600,
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
};

const domElement = document.getElementById("tvchart");
const chart = LightweightCharts.createChart(domElement, chartProperties);
const candleSeries = chart.addCandlestickSeries();
// const candleSeries = chart.addCandlestickSeries({
//   upColor: "#6495ED",
//   downColor: "#FF6347",
//   borderVisible: false,
//   wickVisible: true,
//   borderColor: "#000000",
//   wickColor: "#000000",
//   borderUpColor: "#4682B4",
//   borderDownColor: "#A52A2A",
//   wickUpColor: "#4682B4",
//   wickDownColor: "#A52A2A",
// });

chart.applyOptions({
  grid: {
    vertLines: {
      color: "yellow",
      style: 1,
      visible: true,
    },
    horzLines: {
      color: "rgba(70, 130, 180, 0.5)",
      style: 1,
      visible: true,
    },
  },
});

// chart.timeScale().scrollToRealTime();
// chart.timeScale().getVisibleRange();
// chart.timeScale().fitContent();


fetch(
  `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1000`
)
  .then((res) => res.json())
  .then((data) => {
    const cdata = data.map((d) => {
      return {
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5]),
      };
    });
    candleSeries.setData(cdata);
  })
  .catch((err) => log(err));

//Dynamic Chart
const socket = io.connect("http://127.0.0.1:4000/");

socket.on("KLINE", (pl) => {
  log(pl);
  candleSeries.update(pl);
});

